interface SpecialRitual {
  type: string;
  emoji: string;
  title: string;
  steps: string[];
}

export default function SpecialRitualCard({ ritual }: { ritual: SpecialRitual }) {
  return (
    <div className="card p-6 text-center border-gold/40 relative overflow-hidden">
      <span className="absolute top-3 right-4 text-[10px] uppercase tracking-widest text-gold/70">
        Ritual especial de hoy
      </span>
      <div className="text-5xl mt-2 mb-2">{ritual.emoji}</div>
      <h2 className="font-heading text-2xl text-gold">{ritual.title}</h2>
      <ol className="text-left mt-4 space-y-2">
        {ritual.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-white/80 text-sm">
            <span className="text-pink font-semibold shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
