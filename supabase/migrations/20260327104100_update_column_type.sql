DROP TABLE IF EXISTS feedbacks CASCADE;

-- 유저 피드백을 보관하기 위한 테이블 생성
CREATE TABLE
  feedbacks (
    -- 고유 아이디 (자동 생성)
    id SERIAL PRIMARY KEY,
    -- 유저 이메일 (필수 입력)
    email VARCHAR(255),
    -- 제안 내용 (길이 제한 없는 텍스트)
    content TEXT NOT NULL,
    -- 처리 상태 (기본값 'pending')
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    -- 제출 시각 (자동 기록)
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit suggestions" ON feedbacks FOR INSERT TO anon
WITH
  CHECK (true);