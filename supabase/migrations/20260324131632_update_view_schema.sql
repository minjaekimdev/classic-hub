DROP VIEW IF EXISTS daily_ranking_with_details;

CREATE VIEW daily_ranking_with_details AS
WITH
  -- [1단계] 작곡가별로 곡(Title)들을 먼저 묶기
  composer_agg AS (
    SELECT
      performance_id,
      jsonb_agg(DISTINCT composer_ko) AS composers_ko
    FROM
      programs
    WHERE composer_ko IS NOT NULL
    GROUP BY
      performance_id
  )
SELECT
  r.current_rank,
  p.performance_id,
  p.performance_name,
  p.poster,
  p.cast,
  p.venue_name,
  p.min_price,
  p.max_price,
  p.period_from,
  p.period_to,
  -- 현재는 한글 작곡가명만 필요하므로 해당 컬럼만 가져온다.
  ca.composers_ko
FROM
  daily_ranking r
  LEFT JOIN performances p ON r.performance_id = p.performance_id
  LEFT JOIN composer_agg ca ON r.performance_id = ca.performance_id
ORDER BY
  r.current_rank ASC;

DROP VIEW IF EXISTS weekend_performances_with_program;

CREATE OR REPLACE VIEW weekend_performances_with_program AS
WITH 
  -- [1단계] 이번 주 토요일과 일요일 날짜 계산
  target_weekend AS (
    SELECT 
      (CURRENT_DATE + (6 - EXTRACT(DOW FROM CURRENT_DATE)::int)) AS sat,
      (CURRENT_DATE + (7 - EXTRACT(DOW FROM CURRENT_DATE)::int)) AS sun
  ),
  -- [2단계] 작곡가 뭉치기 (NULL 제외 로직 추가)
  composer_agg AS (
    SELECT
      performance_id,
      jsonb_agg(DISTINCT composer_ko) AS composers_ko
    FROM programs
    WHERE composer_ko IS NOT NULL
    GROUP BY performance_id
  )
SELECT
  p.performance_id,
  p.performance_name,
  p.poster,
  p.cast,
  p.venue_name,
  p.min_price,
  p.max_price,
  p.period_from,
  p.period_to,
  ca.composers_ko
FROM 
  performances p
  CROSS JOIN target_weekend tw
  LEFT JOIN composer_agg ca ON p.performance_id = ca.performance_id
WHERE 
  p.period_from::date <= tw.sun AND p.period_to::date >= tw.sat;