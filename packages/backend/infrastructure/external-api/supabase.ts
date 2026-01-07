import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = "https://razltwjkvwqiyksaydcw.supabase.co";

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("환경변수 SUPABASE_ANON_KEY가 설정되어 있지 않습니다!");
}

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
