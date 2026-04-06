create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  type varchar(50) not null check (type in ('holiday', 'event')),
  title varchar(255) not null,
  description text not null,
  end_time timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table announcements enable row level security;

-- Policies
create policy "Public can view announcements"
  on announcements for select
  to public
  using (true);

create policy "Enable insert for all users for now (demo)"
  on announcements for insert
  to public
  with check (true);

create policy "Enable update for all users for now (demo)"
  on announcements for update
  to public
  using (true);

create policy "Enable delete for all users for now (demo)"
  on announcements for delete
  to public
  using (true);
