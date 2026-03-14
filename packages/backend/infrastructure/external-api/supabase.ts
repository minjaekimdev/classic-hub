import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env" });
}

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
