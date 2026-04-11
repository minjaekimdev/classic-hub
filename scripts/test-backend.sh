#!/bin/bash

# [1/5] 빌드 및 타입 체크 시작... (동일)
set -e # 스크립트 실행 도중 에러가 발생하면 뒤쪽 코드를 실행하지 않고 즉시 스크립트를 종료한다.
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# echo: 전달받은 텍스트를 터미널 화면에 그대로 출력한다.
# -e 옵션은 \033같은 색상 기호를 색상 명령으로 인식하게 해준다(없을 경우 그대로 텍스트 출력)
echo -e "${YELLOW}🏗️  [1/5] 빌드 및 타입 체크 시작...${NC}"
# 준비에 오래 걸리는 테스트를 하기 전에 빌드를 통해 에러를 걸러낸다.
npx turbo run build --filter=backend

# [2/5] Docker 엔진 상태 확인... (동일)
echo -e "${YELLOW}🐳 [2/5] Docker 엔진 상태 확인...${NC}"
# if A then B: A라면 B를 실행한다.
# docker info: Docker 엔진의 상태를 확인(켜져 있으면 0, 꺼져 있으면 에러 코드 반환)
# 쉘 스크립트는 0을 참으로 인식한다.
# docker info > /dev/null: 표준 출력을 쓰레기통으로 보냄
# 2>&1: 표준 에러(에러 메시지)도 표준 출력과 같은 곳(휴지통)으로 보낸다. (이전 docker info > /dev/null의 영향, 줄 단위로 작동)
# if와 then을 한 줄에 넣기 위해 세미콜론을 사용한다.
if ! docker info > /dev/null 2>&1; then
  echo "Docker가 꺼져 있습니다. 실행을 시도합니다..."
  open -a Docker
  # until A do B done:  A가 참이 될 때까지 B를 실행한다.
  until docker info > /dev/null 2>&1; do
    echo "⏳ Docker 엔진 예열 중... (3초 대기)"
    sleep 3
  done
  echo -e "${GREEN}✅ Docker 준비 완료!${NC}"
fi

# 🚀 [3/5] 이 부분이 스마트 리셋으로 변경되었습니다!
echo -e "${YELLOW}🚀 [3/5] Supabase 인프라 최적화 리셋...${NC}"

# Supabase가 이미 실행 중인지 확인
# 🚀 [3/5] 수정된 스마트 리셋 로직
echo -e "${YELLOW}🚀 [3/5] Supabase 인프라 최적화 리셋...${NC}"

# supabase status: 로컬 supabase 환경의 상태 확인
# 이게 true가 되려면 모든 핵심 서비스(DB, API, Storage)가 전부 정상 작동하고 있어야 한다.
if npx supabase status > /dev/null 2>&1; then
  echo -e "${GREEN}이미 Supabase가 실행 중입니다. DB 스키마만 빠르게 리셋합니다...${NC}"
  npx supabase db reset
else # 일부 컨테이너만 살아있거나 꺼져 있는 경우 실행된다.
  echo -e "${YELLOW}Supabase 상태가 불안정하거나 꺼져 있습니다. 인프라를 새로 정리하고 가동합니다...${NC}"
  # --no-backup: 혹시 모를 좀비 컨테이너를 위해 확실히 멈추고 시작.
  # 이는 stop 시 데이터 백업을 하지 않음으로서 스크립트 실행 시간을 줄이는 효과도 있다.
  npx supabase stop --no-backup > /dev/null 2>&1 || true
  npx supabase start
fi

# [4/5] 로컬 환경 변수 동기화... (동일)
echo -e "${YELLOW}🔄 [4/5] 로컬 환경 변수 동기화...${NC}"
node ./scripts/sync-env.js

# [5/5] 백엔드 로직 통합 테스트 실행... (동일)
echo -e "${YELLOW}🧪 [5/5] 백엔드 로직 통합 테스트 실행...${NC}"
npx turbo run test-update-performances --filter=backend

echo -e "${GREEN}🎉 모든 검증을 통과했습니다! 안전하게 푸시를 진행합니다.${NC}"