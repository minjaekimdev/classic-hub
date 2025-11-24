import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://razltwjkvwqiyksaydcw.supabase.co";

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
  throw new Error("환경변수 VITE_SUPABASE_ANON_KEY가 설정되어 있지 않습니다!");
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
