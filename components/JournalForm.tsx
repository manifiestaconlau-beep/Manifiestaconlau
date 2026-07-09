'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

const MOODS = [
  { value: 'radiante', emoji: '✨', label: 'Radiante' },
  { value: 'tranquila', emoji: '😌', label: 'Tranquila' },
  { value: 'motivada', emoji: '🔥', label: 'Motivada' },
  { value: 'sensible', emoji: '🌧️', label: 'Sensible' },
  { value: 'agotada', emoji: '😴', label: 'Agotada' },
  { value: 'ansiosa', emoji: '💭', label: 'Ansiosa' },
];

interface Entry {
  mood?: string;
  gratitude?: string;
  receiving?: string;
  notes?: string;
  commitment?: string;
  vibe_body?: number;
  vibe_mind?: number;
  vibe_spirit?: number;
}

export default function JournalForm({
  userId,
  today,
  existingEntry,
}: {
  userId: string;
  today: string;
  existingEntry: Entry | null;
}) {
  const [mood, setMood] = useState(existingEntry?.mood ?? '');
  const [gratitude, setGratitude] = useState(existingEntry?.gratitude ?? '');
  const [receiving, setReceiving] = useState(existingEntry?.receiving ?? '');
  const [notes, setNotes] = useState(existingEntry?.notes ?? '');
  const [commitment, setCommitment] = useState(existingEntry?.commitment ?? '');
  const [vibeBody, setVibeBody] = useState(existingEntry?.vibe_body ?? 5);
  const [vibeMind, setVibeMind] = useState(existingEntry?.vibe_mind ?? 5);
  const [vibeSpirit, setVibeSpirit] = useState(existingEntry?.vibe_spirit ?? 5);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  async function handleSave() {
    setSaving(true);
    await supabase.from('journal_entries').upsert(
      {
        user_id: userId,
        entry_date: today,
        mood,
        gratitude,
        receiving,
        notes,
        commitment,
        vibe_body: vibeBody,
        vibe_mind: vibeMind,
        vibe_spirit: vibeSpirit,
      },
      { onConflict: 'user_id,entry_date' }
    );
    await supabase.rpc('update_streak', { p_user_id: userId });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const avgVibe = Math.round(((vibeBody + vibeMind + vibeSpirit) / 3) * 10) / 10;

  return (
    <div className="space-y-5">
      {/* Estado de ánimo */}
      <div className="card p-5">
        <label className="text-sm text-white/70 mb-3 block">¿Cómo te sentís hoy?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`rounded-full px-3 py-2 text-sm border transition-colors ${
                mood === m.value ? 'bg-pink border-pink' : 'border-white/20 hover:border-pink'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medidor de vibración */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/70">Medidor de vibración diaria</label>
          <span className="font-heading text-2xl text-gold">{avgVibe}/10</span>
        </div>
        <VibeSlider label="🧘 Cuerpo" value={vibeBody} onChange={setVibeBody} />
        <VibeSlider label="🧠 Mente" value={vibeMind} onChange={setVibeMind} />
        <VibeSlider label="🕊️ Espíritu" value={vibeSpirit} onChange={setVibeSpirit} />
        {avgVibe < 5 && (
          <p className="text-xs text-white/50 pt-1">
            Tu vibración está un poco baja hoy. Probá con una meditación corta antes de seguir.
          </p>
        )}
      </div>

      {/* Campos de texto guiados */}
      <TextField label="Hoy agradezco..." value={gratitude} onChange={setGratitude} />
      <TextField label="Hoy voy a recibir..." value={receiving} onChange={setReceiving} />
      <TextField label="Notas libres" value={notes} onChange={setNotes} multiline />
      <TextField label="Mi compromiso para mañana" value={commitment} onChange={setCommitment} />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-lg bg-pink hover:bg-pink/90 transition-colors py-3 font-semibold disabled:opacity-50"
      >
        {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar mi diario de hoy'}
      </button>
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
    <div>
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>{label}</span>
        <span>{value}/10</span>
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

function TextField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="card p-5">
      <label className="text-sm text-white/70 mb-2 block">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-pink resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-pink"
        />
      )}
    </div>
  );
}
