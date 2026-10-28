create extension if not exists pgcrypto with schema extensions;
create schema if not exists paperverse_private;
revoke all on schema paperverse_private from public, anon, authenticated;

create table public.paperverse_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 32 and display_name !~ '[<>]'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.paperverse_worlds (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 2 and 48 and title !~ '[<>]'),
  owner_id uuid not null references public.paperverse_profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  settings_json jsonb not null default '{"dayCycle":true}'::jsonb check (jsonb_typeof(settings_json)='object')
);
create table public.paperverse_world_members (
  world_id uuid not null references public.paperverse_worlds(id) on delete cascade,
  user_id uuid not null references public.paperverse_profiles(id) on delete cascade,
  role text not null check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key(world_id,user_id),
  unique(user_id)
);
create unique index paperverse_one_owner_per_world on public.paperverse_world_members(world_id) where role='owner';
create table public.paperverse_world_invitations (
  id uuid primary key default gen_random_uuid(), world_id uuid not null references public.paperverse_worlds(id) on delete cascade,
  token_hash bytea not null unique, created_by uuid not null references public.paperverse_profiles(id) on delete cascade,
  created_at timestamptz not null default now(), expires_at timestamptz not null,
  redeemed_by uuid references public.paperverse_profiles(id), redeemed_at timestamptz, revoked_at timestamptz,
  check (expires_at > created_at), check ((redeemed_by is null)=(redeemed_at is null))
);
create table public.paperverse_creatures (
  id uuid primary key, world_id uuid not null references public.paperverse_worlds(id) on delete cascade,
  biome_id text not null check (biome_id in ('ocean','forest','desert','sky','city','space','polar','cave')),
  species_id text not null check (species_id in ('fish','seahorse','jellyfish','octopus','sea_turtle','cat','rabbit','fox','butterfly','owl','camel','scorpion','lizard','fennec','dune_beetle','bird','tiny_dragon','flying_balloon','flying_cat','paper_plane','city_cat','dog','pigeon','robot','car','alien','rocket','planet','satellite','space_cat','penguin','seal','polar_bear','arctic_fox','snow_hare','bat','spider','firefly','cave_salamander','cave_beetle')),
  name text not null check (char_length(btrim(name)) between 1 and 40 and name !~ '[<>]'),
  creator_id uuid not null references public.paperverse_profiles(id) on delete restrict,
  sprite_path text not null unique check (sprite_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'),
  strokes jsonb not null check (strokes->>'schemaVersion'='1' and jsonb_typeof(strokes->'strokes')='array' and jsonb_array_length(strokes->'strokes') between 1 and 400 and pg_column_size(strokes) <= 1048576),
  x double precision not null check (x not in ('NaN'::double precision,'Infinity'::double precision,'-Infinity'::double precision) and x between 0 and 2400), y double precision not null check (y not in ('NaN'::double precision,'Infinity'::double precision,'-Infinity'::double precision) and y between 0 and 900),
  scale double precision not null default 1 check (scale not in ('NaN'::double precision,'Infinity'::double precision,'-Infinity'::double precision) and scale between .25 and 2.5), rotation double precision not null default 0 check (rotation not in ('NaN'::double precision,'Infinity'::double precision,'-Infinity'::double precision) and rotation between -6.4 and 6.4),
  motion_seed integer not null check (motion_seed between 0 and 2147483647), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
  check (split_part(sprite_path,'/',1)=world_id::text and split_part(sprite_path,'/',2)=creator_id::text and split_part(split_part(sprite_path,'/',3),'.',1)=id::text)
);
create index paperverse_creatures_world_biome on public.paperverse_creatures(world_id,biome_id,created_at desc) where deleted_at is null;
create index paperverse_creatures_creator on public.paperverse_creatures(creator_id,created_at desc) where deleted_at is null;
create table public.paperverse_world_events (
  id bigint generated always as identity primary key, world_id uuid not null references public.paperverse_worlds(id) on delete cascade,
  actor_id uuid not null references public.paperverse_profiles(id) on delete cascade, creature_id uuid references public.paperverse_creatures(id) on delete set null,
  event_type text not null check (event_type in ('creature_created','creature_updated','creature_deleted','member_joined')), created_at timestamptz not null default now()
);
create index paperverse_events_world_recent on public.paperverse_world_events(world_id,created_at desc);

create function paperverse_private.is_world_member(p_world_id uuid,p_user_id uuid default auth.uid()) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.paperverse_world_members m where m.world_id=p_world_id and m.user_id=p_user_id) $$;
create function paperverse_private.is_world_owner(p_world_id uuid,p_user_id uuid default auth.uid()) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.paperverse_worlds w where w.id=p_world_id and w.owner_id=p_user_id) $$;
create function paperverse_private.shares_world(p_other uuid,p_user_id uuid default auth.uid()) returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.paperverse_world_members a join public.paperverse_world_members b using(world_id) where a.user_id=p_user_id and b.user_id=p_other) $$;
revoke all on all functions in schema paperverse_private from public,anon,authenticated;
grant usage on schema paperverse_private to authenticated;
grant execute on function paperverse_private.is_world_member(uuid,uuid),paperverse_private.is_world_owner(uuid,uuid),paperverse_private.shares_world(uuid,uuid) to authenticated;

