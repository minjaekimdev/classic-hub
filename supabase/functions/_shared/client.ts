import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Edge Function 및 Deno 테스트가 사용하는 서비스롤 Supabase 클라이언트.
// `supabase functions serve`와 `supabase start`가 주입하는 환경변수를 사용하며,
// 로컬 실행 시 로컬 스택(127.0.0.1:54321)을 향한다.
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl) {
  throw new Error("환경변수 SUPABASE_URL이 설정되어 있지 않습니다!");
}
if (!serviceRoleKey) {
  throw new Error("환경변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어 있지 않습니다!");
}

// 세션 저장/자동 갱신이 없는 서버 간 클라이언트이므로 auth 타이머를 비활성화한다.
// (Deno 테스트의 타이머 누수 감지 원인이 되기도 한다)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
