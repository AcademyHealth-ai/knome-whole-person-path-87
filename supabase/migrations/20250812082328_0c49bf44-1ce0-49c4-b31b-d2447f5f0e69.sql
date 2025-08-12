-- Create packs table for user-scoped content
create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  slug text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure unique slug per user when provided
create unique index if not exists packs_user_slug_unique on public.packs (user_id, slug) where slug is not null;

-- Enable Row Level Security
alter table public.packs enable row level security;

-- Add updated_at trigger
drop trigger if exists packs_set_updated_at on public.packs;
create trigger packs_set_updated_at
before update on public.packs
for each row execute function public.handle_updated_at();

-- RLS Policies (recreate to avoid duplicates)
drop policy if exists "users see own packs" on public.packs;
create policy "users see own packs"
  on public.packs for select
  using (user_id = auth.uid());

drop policy if exists "users insert own packs" on public.packs;
create policy "users insert own packs"
  on public.packs for insert
  with check (user_id = auth.uid());

drop policy if exists "users update own packs" on public.packs;
create policy "users update own packs"
  on public.packs for update
  using (user_id = auth.uid());

drop policy if exists "users delete own packs" on public.packs;
create policy "users delete own packs"
  on public.packs for delete
  using (user_id = auth.uid());