create function paperverse_private.touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now(); return new; end $$;
create trigger paperverse_profiles_touch before update on public.paperverse_profiles for each row execute function paperverse_private.touch_updated_at();
create trigger paperverse_creatures_touch before update on public.paperverse_creatures for each row execute function paperverse_private.touch_updated_at();
create function paperverse_private.limit_members() returns trigger language plpgsql security definer set search_path='' as $$ begin perform 1 from public.paperverse_worlds where id=new.world_id for update; if (select count(*) from public.paperverse_world_members where world_id=new.world_id)>=2 then raise exception using errcode='P0001',message='Bu dünya iki üyeyle dolu.'; end if; return new; end $$;
create trigger paperverse_limit_members before insert on public.paperverse_world_members for each row execute function paperverse_private.limit_members();

alter table public.paperverse_profiles enable row level security; alter table public.paperverse_worlds enable row level security; alter table public.paperverse_world_members enable row level security; alter table public.paperverse_world_invitations enable row level security; alter table public.paperverse_creatures enable row level security; alter table public.paperverse_world_events enable row level security;
create policy paperverse_profiles_select on public.paperverse_profiles for select to authenticated using (id=(select auth.uid()) or paperverse_private.shares_world(id));
create policy paperverse_profiles_insert on public.paperverse_profiles for insert to authenticated with check (id=(select auth.uid()));
create policy paperverse_profiles_update on public.paperverse_profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy paperverse_worlds_select on public.paperverse_worlds for select to authenticated using (paperverse_private.is_world_member(id));
create policy paperverse_members_select on public.paperverse_world_members for select to authenticated using (paperverse_private.is_world_member(world_id));
create policy paperverse_creatures_select on public.paperverse_creatures for select to authenticated using (paperverse_private.is_world_member(world_id));
create policy paperverse_creatures_insert on public.paperverse_creatures for insert to authenticated with check (creator_id=(select auth.uid()) and paperverse_private.is_world_member(world_id));
create policy paperverse_creatures_update on public.paperverse_creatures for update to authenticated using (creator_id=(select auth.uid()) and paperverse_private.is_world_member(world_id)) with check (creator_id=(select auth.uid()) and paperverse_private.is_world_member(world_id));
create policy paperverse_creatures_delete on public.paperverse_creatures for delete to authenticated using (creator_id=(select auth.uid()) and paperverse_private.is_world_member(world_id));
create policy paperverse_events_select on public.paperverse_world_events for select to authenticated using (paperverse_private.is_world_member(world_id));

revoke all on public.paperverse_profiles,public.paperverse_worlds,public.paperverse_world_members,public.paperverse_world_invitations,public.paperverse_creatures,public.paperverse_world_events from anon,authenticated;
grant select,insert,update on public.paperverse_profiles to authenticated; grant select on public.paperverse_worlds,public.paperverse_world_members,public.paperverse_world_events to authenticated; grant select,insert,update,delete on public.paperverse_creatures to authenticated;

