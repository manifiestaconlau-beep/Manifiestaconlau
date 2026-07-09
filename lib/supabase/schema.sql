-- ============================================
-- MANIFIESTA CON LAU — Schema de Supabase
-- ============================================

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PERFILES DE USUARIA (extiende auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  nombre text,
  created_at timestamptz default now(),

  -- Estado de suscripción (controlado por webhook de Hotmart)
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'cancelled', 'overdue')),
  subscription_id text, -- ID de transacción/suscripción de Hotmart
  subscription_plan text, -- ej: 'mensual', 'anual'
  subscription_expires_at timestamptz,

  -- Racha
  current_streak int default 0,
  longest_streak int default 0,
  last_checkin_date date,

  -- Insignias ganadas (array de códigos: 'primera_semana', 'mes_completo', etc)
  badges jsonb default '[]'::jsonb
);

alter table public.profiles enable row level security;

create policy "Usuaria ve su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuaria actualiza su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. AFIRMACIONES (contenido curado por Lau)
-- ============================================
create table public.affirmations (
  id uuid default uuid_generate_v4() primary key,
  category text not null check (category in (
    'Amor', 'Felicidad', 'Abundancia y Prosperidad', 'Abundancia Financiera',
    'Parejas y Relaciones', 'Negocios y Clientes', 'Gratitud', 'Paz Mental'
  )),
  text text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Afirmaciones son públicas de lectura para usuarias con sesión
alter table public.affirmations enable row level security;

create policy "Usuarias autenticadas leen afirmaciones"
  on public.affirmations for select
  using (auth.role() = 'authenticated');

-- ============================================
-- 3. FAVORITOS (afirmaciones guardadas por usuaria)
-- ============================================
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  affirmation_id uuid references public.affirmations(id) not null,
  created_at timestamptz default now(),
  unique(user_id, affirmation_id)
);

alter table public.favorites enable row level security;

create policy "Usuaria maneja sus propios favoritos"
  on public.favorites for all
  using (auth.uid() = user_id);

-- ============================================
-- 4. ENTRADAS DE DIARIO GUIADO
-- ============================================
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  entry_date date not null default current_date,

  mood text, -- ej: 'radiante', 'tranquila', 'ansiosa', 'agotada', etc (emoji-mapped en frontend)
  gratitude text, -- "hoy agradezco..."
  receiving text, -- "hoy voy a recibir..."
  notes text, -- notas libres
  commitment text, -- "mi compromiso para mañana"

  -- Medidor de vibración (1-10 cada uno)
  vibe_body int check (vibe_body between 1 and 10),
  vibe_mind int check (vibe_mind between 1 and 10),
  vibe_spirit int check (vibe_spirit between 1 and 10),

  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table public.journal_entries enable row level security;

create policy "Usuaria maneja su propio diario"
  on public.journal_entries for all
  using (auth.uid() = user_id);

-- ============================================
-- 5. MEDITACIONES (contenido mensual)
-- ============================================
create table public.meditations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  audio_url text not null, -- URL en Supabase Storage
  duration_seconds int,
  category text, -- ej: 'despertador', 'meditacion', 'sueño'
  month_available date, -- para lógica de "contenido nuevo cada mes"
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.meditations enable row level security;

create policy "Usuarias autenticadas leen meditaciones"
  on public.meditations for select
  using (auth.role() = 'authenticated');

-- ============================================
-- 5b. RITUAL ESPECIAL MENSUAL (temática por mes del año)
-- ============================================
create table public.monthly_rituals (
  id uuid default uuid_generate_v4() primary key,
  month_number int unique not null check (month_number between 1 and 12),
  month_name text not null,
  emoji text,
  title text not null,
  description text
);

alter table public.monthly_rituals enable row level security;

create policy "Usuarias autenticadas leen ritual mensual"
  on public.monthly_rituals for select
  using (auth.role() = 'authenticated');

-- ============================================
-- 6. COMUNIDAD (posts de manifestación)
-- ============================================
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id), -- null para posts de ejemplo/seed
  author_name text, -- se usa solo cuando user_id es null (contenido de ejemplo)
  content text not null,
  category text, -- opcional: qué está manifestando (amor, negocios, etc)
  likes_count int default 0,
  created_at timestamptz default now(),
  is_visible boolean default true -- para moderación simple
);

alter table public.community_posts enable row level security;

create policy "Usuarias autenticadas leen posts visibles"
  on public.community_posts for select
  using (auth.role() = 'authenticated' and is_visible = true);

create policy "Usuaria crea sus propios posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Usuaria borra sus propios posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

create table public.community_likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  post_id uuid references public.community_posts(id) not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

alter table public.community_likes enable row level security;

create policy "Usuaria maneja sus propios likes"
  on public.community_likes for all
  using (auth.uid() = user_id);

-- ============================================
-- 7. FUNCIÓN: actualizar racha al hacer check-in
-- ============================================
create or replace function public.update_streak(p_user_id uuid)
returns void as $$
declare
  v_last_date date;
  v_current_streak int;
  v_longest_streak int;
begin
  select last_checkin_date, current_streak, longest_streak
  into v_last_date, v_current_streak, v_longest_streak
  from public.profiles where id = p_user_id;

  if v_last_date = current_date then
    -- ya hizo check-in hoy, no hacer nada
    return;
  elsif v_last_date = current_date - interval '1 day' then
    -- consecutivo: suma racha
    v_current_streak := v_current_streak + 1;
  else
    -- se rompió la racha (o es la primera vez)
    v_current_streak := 1;
  end if;

  if v_current_streak > v_longest_streak then
    v_longest_streak := v_current_streak;
  end if;

  update public.profiles
  set current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_checkin_date = current_date
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- 8. TRIGGER: crear perfil automáticamente al registrarse
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
