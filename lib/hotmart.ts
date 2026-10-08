// Link de compra de Hotmart. Se configura en Vercel con la variable
// NEXT_PUBLIC_HOTMART_CHECKOUT_URL (o se reemplaza acá directamente).
const BASE_URL =
  process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL ?? 'https://pay.hotmart.com/TU-PRODUCTO-AQUI';

export const HOTMART_CHECKOUT_URL = BASE_URL;

// Link de compra con el email de la usuaria ya cargado, para que compre con
// el mismo email de su cuenta (el webhook activa el acceso por email).
export function hotmartCheckoutUrl(email?: string | null): string {
  try {
    const url = new URL(BASE_URL);
    if (email) url.searchParams.set('email', email);
    return url.toString();
  } catch {
    return BASE_URL;
  }
}
