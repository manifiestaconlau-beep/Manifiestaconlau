import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para componentes de cliente ('use client'). Este archivo NO debe
// importar next/headers ni nada exclusivo de servidor, porque los componentes
// de cliente lo importan directamente y Next.js rompe el build si lo hace.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
