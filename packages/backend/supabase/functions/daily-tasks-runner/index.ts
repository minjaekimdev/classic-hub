import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log("Daily tasks runner function loaded.");

Deno.serve(async (_req) => {
  try {
    // 1. 첫 번째 함수 호출
    console.log("Invoking ranking-performance...");
    const { error: errorA } = await supabase.functions.invoke(
      "ranking-performance"
    );

    if (errorA) {
      throw new Error(`Failed to run ranking-performance: ${errorA.message}`);
    }
    console.log("ranking-performance completed successfully.");

    // 2. 두 번째 함수 호출
    console.log("Invoking all-performance...");
    const { error: errorB } = await supabase.functions.invoke(
      "all-performance"
    );

    if (errorB) {
      throw new Error(`Failed to run all-performance: ${errorB.message}`);
    }
    console.log("all-performance completed successfully.");

    return new Response("All daily tasks completed successfully.", {
      status: 200,
    });
  } catch (error) {
    console.error("Error in daily tasks runner:", error);
    
    // 3. 에러 응답 형식을 JSON으로 통일
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});