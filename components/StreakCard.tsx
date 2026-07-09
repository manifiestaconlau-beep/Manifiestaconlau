'use client';

const MILESTONES = [
  { days: 3, label: '3 días', icon: '🔥' },
  { days: 7, label: '1 semana', icon: '💧' },
  { days: 15, label: '15 días', icon: '🌗' },
  { days: 30, label: '1 mes', icon: '⭐' },
  { days: 60, label: '60 días', icon: '💎' },
  { days: 90, label: '90 días', icon: '👑' },
];

export default function StreakCard({
  currentStreak,
  weekHistory,
}: {
  currentStreak: number;
  weekHistory: boolean[]; // 7 valores: hace 6 días -> hoy
}) {
  async function handleShare() {
    const text = `Llevo ${currentStreak} días seguidos manifestando con Lau 🔥✨`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        /* usuaria canceló, no hacemos nada */
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado! Pegalo donde quieras compartirlo.');
    }
  }

  return (
    <div className="card p-6">
      <span className="text-xs uppercase tracking-widest text-white/40">Tu racha</span>
      <div className="flex items-end justify-between">
        <h2 className="font-accent italic text-5xl text-gold">{currentStreak} días</h2>
        <span className="text-3xl">🔥</span>
      </div>
      <p className="text-white/50 text-xs mt-1 mb-4">Días seguidos completando tu diario</p>

      {/* Mini gráfico de la semana */}
      <div className="flex items-end justify-between gap-1.5 h-10 mb-5">
        {weekHistory.map((done, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${
              done ? 'bg-gold h-full' : 'bg-white/10 h-2'
            }`}
            title={done ? 'Completaste tu ritual' : 'Sin registro'}
          />
        ))}
      </div>

      {/* Hitos / insignias */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {MILESTONES.map((m) => {
          const reached = currentStreak >= m.days;
          return (
            <div key={m.days} className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-lg border ${
                  reached ? 'border-gold bg-gold/10' : 'border-white/15 opacity-40'
                }`}
              >
                {m.icon}
              </div>
              <span className="text-[10px] text-white/50">{m.label}</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleShare}
        className="w-full mt-4 rounded-lg border border-white/15 hover:border-gold transition-colors py-2.5 text-sm text-white/80"
      >
        ↗ Compartir mi racha
      </button>
    </div>
  );
}
