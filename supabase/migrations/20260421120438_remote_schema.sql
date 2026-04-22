drop trigger if exists "delete-performance-storage-files" on "public"."performances_temp";

drop trigger if exists "tr_on_performance_delete" on "public"."performances_temp";

drop trigger if exists "trg_fill_performance_area" on "public"."performances_temp";

drop policy "Enable read access for all users" on "public"."performances_temp";

revoke delete on table "public"."performances_temp" from "anon";

revoke insert on table "public"."performances_temp" from "anon";

revoke references on table "public"."performances_temp" from "anon";

revoke select on table "public"."performances_temp" from "anon";

revoke trigger on table "public"."performances_temp" from "anon";

revoke truncate on table "public"."performances_temp" from "anon";

revoke update on table "public"."performances_temp" from "anon";

revoke delete on table "public"."performances_temp" from "authenticated";

revoke insert on table "public"."performances_temp" from "authenticated";

revoke references on table "public"."performances_temp" from "authenticated";

revoke select on table "public"."performances_temp" from "authenticated";

revoke trigger on table "public"."performances_temp" from "authenticated";

revoke truncate on table "public"."performances_temp" from "authenticated";

revoke update on table "public"."performances_temp" from "authenticated";

revoke delete on table "public"."performances_temp" from "service_role";

revoke insert on table "public"."performances_temp" from "service_role";

revoke references on table "public"."performances_temp" from "service_role";

revoke select on table "public"."performances_temp" from "service_role";

revoke trigger on table "public"."performances_temp" from "service_role";

revoke truncate on table "public"."performances_temp" from "service_role";

revoke update on table "public"."performances_temp" from "service_role";

alter table "public"."performances_temp" drop constraint "performance_list_pkey1";

drop index if exists "public"."performance_list_pkey1";

drop table "public"."performances_temp";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.bulk_update_concert_ranks(payload jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    -- 1. INSERT 대상 테이블명을 daily_ranking으로 수정
    insert into daily_ranking (performance_id, current_rank, last_rank, updated_at)
    select 
        (item->>'id')::text, 
        (item->>'rank')::int, 
        null, 
        now()
    from jsonb_array_elements(payload) as item
    -- 2. 제약 조건 확인 대상(performance_id)은 그대로 둡니다.
    on conflict (performance_id) 
    do update set 
        -- 3. 기존 테이블 참조 이름을 daily_ranking으로 수정 (중요!)
        last_rank = daily_ranking.current_rank, 
        current_rank = excluded.current_rank, 
        updated_at = now();
end;
$function$
;

drop policy "공연 이미지 공개 읽기" on "storage"."objects";


