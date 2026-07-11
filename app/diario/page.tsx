import { createServerSupabaseClient } from '@/lib/supabaseServer';
import Masthead from '@/components/Masthead';
import BottomNav from '@/components/BottomNav';
import JournalForm from '@/components/JournalForm';
import Link from 'next/link';

export default async function DiarioPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const { data: existingEntry } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_date', today)
    .maybeSingle();

  return (
    <main className="min-h-screen px-6 py-10 pb-24 max-w-2xl mx-auto space-y-6">
      <Masthead />
      <div className="flex items-center justify-between -mt-2">
        <h1 className="font-heading text-2xl text-pink">Diario Guiado</h1>
        <Link href="/diario/historial" className="text-sm text-white/50 hover:text-white">
          Mi historial →
        </Link>
      </div>

      <JournalForm userId={user.id} today={today} existingEntry={existingEntry ?? null} />

      <BottomNav />
    </main>
  );
}
