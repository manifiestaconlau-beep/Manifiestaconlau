'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface Post {
  id: string;
  content: string;
  category?: string;
  likes_count: number;
  created_at: string;
  author_name?: string | null;
  profiles?: { nombre?: string } | null;
}

export default function CommunityFeed({
  userId,
  initialPosts,
  likedPostIds,
}: {
  userId: string;
  initialPosts: Post[];
  likedPostIds: string[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState(new Set(likedPostIds));
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const supabase = createClient();

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);
    const { data } = await supabase
      .from('community_posts')
      .insert({ user_id: userId, content: content.trim() })
      .select('*, profiles(nombre)')
      .single();
    if (data) setPosts((prev) => [data, ...prev]);
    setContent('');
    setPosting(false);
  }

  async function handleLike(postId: string) {
    if (liked.has(postId)) return; // simple: un like por post, no se puede sacar en el MVP
    await supabase.from('community_likes').insert({ user_id: userId, post_id: postId });
    setLiked((prev) => new Set(prev).add(postId));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p))
    );
  }

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás manifestando hoy?"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 outline-none focus:border-pink resize-none"
        />
        <button
          onClick={handlePost}
          disabled={posting || !content.trim()}
          className="mt-2 rounded-lg bg-pink hover:bg-pink/90 transition-colors px-5 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {posting ? 'Publicando...' : 'Compartir'}
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="card p-4">
            <p className="text-white/90">{p.content}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-white/40">
              <span>{p.author_name || p.profiles?.nombre || 'Una manifestadora'}</span>
              <button
                onClick={() => handleLike(p.id)}
                className={`flex items-center gap-1 ${liked.has(p.id) ? 'text-pink' : ''}`}
              >
                {liked.has(p.id) ? '💗' : '🤍'} {p.likes_count}
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-white/50 text-center py-8">Sé la primera en compartir hoy 🤍</p>
        )}
      </div>
    </div>
  );
}
