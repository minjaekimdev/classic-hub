import { supabaseAdmin } from "../../_shared/client.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { BUCKET_NAME } from "../../_shared/constants.ts";

// Deno.test로 함수 테스트
Deno.test("스토리지 파일 삭제 통합 테스트", async () => {
  const testFileName = "PF123456/poster.jpg";

  // 스토리지에 테스트 파일을 업로드
  console.log("🛠️ 1. 테스트 파일 업로드 중...");
  await supabaseAdmin.storage
    .from("performances")
    .upload(testFileName, new Uint8Array([0]), { upsert: true });

  // 에지 함추를 호출하여 가상의 삭제 유발
  console.log("🚀 2. 에지 함수 호출 (Invoke)...");
  const { data: responseData, error: functionError } =
    await supabaseAdmin.functions.invoke("delete-storage-file", {
      body: {
        type: "DELETE",
        old_record: {
          performance_id: "PF123456",
        },
      },
    });
  
  // assertEquals(actual, expected, [message])
  // actual이 expected와 다르면 테스트가 중단되고 message가 출력된다.
  assertEquals(functionError, null, "함수 호출 중 에러가 발생했습니다.");
  assertEquals(
    responseData.message,
    "Success",
    "함수가 성공 응답을 보내지 않았습니다.",
  );

  await new Promise((r) => setTimeout(r, 1000));

  const { data: list } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list("PF123456");

  const isExist = list?.some((item) => item.name === "poster.jpg");
  assertEquals(
    isExist,
    false,
    "❌ 에지 함수가 실행되었으나 파일이 여전히 존재합니다!",
  );
  console.log("✅ 테스트 통과!");
});
