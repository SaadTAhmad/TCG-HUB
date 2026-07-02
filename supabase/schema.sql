create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  discord_user_id text unique,
  discord_username text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aco_profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  display_name text not null,
  encrypted_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proxy_orders (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  provider text not null,
  package_name text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references public.profiles(clerk_user_id) on delete cascade,
  source text not null,
  external_order_id text,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.aco_profiles enable row level security;
alter table public.proxy_orders enable row level security;
alter table public.order_events enable row level security;

create or replace function public.requesting_clerk_user_id()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() ->> 'sub', ''),
    nullif(auth.jwt() ->> 'clerk_user_id', '')
  );
$$;

create policy "profiles_select_own"
on public.profiles for select
using (clerk_user_id = public.requesting_clerk_user_id());

create policy "profiles_update_own"
on public.profiles for update
using (clerk_user_id = public.requesting_clerk_user_id())
with check (clerk_user_id = public.requesting_clerk_user_id());

create policy "subscriptions_select_own"
on public.subscriptions for select
using (clerk_user_id = public.requesting_clerk_user_id());

create policy "aco_profiles_select_own"
on public.aco_profiles for select
using (clerk_user_id = public.requesting_clerk_user_id());

create policy "aco_profiles_insert_own"
on public.aco_profiles for insert
with check (clerk_user_id = public.requesting_clerk_user_id());

create policy "aco_profiles_update_own"
on public.aco_profiles for update
using (clerk_user_id = public.requesting_clerk_user_id())
with check (clerk_user_id = public.requesting_clerk_user_id());

create policy "aco_profiles_delete_own"
on public.aco_profiles for delete
using (clerk_user_id = public.requesting_clerk_user_id());

create policy "proxy_orders_select_own"
on public.proxy_orders for select
using (clerk_user_id = public.requesting_clerk_user_id());

create policy "order_events_select_own"
on public.order_events for select
using (clerk_user_id = public.requesting_clerk_user_id());
