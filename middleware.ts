import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rutas que no requieren login ni suscripción activa
const PUBLIC_ROUTES = ['/login', '/registro', '/api/hotmart-webhook', '/suscripcion-vencida'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sin sesión -> a login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Con sesión: chequear estado de suscripción
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', user.id)
    .single();

  const isActive =
    profile?.subscription_status === 'active' &&
    (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

  if (!isActive) {
    return NextResponse.redirect(new URL('/suscripcion-vencida', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto:
     * archivos estáticos, imágenes y favicon
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
