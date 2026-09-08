import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// 1. 우선 기본 .env 파일을 로드합니다.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// 2. 만약 NODE_ENV가 test라면, .env.test 파일을 로드하여 기존 값을 덮어씌웁니다.
if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.test"),
    override: true, // 🔥 이 옵션이 핵심입니다! 기존 값을 무시하고 덮어씁니다.
  });
}

if (!process.env.SUPABASE_URL) {
  throw new Error("환경변수 SUPABASE_URL이 설정되어 있지 않습니다!");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "환경변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어 있지 않습니다!",
  );
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
