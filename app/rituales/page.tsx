import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { getDailyRitual } from '@/lib/moonPhase';
import WeeklyRitualTracker from '@/components/WeeklyRitualTracker';
import SpecialRitualCard from '@/components/SpecialRitualCard';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';

export default async function RitualesPage() {
  const supabase = createServerSupabaseClient();
  const { data: monthlyRitual } = await supabase
    .from('monthly_rituals')
    .select('*')
    .eq('month_number', new Date().getMonth() + 1)
    .single();

  const ritual = getDailyRitual();

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <h1 className="font-heading text-2xl text-pink text-center -mt-2">Rituales</h1>

      {ritual.specialRitual && <SpecialRitualCard ritual={ritual.specialRitual} />}

      {monthlyRitual && (
        <WeeklyRitualTracker
          currentStage={ritual.weeklyStage}
          monthlyTheme={`${monthlyRitual.emoji} ${monthlyRitual.title}`}
        />
      )}

      <div className="card p-6 text-center">
        <div className="text-5xl mb-2">{ritual.moon.emoji}</div>
        <h2 className="font-heading text-2xl text-white">{ritual.moon.phaseName}</h2>
        <p className="text-white/70 mt-2 text-sm">{ritual.moon.ritualFocus}</p>
        <div className="border-t border-white/10 mt-4 pt-4">
          <span className="text-lg">{ritual.dayEnergy.emoji}</span>{' '}
          <span className="text-white/80 text-sm">
            {ritual.dayEnergy.day}: {ritual.dayEnergy.focus}
          </span>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
