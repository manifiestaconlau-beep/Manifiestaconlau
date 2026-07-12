import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Extrae el "slug" del archivo a partir de su audio_url, ej:
// 'meditaciones/para-descansar.m4a' -> 'para-descansar'
function getSlug(audioUrl: string) {
  const filename = audioUrl.split('/').pop() ?? '';
  return filename.replace(/\.[^/.]+$/, '');
}

export default async function AudiosPage({
  searchParams,
}: {
  searchParams: { audio?: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: meditations } = await supabase
    .from('meditations')
    .select('*')
    .eq('active', true)
    .neq('category', 'despertador') // el despertador vive solo en la pantalla de Hoy
    .order('category');

  const requestedSlug = searchParams.audio;
  const filtered = requestedSlug
    ? meditations?.filter((m) => getSlug(m.audio_url) === requestedSlug)
    : null;

  const listToShow = filtered && filtered.length > 0 ? filtered : meditations;
  const isFiltered = Boolean(filtered && filtered.length > 0);

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <h1 className="font-heading text-2xl text-pink text-center -mt-2">Meditaciones</h1>

      {isFiltered && (
        <div className="flex items-center justify-between -mt-3">
          <span className="text-xs uppercase tracking-widest text-salmon">Recomendada para hoy</span>
          <Link href="/audios" className="text-sm text-white/50 hover:text-white">
            Ver todas →
          </Link>
        </div>
      )}

      {/* Canal de YouTube: música para manifestar (se oculta cuando viene filtrado, para no distraer) */}
      {!isFiltered && (
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
      )}

      {/* Meditaciones guiadas */}
      <div className="space-y-4">
        {listToShow?.map((m) => {
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
              <audio controls autoPlay={isFiltered} className="w-full" preload="none">
                <source src={publicUrl} />
              </audio>
            </div>
          );
        })}
        {(!listToShow || listToShow.length === 0) && (
          <p className="text-white/50 text-center py-8">
            Todavía no hay meditaciones cargadas. Subí los audios al bucket de Supabase Storage.
          </p>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
