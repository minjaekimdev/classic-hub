CREATE OR REPLACE VIEW performances_with_program_view AS
-- 1. 먼저 공연별 + 작곡가별로 곡 제목들을 배열로 묶습니다.
WITH composer_grouped_programs AS (
    SELECT 
        pr.performance_id,
        pr.composer_ko,
        pr.composer_en,
        jsonb_agg(pr.title_ko ORDER BY pr.title_ko) AS title_ko_list,
        jsonb_agg(pr.title_en ORDER BY pr.title_en) AS title_en_list
    FROM programs pr
    GROUP BY pr.performance_id, pr.composer_ko, pr.composer_en
),
-- 2. 위에서 만든 작곡가별 객체들을 다시 공연 ID별로 하나의 배열로 묶습니다.
aggregated_programs AS (
    SELECT 
        performance_id,
        jsonb_agg(
            jsonb_build_object(
                'composerKo', composer_ko,
                'composerEn', composer_en,
                'titleKo', title_ko_list,
                'titleEn', title_en_list
            )
            ORDER BY composer_ko -- 작곡가 이름순 정렬
        ) AS final_programs
    FROM composer_grouped_programs
    GROUP BY performance_id
)
-- 3. 최종 결과 조인
SELECT 
    p.performance_id,
    p.poster,
    p.performance_name,
    p.cast,
    p.period_from,
    p.period_to,
    p.venue_id,
    p.venue_name,
    p.min_price,
    p.max_price,
    p.booking_links,
    COALESCE(ap.final_programs, '[]'::jsonb) AS programs
FROM performances p
LEFT JOIN aggregated_programs ap ON p.performance_id = ap.performance_id;