create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'manager', 'employee');
create type public.evacuation_status as enum ('active', 'resolved');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan_tier text not null default 'professional',
  billing_contact_email text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'employee',
  created_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text not null,
  floors integer not null check (floors > 0),
  employee_count integer not null default 0 check (employee_count >= 0),
  created_at timestamptz not null default now()
);

create table public.building_assignments (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (building_id, user_id)
);

create table public.exits (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  floor integer not null check (floor > 0),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  label text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.evacuation_events (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  triggered_by uuid references public.profiles(id) on delete set null,
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz,
  user_count integer not null default 0 check (user_count >= 0),
  status public.evacuation_status not null default 'active'
);

create index memberships_user_id_idx on public.memberships(user_id);
create index buildings_organization_id_idx on public.buildings(organization_id);
create index building_assignments_user_id_idx on public.building_assignments(user_id);
create index exits_building_id_idx on public.exits(building_id);
create index evacuation_events_building_id_idx on public.evacuation_events(building_id);
create index evacuation_events_status_idx on public.evacuation_events(status);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.buildings enable row level security;
alter table public.building_assignments enable row level security;
alter table public.exits enable row level security;
alter table public.evacuation_events enable row level security;

create policy "members can read their organizations"
  on public.organizations for select
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = organizations.id
      and m.user_id = auth.uid()
    )
  );

create policy "users can read their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "users can read org memberships"
  on public.memberships for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.memberships m
      where m.organization_id = memberships.organization_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "members can read assigned buildings"
  on public.buildings for select
  using (
    exists (
      select 1 from public.building_assignments ba
      where ba.building_id = buildings.id
      and ba.user_id = auth.uid()
    )
    or exists (
      select 1 from public.memberships m
      where m.organization_id = buildings.organization_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "users can read their building assignments"
  on public.building_assignments for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.buildings b
      join public.memberships m on m.organization_id = b.organization_id
      where b.id = building_assignments.building_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "assigned users can read exits"
  on public.exits for select
  using (
    exists (
      select 1 from public.building_assignments ba
      where ba.building_id = exits.building_id
      and ba.user_id = auth.uid()
    )
    or exists (
      select 1 from public.buildings b
      join public.memberships m on m.organization_id = b.organization_id
      where b.id = exits.building_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "managers can insert exits"
  on public.exits for insert
  with check (
    exists (
      select 1 from public.buildings b
      join public.memberships m on m.organization_id = b.organization_id
      where b.id = exits.building_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "assigned users can read evacuation events"
  on public.evacuation_events for select
  using (
    exists (
      select 1 from public.building_assignments ba
      where ba.building_id = evacuation_events.building_id
      and ba.user_id = auth.uid()
    )
    or exists (
      select 1 from public.buildings b
      join public.memberships m on m.organization_id = b.organization_id
      where b.id = evacuation_events.building_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );

create policy "managers can insert evacuation events"
  on public.evacuation_events for insert
  with check (
    exists (
      select 1 from public.buildings b
      join public.memberships m on m.organization_id = b.organization_id
      where b.id = evacuation_events.building_id
      and m.user_id = auth.uid()
      and m.role in ('admin', 'manager')
    )
  );
