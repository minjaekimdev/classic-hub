# set: 쉘의 작동 규칙(설정)을 정의 
# -e옵션: 에러 발생 시 즉시 중단 (Fail-Fast)
set -e

# 색상 정의 (가독성용)
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# echo: 터미널에 글자를 출력해주는 명령어
# 여기서의 -e옵션은 터미널이 이스케이프 문자를 해석(Interpret)하는 기능을 켜는 역할
# NC: 걸려있는 효과
echo -e "${YELLOW}🏗️  [1/5] 빌드 및 타입 체크 시작...${NC}"
# 백엔드와 그 의존성(shared 등)만 빌드하여 시간 단축
npx turbo run build --filter=backend...

echo -e "${YELLOW}🐳 [2/5] Docker 엔진 상태 확인...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo "Docker가 꺼져 있습니다. 실행을 시도합니다..."
  # macOS 기준 (Windows/Linux 사용 시 환경에 맞게 조정 필요)
  open -a Docker
  until docker info > /dev/null 2>&1; do
    echo "⏳ Docker 엔진 예열 중... (3초 대기)"
    sleep 3
  done
  echo -e "${GREEN}✅ Docker 준비 완료!${NC}"
fi

echo -e "${YELLOW}🚀 [3/5] Supabase 인프라 초기화 및 재가동...${NC}"
# # 1. 이미 실행 중인 경우를 대비해 중지 (데이터 백업 없이 완전 삭제)
# # || true는 아직 실행 중이 아닐 때 에러가 발생해도 스크립트가 멈추지 않게 합니다.
npx supabase stop --no-backup || true

npx supabase start

echo -e "${YELLOW}🔄 [4/5] 로컬 환경 변수 동기화...${NC}"
# 루트의 scripts 폴더에 있는 sync-env.js 실행
node ./scripts/sync-env.js

echo -e "${YELLOW}🧪 [5/5] 백엔드 로직 통합 테스트 실행...${NC}"
npx turbo run test-update-performances --filter=backend

echo -e "${GREEN}🎉 모든 검증을 통과했습니다! 안전하게 푸시를 진행합니다.${NC}"