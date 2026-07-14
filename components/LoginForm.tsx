'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const emailFromLink = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(emailFromLink);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSent, setAutoSent] = useState(false);

  const supabase = createClient();

  async function handleLogin(e?: React.FormEvent, emailToUse?: string) {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email: emailToUse ?? email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError('No pudimos enviar el link. Revisá el email e intentá de nuevo.');
    } else {
      setSent(true);
    }
  }

  // Si venimos de la página de gracias de Hotmart con el email ya incluido
  // en el link, mandamos el magic link automáticamente, sin que la clienta
  // tenga que escribir nada ni tocar ningún botón.
  useEffect(() => {
    if (emailFromLink && !autoSent) {
      setAutoSent(true);
      handleLogin(undefined, emailFromLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFromLink]);

  return (
    <div className="card w-full max-w-md p-8 text-center">
      <h1 className="font-heading text-4xl text-gold mb-2">Manifiesta con Lau</h1>
      <p className="font-accent italic text-lg text-white/70 mb-8">
        Tu ritual diario para sostener la constancia que realmente cambia las cosas.
      </p>

      {sent ? (
        <p className="text-white/90">
          Te enviamos un link mágico a <strong>{email}</strong>. Abrilo desde tu email para
          entrar, sin necesidad de contraseña.
          <span className="block text-white/50 text-sm mt-3">
            💡 Si no lo ves en unos minutos, revisá también la carpeta de spam o promociones.
          </span>
        </p>
      ) : emailFromLink && loading ? (
        <p className="text-white/90">Estamos enviando tu acceso a {emailFromLink}...</p>
      ) : (
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
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
  );
}
