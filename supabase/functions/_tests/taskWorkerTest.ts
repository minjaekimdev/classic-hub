import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("태스크 큐 기반 스토리지 삭제 통합 테스트", async () => {
  const bucketName = "performances";
  const testFileName = `test-folder/integration-test-${Date.now()}.jpg`;
  const performanceId = "test-perf-id";

  // 🛠️ 1. 테스트 환경 준비 (파일 업로드 및 태스크 등록)
  console.log("🛠️ 1. 테스트용 파일 업로드 및 큐 데이터 생성 중...");

  // 스토리지에 실제 더미 파일 업로드
  await supabaseAdmin.storage
    .from(bucketName)
    .upload(testFileName, new Uint8Array([0]), { upsert: true });

  // task_queue에 처리 대기 중인 데이터 삽입
  // (next_retry_at을 과거 시간으로 설정해야 워커가 긁어갑니다)
  const { data: taskData, error: insertError } = await supabaseAdmin
    .from("task_queue")
    .insert({
      payload: {
        performanceId: performanceId,
        storagePaths: [testFileName],
      },
      status: "PENDING",
      next_retry_at: new Date(Date.now() - 1000).toISOString(),
      max_retries: 5,
      retry_count: 0,
    })
    .select()
    .single();

  if (insertError) throw insertError;
  const taskId = taskData.id;

  // 🚀 2. 에지 함수 호출 (Invoke)
  console.log("🚀 2. 워커 에지 함수 호출 (Invoke)...");
  // 함수 이름은 환경에 맞게 수정하세요 (예: 'task-worker')
  const { data: responseData, error: functionError } =
    await supabaseAdmin.functions.invoke("task-worker", {
      body: {}, // 워커는 DB를 조회하므로 별도의 Body는 필요 없습니다.
    });

  assertEquals(functionError, null, "함수 호출 중 에러가 발생했습니다.");
  console.log("📊 함수 응답 결과:", responseData);

  // 🔍 3. 결과 검증 (DB 상태 및 스토리지)
  console.log("🔍 3. 처리 결과 및 DB 상태 검증 중...");

  // (1) task_queue 내의 해당 행이 COMPLETED로 바뀌었는지 확인
  const { data: updatedTask } = await supabaseAdmin
    .from("task_queue")
    .select("status")
    .eq("id", taskId)
    .single();

  assertEquals(
    updatedTask?.status,
    "COMPLETED",
    "태스크 상태가 COMPLETED로 업데이트되지 않았습니다.",
  );

  // (2) 스토리지에서 파일이 실제로 삭제되었는지 확인
  const { data: list } = await supabaseAdmin.storage
    .from(bucketName)
    .list("test-folder");

  const isExist = list?.some(
    (item) => item.name === testFileName.split("/").pop(),
  );
  assertEquals(
    isExist,
    false,
    "❌ 에지 함수가 실행되었으나 파일이 여전히 스토리지에 존재합니다!",
  );

  console.log("✅ 모든 통합 테스트 통과!");

  // 🧹 4. 테스트 데이터 정리 (Cleanup)
  await supabaseAdmin.from("task_queue").delete().eq("id", taskId);
});
