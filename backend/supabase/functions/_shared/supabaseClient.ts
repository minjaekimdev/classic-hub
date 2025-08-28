import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import 'jsr:@std/dotenv/load'

const supabaseUrl = "https://razltwjkvwqiyksaydcw.supabase.co";


const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
if (!supabaseAnonKey) {
  throw new Error("환경변수 SUPABASE_ANON_KEY가 설정되어 있지 않습니다!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
