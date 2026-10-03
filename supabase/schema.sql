-- FORTUNATE MUSIC GROUP (FMG) secure initial schema
create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('artist','owner');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.release_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  artist_name text,
  role public.user_role not null default 'artist',
  created_at timestamptz not null default now()
);

create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  artist_name text not null,
  title text not null,
  genre text,
  release_date date,
  notes text,
  audio_path text,
  artwork_path text,
  status public.release_status not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists releases_user_id_idx on public.releases(user_id);
create index if not exists releases_status_idx on public.releases(status);

alter table public.profiles enable row level security;
alter table public.releases enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

-- New signups can only create artist profiles. Owner access is assigned manually by FMG.
drop policy if exists "artists can view own profile" on public.profiles;
drop policy if exists "artists can create own profile" on public.profiles;
drop policy if exists "artists can update own profile" on public.profiles;
create policy "users view own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "users create own artist profile" on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'artist');
create policy "users update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'artist');

create policy "users view own releases or owners view all" on public.releases
for select to authenticated using (user_id = auth.uid() or public.current_user_role() = 'owner');

create policy "artists create pending releases" on public.releases
for insert to authenticated with check (user_id = auth.uid() and status = 'pending');

create policy "owners update releases" on public.releases
for update to authenticated using (public.current_user_role() = 'owner') with check (public.current_user_role() = 'owner');

-- Automatic profile creation for new Auth users. Artist is always the initial role.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, artist_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'artist_name',''), 'artist')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Private storage buckets. Create these in Storage if they don't already exist:
-- fmg-audio
-- fmg-artwork
-- Then add storage.objects policies for authenticated users/owners before production.
