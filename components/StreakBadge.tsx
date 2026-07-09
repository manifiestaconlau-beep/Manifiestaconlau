interface Props {
  currentStreak: number;
  longestStreak: number;
}

const BADGE_MILESTONES = [
  { days: 7, label: 'Semana de Fuego', emoji: '🔥' },
  { days: 21, label: '21 Días de Hábito', emoji: '⭐' },
  { days: 30, label: 'Mes Completo', emoji: '🌕' },
  { days: 90, label: 'Trimestre Manifestando', emoji: '💎' },
  { days: 365, label: 'Un Año Manifestando', emoji: '👑' },
];

export default function StreakBadge({ currentStreak, longestStreak }: Props) {
  const nextMilestone = BADGE_MILESTONES.find((m) => m.days > currentStreak);
  const earnedBadges = BADGE_MILESTONES.filter((m) => longestStreak >= m.days);

  return (
    <div className="card p-5 flex flex-col items-center text-center">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl">🔥</span>
        <span className="font-heading text-4xl text-gold">{currentStreak}</span>
        <span className="text-white/60 text-sm">días seguidos</span>
      </div>

      {nextMilestone && (
        <p className="text-xs text-white/50 mt-1">
          {nextMilestone.days - currentStreak} días más para &ldquo;{nextMilestone.label}&rdquo;{' '}
          {nextMilestone.emoji}
        </p>
      )}

      {earnedBadges.length > 0 && (
        <div className="flex gap-2 mt-3">
          {earnedBadges.map((b) => (
            <span key={b.label} title={b.label} className="text-xl">
              {b.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
