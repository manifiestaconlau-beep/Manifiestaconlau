'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) {
      setError('No pudimos enviar el link. Revisá el email e intentá de nuevo.');
    } else {
      setSent(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="font-heading text-4xl text-pink mb-2">Manifiesta con Lau</h1>
        <p className="font-accent italic text-lg text-white/70 mb-8">
          Tu ritual diario para sostener la constancia que realmente cambia las cosas.
        </p>

        {sent ? (
          <p className="text-white/90">
            Te enviamos un link mágico a <strong>{email}</strong>. Abrilo desde tu email para
            entrar, sin necesidad de contraseña.
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Tu email (el mismo de tu compra)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-pink"
            />
            {error && <p className="text-salmon text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink hover:bg-pink/90 transition-colors py-3 font-semibold disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Entrar a mi ritual diario'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
