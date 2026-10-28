-- ChopWeti beta schema
-- Run this in Supabase SQL Editor after creating the project.
-- The front end uses the anon key; every rule below is enforced by RLS.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.ops_role as enum ('admin', 'regulator', 'correspondent', 'vendor');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role public.ops_role,
  neighbourhood text,
  vendor_id text,
  created_at timestamptz not null default now()
);

create or replace function public.current_ops_role()
returns public.ops_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "admins read all profiles" on public.profiles;
create policy "admins read all profiles"
  on public.profiles for select
  using (public.current_ops_role() = 'admin');

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles"
  on public.profiles for update
  using (public.current_ops_role() = 'admin')
  with check (public.current_ops_role() = 'admin');

-- Field reports -------------------------------------------------------------

create table if not exists public.verification_reports (
  id uuid primary key default gen_random_uuid(),
  vendor_id text not null,
  vendor_name text not null,
  neighbourhood text not null,
  correspondent_id uuid references public.profiles(id) on delete set null,
  correspondent_name text not null,
  seen text not null,
  price_note text,
  note text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_note text
);

alter table public.verification_reports enable row level security;

drop policy if exists "correspondents create reports" on public.verification_reports;
create policy "correspondents create reports"
  on public.verification_reports for insert
  to authenticated
  with check (
    public.current_ops_role() in ('correspondent', 'admin')
    and correspondent_id = auth.uid()
  );

drop policy if exists "ops read reports" on public.verification_reports;
create policy "ops read reports"
  on public.verification_reports for select
  to authenticated
  using (public.current_ops_role() in ('admin', 'regulator', 'correspondent'));

drop policy if exists "regulators review reports" on public.verification_reports;
create policy "regulators review reports"
  on public.verification_reports for update
  to authenticated
  using (public.current_ops_role() in ('regulator', 'admin'))
  with check (public.current_ops_role() in ('regulator', 'admin'));

-- Feedback ------------------------------------------------------------------

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  rating int not null check (rating between 1 and 5),
  cooked text,
  message text not null,
  email text,
  page text,
  created_at timestamptz not null default now(),
  handled boolean not null default false
);

alter table public.feedback enable row level security;

drop policy if exists "anyone can send feedback" on public.feedback;
create policy "anyone can send feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read feedback" on public.feedback;
create policy "admins read feedback"
  on public.feedback for select
  to authenticated
  using (public.current_ops_role() = 'admin');

drop policy if exists "admins update feedback" on public.feedback;
create policy "admins update feedback"
  on public.feedback for update
  to authenticated
  using (public.current_ops_role() = 'admin')
  with check (public.current_ops_role() = 'admin');

-- Analytics events ----------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "anyone can write events" on public.events;
create policy "anyone can write events"
  on public.events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read events" on public.events;
create policy "admins read events"
  on public.events for select
  to authenticated
  using (public.current_ops_role() = 'admin');

-- Bootstrap the first admin after creating the account in Authentication:
-- insert into public.profiles (id, email, full_name, role, neighbourhood)
-- values ('<auth-user-uuid>', 'you@example.com', 'Your name', 'admin', 'Bamenda Centre');
