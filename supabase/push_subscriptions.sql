-- ============================================================
-- PUSH SUBSCRIPTIONS — ejecutar en Supabase SQL Editor
-- ============================================================

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;

create policy "Users can manage own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id);

-- Columna gold_until para expiración de suscripción Gold
alter table public.profiles
  add column if not exists stripe_customer_id text;
