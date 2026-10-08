import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabaseServer';

/**
 * Webhook de Hotmart.
 *
 * Configurar en Hotmart: Herramientas > Webhooks > agregar esta URL:
 * https://tu-dominio.vercel.app/api/hotmart-webhook
 *
 * Eventos que Hotmart envía y que este endpoint maneja:
 * - PURCHASE_APPROVED / PURCHASE_COMPLETE  -> activa la suscripción
 * - SUBSCRIPTION_CANCELLATION / PURCHASE_CANCELED / PURCHASE_EXPIRED
 *     -> la usuaria CONSERVA el acceso hasta el fin del período que ya pagó
 * - PURCHASE_REFUNDED / PURCHASE_CHARGEBACK / PURCHASE_PROTEST
 *     -> corta el acceso YA (le devolvieron la plata)
 * - SUBSCRIPTION_RENEWAL / PURCHASE_APPROVED (recurrente) -> extiende el acceso
 *
 * IMPORTANTE: Hotmart identifica al comprador por email. Por eso la cuenta
 * de la app DEBE crearse con el mismo email usado en la compra de Hotmart.
 */

const HOTMART_HOTTOK = process.env.HOTMART_HOTTOK; // token de seguridad de Hotmart

const ACTIVE_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_RENEWAL'];
// Cancelaciones: se marca como 'cancelled' pero el acceso sigue hasta
// subscription_expires_at (el período que ya pagó).
const CANCEL_KEEP_ACCESS_EVENTS = [
  'SUBSCRIPTION_CANCELLATION',
  'PURCHASE_CANCELED',
  'PURCHASE_EXPIRED',
];
// Reembolsos y contracargos: se corta el acceso en el momento.
const CUT_NOW_EVENTS = ['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_PROTEST'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validación de seguridad: Hotmart envía el hottok en el body o en el header
    const receivedToken = body?.hottok || req.headers.get('x-hotmart-hottok');
    if (HOTMART_HOTTOK && receivedToken !== HOTMART_HOTTOK) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const event = body?.event; // ej: 'PURCHASE_APPROVED'
    const buyerEmail = body?.data?.buyer?.email;
    const transactionId = body?.data?.purchase?.transaction;
    const planName = body?.data?.subscription?.plan?.name || 'mensual';

    // Fecha de expiración: Hotmart manda el próximo cobro; si no viene, asumimos 31 días
    const nextChargeDate = body?.data?.purchase?.date_next_charge;
    const expiresAt = nextChargeDate
      ? new Date(nextChargeDate)
      : new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);

    if (!buyerEmail) {
      return NextResponse.json({ error: 'Falta email del comprador' }, { status: 400 });
    }

    console.log('Webhook Hotmart recibido:', { event, buyerEmail, transactionId });

    const supabase = createServiceClient();

    if (ACTIVE_EVENTS.includes(event)) {
      // Si la clienta compró ANTES de haber entrado alguna vez a la app, todavía
      // no existe su perfil (se crea recién con el primer login). Nos aseguramos
      // de que la cuenta exista ya mismo, para no depender del orden de eventos.
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', buyerEmail)
        .maybeSingle();

      if (!existingProfile) {
        console.log('No existía cuenta para este email, creándola ahora:', buyerEmail);
        const { error: createError } = await supabase.auth.admin.createUser({
          email: buyerEmail,
          email_confirm: true, // se confirma sola: no hace falta que abra un mail de verificación aparte
        });

        if (createError && !createError.message?.toLowerCase().includes('already')) {
          console.error('Error creando la cuenta nueva:', createError);
          return NextResponse.json({ error: 'Error creando la cuenta' }, { status: 500 });
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_id: transactionId,
          subscription_plan: planName,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('email', buyerEmail)
        .select();

      if (error) {
        console.error('Error activando suscripción:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      console.log('Filas actualizadas (activación):', data?.length ?? 0, data);

      if (!data || data.length === 0) {
        console.warn('No se encontró ningún perfil con ese email:', buyerEmail);
        return NextResponse.json({
          ok: true,
          status: 'evento recibido pero no se encontró la usuaria',
          email: buyerEmail,
        });
      }

      return NextResponse.json({ ok: true, status: 'activada', email: buyerEmail });
    }

    if (CANCEL_KEEP_ACCESS_EVENTS.includes(event)) {
      // No tocamos subscription_expires_at: conserva lo que ya pagó.
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('email', buyerEmail);

      if (error) {
        console.error('Error marcando cancelación:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: 'cancelada (acceso hasta fin del período)', email: buyerEmail });
    }

    if (CUT_NOW_EVENTS.includes(event)) {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_expires_at: new Date().toISOString(), // corte inmediato
        })
        .eq('email', buyerEmail);

      if (error) {
        console.error('Error cortando acceso:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: 'acceso cortado', email: buyerEmail });
    }

    // Evento no manejado explícitamente: se responde OK igual para que Hotmart no reintente
    return NextResponse.json({ ok: true, status: 'evento no procesado', event });
  } catch (err) {
    console.error('Error en webhook de Hotmart:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
