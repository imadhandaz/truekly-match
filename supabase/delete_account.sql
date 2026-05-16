-- =================================================================
-- Add this to Supabase SQL Editor — adds a delete_my_account() function
-- =================================================================

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'No autenticado';
  end if;

  -- The cascade deletes will remove profile, products, swipes, matches,
  -- and messages associated with this user automatically.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
