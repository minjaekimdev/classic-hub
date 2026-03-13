import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
// 2. 로컬용 .env.local 로드 (override: true를 주어 .env보다 우선순위를 높임)
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true });

if (!process.env.SUPABASE_URL) {
  console.dir(process.env);
  throw new Error("환경변수 SUPABASE_URL이 설정되어 있지 않습니다!");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.dir(process.env);
  throw new Error(
    "환경변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어 있지 않습니다!",
  );
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
