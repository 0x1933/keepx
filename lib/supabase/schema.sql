create table if not exists public.keepx_preferences (
  wallet text primary key,
  slippage_bps integer not null default 50,
  preferred_priority_fee_micro_lamports integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.keepx_activity (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  pool_id text not null,
  position_id text,
  action text not null,
  signature text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.keepx_presets (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  name text not null,
  lower_offset_pct numeric not null,
  upper_offset_pct numeric not null,
  slippage_bps integer not null default 50,
  pool_id text,
  created_at timestamptz not null default now()
);

alter table public.keepx_preferences enable row level security;
alter table public.keepx_activity enable row level security;
alter table public.keepx_presets enable row level security;
