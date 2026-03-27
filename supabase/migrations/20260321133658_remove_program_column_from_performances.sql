DROP VIEW IF EXISTS daily_ranking_with_details;

ALTER TABLE performances
DROP COLUMN IF EXISTS program;

CREATE
OR REPLACE VIEW daily_ranking_with_details AS
WITH
  aggregated_programs AS (
    -- 1단계: programs 테이블만 따로 그룹화 (JSON으로 압축)
    SELECT
      performance_id,
      jsonb_agg (
        jsonb_build_object (
          'name',
          composer_ko,
          'pieces',
          (
            SELECT
              jsonb_agg (title_ko)
            FROM
              programs p2
            WHERE
              p2.performance_id = p1.performance_id
              AND p2.composer_ko IS NOT DISTINCT
            FROM
              p1.composer_ko
          )
        )
      ) AS program_ko,
      jsonb_agg (
        jsonb_build_object (
          'name',
          composer_en,
          'pieces',
          (
            SELECT
              jsonb_agg (title_en)
            FROM
              programs p2
            WHERE
              p2.performance_id = p1.performance_id
              AND p2.composer_en IS NOT DISTINCT
            FROM
              p1.composer_en
          )
        )
      ) AS program_en
    FROM
      (
        SELECT DISTINCT
          performance_id,
          composer_ko,
          composer_en
        FROM
          programs
      ) p1
    GROUP BY
      performance_id
  )
  -- 2단계: 메인 테이블들과 최종 조인
SELECT
  -- 랭킹 정보
  r.current_rank,
  r.last_rank,
  r.performance_id,
  r.performance_name,
  r.period_from,
  r.period_to,
  r.venue_name,
  -- 공연 상세 정보 (performances 테이블)
  p.poster,
  p.cast,
  p.price,
  p.booking_links,
  -- 압축된 프로그램 정보 (위에서 만든 aggregated_programs)
  ap.program_ko,
  ap.program_en
FROM
  daily_ranking r
  LEFT JOIN performances p ON r.performance_id = p.performance_id
  LEFT JOIN aggregated_programs ap ON r.performance_id = ap.performance_id
ORDER BY
  r.current_rank ASC;


CREATE OR REPLACE FUNCTION "public"."upsert_performances_bulk"("payload" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    item jsonb; -- 배열 안의 각 공연 객체
    perf_id text;
    processed_count int := 0;
BEGIN
    FOR item IN SELECT jsonb_array_elements(payload)
    LOOP
        perf_id := item->>'performance_id';

        INSERT INTO performances (
            performance_id, performance_name, age, area, booking_links, 
            "cast", detail_image, max_price, min_price, period_from, 
            period_to, poster, price, raw_data, 
            runtime, state, time, venue_id, venue_name, updated_at
            -- performances 테이블에서 program 컬럼이 제외되었으므로 program을 뻈다.
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
            item->>'period_from', 
            item->>'period_to',
            item->>'poster',
            item->'price',
            item->'raw_data',
            item->>'runtime',
            item->>'state',
            item->>'time',
            item->>'venue_id',
            item->>'venue_name',
            now()
            -- 여기서 item->'program'을 넣는 코드 제외
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
            -- 여기서 'program = EXCLUDED.program' 제외

        -- 2. programs 테이블 동기화 (인자로 받은 item->'program'은 여기서 찢어서 사용!)
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
            kr.title,
            en.title
        FROM jsonb_array_elements(item->'program') AS p
        CROSS JOIN LATERAL jsonb_array_elements_text(p->'workTitleKr') WITH ORDINALITY AS kr(title, idx)
        INNER JOIN LATERAL jsonb_array_elements_text(p->'workTitleEn') WITH ORDINALITY AS en(title, idx) 
            ON kr.idx = en.idx;

        processed_count := processed_count + 1;
    END LOOP;

    RETURN processed_count || ' performances processed successfully.';
END;
$$;

-- programs 컬럼에 프로그램 데이터를 삽입하기 위해,
-- performances 테이블에 program 컬럼을 요구하는 트리거와 함수 삭제
DROP TRIGGER IF EXISTS "trigger_sync_programs" ON "public"."performances";

-- 필요 없어진 기존 동기화 함수 삭제
-- 새로 만든 upsert_performances_bulk 함수가 이 역할을 대신한다.
DROP FUNCTION IF EXISTS "public"."sync_performance_programs" ();