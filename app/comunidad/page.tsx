import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import CommunityFeed from '@/components/CommunityFeed';

export default async function ComunidadPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: posts } = await supabase
    .from('community_posts')
    .select('*, profiles(nombre)')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: likes } = await supabase.from('community_likes').select('post_id').eq('user_id', user.id);
  const likedPostIds = likes?.map((l) => l.post_id) ?? [];

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <h1 className="font-heading text-2xl text-pink text-center -mt-2">Comunidad</h1>
      <p className="text-white/60 text-sm text-center -mt-3">
        Compartí lo que estás manifestando y leé lo que logran otras mujeres en el mismo camino.
      </p>

      <CommunityFeed userId={user.id} initialPosts={posts ?? []} likedPostIds={likedPostIds} />

      <BottomNav />
    </main>
  );
}
