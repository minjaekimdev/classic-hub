#!/bin/bash

# [1/5] 빌드 및 타입 체크 시작... (동일)
set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🏗️  [1/5] 빌드 및 타입 체크 시작...${NC}"
npx turbo run build --filter=backend...

# [2/5] Docker 엔진 상태 확인... (동일)
echo -e "${YELLOW}🐳 [2/5] Docker 엔진 상태 확인...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo "Docker가 꺼져 있습니다. 실행을 시도합니다..."
  open -a Docker
  until docker info > /dev/null 2>&1; do
    echo "⏳ Docker 엔진 예열 중... (3초 대기)"
    sleep 3
  done
  echo -e "${GREEN}✅ Docker 준비 완료!${NC}"
fi

# 🚀 [3/5] 이 부분이 스마트 리셋으로 변경되었습니다!
echo -e "${YELLOW}🚀 [3/5] Supabase 인프라 최적화 리셋...${NC}"

# Supabase가 이미 실행 중인지 확인
if npx supabase status > /dev/null 2>&1; then
  echo -e "${GREEN}이미 Supabase가 실행 중입니다. DB 스키마만 빠르게 리셋합니다...${NC}"
  # DB만 밀고 마이그레이션 파일을 다시 적용 (매우 빠름)
  npx supabase db reset
else
  echo -e "${YELLOW}Supabase가 꺼져 있습니다. 인프라를 새로 가동합니다...${NC}"
  # 꺼져 있을 때는 전체 인프라 가동
  npx supabase start
fi

# [4/5] 로컬 환경 변수 동기화... (동일)
echo -e "${YELLOW}🔄 [4/5] 로컬 환경 변수 동기화...${NC}"
node ./scripts/sync-env.js

# [5/5] 백엔드 로직 통합 테스트 실행... (동일)
echo -e "${YELLOW}🧪 [5/5] 백엔드 로직 통합 테스트 실행...${NC}"

# DB 테스트 이므로 순차 실행을 위해 && 사용
# --continue=never를 통해 테스트 하나가 실패하면 전체가 실패하도록
npx turbo run test-update-performances --filter=backend

echo -e "${GREEN}🎉 모든 검증을 통과했습니다! 안전하게 푸시를 진행합니다.${NC}"