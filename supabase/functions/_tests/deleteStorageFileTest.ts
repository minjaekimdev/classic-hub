import { supabaseAdmin, supabaseUrl } from "../_shared/supabaseAdmin.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Deno.test로 함수 테스트
Deno.test("스토리지 파일 삭제 통합 테스트", async () => {
  const bucketName = "performances";
  const testFileName = "test-folder/auto-test.jpg";
  // 로컬 스토리지의 실제 URL 구조 (함수가 인식할 수 있는 형태)
  const fullUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${testFileName}`;

  console.log("🛠️ 1. 테스트 파일 업로드 중...");
  await supabaseAdmin.storage
    .from("performances")
    .upload(testFileName, new Uint8Array([0]), { upsert: true });

  console.log("🚀 2. 에지 함수 호출 (Invoke)...");
  const { data: responseData, error: functionError } =
    await supabaseAdmin.functions.invoke("delete-storage-file", {
      body: {
        type: "DELETE",
        old_record: {
          poster: fullUrl,
          detail_image: [],
        },
      },
    });

  assertEquals(functionError, null, "함수 호출 중 에러가 발생했습니다.");
  assertEquals(
    responseData.message,
    "Success",
    "함수가 성공 응답을 보내지 않았습니다.",
  );

  await new Promise((r) => setTimeout(r, 1000));

  const { data: list } = await supabaseAdmin.storage
    .from(bucketName)
    .list("test-folder");

  const isExist = list?.some((item) => item.name === "auto-test.jpg");
  assertEquals(
    isExist,
    false,
    "❌ 에지 함수가 실행되었으나 파일이 여전히 존재합니다!",
  );
  console.log("✅ 테스트 통과!");
});
