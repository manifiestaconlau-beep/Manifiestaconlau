import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default async function AudiosPage() {
  const supabase = createServerSupabaseClient();
  const { data: meditations } = await supabase
    .from('meditations')
    .select('*')
    .eq('active', true)
    .neq('category', 'despertador') // el despertador vive solo en la pantalla de Hoy
    .order('category');

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <h1 className="font-heading text-2xl text-pink text-center -mt-2">Meditaciones</h1>

      {/* Canal de YouTube: música para manifestar */}
      <a
        href="https://www.youtube.com/@ManifiestaconLau"
        target="_blank"
        rel="noopener noreferrer"
        className="card p-6 text-center block hover:border-gold transition-colors"
      >
        <span className="text-3xl">🎵</span>
        <h2 className="font-heading text-xl text-gold mt-1">Música para Manifestar</h2>
        <p className="text-white/60 text-sm mt-1 mb-3">
          Tu canal de YouTube con música pensada para manifestar. Ideal para tener de fondo
          mientras hacés tu ritual.
        </p>
        <span className="inline-block rounded-full bg-gold text-background px-5 py-2 text-sm font-semibold">
          ▶ Ir al canal de YouTube
        </span>
      </a>

      {/* Meditaciones guiadas */}
      <div className="space-y-4">
        {meditations?.map((m) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from('meditaciones').getPublicUrl(m.audio_url);

          return (
            <div key={m.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{m.title}</h3>
                <span className="text-xs text-white/40">{formatDuration(m.duration_seconds)}</span>
              </div>
              {m.description && <p className="text-white/60 text-sm mb-3">{m.description}</p>}
              <audio controls className="w-full" preload="none">
                <source src={publicUrl} />
              </audio>
            </div>
          );
        })}
        {(!meditations || meditations.length === 0) && (
          <p className="text-white/50 text-center py-8">
            Todavía no hay meditaciones cargadas. Subí los audios al bucket de Supabase Storage.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
