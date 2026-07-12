'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';

interface VibeResult {
  avg: number;
  tier: 'bajo' | 'medio_bajo' | 'equilibrio' | 'alto';
  legend: string;
  recommendation: { text: string; href: string; linkLabel: string } | null;
}

function getTier(avg: number): { tier: VibeResult['tier']; legend: string } {
  if (avg <= 3) {
    return {
      tier: 'bajo',
      legend: 'Tu energía está baja hoy, y está bien reconocerlo. Es momento de cuidarte antes que de exigirte.',
    };
  }
  if (avg <= 5) {
    return {
      tier: 'medio_bajo',
      legend: 'Estás por debajo de tu equilibrio. Un pequeño gesto hoy puede ayudarte a subir ese número.',
    };
  }
  if (avg <= 8) {
    return {
      tier: 'equilibrio',
      legend: 'Estás en un buen punto de equilibrio. Sostené tu ritual sin exigirte de más.',
    };
  }
  return {
    tier: 'alto',
    legend: 'Estás en tu punto más alto. Día ideal para manifestar en grande y agradecer todo lo que ya tenés.',
  };
}

// Según cuál de los 3 valores esté más bajo, sugiere una acción concreta y
// distinta (meditación o categoría de afirmaciones) para elevar justo esa área.
function getRecommendation(
  body: number,
  mind: number,
  spirit: number
): { text: string; href: string; linkLabel: string } {
  const lowest = Math.min(body, mind, spirit);

  if (lowest === body) {
    return {
      text: 'Tu cuerpo es lo que más pide atención hoy. Una meditación de descanso puede ayudarte a recargar.',
      href: '/audios?audio=para-descansar',
      linkLabel: '🎧 Ir a Meditaciones',
    };
  }
  if (lowest === mind) {
    return {
      text: 'Tu mente necesita un poco de calma hoy. Las afirmaciones de Paz Mental te pueden ayudar a bajar revoluciones.',
      href: '/afirmaciones?categoria=' + encodeURIComponent('Paz Mental'),
      linkLabel: '✨ Ver afirmaciones de Paz Mental',
    };
  }
  return {
    text: 'Tu espíritu pide un poco de amor propio hoy. Unas afirmaciones de Amor o Gratitud pueden elevarte.',
   href: '/afirmaciones?categoria=' + encodeURIComponent('Amor'),
    linkLabel: '✨ Ver afirmaciones de Amor',
  };
}

export default function VibeCheckCard({ userId, today }: { userId: string; today: string }) {
  const [body, setBody] = useState(5);
  const [mind, setMind] = useState(5);
  const [spirit, setSpirit] = useState(5);
  const [result, setResult] = useState<VibeResult | null>(null);
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

    const { tier, legend } = getTier(avg);
    const recommendation = tier === 'bajo' || tier === 'medio_bajo' ? getRecommendation(body, mind, spirit) : null;

    setResult({ avg, tier, legend, recommendation });
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
          <span className="font-accent italic text-5xl text-gold">{result.avg}</span>
          <span className="text-white/50 text-sm block mb-2">tu número de hoy</span>
          <p className="text-white/70 text-sm">{result.legend}</p>

          {result.recommendation && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/70 text-sm mb-3">{result.recommendation.text}</p>
              <Link
                href={result.recommendation.href}
                className="inline-block rounded-full bg-pink px-5 py-2 text-sm font-semibold hover:bg-pink/90 transition-colors"
              >
                {result.recommendation.linkLabel}
              </Link>
            </div>
          )}
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
