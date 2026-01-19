import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = "https://razltwjkvwqiyksaydcw.supabase.co";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("환경변수 SUPABASE_ANON_KEY가 설정되어 있지 않습니다!");
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
