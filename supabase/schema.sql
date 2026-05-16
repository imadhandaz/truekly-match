-- ============================================================
-- TRUEKLY MATCH — DATABASE SCHEMA
-- Run this whole file in Supabase Dashboard → SQL Editor
-- ============================================================

-- =========================
-- 1. PROFILES (user data)
-- =========================
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text not null,
  neighborhood text default 'Centro',
  verified boolean default false,
  gold boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- 2. PRODUCTS
-- =========================
create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  storage_detail text,
  category text not null,
  neighborhood text default 'Centro',
  photos text[] not null default '{}',
  wants text not null,
  description text,
  tags text[] default '{}',
  active boolean default true,
  boosted_until timestamptz,
  created_at timestamptz default now()
);

create index products_owner_idx on public.products(owner_id);
create index products_category_idx on public.products(category);
create index products_active_idx on public.products(active);

alter table public.products enable row level security;

create policy "Anyone can read active products"
  on public.products for select using (active = true);

create policy "Users can insert own products"
  on public.products for insert with check (auth.uid() = owner_id);

create policy "Users can update own products"
  on public.products for update using (auth.uid() = owner_id);

create policy "Users can delete own products"
  on public.products for delete using (auth.uid() = owner_id);

-- =========================
-- 3. SWIPES (likes / passes / super)
-- =========================
create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  choice text not null check (choice in ('yes', 'no', 'super')),
  created_at timestamptz default now(),
  unique (swiper_id, product_id)
);

create index swipes_swiper_idx on public.swipes(swiper_id);
create index swipes_product_idx on public.swipes(product_id);

alter table public.swipes enable row level security;

create policy "Users can read own swipes"
  on public.swipes for select using (auth.uid() = swiper_id);

create policy "Users can insert own swipes"
  on public.swipes for insert with check (auth.uid() = swiper_id);

-- =========================
-- 4. MATCHES (mutual likes)
-- =========================
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  product_a uuid references public.products(id) on delete set null,
  product_b uuid references public.products(id) on delete set null,
  created_at timestamptz default now(),
  unique (user_a, user_b)
);

alter table public.matches enable row level security;

create policy "Users can read own matches"
  on public.matches for select using (auth.uid() = user_a or auth.uid() = user_b);

-- =========================
-- 5. MESSAGES
-- =========================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

create index messages_match_idx on public.messages(match_id, created_at);

alter table public.messages enable row level security;

create policy "Users can read messages in their matches"
  on public.messages for select using (
    exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

create policy "Users can send messages in their matches"
  on public.messages for insert with check (
    sender_id = auth.uid() and exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

-- =========================
-- 6. STORAGE BUCKET for product photos
-- =========================
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "Anyone can view product photos"
  on storage.objects for select
  using (bucket_id = 'product-photos');

create policy "Authenticated users can upload product photos"
  on storage.objects for insert
  with check (bucket_id = 'product-photos' and auth.role() = 'authenticated');

create policy "Users can delete own product photos"
  on storage.objects for delete
  using (bucket_id = 'product-photos' and auth.uid()::text = (storage.foldername(name))[1]);
