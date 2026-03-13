-- 1. 'performances' 버킷 생성
-- storage.buckets 테이블에 데이터를 삽입하는 방식으로 생성합니다.
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('performances', 'performances', true) ON CONFLICT (id) DO NOTHING;

-- 2. 스토리지 보안 정책(RLS) 설정
-- 버킷만 만든다고 끝이 아니라, 누가 읽고 쓸 수 있는지 정해야 에러가 안 납니다.
-- 모든 사람이 이미지를 볼 수 있게 허용 (Public 설정)
CREATE POLICY "공연 이미지 공개 읽기" ON storage.objects FOR
SELECT
  USING (bucket_id = 'performances');

-- 인증된 사용자(또는 서비스 역할)가 파일을 올리고 지울 수 있게 허용
CREATE POLICY "공연 데이터 관리자 권한" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'performances')
WITH
  CHECK (bucket_id = 'performances');