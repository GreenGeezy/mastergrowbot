-- Create or replace leaderboard RPC with safe search_path and limited exposure
create or replace function public.get_bud_boost_leaderboard(max_rows integer default 20)
returns table (
  rank integer,
  leaderboard_name text,
  run integer,
  last_action date
)
language sql
security definer
set search_path = public
as $$
  with ranked as (
    select
      rank() over (
        order by us.current_streak desc, us.last_action desc, us.user_id
      ) as rank,
      lp.leaderboard_name,
      us.current_streak as run,
      us.last_action
    from public.user_streaks us
    join public.leaderboard_profiles lp
      on lp.user_id = us.user_id
    where lp.is_opt_in = true
  )
  select r.rank, r.leaderboard_name, r.run, r.last_action
  from ranked r
  order by r.rank, r.leaderboard_name
  limit greatest(1, max_rows)
$$;

-- Restrict execution to authenticated role only (idempotent)
revoke all on function public.get_bud_boost_leaderboard(integer) from public;
grant execute on function public.get_bud_boost_leaderboard(integer) to authenticated;