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