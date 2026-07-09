'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface Affirmation {
  id: string;
  text: string;
  category: string;
}

export default function AffirmationsBrowser({
  userId,
  affirmations,
  favoriteIds,
}: {
  userId: string;
  affirmations: Affirmation[];
  favoriteIds: string[];
}) {
  const [favorites, setFavorites] = useState(new Set(favoriteIds));
  const [filter, setFilter] = useState<'todas' | 'favoritas' | string>('todas');
  const supabase = createClient();

  const categories = useMemo(
    () => Array.from(new Set(affirmations.map((a) => a.category))),
    [affirmations]
  );

  const visible = affirmations.filter((a) => {
    if (filter === 'todas') return true;
    if (filter === 'favoritas') return favorites.has(a.id);
    return a.category === filter;
  });

  async function toggleFavorite(id: string) {
    if (favorites.has(id)) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('affirmation_id', id);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      await supabase.from('favorites').insert({ user_id: userId, affirmation_id: id });
      setFavorites((prev) => new Set(prev).add(id));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === 'todas'} onClick={() => setFilter('todas')}>
          Todas
        </FilterChip>
        <FilterChip active={filter === 'favoritas'} onClick={() => setFilter('favoritas')}>
          💗 Favoritas
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((a) => (
          <div key={a.id} className="card p-4 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wide text-salmon">{a.category}</span>
              <p className="font-accent italic text-lg mt-1">&ldquo;{a.text}&rdquo;</p>
            </div>
            <button onClick={() => toggleFavorite(a.id)} className="text-2xl shrink-0">
              {favorites.has(a.id) ? '💗' : '🤍'}
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-white/50 text-center py-8">No hay afirmaciones para mostrar acá todavía.</p>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
        active ? 'bg-pink border-pink text-white' : 'border-white/20 text-white/60 hover:border-pink'
      }`}
    >
      {children}
    </button>
  );
}
