create table if not exists public.mosquee_settings (
  id text primary key default 'main',
  prayers jsonb not null default '{}'::jsonb,
  adhan jsonb not null default '{}'::jsonb,
  jumua text,
  hijri jsonb,
  updated_at timestamptz not null default now()
);

insert into public.mosquee_settings(id)
values ('main')
on conflict (id) do nothing;

create table if not exists public.mosquee_settings_history (
  id bigint generated always as identity primary key,
  saved_at timestamptz not null default now(),
  before_data jsonb,
  after_data jsonb,
  action text
);

alter table public.mosquee_settings enable row level security;
alter table public.mosquee_settings_history enable row level security;

drop policy if exists "public can read mosque settings" on public.mosquee_settings;
create policy "public can read mosque settings"
on public.mosquee_settings for select
to anon, authenticated
using (id = 'main');

drop policy if exists "authenticated can update mosque settings" on public.mosquee_settings;
create policy "authenticated can update mosque settings"
on public.mosquee_settings for update
to authenticated
using (id = 'main')
with check (id = 'main');

drop policy if exists "authenticated can insert mosque settings" on public.mosquee_settings;
create policy "authenticated can insert mosque settings"
on public.mosquee_settings for insert
to authenticated
with check (id = 'main');

drop policy if exists "authenticated can read history" on public.mosquee_settings_history;
create policy "authenticated can read history"
on public.mosquee_settings_history for select
to authenticated
using (true);

drop policy if exists "authenticated can add history" on public.mosquee_settings_history;
create policy "authenticated can add history"
on public.mosquee_settings_history for insert
to authenticated
with check (true);
