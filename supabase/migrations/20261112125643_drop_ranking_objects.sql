
-- 랭킹 크론 제거에 따른 랭킹 객체 정리.
-- 서비스에 랭킹 조회 기능이 존재하지 않으며, 관련 백엔드 코드(updateRanking 크론,
-- rankingPeriods, getRanking)는 이미 삭제되어 이 객체들을 참조하는 곳이 없다.
-- 의존 객체가 남아있는 경우 실패로 드러나야 하므로 CASCADE를 쓰지 않는다.
-- 테이블 DROP 시 RLS 정책·권한·50행씩의 과거 랭킹 데이터가 함께 제거된다.

DROP VIEW IF EXISTS public.daily_ranking_with_details;
DROP VIEW IF EXISTS public.weekly_ranking_with_details;
DROP VIEW IF EXISTS public.monthly_ranking_with_details;

DROP FUNCTION IF EXISTS public.bulk_update_concert_ranks(payload jsonb);
DROP FUNCTION IF EXISTS public.bulk_update_concert_ranks(period text, payload jsonb);

DROP TABLE IF EXISTS public.daily_ranking;
DROP TABLE IF EXISTS public.weekly_ranking;
DROP TABLE IF EXISTS public.monthly_ranking;
;
