create index if not exists paperverse_worlds_owner on public.paperverse_worlds(owner_id);
create index if not exists paperverse_invitations_world on public.paperverse_world_invitations(world_id);
create index if not exists paperverse_invitations_created_by on public.paperverse_world_invitations(created_by);
create index if not exists paperverse_invitations_redeemed_by on public.paperverse_world_invitations(redeemed_by) where redeemed_by is not null;
create index if not exists paperverse_events_actor on public.paperverse_world_events(actor_id);
create index if not exists paperverse_events_creature on public.paperverse_world_events(creature_id) where creature_id is not null;

-- Davet hash'leri istemciye hiçbir koşulda açılmaz; RPC tek geçiş kapısıdır.
create policy paperverse_invitations_deny_direct_access on public.paperverse_world_invitations
  for all to authenticated using (false) with check (false);

-- Realtime Postgres Changes, mevcut RLS ile yalnızca dünya üyelerine satır gönderir.
do $$ begin
  alter publication supabase_realtime add table public.paperverse_creatures;
exception when duplicate_object then null;
end $$;
