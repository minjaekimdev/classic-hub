// backend/.env.local에 일시 생성된 supabase 환경변수들을 저장한다.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process"); // 명령어를 실행해주는 도구

try {
  console.log("🔄 Supabase 상태 정보를 가져오는 중...");

  // 1. 'supabase status -o json' 명령어를 실행해서 결과를 JSON으로 받습니다.
  const statusRaw = execSync("supabase status -o json", { encoding: "utf-8" });
  const status = JSON.parse(statusRaw);

  // 2. 받아온 실시간 정보에서 필요한 값만 쏙쏙 뽑아냅니다.
  const supabaseUrl = status.API_URL;
  const anonKey = status.ANON_KEY;
  const serviceKey = status.SERVICE_ROLE_KEY;
  const dbUrl = status.DB_URL; // postgresql://... 형식의 전체 주소

  // 3. 동적으로 생성된 내용을 템플릿에 넣습니다.
  const localContent = `
# [Dynamic Script Exclusive] Supabase Local Settings
# 생성 일시: ${new Date().toLocaleString()}

SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
DATABASE_URL=${dbUrl}

# 스크립트 작동 모드
DEBUG=true
SCRIPT_MODE=standalone
`.trim();

  // 4. 파일 저장 경로 (packages/backend/.env.local)
  const targetPath = path.join(__dirname, "..", "packages", "backend", ".env.local");

  // 5. 파일 쓰기
  fs.writeFileSync(targetPath, localContent);

  console.log("--- ✅ 실시간 환경 변수 동기화 완료! ---");
  console.log(`🔗 URL: ${supabaseUrl}`);
  console.log(`📝 파일: .env.local 업데이트됨`);
} catch (error) {
  console.error("❌ 실패: Supabase가 켜져 있는지 확인해 주세요!");
  console.error(`에러 내용: ${error.message}`);
  process.exit(1); // 에러 발생 시 스크립트 중단
}
