'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface Props {
  userId: string;
  affirmationId: string;
  affirmationText: string;
  category: string;
  isFavorite: boolean;
  alreadyCheckedInToday: boolean;
}

export default function AffirmationCard({
  userId,
  affirmationId,
  affirmationText,
  category,
  isFavorite,
  alreadyCheckedInToday,
}: Props) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [checkedIn, setCheckedIn] = useState(alreadyCheckedInToday);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function toggleFavorite() {
    if (favorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('affirmation_id', affirmationId);
      setFavorite(false);
    } else {
      await supabase.from('favorites').insert({ user_id: userId, affirmation_id: affirmationId });
      setFavorite(true);
    }
  }

  async function handleCheckin() {
    setLoading(true);
    await supabase.rpc('update_streak', { p_user_id: userId });
    setCheckedIn(true);
    setLoading(false);
  }

  return (
    <div className="card p-6 text-center">
      <span className="text-xs uppercase tracking-widest text-salmon">{category}</span>
      <p className="font-accent italic text-2xl mt-3 mb-6 text-white">&ldquo;{affirmationText}&rdquo;</p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleFavorite}
          className={`rounded-full px-4 py-2 text-sm border transition-colors ${
            favorite
              ? 'bg-pink border-pink text-white'
              : 'border-white/20 text-white/70 hover:border-pink'
          }`}
        >
          {favorite ? '💗 Guardada' : '🤍 Guardar'}
        </button>

        <button
          onClick={handleCheckin}
          disabled={checkedIn || loading}
          className="rounded-full px-4 py-2 text-sm bg-gold text-background font-semibold disabled:opacity-50"
        >
          {checkedIn ? '✓ Ritual cumplido hoy' : loading ? 'Guardando...' : 'Completé mi ritual de hoy'}
        </button>
      </div>
    </div>
  );
}