create function public.paperverse_create_world(p_title text,p_display_name text) returns jsonb language plpgsql security definer set search_path='' as $$ declare uid uuid:=auth.uid();wid uuid; begin if uid is null then raise exception 'Oturum gerekli';end if;if length(btrim(p_title)) not between 2 and 48 or p_title~'[<>]' then raise exception 'Geçersiz dünya adı';end if;if exists(select 1 from public.paperverse_world_members where user_id=uid) then raise exception 'Zaten bir dünyaya üyeysin';end if;insert into public.paperverse_profiles(id,display_name) values(uid,btrim(p_display_name)) on conflict(id) do update set display_name=excluded.display_name;insert into public.paperverse_worlds(title,owner_id) values(btrim(p_title),uid) returning id into wid;insert into public.paperverse_world_members(world_id,user_id,role) values(wid,uid,'owner');return jsonb_build_object('world_id',wid);end $$;
create function public.paperverse_create_invitation(p_world_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$ declare uid uuid:=auth.uid();raw text;exp timestamptz:=now()+interval '24 hours';begin if not paperverse_private.is_world_owner(p_world_id,uid) then raise exception 'Yalnızca dünya sahibi davet oluşturabilir';end if;if (select count(*) from public.paperverse_world_members where world_id=p_world_id)>=2 then raise exception 'Dünya zaten dolu';end if;update public.paperverse_world_invitations set revoked_at=now() where world_id=p_world_id and redeemed_at is null and revoked_at is null;raw:=encode(extensions.gen_random_bytes(32),'hex');insert into public.paperverse_world_invitations(world_id,token_hash,created_by,expires_at) values(p_world_id,extensions.digest(raw,'sha256'),uid,exp);return jsonb_build_object('token',raw,'expires_at',exp);end $$;
create function public.paperverse_redeem_invitation(p_token text,p_display_name text) returns jsonb language plpgsql security definer set search_path='' as $$ declare uid uuid:=auth.uid();inv public.paperverse_world_invitations%rowtype;begin if uid is null then raise exception 'Oturum gerekli';end if;if length(p_token)<>64 then raise exception 'Davet bağlantısı geçersiz';end if;if exists(select 1 from public.paperverse_world_members where user_id=uid) then raise exception 'Zaten bir dünyaya üyeysin';end if;select * into inv from public.paperverse_world_invitations where token_hash=extensions.digest(p_token,'sha256') for update;if not found or inv.revoked_at is not null or inv.redeemed_at is not null then raise exception 'Davet kullanılmış veya iptal edilmiş';end if;if inv.expires_at<=now() then raise exception 'Davetin süresi dolmuş';end if;perform 1 from public.paperverse_worlds where id=inv.world_id for update;if (select count(*) from public.paperverse_world_members where world_id=inv.world_id)>=2 then raise exception 'Bu dünya iki üyeyle dolu';end if;insert into public.paperverse_profiles(id,display_name) values(uid,btrim(p_display_name)) on conflict(id) do update set display_name=excluded.display_name;insert into public.paperverse_world_members(world_id,user_id,role) values(inv.world_id,uid,'member');update public.paperverse_world_invitations set redeemed_by=uid,redeemed_at=now() where id=inv.id;insert into public.paperverse_world_events(world_id,actor_id,event_type) values(inv.world_id,uid,'member_joined');return jsonb_build_object('world_id',inv.world_id);end $$;
create function public.paperverse_delete_creature(p_creature_id uuid) returns void language plpgsql security definer set search_path='' as $$ declare row public.paperverse_creatures%rowtype;begin select * into row from public.paperverse_creatures where id=p_creature_id for update;if not found then return;end if;if row.creator_id<>auth.uid() then raise exception 'Yalnızca çizimin sahibi silebilir';end if;update public.paperverse_creatures set deleted_at=now() where id=p_creature_id;insert into public.paperverse_world_events(world_id,actor_id,creature_id,event_type) values(row.world_id,auth.uid(),row.id,'creature_deleted');end $$;
revoke all on function public.paperverse_create_world(text,text),public.paperverse_create_invitation(uuid),public.paperverse_redeem_invitation(text,text),public.paperverse_delete_creature(uuid) from public,anon;
grant execute on function public.paperverse_create_world(text,text),public.paperverse_create_invitation(uuid),public.paperverse_redeem_invitation(text,text),public.paperverse_delete_creature(uuid) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('paperverse-creatures','paperverse-creatures',false,1500000,array['image/webp']) on conflict(id) do update set public=false,file_size_limit=1500000,allowed_mime_types=array['image/webp'];
create policy paperverse_storage_select on storage.objects for select to authenticated using (bucket_id='paperverse-creatures' and paperverse_private.is_world_member(((storage.foldername(name))[1])::uuid));
create policy paperverse_storage_insert on storage.objects for insert to authenticated with check (bucket_id='paperverse-creatures' and (storage.foldername(name))[2]=(select auth.uid())::text and paperverse_private.is_world_member(((storage.foldername(name))[1])::uuid));
create policy paperverse_storage_update on storage.objects for update to authenticated using (bucket_id='paperverse-creatures' and owner_id=(select auth.uid())::text) with check (bucket_id='paperverse-creatures' and owner_id=(select auth.uid())::text);
create policy paperverse_storage_delete on storage.objects for delete to authenticated using (bucket_id='paperverse-creatures' and owner_id=(select auth.uid())::text);

