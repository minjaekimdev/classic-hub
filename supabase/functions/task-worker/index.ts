import { deleteFromStorage } from "../../_shared/utils.ts";
import { supabaseAdmin } from "../../_shared/client.ts";
import { Queue } from "../../_shared/typeExtractor.ts";
import { getResponse } from "../../_shared/utils.ts";

interface Payload {
  performanceId: string;
  storagePaths: string[];
}

// DB의 task_queue 테이블에 쌓여 있는 작업들(주로 파일 삭제) 중
// PENDING이거나 FAILED한 것들 가져와서 재시도하고, 상태를 업데이트한다.
// pg_cron을 통해 실행 스케줄링
Deno.serve(async () => {
  // 이벤트가 발생하면 다음 내용 실행
  // pending이거나 failed 상태의 데이터를 모으기
  try {
    const { data: targets, error: fetchError } = await supabaseAdmin
      .from("task_queue")
      .select("*")
      .in("status", ["PENDING", "FAILED"])
      // 재시도 예정 시간이 현재 시점보다 과거인 데이터만 가져와서 실행한다.
      .lte("next_retry_at", new Date().toISOString())
      .returns<Queue[]>();

    if (fetchError) throw fetchError;
    if (!targets || targets.length === 0) {
      return getResponse({ message: "No tasks to process" });
    }

    // 모은 대상 데이터들에 한해 다시 storage 파일 삭제 수행
    // allSettled: 하나가 실패해도 다른 작업은 끝까지 진행
    /* allSettled 내에서는 각 호출마다 다음과 같은 객체를 리턴한다.
      성공 시
      {
        status: "fullfilled",
        value: "..."(리턴한 값)
      }
      실패 시
      { 
        status: "rejected"
        reason: Error(...)
      }
    */
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
        .in("id", successIds); // id 컬럼의 값이 successIds 배열 안에 포함된 데이터들만 골라서 업데이트한다.
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
