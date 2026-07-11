interface WeeklyStage {
  week: number;
  title: string;
  focus: string;
  dateRange: string;
  exercise: string[];
}

export default function WeeklyRitualTracker({
  currentStage,
  monthlyTheme,
}: {
  currentStage: WeeklyStage;
  monthlyTheme: string;
}) {
  const stages = [1, 2, 3, 4];

  return (
    <div className="card p-5 text-center">
      <span className="text-xs uppercase tracking-widest text-white/40">Ritual del mes</span>
      <h2 className="font-heading text-xl text-gold mt-1">{monthlyTheme}</h2>

      {/* Indicador de 4 rituales, con progreso */}
      <div className="flex items-center justify-center gap-2 my-4">
        {stages.map((week) => {
          const isPast = week < currentStage.week;
          const isCurrent = week === currentStage.week;
          const isFuture = week > currentStage.week;

          return (
            <div
              key={week}
              className={`flex flex-col items-center gap-1 ${isCurrent ? 'scale-110' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-all ${
                  isCurrent
                    ? 'bg-pink border-pink text-white font-bold'
                    : isPast
                    ? 'bg-white/10 border-white/20 text-white/60'
                    : 'bg-transparent border-white/10 text-white/20'
                }`}
              >
                {isPast ? '✓' : isFuture ? '🔒' : week}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/40 mb-4">Semana {currentStage.week} de 4</p>
      <p className="text-xs text-gold/80 mb-1">{currentStage.dateRange}</p>

      {/* Solo se revela el contenido del ritual de esta semana */}
      <div className="border-t border-white/10 pt-4 text-left">
        <p className="text-center">
          <span className="text-xs uppercase tracking-widest text-salmon">{currentStage.title}</span>
        </p>
        <p className="text-white/70 text-sm mt-1 text-center">{currentStage.focus}</p>

        <p className="text-xs uppercase tracking-widest text-gold/70 mt-4 mb-2">
          Ejercicio para esta semana
        </p>
        <ol className="space-y-2">
          {currentStage.exercise.map((step, i) => (
            <li key={i} className="flex gap-2 text-white/80 text-sm">
              <span className="text-pink font-semibold shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
