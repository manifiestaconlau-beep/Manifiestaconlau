'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface Affirmation {
  id: string;
  text: string;
  category: string;
}

const PREVIEW_COUNT = 2;

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
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set<string>());
  const supabase = createClient();

  const byCategory = useMemo(() => {
    const groups = new Map<string, Affirmation[]>();
    for (const a of affirmations) {
      if (!groups.has(a.category)) groups.set(a.category, []);
      groups.get(a.category)!.push(a);
    }
    return groups;
  }, [affirmations]);

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

  function toggleExpanded(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  if (showOnlyFavorites) {
    const favList = affirmations.filter((a) => favorites.has(a.id));
    return (
      <div className="space-y-5">
        <FilterToggle showOnlyFavorites={showOnlyFavorites} onToggle={setShowOnlyFavorites} />
        <div className="space-y-3">
          {favList.map((a) => (
            <AffirmationCardRow
              key={a.id}
              affirmation={a}
              isFavorite={favorites.has(a.id)}
              onToggleFavorite={() => toggleFavorite(a.id)}
            />
          ))}
          {favList.length === 0 && (
            <p className="text-white/50 text-center py-8">Todavía no guardaste ninguna favorita 🤍</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FilterToggle showOnlyFavorites={showOnlyFavorites} onToggle={setShowOnlyFavorites} />

      {Array.from(byCategory.entries()).map(([category, items]) => {
        const isExpanded = expandedCategories.has(category);
        const visible = isExpanded ? items : items.slice(0, PREVIEW_COUNT);
        const remaining = items.length - PREVIEW_COUNT;

        return (
          <div key={category} className="space-y-3">
            <h2 className="font-heading text-lg text-gold">{category}</h2>
            {visible.map((a) => (
              <AffirmationCardRow
                key={a.id}
                affirmation={a}
                isFavorite={favorites.has(a.id)}
                onToggleFavorite={() => toggleFavorite(a.id)}
              />
            ))}
            {remaining > 0 && (
              <button
                onClick={() => toggleExpanded(category)}
                className="text-sm text-pink hover:text-pink/80 transition-colors pl-1"
              >
                {isExpanded ? 'Ver menos' : `Ver ${remaining} más`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FilterToggle({
  showOnlyFavorites,
  onToggle,
}: {
  showOnlyFavorites: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onToggle(false)}
        className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
          !showOnlyFavorites ? 'bg-pink border-pink text-white' : 'border-white/20 text-white/60 hover:border-pink'
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
          showOnlyFavorites ? 'bg-pink border-pink text-white' : 'border-white/20 text-white/60 hover:border-pink'
        }`}
      >
        💗 Favoritas
      </button>
    </div>
  );
}

function AffirmationCardRow({
  affirmation,
  isFavorite,
  onToggleFavorite,
}: {
  affirmation: Affirmation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="card p-4 flex items-start justify-between gap-3">
      <p className="font-accent italic text-lg">&ldquo;{affirmation.text}&rdquo;</p>
      <button onClick={onToggleFavorite} className="text-2xl shrink-0">
        {isFavorite ? '💗' : '🤍'}
      </button>
    </div>
  );
}
