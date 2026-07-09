import { createsupabaseServer } from '@/lib/supabaseClient';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import AffirmationsBrowser from '@/components/AffirmationsBrowser';

export default async function AfirmacionesPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: affirmations }, { data: favorites }] = await Promise.all([
    supabase.from('affirmations').select('id, text, category').eq('active', true).order('category'),
    supabase.from('favorites').select('affirmation_id').eq('user_id', user.id),
  ]);

  const favoriteIds = new Set(favorites?.map((f) => f.affirmation_id) ?? []);

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <h1 className="font-heading text-2xl text-pink text-center -mt-2">Afirmaciones</h1>

      <AffirmationsBrowser
        userId={user.id}
        affirmations={affirmations ?? []}
        favoriteIds={Array.from(favoriteIds)}
      />

      <BottomNav />
    </main>
  );
}
