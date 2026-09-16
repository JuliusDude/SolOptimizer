-- =============================================================================
-- SolOptimizer Initial Schema Migration
-- Designed for Supabase Postgres with Row Level Security & Performance Indexes
-- =============================================================================

-- Enable uuid-ossp if not already enabled
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Profiles Table
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles RLS Policies
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Index for fast user_id lookup
create index if not exists idx_profiles_user_id on public.profiles(user_id);


-- -----------------------------------------------------------------------------
-- 2. Properties Table
-- -----------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  city text not null,
  state text,
  country text not null default 'India',
  postal_code text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.properties enable row level security;

-- Properties RLS Policies
create policy "Users can view their own properties"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own properties"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own properties"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own properties"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Indexes
create index if not exists idx_properties_user_id on public.properties(user_id);


-- -----------------------------------------------------------------------------
-- 3. Solar Estimates Table
-- -----------------------------------------------------------------------------
create table if not exists public.solar_estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete set null,
  status text not null default 'saved',
  input_payload_json jsonb not null,
  assumptions_json jsonb not null,
  result_payload_json jsonb not null,
  roof_geometry_geojson jsonb,
  model_version text not null default '1.0.0',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.solar_estimates enable row level security;

-- Solar Estimates RLS Policies
create policy "Users can view their own solar estimates"
  on public.solar_estimates for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own solar estimates"
  on public.solar_estimates for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own solar estimates"
  on public.solar_estimates for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own solar estimates"
  on public.solar_estimates for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Indexes
create index if not exists idx_solar_estimates_user_id on public.solar_estimates(user_id);
create index if not exists idx_solar_estimates_property_id on public.solar_estimates(property_id);
create index if not exists idx_solar_estimates_created_at on public.solar_estimates(created_at desc);


-- -----------------------------------------------------------------------------
-- 4. Solar Resource Reference Data Table
-- -----------------------------------------------------------------------------
create table if not exists public.solar_resource_data (
  id uuid primary key default gen_random_uuid(),
  location_key text not null unique,
  city text not null,
  state text,
  country text not null default 'India',
  latitude double precision,
  longitude double precision,
  peak_sun_hours double precision not null,
  source text not null default 'simulated_regional_dataset',
  source_version text not null default '1.0',
  updated_at timestamptz default now() not null
);

-- Enable RLS for reference data
alter table public.solar_resource_data enable row level security;

create policy "Anyone can read solar resource data"
  on public.solar_resource_data for select
  to anon, authenticated
  using (true);


-- -----------------------------------------------------------------------------
-- 5. Assumption Sets Table
-- -----------------------------------------------------------------------------
create table if not exists public.assumption_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  payload_json jsonb not null,
  active boolean not null default true,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.assumption_sets enable row level security;

create policy "Anyone can read active assumption sets"
  on public.assumption_sets for select
  to anon, authenticated
  using (active = true);
