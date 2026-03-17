CREATE TABLE
  IF NOT EXISTS public.performances (
    -- PK (기본키)
    performance_id TEXT PRIMARY KEY,
    -- 일반 문자열 필드
    performance_name TEXT,
    age TEXT,
    area TEXT,
    "cast" TEXT,
    poster TEXT,
    runtime TEXT,
    state TEXT,
    time TEXT,
    venue_id TEXT,
    venue_name TEXT,
    -- 날짜 필드 (KOPIS 형식인 YYYY.MM.DD 또는 YYYYMMDD를 그대로 담으려면 TEXT가 편하지만, 
    -- DB 기능을 쓰려면 DATE나 TIMESTAMP가 좋습니다. 여기서는 타입에 맞춰 TEXT로 구성합니다.)
    period_from TEXT,
    period_to TEXT,
    -- 숫자 필드
    max_price INTEGER,
    min_price INTEGER,
    -- JSON 필드 (PostgreSQL의 JSONB가 성능과 쿼리에 더 유리합니다)
    booking_links JSONB,
    detail_image JSONB,
    price JSONB,
    program JSONB,
    raw_data JSONB,
    -- 시스템 필드
    created_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW () NOT NULL,
      updated_at TIMESTAMP
    WITH
      TIME ZONE DEFAULT NOW ()
  );