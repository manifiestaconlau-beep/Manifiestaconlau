'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

function getMotivationalPhrase(avg: number): string {
  if (avg <= 3) {
    return 'Hoy tu energía está más baja de lo normal, y está bien. Probá bajar el ritmo, escuchar una meditación corta, o simplemente respirar unos minutos antes de seguir.';
  }
  if (avg <= 6) {
    return 'Estás en un punto de equilibrio. Es un buen momento para sostener tu ritual sin exigirte de más.';
  }
  if (avg <= 8) {
    return 'Tu energía está alta hoy. Aprovechá este impulso para avanzar en algo que vengas posponiendo.';
  }
  return 'Estás en tu punto más alto. Es un día ideal para manifestar en grande y agradecer todo lo que ya tenés.';
}

export default function VibeCheckCard({ userId, today }: { userId: string; today: string }) {
  const [body, setBody] = useState(5);
  const [mind, setMind] = useState(5);
  const [spirit, setSpirit] = useState(5);
  const [result, setResult] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleReveal() {
    setSaving(true);
    const avg = Math.round(((body + mind + spirit) / 3) * 10) / 10;

    await supabase.from('journal_entries').upsert(
      {
        user_id: userId,
        entry_date: today,
        vibe_body: body,
        vibe_mind: mind,
        vibe_spirit: spirit,
      },
      { onConflict: 'user_id,entry_date' }
    );

    setResult(avg);
    setSaving(false);
  }

  return (
    <div className="card p-6">
      <h2 className="font-heading text-2xl text-gold mb-4">¿Cómo estás hoy?</h2>

      <VibeSlider label="Cuerpo / energía física" value={body} onChange={setBody} />
      <VibeSlider label="Mente / claridad" value={mind} onChange={setMind} />
      <VibeSlider label="Espíritu / ánimo" value={spirit} onChange={setSpirit} />

      {result === null ? (
        <button
          onClick={handleReveal}
          disabled={saving}
          className="w-full mt-2 rounded-lg bg-gold text-background font-semibold py-3 disabled:opacity-50"
        >
          {saving ? 'Calculando...' : 'Ver mi número de hoy'}
        </button>
      ) : (
        <div className="text-center pt-2 border-t border-white/10 mt-2">
          <span className="font-accent italic text-5xl text-gold">{result}</span>
          <span className="text-white/50 text-sm block mb-2">tu número de hoy</span>
          <p className="text-white/70 text-sm">{getMotivationalPhrase(result)}</p>
        </div>
      )}
    </div>
  );
}

function VibeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm text-white/70 mb-2">
        <span>{label}</span>
        <span className="text-gold font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink"
      />
    </div>
  );
}
