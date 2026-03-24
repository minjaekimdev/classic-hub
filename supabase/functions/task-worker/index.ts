import { deleteFromStorage } from "../_shared/service.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { Queue } from "../_shared/typeExtract.ts";
import { getResponse } from "../_shared/utils.ts";

interface Payload {
  performanceId: string;
  storagePaths: string[];
}

// pg_cron을 통해 실행 스케줄링
Deno.serve(async () => {
  // 이벤트가 발생하면 다음 내용 실행
  // pending이거나 failed 상태의 데이터를 모으기
  try {
    const { data: targets, error: fetchError } = await supabaseAdmin
      .from("task_queue")
      .select("*")
      .in("status", ["PENDING", "FAILED"])
      .lte("next_retry_at", new Date().toISOString())
      .returns<Queue[]>();

    if (fetchError) throw fetchError;
    if (!targets || targets.length === 0) {
      return getResponse({ message: "No tasks to process" });
    }

    // 모은 대상 데이터들에 한해 다시 storage 파일 삭제 수행
    const results = await Promise.allSettled(
      targets.map(async (target) => {
        const content = target.payload as unknown as Payload;
        await deleteFromStorage("performances", content.storagePaths);
        return target.id;
      }),
    );

    // 성공한 데이터와 실패한 데이터를 나누어 처리
    const successIds: string[] = [];
    const failureUpdates: any[] = [];

    results.forEach((result, idx) => {
      const origin = targets[idx];

      if (result.status === "fulfilled") {
        successIds.push(result.value);
      } else {
        const nextRetryCount = origin.retry_count + 1;
        const isArchived = nextRetryCount >= origin.max_retries;
        const errorMsg =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);

        // 지수적 백오프로 재시도 로직 구현(2시간, 4시간, 8시간 ...)
        const backoffMinutes = Math.pow(2, nextRetryCount);
        const nextRetryAt = new Date(
          Date.now() + backoffMinutes * 3600000,
        ).toISOString();

        failureUpdates.push({
          id: origin.id,
          status: isArchived ? "ARCHIVED" : "FAILED",
          error_message: `[STORAGE_ERR] ${errorMsg}`,
          retry_count: nextRetryCount,
          next_retry_at: isArchived ? null : nextRetryAt,
        });
      }
    });

    if (successIds.length > 0) {
      await supabaseAdmin
        .from("task_queue")
        .update({ status: "COMPLETED" })
        .in("id", successIds);
    }

    if (failureUpdates.length > 0) {
      await supabaseAdmin.from("task_queue").upsert(failureUpdates);
    }

    return getResponse({
      message: `Processed ${targets.length} tasks`,
      success: successIds.length,
      failed: failureUpdates.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return getResponse({ error: errorMessage }, 500);
  }
});
