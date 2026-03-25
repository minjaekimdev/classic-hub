CREATE OR REPLACE FUNCTION search_performances_with_unique_composers(search_keyword TEXT)
RETURNS TABLE (
    performance_id TEXT,
    performance_name TEXT,
    poster TEXT,
    "cast" TEXT,
    period_from TEXT,
    period_to TEXT,
    venue_name TEXT,
    programs JSONB
) AS $$
DECLARE
    k TEXT := '%' || search_keyword || '%'; -- 검색어 미리 포맷팅
BEGIN
    RETURN QUERY
    -- 1. 검색 조건에 맞는 공연 ID들만 먼저 선별 (중복 제거)
    WITH filtered_performances AS (
        SELECT DISTINCT p.performance_id
        FROM performances p
        LEFT JOIN programs pr ON p.performance_id = pr.performance_id
        WHERE p.performance_name ILIKE k
           OR p.cast ILIKE k
           OR pr.composer_ko ILIKE k
           OR pr.title_ko ILIKE k
           OR pr.composer_en ILIKE k
           OR pr.title_en ILIKE k
    ),
    -- 2. 선별된 공연들에 대해서만 작곡가별 중복 없는 프로그램 목록 생성
    distinct_programs AS (
        SELECT DISTINCT ON (pr.performance_id, pr.composer_ko)
            pr.performance_id,
            pr.composer_ko,
            pr.composer_en,
            pr.title_ko,
            pr.title_en
        FROM programs pr
        JOIN filtered_performances fp ON pr.performance_id = fp.performance_id
        ORDER BY pr.performance_id, pr.composer_ko, pr.title_ko
    ),
    -- 3. 중복 제거된 프로그램들을 공연별로 JSON 그룹화
    aggregated_programs AS (
        SELECT 
            dp.performance_id,
            jsonb_agg(jsonb_build_object('composerKo', dp.composer_ko, 'workTitleKr', dp.title_ko, 'composerEn', dp.composer_en, 'workTitleEn', dp.title_en)) as programs_json
        FROM distinct_programs dp
        GROUP BY dp.performance_id
    )
    -- 4. 최종 결과 조인
    SELECT 
        p.performance_id,
        p.performance_name,
        p.poster,
        p.cast,
        p.period_from,
        p.period_to,
        p.venue_name,
        COALESCE(ap.programs_json, '[]'::jsonb) -- 프로그램이 없는 경우 빈 배열 처리
    FROM filtered_performances fp -- 1단계에서 찾은 명단을 기준으로 시작합니다!
    JOIN performances p ON fp.performance_id = p.performance_id -- 명단에 있는 공연 정보만 가져옵니다.
    LEFT JOIN aggregated_programs ap ON fp.performance_id = ap.performance_id; -- 프로그램 정보를 합칩니다.
END;
$$ LANGUAGE plpgsql;