import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

const MOOD_EMOJIS: Record<string, string> = {
  radiante: '✨',
  tranquila: '😌',
  motivada: '🔥',
  sensible: '🌧️',
  agotada: '😴',
  ansiosa: '💭',
};

export default async function HistorialDiarioPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .limit(60);

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <div className="flex items-center justify-between -mt-2">
        <h1 className="font-heading text-2xl text-pink">Mi Historial</h1>
        <Link href="/diario" className="text-sm text-white/50 hover:text-white">
          ← Hoy
        </Link>
      </div>

      <div className="space-y-3">
        {entries?.map((entry) => (
          <div key={entry.id} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gold">
                {new Date(entry.entry_date + 'T12:00:00').toLocaleDateString('es-AR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              {entry.mood && <span className="text-xl">{MOOD_EMOJIS[entry.mood] ?? '🤍'}</span>}
            </div>

            {entry.gratitude && (
              <p className="text-white/80 text-sm mb-1">
                <span className="text-white/50">Agradecí:</span> {entry.gratitude}
              </p>
            )}
            {entry.receiving && (
              <p className="text-white/80 text-sm mb-1">
                <span className="text-white/50">Iba a recibir:</span> {entry.receiving}
              </p>
            )}
            {entry.commitment && (
              <p className="text-white/80 text-sm">
                <span className="text-white/50">Compromiso:</span> {entry.commitment}
              </p>
            )}

            {(entry.vibe_body || entry.vibe_mind || entry.vibe_spirit) && (
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                {entry.vibe_body && <span>🧘 Cuerpo: {entry.vibe_body}/10</span>}
                {entry.vibe_mind && <span>🧠 Mente: {entry.vibe_mind}/10</span>}
                {entry.vibe_spirit && <span>🕊️ Espíritu: {entry.vibe_spirit}/10</span>}
              </div>
            )}
          </div>
        ))}

        {(!entries || entries.length === 0) && (
          <p className="text-white/50 text-center py-8">
            Todavía no tenés entradas guardadas. Empezá hoy escribiendo tu primer diario 🤍
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
