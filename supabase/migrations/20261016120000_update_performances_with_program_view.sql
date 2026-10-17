DROP VIEW IF EXISTS performances_with_program_view;

CREATE OR REPLACE VIEW performances_with_program_view AS
WITH composer_grouped_programs AS (
    SELECT
        pr.performance_id,
        pr.composer_ko,
        pr.composer_en,
        string_agg(concat_ws(' ', pr.title_ko, pr.title_en), ' ') AS titles_text,
        COALESCE(
            jsonb_agg(
                jsonb_build_object('ko', pr.title_ko, 'en', pr.title_en)
                ORDER BY pr.title_ko NULLS LAST
            ) FILTER (WHERE pr.title_ko IS NOT NULL OR pr.title_en IS NOT NULL),
            '[]'::jsonb
        ) AS titles
    FROM programs pr
    GROUP BY pr.performance_id, pr.composer_ko, pr.composer_en
),
aggregated_programs AS (
    SELECT
        performance_id,
        string_agg(concat_ws(' ', composer_ko, composer_en, titles_text), ' ') AS all_programs_text,
        jsonb_agg(
            jsonb_build_object(
                'composerKo', composer_ko,
                'composerEn', composer_en,
                'titles', titles
            ) ORDER BY composer_ko NULLS LAST
        ) AS final_programs
    FROM composer_grouped_programs
    GROUP BY performance_id
)
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
    p.area,
    regexp_replace(
        regexp_replace(p."time", '(월|화|수|목|금|토|일)요일', '\1', 'g'),
        '\(((?:\d{1,2}:\d{2})(?:,\d{1,2}:\d{2})*)\)',
        ' \1',
        'g'
    ) AS performance_time,
    p.runtime,
    p.age,
    p.price,
    f.adress AS venue_address,
    LOWER(
        concat_ws(' ', p.performance_name, p.cast, p.venue_name, ap.all_programs_text)
    ) AS search_target,
    COALESCE(ap.final_programs, '[]'::jsonb) AS programs
FROM performances p
LEFT JOIN aggregated_programs ap ON p.performance_id = ap.performance_id
LEFT JOIN facilities f ON p.venue_id = f.id;

GRANT SELECT ON performances_with_program_view TO anon, authenticated;
