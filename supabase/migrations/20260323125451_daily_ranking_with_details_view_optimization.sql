CREATE OR REPLACE VIEW daily_ranking_with_details AS
WITH 
  -- [1단계] 작곡가별로 곡(Title)들을 먼저 묶기
  composer_grouped AS (
    SELECT 
      performance_id,
      composer_ko,
      composer_en,
      jsonb_agg(title_ko) AS pieces_ko,
      jsonb_agg(title_en) AS pieces_en
    FROM programs
    GROUP BY performance_id, composer_ko, composer_en
  ),

  -- [2단계] 공연별로 작곡가 그룹들을 최종 JSON 배열로 압축하기
  aggregated_programs AS (
    SELECT 
      performance_id,
      jsonb_agg(jsonb_build_object('name', composer_ko, 'pieces', pieces_ko)) AS program_ko,
      jsonb_agg(jsonb_build_object('name', composer_en, 'pieces', pieces_en)) AS program_en
    FROM composer_grouped
    GROUP BY performance_id
  )

-- [3단계] 순위표(r), 공연정보(p), 프로그램(ap)을 하나로 조립
SELECT 
  r.current_rank,
  r.last_rank,
  r.performance_id,
  r.performance_name,
  r.period_from,
  r.period_to,
  r.venue_name,
  p.poster,
  p.cast,
  p.price,
  p.booking_links,
  ap.program_ko,
  ap.program_en
FROM daily_ranking r
LEFT JOIN performances p ON r.performance_id = p.performance_id
LEFT JOIN aggregated_programs ap ON r.performance_id = ap.performance_id
ORDER BY r.current_rank ASC;