-- 계층형 공연 검색 RPC
-- 1계층(정밀): 작곡가 그룹 단위 AND 매칭 — 모든 검색 토큰이 하나의 작곡가 그룹
--             (작곡가명 + 그의 곡명들, 한글 그룹 또는 영문 그룹) 안에 있어야 매칭.
--             그룹 텍스트를 공백 제거 후 비교하므로 '브람스교향곡' 같은 붙여쓰기도 처리된다. (specs search-002, search-008)
-- 2계층(폴백): 1계층 0건 시 공연 단위 AND(search_target) + compact 매칭.
--             공연명/출연진/공연장 검색을 지원하며 exactMatch=false로 표시된다.
-- 검색어가 비면 토큰 조건이 항상 참이 되어 전체 조회(필터만 적용)된다.

CREATE OR REPLACE FUNCTION search_concerts(
    p_keyword text DEFAULT '',
    p_status text DEFAULT 'all',
    p_period_from text DEFAULT NULL,
    p_period_to text DEFAULT NULL,
    p_sort text DEFAULT 'imminent',
    p_page int DEFAULT 1,
    p_page_size int DEFAULT 10,
    p_today text DEFAULT NULL,
    p_with_counts boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql STABLE
AS $$
DECLARE
    v_tokens text[];
    v_compact text;
    v_today text;
    v_from text;
    v_to text;
    v_page int := GREATEST(COALESCE(p_page, 1), 1);
    v_page_size int := LEAST(GREATEST(COALESCE(p_page_size, 10), 1), 50);
    v_exact_count int;
    v_exact boolean := true;
    v_total int;
    v_total_pages int;
    v_items jsonb;
    v_counts jsonb;
BEGIN
    v_today := COALESCE(p_today, to_char((now() AT TIME ZONE 'Asia/Seoul')::date, 'YYYY.MM.DD'));
    v_from := COALESCE(p_period_from, '0001.01.01');
    v_to := COALESCE(p_period_to, '9999.12.31');

    IF btrim(COALESCE(p_keyword, '')) = '' THEN
        v_tokens := ARRAY[]::text[];
        v_compact := NULL;
    ELSE
        v_tokens := regexp_split_to_array(btrim(p_keyword), '\s+');
        v_compact := replace(btrim(p_keyword), ' ', '');
    END IF;

    -- 1계층 매칭 수 (작곡가 그룹 단위 AND)
    SELECT count(*) INTO v_exact_count
    FROM (
        SELECT v.performance_id,
            EXISTS (
                SELECT 1
                FROM jsonb_array_elements(COALESCE(v.programs, '[]'::jsonb)) AS elem
                CROSS JOIN LATERAL (
                    SELECT
                        lower(regexp_replace(concat_ws(' ', elem->>'composerKo',
                            (SELECT string_agg(x->>'ko', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x)
                        ), '\s', '', 'g')) AS ko_txt,
                        lower(regexp_replace(concat_ws(' ', elem->>'composerEn',
                            (SELECT string_agg(x->>'en', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x)
                        ), '\s', '', 'g')) AS en_txt
                ) AS g
                WHERE COALESCE((SELECT bool_and(position(tok IN g.ko_txt) > 0) FROM unnest(v_tokens) AS tok), true)
                   OR COALESCE((SELECT bool_and(position(tok IN g.en_txt) > 0) FROM unnest(v_tokens) AS tok), true)
            ) AS is_exact
        FROM performances_with_program_view AS v
        WHERE v.period_to >= v_from
          AND v.period_to <= v_to
          AND (
            CASE p_status
                WHEN 'ongoing' THEN v.period_from <= v_today AND v.period_to >= v_today
                WHEN 'upcoming' THEN v.period_from > v_today
                ELSE true
            END
          )
    ) AS c
    WHERE c.is_exact;

    IF v_exact_count > 0 THEN
        v_exact := true;
        v_total := v_exact_count;
    ELSE
        v_exact := false;
        -- 2계층 매칭 수 (공연 단위 AND + compact)
        SELECT count(*) INTO v_total
        FROM performances_with_program_view AS v
        WHERE v.period_to >= v_from
          AND v.period_to <= v_to
          AND (
            CASE p_status
                WHEN 'ongoing' THEN v.period_from <= v_today AND v.period_to >= v_today
                WHEN 'upcoming' THEN v.period_from > v_today
                ELSE true
            END
          )
          AND (
            COALESCE((SELECT bool_and(position(tok IN v.search_target) > 0) FROM unnest(v_tokens) AS tok), true)
            OR (v_compact IS NOT NULL AND position(v_compact IN v.search_target_compact) > 0)
          );
    END IF;

    v_total_pages := GREATEST(ceil(v_total::numeric / v_page_size), 1);
    IF v_page > v_total_pages THEN
        v_page := v_total_pages;  -- 존재하지 않는 페이지는 마지막 페이지로 clamp (specs exception-02)
    END IF;

    IF v_exact THEN
        SELECT COALESCE(
            jsonb_agg(
                to_jsonb(r) - 'search_target' - 'search_target_compact' - 'is_exact'
                ORDER BY r.ord_price_asc, r.ord_price_desc, r.period_from, r.period_to
            ),
            '[]'::jsonb
        )
        INTO v_items
        FROM (
            SELECT b.*,
                CASE WHEN p_sort = 'price_asc' THEN b.min_price END AS ord_price_asc,
                CASE WHEN p_sort = 'price_desc' THEN b.min_price END AS ord_price_desc
            FROM (
                SELECT v.*,
                    EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements(COALESCE(v.programs, '[]'::jsonb)) AS elem
                        CROSS JOIN LATERAL (
                            SELECT
                                lower(regexp_replace(concat_ws(' ', elem->>'composerKo',
                                    (SELECT string_agg(x->>'ko', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x)
                                ), '\s', '', 'g')) AS ko_txt,
                                lower(regexp_replace(concat_ws(' ', elem->>'composerEn',
                                    (SELECT string_agg(x->>'en', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x
                                )), '\s', '', 'g')) AS en_txt
                        ) AS g
                        WHERE COALESCE((SELECT bool_and(position(tok IN g.ko_txt) > 0) FROM unnest(v_tokens) AS tok), true)
                           OR COALESCE((SELECT bool_and(position(tok IN g.en_txt) > 0) FROM unnest(v_tokens) AS tok), true)
                    ) AS is_exact
                FROM performances_with_program_view AS v
                WHERE v.period_to >= v_from
                  AND v.period_to <= v_to
                  AND (
                    CASE p_status
                        WHEN 'ongoing' THEN v.period_from <= v_today AND v.period_to >= v_today
                        WHEN 'upcoming' THEN v.period_from > v_today
                        ELSE true
                    END
                  )
            ) AS b
            WHERE b.is_exact
            ORDER BY
                CASE WHEN p_sort = 'price_asc' THEN b.min_price END ASC NULLS LAST,
                CASE WHEN p_sort = 'price_desc' THEN b.min_price END DESC NULLS LAST,
                b.period_from ASC,
                b.period_to ASC
            LIMIT v_page_size OFFSET (v_page - 1) * v_page_size
        ) AS r;
    ELSE
        SELECT COALESCE(
            jsonb_agg(
                to_jsonb(r) - 'search_target' - 'search_target_compact' - 'is_exact'
                ORDER BY r.ord_price_asc, r.ord_price_desc, r.period_from, r.period_to
            ),
            '[]'::jsonb
        )
        INTO v_items
        FROM (
            SELECT b.*,
                CASE WHEN p_sort = 'price_asc' THEN b.min_price END AS ord_price_asc,
                CASE WHEN p_sort = 'price_desc' THEN b.min_price END AS ord_price_desc
            FROM (
                SELECT v.*, false AS is_exact
                FROM performances_with_program_view AS v
                WHERE v.period_to >= v_from
                  AND v.period_to <= v_to
                  AND (
                    CASE p_status
                        WHEN 'ongoing' THEN v.period_from <= v_today AND v.period_to >= v_today
                        WHEN 'upcoming' THEN v.period_from > v_today
                        ELSE true
                    END
                  )
                  AND (
                    COALESCE((SELECT bool_and(position(tok IN v.search_target) > 0) FROM unnest(v_tokens) AS tok), true)
                    OR (v_compact IS NOT NULL AND position(v_compact IN v.search_target_compact) > 0)
                  )
            ) AS b
            ORDER BY
                CASE WHEN p_sort = 'price_asc' THEN b.min_price END ASC NULLS LAST,
                CASE WHEN p_sort = 'price_desc' THEN b.min_price END DESC NULLS LAST,
                b.period_from ASC,
                b.period_to ASC
            LIMIT v_page_size OFFSET (v_page - 1) * v_page_size
        ) AS r;
    END IF;

    IF p_with_counts THEN
        IF v_exact THEN
            SELECT jsonb_build_object(
                'all', count(*),
                'ongoing', count(*) FILTER (WHERE period_from <= v_today AND period_to >= v_today),
                'upcoming', count(*) FILTER (WHERE period_from > v_today)
            ) INTO v_counts
            FROM (
                SELECT v.period_from, v.period_to,
                    EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements(COALESCE(v.programs, '[]'::jsonb)) AS elem
                        CROSS JOIN LATERAL (
                            SELECT
                                lower(regexp_replace(concat_ws(' ', elem->>'composerKo',
                                    (SELECT string_agg(x->>'ko', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x
                                )), '\s', '', 'g')) AS ko_txt,
                                lower(regexp_replace(concat_ws(' ', elem->>'composerEn',
                                    (SELECT string_agg(x->>'en', ' ') FROM jsonb_array_elements(COALESCE(elem->'titles', '[]'::jsonb)) AS x
                                )), '\s', '', 'g')) AS en_txt
                        ) AS g
                        WHERE COALESCE((SELECT bool_and(position(tok IN g.ko_txt) > 0) FROM unnest(v_tokens) AS tok), true)
                           OR COALESCE((SELECT bool_and(position(tok IN g.en_txt) > 0) FROM unnest(v_tokens) AS tok), true)
                    ) AS is_exact
                FROM performances_with_program_view AS v
                WHERE v.period_to >= v_from
                  AND v.period_to <= v_to
            ) AS c
            WHERE c.is_exact;
        ELSE
            SELECT jsonb_build_object(
                'all', count(*),
                'ongoing', count(*) FILTER (WHERE period_from <= v_today AND period_to >= v_today),
                'upcoming', count(*) FILTER (WHERE period_from > v_today)
            ) INTO v_counts
            FROM performances_with_program_view AS v
            WHERE v.period_to >= v_from
              AND v.period_to <= v_to
              AND (
                COALESCE((SELECT bool_and(position(tok IN v.search_target) > 0) FROM unnest(v_tokens) AS tok), true)
                OR (v_compact IS NOT NULL AND position(v_compact IN v.search_target_compact) > 0)
              );
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'items', v_items,
        'total', v_total,
        'page', v_page,
        'totalPages', v_total_pages,
        'exactMatch', v_exact,
        'counts', v_counts
    );
END;
$$;

GRANT EXECUTE ON FUNCTION search_concerts(text, text, text, text, text, int, int, text, boolean) TO anon, authenticated;
