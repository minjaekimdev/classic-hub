

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";



-- 파일 맨 위 설정값들(SET ...) 바로 다음에 붙여넣으세요

-- 1. 'performances' 버킷 생성 (데이터이므로 pull로 안 오기 때문에 직접 추가)
INSERT INTO storage.buckets (id, name, public)
VALUES ('performances', 'performances', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. 스토리지 보안 정책 (이미 파일 하단에 storage.objects 정책이 있다면 생략 가능)
-- 만약 pull 받은 파일에 정책이 없다면 아래 두 줄만 추가하세요.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '공연 이미지 공개 읽기') THEN
        CREATE POLICY "공연 이미지 공개 읽기" ON storage.objects FOR SELECT USING (bucket_id = 'performances');
    END IF;
END;
$$;



CREATE OR REPLACE FUNCTION "public"."bulk_update_concert_ranks"("payload" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
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
$$;


ALTER FUNCTION "public"."bulk_update_concert_ranks"("payload" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_update_concert_ranks"("period" "text", "payload" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    target_table text;
BEGIN
    -- 1. 대상 테이블 이름 결정 (예: daily_ranking)
    target_table := period || '_ranking';

    -- [단계 1] 기존 순위 백업 & 초기화
    EXECUTE format('
        UPDATE %I 
        SET last_rank = current_rank, 
            current_rank = NULL 
        WHERE current_rank IS NOT NULL', 
        target_table
    );

    -- [단계 2] 데이터 파싱 및 Upsert (핵심 수정 완료)
    EXECUTE format('
        INSERT INTO %I (
            performance_id, 
            current_rank, 
            updated_at, 
            performance_name, 
            
            -- [수정 1] 기존 period 대신 period_from, period_to 지정
            period_from, 
            period_to,
            
            area, 
            venue_name, 
            seat_scale, 
            performance_count, 
            poster
        )
        SELECT 
            (item->>''mt20id'')::text,
            (item->>''rnum'')::int,
            now(),
            (item->>''prfnm'')::text, 
            
            -- [수정 2] prfpd("YYYY.MM.DD~YYYY.MM.DD")를 쪼개서 각각 저장 (TEXT 타입)
            SPLIT_PART((item->>''prfpd''), ''~'', 1), 
            SPLIT_PART((item->>''prfpd''), ''~'', 2),
            
            (item->>''area'')::text, 
            (item->>''prfplcnm'')::text, 
            (item->>''seatcnt'')::int, 
            (item->>''prfdtcnt'')::int, 
            (item->>''poster'')::text
        FROM jsonb_array_elements(%L) AS item
        WHERE (item->>''mt20id'') IS NOT NULL
        ON CONFLICT (performance_id) 
        DO UPDATE SET 
            current_rank = EXCLUDED.current_rank, 
            
            -- [수정 3] 공연 기간이 변경되었을 경우를 대비해 업데이트 로직 추가
            period_from = EXCLUDED.period_from,
            period_to = EXCLUDED.period_to,
            
            updated_at = now()',
        target_table, 
        payload
    );

    -- [단계 3] 차트 아웃 데이터 삭제
    EXECUTE format('
        DELETE FROM %I 
        WHERE current_rank IS NULL', 
        target_table
    );

END;
$$;


ALTER FUNCTION "public"."bulk_update_concert_ranks"("period" "text", "payload" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."debug_check_payload"("period" "text", "payload" "jsonb") RETURNS TABLE("item_index" integer, "item_type" "text", "extracted_id" "text", "raw_item" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- 1. 전체 데이터 요약 로그 출력
    RAISE NOTICE '--- [DEBUG START] ---';
    RAISE NOTICE '기간(Period): %', period;
    RAISE NOTICE '전체 데이터 타입: %', jsonb_typeof(payload);
    RAISE NOTICE '데이터 개수(Length): %', jsonb_array_length(payload);

    -- 2. 데이터를 표(Table) 형태로 반환하여 SQL Editor에서 즉시 확인
    RETURN QUERY
    SELECT 
        (row_number() OVER())::int as item_index,
        jsonb_typeof(item) as item_type,
        (item->>'mt20id')::text as extracted_id,
        item as raw_item
    FROM jsonb_array_elements(payload) AS item;

    RAISE NOTICE '--- [DEBUG END] ---';
END;
$$;


ALTER FUNCTION "public"."debug_check_payload"("period" "text", "payload" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fill_performance_area"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    v_cleaned_name TEXT;
    v_full_adress TEXT;
BEGIN
    -- 'area' 컬럼이 비어있고, 'venue_name'이 있을 때만 실행
    IF NEW.area IS NULL AND NEW.venue_name IS NOT NULL THEN
        
        -- (1) venue_name 가공 로직 (핵심 변경 사항)
        -- 정규표현식: \s*\(([^()]*|\([^()]*\))*\)\s*$
        -- 설명: 
        -- 1. \s* : 앞쪽 공백 제거
        -- 2. \( ... \) : 가장 바깥쪽 괄호 쌍 찾기
        -- 3. ([^()]*|\([^()]*\))* : 괄호 안에 '일반 문자' 또는 '한 단계 중첩된 괄호'가 섞여 있어도 허용
        -- 4. \s*$ : 반드시 문자열의 맨 끝에 위치해야 함
        v_cleaned_name := TRIM(regexp_replace(NEW.venue_name, '\s*\(([^()]*|\([^()]*\))*\)\s*$', ''));

        -- (2) facilities 테이블에서 가공된 이름으로 주소 조회
        SELECT adress INTO v_full_adress 
        FROM facilities 
        WHERE name = v_cleaned_name 
        LIMIT 1;

        -- (3) 주소가 존재한다면 첫 번째 단어(시/도)만 추출하여 area에 삽입
        IF v_full_adress IS NOT NULL THEN
            NEW.area := split_part(v_full_adress, ' ', 1);
        END IF;
        
    END IF;

    RETURN NEW;
END;
$_$;


ALTER FUNCTION "public"."fill_performance_area"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_enqueue_performance_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
    -- 테이블 구조에 맞춰 task_type을 제거하고 payload 중심의 insert 수행
    insert into public.task_queue (status, payload)
    values (
        'PENDING',
        jsonb_build_object(
            'performanceId', old.performance_id,
            -- ✅ 아래 부분을 수정했습니다.
            'storagePaths', (
                to_jsonb(array_remove(array[old.poster], null)) || 
                coalesce(old.detail_image, '[]'::jsonb)
            )
        )
    );
    return old;
end;$$;


ALTER FUNCTION "public"."fn_enqueue_performance_delete"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_performance_programs"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- 1. 기존 데이터 삭제 (업데이트 시 중복 방지 및 동기화)
    -- NEW.performance_id를 사용하여 정확히 해당 공연의 곡들만 지웁니다.
    DELETE FROM programs WHERE performance_id = NEW.performance_id;

    -- 2. NEW.program(JSONB) 데이터를 찢어서 새 테이블에 삽입 (play_order 제외)
    INSERT INTO programs (
        performance_id, 
        composer_ko, 
        composer_en, 
        title_ko, 
        title_en
    )
    SELECT 
        NEW.performance_id, -- 부모의 TEXT 타입 ID
        prog.obj->>'composerKo',
        prog.obj->>'composerEn',
        kr.title,
        en.title
    FROM 
        jsonb_array_elements(NEW.program) AS prog(obj)
    CROSS JOIN LATERAL 
        jsonb_array_elements_text(prog.obj->'workTitleKr') WITH ORDINALITY AS kr(title, idx)
    INNER JOIN LATERAL 
        jsonb_array_elements_text(prog.obj->'workTitleEn') WITH ORDINALITY AS en(title, idx) 
        ON kr.idx = en.idx; -- 한/영 배열 인덱스 매칭

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_performance_programs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_full_performance"("payload" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- 함수 안에서 사용할 변수를 정의한다
    target_id text;
BEGIN
    -- 1. 공공데이터 ID 추출
    target_id := payload->>'performance_id';

    -- 2. performances 테이블 Upsert (program 컬럼 제외)
    INSERT INTO performances (
        performance_id, performance_name, age, area, booking_links, 
        "cast", detail_image, max_price, min_price, period_from, 
        period_to, poster, price, raw_data, 
        runtime, state, time, venue_id, venue_name, updated_at
    )
    VALUES (
        target_id,
        payload->>'performance_name',
        payload->>'age',
        payload->>'area',
        payload->'booking_links',
        payload->>'"cast"',
        payload->'detail_image',
        (payload->>'max_price')::numeric,
        (payload->>'min_price')::numeric,
        (payload->>'period_from')::date,
        (payload->>'period_to')::date,
        payload->>'poster',
        payload->'price',
        payload->'raw_data',
        payload->>'runtime',
        payload->>'state',
        payload->>'time',
        payload->>'venue_id',
        payload->>'venue_name',
        now()
    ) 
    ON CONFLICT (performance_id) 
    DO UPDATE SET 
        performance_name = EXCLUDED.performance_name,
        age = EXCLUDED.age,
        area = EXCLUDED.area,
        booking_links = EXCLUDED.booking_links,
        "cast" = EXCLUDED."cast",
        detail_image = EXCLUDED.detail_image,
        max_price = EXCLUDED.max_price,
        min_price = EXCLUDED.min_price,
        period_from = EXCLUDED.period_from,
        period_to = EXCLUDED.period_to,
        poster = EXCLUDED.poster,
        price = EXCLUDED.price,
        raw_data = EXCLUDED.raw_data,
        runtime = EXCLUDED.runtime,
        state = EXCLUDED.state,
        time = EXCLUDED.time,
        venue_id = EXCLUDED.venue_id,
        venue_name = EXCLUDED.venue_name,
        updated_at = now();

    -- 3. programs 테이블 동기화 
    DELETE FROM programs WHERE performance_id = target_id;

    INSERT INTO programs (
        performance_id, 
        composer_ko, 
        composer_en, 
        title_ko, 
        title_en
    )
    SELECT 
        target_id,
        p->>'composerKo',
        p->>'composerEn',
        p->>'workTitleKr',
        p->>'workTitleEn'
    FROM jsonb_array_elements(payload->'program') AS p;

    RETURN target_id;
END;
$$;


ALTER FUNCTION "public"."upsert_full_performance"("payload" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    item jsonb; -- 배열 안의 각 공연 객체를 담을 임시 변수
    perf_id text;
    processed_count int := 0;
BEGIN
    -- 1. payload가 배열인지 확인하고 루프를 돌림
    FOR item IN SELECT jsonb_array_elements(payload)
    LOOP
        perf_id := item->>'performance_id';

        -- 2. performances 테이블 Upsert
        INSERT INTO performances (
            performance_id, performance_name, age, area, booking_links, 
            "cast", detail_image, max_price, min_price, period_from, 
            period_to, poster, price, raw_data, 
            runtime, state, time, venue_id, venue_name, updated_at
        )
        VALUES (
            perf_id,
            item->>'performance_name',
            item->>'age',
            item->>'area',
            item->'booking_links',
            item->>'cast',
            item->'detail_image',
            (item->>'max_price')::numeric,
            (item->>'min_price')::numeric,
            (item->>'period_from')::date,
            (item->>'period_to')::date,
            item->>'poster',
            item->'price',
            item->'raw_data',
            item->>'runtime',
            item->>'state',
            item->>'time',
            item->>'venue_id',
            item->>'venue_name',
            now()
        ) 
        ON CONFLICT (performance_id) 
        DO UPDATE SET 
            performance_name = EXCLUDED.performance_name,
            age = EXCLUDED.age,
            area = EXCLUDED.area,
            booking_links = EXCLUDED.booking_links,
            "cast" = EXCLUDED."cast",
            detail_image = EXCLUDED.detail_image,
            max_price = EXCLUDED.max_price,
            min_price = EXCLUDED.min_price,
            period_from = EXCLUDED.period_from,
            period_to = EXCLUDED.period_to,
            poster = EXCLUDED.poster,
            price = EXCLUDED.price,
            raw_data = EXCLUDED.raw_data,
            runtime = EXCLUDED.runtime,
            state = EXCLUDED.state,
            time = EXCLUDED.time,
            venue_id = EXCLUDED.venue_id,
            venue_name = EXCLUDED.venue_name,
            updated_at = now();

        -- 3. 해당 공연의 programs 테이블 동기화
        DELETE FROM programs WHERE performance_id = perf_id;

        INSERT INTO programs (
            performance_id, 
            composer_ko, 
            composer_en, 
            title_ko, 
            title_en
        )
        SELECT 
            perf_id,
            p->>'composerKo',
            p->>'composerEn',
            p->>'workTitleKr',
            p->>'workTitleEn'
        FROM jsonb_array_elements(item->'program') AS p;

        processed_count := processed_count + 1;
    END LOOP;

    RETURN processed_count || ' performances processed successfully.';
END;
$$;


ALTER FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."daily_ranking" (
    "current_rank" smallint,
    "performance_name" "text",
    "area" "text",
    "venue_name" "text",
    "poster" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_rank" smallint,
    "seat_scale" integer,
    "performance_count" integer,
    "performance_id" "text" NOT NULL,
    "period_from" "text",
    "period_to" "text"
);


ALTER TABLE "public"."daily_ranking" OWNER TO "postgres";


COMMENT ON COLUMN "public"."daily_ranking"."last_rank" IS '순위 변동 표시를 위해 어제 순위 저장';



CREATE TABLE IF NOT EXISTS "public"."performances" (
    "performance_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "venue_id" "text",
    "performance_name" "text",
    "period_from" "text",
    "period_to" "text",
    "venue_name" "text",
    "cast" "text",
    "runtime" "text",
    "age" "text",
    "price" "jsonb",
    "poster" "text",
    "state" "text",
    "detail_image" "jsonb",
    "time" "text",
    "raw_data" "jsonb",
    "booking_links" "jsonb" DEFAULT '[]'::"jsonb",
    "area" "text",
    "min_price" integer,
    "max_price" integer,
    "program" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."performances" OWNER TO "postgres";


COMMENT ON COLUMN "public"."performances"."raw_data" IS '추후 확장성을 위해 잘 사용되지 않는 데이터를 보관';



CREATE OR REPLACE VIEW "public"."daily_ranking_with_details" AS
 SELECT "r"."current_rank",
    "r"."last_rank",
    "r"."performance_id",
    "r"."performance_name",
    "r"."period_from",
    "r"."period_to",
    "r"."venue_name",
    "p"."poster",
    "p"."cast",
    "p"."price",
    "p"."booking_links",
    "p"."program"
   FROM ("public"."daily_ranking" "r"
     LEFT JOIN "public"."performances" "p" ON (("r"."performance_id" = "p"."performance_id")))
  ORDER BY "r"."current_rank";


ALTER VIEW "public"."daily_ranking_with_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."facilities" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "opening_year" "text",
    "facility_type" "text",
    "seat_count" integer,
    "hall_count" smallint,
    "tel" "text",
    "url" "text",
    "adress" "text",
    "latitude" double precision,
    "longitude" double precision,
    "has_restaurant" boolean,
    "has_cafe" boolean,
    "has_store" boolean,
    "has_nolibang" boolean,
    "has_suyu" boolean,
    "has_parking" boolean,
    "has_disabled_parking" boolean,
    "has_disabled_restroom" boolean,
    "has_disabled_ramp" boolean,
    "has_disabled_elevator" boolean,
    "id" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."facilities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."halls" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "seat_count" integer,
    "has_orchestra_pit" boolean,
    "has_practice_room" boolean,
    "has_dressing_room" boolean,
    "has_outdoor_stage" boolean,
    "disabled_seat_count" integer,
    "disabled_stage_area" "text",
    "facility_id" "text",
    "id" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."halls" OWNER TO "postgres";


COMMENT ON TABLE "public"."halls" IS '공연시설(facilities)에 있는 개별 공연장';



CREATE TABLE IF NOT EXISTS "public"."monthly_ranking" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_rank" smallint,
    "performance_name" "text",
    "area" "text",
    "venue_name" "text",
    "poster" "text",
    "performance_id" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_rank" smallint,
    "seat_scale" integer,
    "performance_count" integer,
    "period_from" "text",
    "period_to" "text"
);


ALTER TABLE "public"."monthly_ranking" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."monthly_ranking_with_details" AS
 SELECT "r"."current_rank",
    "r"."last_rank",
    "r"."performance_id",
    "r"."performance_name",
    "r"."period_from",
    "r"."period_to",
    "r"."venue_name",
    "p"."poster",
    "p"."cast",
    "p"."price",
    "p"."booking_links"
   FROM ("public"."monthly_ranking" "r"
     LEFT JOIN "public"."performances" "p" ON (("r"."performance_id" = "p"."performance_id")))
  ORDER BY "r"."current_rank";


ALTER VIEW "public"."monthly_ranking_with_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."performances_temp" (
    "performance_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "venue_id" "text",
    "performance_name" "text",
    "period_from" "text",
    "period_to" "text",
    "venue_name" "text",
    "cast" "text",
    "runtime" "text",
    "age" "text",
    "price" "jsonb",
    "poster" "text",
    "state" "text",
    "detail_image" "jsonb",
    "time" "text",
    "raw_data" "jsonb",
    "booking_links" "jsonb" DEFAULT '[]'::"jsonb",
    "area" "text",
    "min_price" integer,
    "max_price" integer,
    "program" "jsonb"
);


ALTER TABLE "public"."performances_temp" OWNER TO "postgres";


COMMENT ON COLUMN "public"."performances_temp"."raw_data" IS '추후 확장성을 위해 잘 사용되지 않는 데이터를 보관';



CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "performance_id" "text" NOT NULL,
    "composer_ko" "text",
    "composer_en" "text",
    "title_ko" "text",
    "title_en" "text"
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."task_queue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "status" "text" DEFAULT 'PENDING'::"text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "error_message" "text",
    "retry_count" integer DEFAULT 0 NOT NULL,
    "max_retries" integer DEFAULT 5 NOT NULL,
    "next_retry_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "task_queue_status_check" CHECK (("status" = ANY (ARRAY['PENDING'::"text", 'FAILED'::"text", 'COMPLETED'::"text", 'ARCHIVED'::"text"])))
);


ALTER TABLE "public"."task_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weekly_ranking" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_rank" smallint,
    "performance_name" "text",
    "area" "text",
    "venue_name" "text",
    "poster" "text",
    "performance_id" "text" NOT NULL,
    "updated_at" timestamp with time zone,
    "last_rank" smallint,
    "seat_scale" integer,
    "performance_count" integer,
    "period_from" "text",
    "period_to" "text"
);


ALTER TABLE "public"."weekly_ranking" OWNER TO "postgres";


COMMENT ON COLUMN "public"."weekly_ranking"."updated_at" IS 'now()';



CREATE OR REPLACE VIEW "public"."weekly_ranking_with_details" AS
 SELECT "r"."current_rank",
    "r"."last_rank",
    "r"."performance_id",
    "r"."performance_name",
    "r"."period_from",
    "r"."period_to",
    "r"."venue_name",
    "p"."poster",
    "p"."cast",
    "p"."price",
    "p"."booking_links"
   FROM ("public"."weekly_ranking" "r"
     LEFT JOIN "public"."performances" "p" ON (("r"."performance_id" = "p"."performance_id")))
  ORDER BY "r"."current_rank";


ALTER VIEW "public"."weekly_ranking_with_details" OWNER TO "postgres";


ALTER TABLE ONLY "public"."daily_ranking"
    ADD CONSTRAINT "daily_ranking_pkey" PRIMARY KEY ("performance_id");



ALTER TABLE ONLY "public"."facilities"
    ADD CONSTRAINT "facilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."halls"
    ADD CONSTRAINT "halls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_ranking"
    ADD CONSTRAINT "monthly_ranking_pkey" PRIMARY KEY ("performance_id");



ALTER TABLE ONLY "public"."performances_temp"
    ADD CONSTRAINT "performance_list_pkey1" PRIMARY KEY ("performance_id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "performance_programs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."performances"
    ADD CONSTRAINT "performances_new_pkey" PRIMARY KEY ("performance_id");



ALTER TABLE ONLY "public"."task_queue"
    ADD CONSTRAINT "task_queue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weekly_ranking"
    ADD CONSTRAINT "weekly_ranking_pkey" PRIMARY KEY ("performance_id");



CREATE INDEX "idx_task_queue_status_next_retry" ON "public"."task_queue" USING "btree" ("status", "next_retry_at") WHERE ("status" = ANY (ARRAY['PENDING'::"text", 'FAILED'::"text"]));



CREATE OR REPLACE TRIGGER "delete-performance-storage-files" AFTER DELETE ON "public"."performances_temp" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://razltwjkvwqiyksaydcw.supabase.co/functions/v1/delete-storage-file', 'POST', '{"Content-type":"application/json"}', '{}', '10000');



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."task_queue" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "tr_on_performance_delete" AFTER DELETE ON "public"."performances_temp" FOR EACH ROW EXECUTE FUNCTION "public"."fn_enqueue_performance_delete"();



CREATE OR REPLACE TRIGGER "trg_fill_performance_area" BEFORE INSERT ON "public"."performances_temp" FOR EACH ROW EXECUTE FUNCTION "public"."fill_performance_area"();



CREATE OR REPLACE TRIGGER "trigger_set_updated_at" BEFORE UPDATE ON "public"."daily_ranking" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_set_updated_at" BEFORE UPDATE ON "public"."monthly_ranking" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_set_updated_at" BEFORE UPDATE ON "public"."weekly_ranking" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_sync_programs" AFTER INSERT OR UPDATE ON "public"."performances" FOR EACH ROW EXECUTE FUNCTION "public"."sync_performance_programs"();



ALTER TABLE ONLY "public"."halls"
    ADD CONSTRAINT "halls_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "performance_programs_performance_id_fkey" FOREIGN KEY ("performance_id") REFERENCES "public"."performances"("performance_id") ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "public"."daily_ranking" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."facilities" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."halls" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."monthly_ranking" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."performances" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."performances_temp" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."weekly_ranking" FOR SELECT TO "anon" USING (true);



CREATE POLICY "anon_select" ON "public"."programs" FOR SELECT TO "anon" USING (true);



ALTER TABLE "public"."daily_ranking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."facilities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."halls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."monthly_ranking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."performances" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."performances_temp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."task_queue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weekly_ranking" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";







































































































































































































































GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("payload" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("period" "text", "payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("period" "text", "payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_update_concert_ranks"("period" "text", "payload" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."debug_check_payload"("period" "text", "payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."debug_check_payload"("period" "text", "payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."debug_check_payload"("period" "text", "payload" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."fill_performance_area"() TO "anon";
GRANT ALL ON FUNCTION "public"."fill_performance_area"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fill_performance_area"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_enqueue_performance_delete"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_enqueue_performance_delete"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_enqueue_performance_delete"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_performance_programs"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_performance_programs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_performance_programs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_full_performance"("payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_full_performance"("payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_full_performance"("payload" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") TO "service_role";
























GRANT ALL ON TABLE "public"."daily_ranking" TO "anon";
GRANT ALL ON TABLE "public"."daily_ranking" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_ranking" TO "service_role";



GRANT ALL ON TABLE "public"."performances" TO "anon";
GRANT ALL ON TABLE "public"."performances" TO "authenticated";
GRANT ALL ON TABLE "public"."performances" TO "service_role";



GRANT ALL ON TABLE "public"."daily_ranking_with_details" TO "anon";
GRANT ALL ON TABLE "public"."daily_ranking_with_details" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_ranking_with_details" TO "service_role";



GRANT ALL ON TABLE "public"."facilities" TO "anon";
GRANT ALL ON TABLE "public"."facilities" TO "authenticated";
GRANT ALL ON TABLE "public"."facilities" TO "service_role";



GRANT ALL ON TABLE "public"."halls" TO "anon";
GRANT ALL ON TABLE "public"."halls" TO "authenticated";
GRANT ALL ON TABLE "public"."halls" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_ranking" TO "anon";
GRANT ALL ON TABLE "public"."monthly_ranking" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_ranking" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_ranking_with_details" TO "anon";
GRANT ALL ON TABLE "public"."monthly_ranking_with_details" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_ranking_with_details" TO "service_role";



GRANT ALL ON TABLE "public"."performances_temp" TO "anon";
GRANT ALL ON TABLE "public"."performances_temp" TO "authenticated";
GRANT ALL ON TABLE "public"."performances_temp" TO "service_role";



GRANT ALL ON TABLE "public"."programs" TO "anon";
GRANT ALL ON TABLE "public"."programs" TO "authenticated";
GRANT ALL ON TABLE "public"."programs" TO "service_role";



GRANT ALL ON TABLE "public"."task_queue" TO "anon";
GRANT ALL ON TABLE "public"."task_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."task_queue" TO "service_role";



GRANT ALL ON TABLE "public"."weekly_ranking" TO "anon";
GRANT ALL ON TABLE "public"."weekly_ranking" TO "authenticated";
GRANT ALL ON TABLE "public"."weekly_ranking" TO "service_role";



GRANT ALL ON TABLE "public"."weekly_ranking_with_details" TO "anon";
GRANT ALL ON TABLE "public"."weekly_ranking_with_details" TO "authenticated";
GRANT ALL ON TABLE "public"."weekly_ranking_with_details" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































  create policy "read-only mdaszn_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'performances'::text));



