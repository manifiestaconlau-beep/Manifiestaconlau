import { createsupabaseServer } from '@/lib/supabaseClient';
import AffirmationCard from '@/components/AffirmationCard';
import StreakCard from '@/components/StreakCard';
import VibeCheckCard from '@/components/VibeCheckCard';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

// Elige una afirmación "del día" de forma determinística: todas las usuarias
// ven la misma afirmación en el mismo día (crea sentido de comunidad/ritual compartido),
// pero rota todos los días del año.
function pickDailyAffirmation(affirmations: { id: string; text: string; category: string }[]) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % affirmations.length;
  return affirmations[index];
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // el middleware ya redirige, esto es solo un guard extra

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const [{ data: profile }, { data: affirmations }, { data: favorites }, { data: recentEntries }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('affirmations').select('id, text, category').eq('active', true),
      supabase.from('favorites').select('affirmation_id').eq('user_id', user.id),
      supabase
        .from('journal_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .gte('entry_date', sevenDaysAgoStr),
    ]);

  const dailyAffirmation = affirmations && affirmations.length > 0 ? pickDailyAffirmation(affirmations) : null;
  const isFavorite = favorites?.some((f) => f.affirmation_id === dailyAffirmation?.id) ?? false;
  const alreadyCheckedInToday = profile?.last_checkin_date === today;

  // Armar los últimos 7 días (hace 6 -> hoy) marcando si hubo entrada de diario
  const entryDates = new Set(recentEntries?.map((e) => e.entry_date) ?? []);
  const weekHistory: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekHistory.push(entryDates.has(d.toISOString().split('T')[0]));
  }

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />

      <p className="text-center text-white/50 text-sm -mt-4">
        {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <StreakCard currentStreak={profile?.current_streak ?? 0} weekHistory={weekHistory} />

      {/* Aviso de check-in si todavía no completó el diario hoy */}
      {!alreadyCheckedInToday && (
        <div className="card p-5 text-center">
          <p className="text-white/80 mb-3">¿Ya hiciste tu check-in diario?</p>
          <Link
            href="/diario"
            className="inline-block rounded-full border border-gold text-gold px-5 py-2 text-sm hover:bg-gold hover:text-background transition-colors"
          >
            Ir a mi diario →
          </Link>
        </div>
      )}

      {/* Audio despertador — para escuchar cada mañana */}
      <div className="card p-5 text-center">
        <span className="text-2xl">⏰</span>
        <h2 className="font-heading text-xl text-gold mt-1">Tu Audio Despertador</h2>
        <p className="text-white/60 text-sm mt-1 mb-3">
          Escuchalo apenas te levantás, para arrancar el día con la energía correcta.
        </p>
        <audio controls className="w-full" preload="none">
          <source
            src={
              supabase.storage.from('meditaciones').getPublicUrl('despertador/audio-despertador-1.wav')
                .data.publicUrl
            }
          />
        </audio>
      </div>

      {/* Medidor de vibración diaria con frase motivacional */}
      <VibeCheckCard userId={user.id} today={today} />

      {/* Afirmación del día */}
      {dailyAffirmation && (
        <AffirmationCard
          userId={user.id}
          affirmationId={dailyAffirmation.id}
          affirmationText={dailyAffirmation.text}
          category={dailyAffirmation.category}
          isFavorite={isFavorite}
          alreadyCheckedInToday={alreadyCheckedInToday}
        />
      )}

      {/* Diario de hoy: cuadro grande */}
      <Link
        href="/diario"
        className="card p-8 text-center block hover:border-gold transition-colors"
      >
        <span className="text-4xl">📝</span>
        <h2 className="font-heading text-2xl text-gold mt-2">Tu Diario de Hoy</h2>
        <p className="text-white/70 text-sm mt-2 max-w-xs mx-auto">
          Registrá tu estado de ánimo, tu gratitud, qué vas a recibir hoy y tu compromiso para
          mañana.
        </p>
        <span className="inline-block mt-4 rounded-full bg-gold text-background px-6 py-2 text-sm font-semibold">
          {alreadyCheckedInToday ? 'Ver / editar mi diario' : 'Escribir mi diario'}
        </span>
      </Link>

      <Link href="/rituales" className="card p-5 text-center block hover:border-pink transition-colors">
        <span className="text-2xl">◐</span>
        <h2 className="font-heading text-lg text-gold mt-1">Ver Ritual del Día</h2>
        <p className="text-white/60 text-sm">Fase lunar, ritual semanal y ritual especial de hoy.</p>
      </Link>

      <BottomNav />
    </main>
  );
}
