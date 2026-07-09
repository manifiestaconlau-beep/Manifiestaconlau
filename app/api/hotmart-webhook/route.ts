import { NextRequest, NextResponse } from 'next/server';
import { createsupabaseServer } from '@/lib/supabaseClient';

/**
 * Webhook de Hotmart.
 *
 * Configurar en Hotmart: Herramientas > Webhooks > agregar esta URL:
 * https://tu-dominio.vercel.app/api/hotmart-webhook
 *
 * Eventos que Hotmart envía y que este endpoint maneja:
 * - PURCHASE_APPROVED / PURCHASE_COMPLETE  -> activa la suscripción
 * - PURCHASE_CANCELED / PURCHASE_REFUNDED  -> cancela el acceso
 * - SUBSCRIPTION_CANCELLATION              -> cancela el acceso
 * - PURCHASE_EXPIRED / PURCHASE_CHARGEBACK  -> corta el acceso
 * - SUBSCRIPTION_RENEWAL / PURCHASE_APPROVED (recurrente) -> extiende el acceso
 *
 * IMPORTANTE: Hotmart identifica al comprador por email. Por eso la cuenta
 * de la app DEBE crearse con el mismo email usado en la compra de Hotmart.
 */

const HOTMART_HOTTOK = process.env.HOTMART_HOTTOK; // token de seguridad de Hotmart

const ACTIVE_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_RENEWAL'];
const INACTIVE_EVENTS = [
  'PURCHASE_CANCELED',
  'PURCHASE_REFUNDED',
  'SUBSCRIPTION_CANCELLATION',
  'PURCHASE_EXPIRED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_PROTEST',
];

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

    const supabase = createServiceClient();

    if (ACTIVE_EVENTS.includes(event)) {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_id: transactionId,
          subscription_plan: planName,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('email', buyerEmail);

      if (error) {
        console.error('Error activando suscripción:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: 'activada', email: buyerEmail });
    }

    if (INACTIVE_EVENTS.includes(event)) {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('email', buyerEmail);

      if (error) {
        console.error('Error cancelando suscripción:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      return NextResponse.json({ ok: true, status: 'cancelada', email: buyerEmail });
    }

    // Evento no manejado explícitamente: se responde OK igual para que Hotmart no reintente
    return NextResponse.json({ ok: true, status: 'evento no procesado', event });
  } catch (err) {
    console.error('Error en webhook de Hotmart:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
