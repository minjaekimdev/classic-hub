import { BUCKET_NAME } from "../../_shared/constants.ts";
import { getResponse } from "../../_shared/utils.ts";
import { supabaseAdmin } from "../../_shared/client.ts";

// Database Webhook이 보내준 요청(req)를 바탕으로 처리한다.
/* req.json()에는 다음과 같은 데이터가 자동으로 들어있다.
  {
    "type": "DELETE",           // 이벤트 종류 (INSERT, UPDATE, DELETE, SELECT)
    "table": "performances",    // 대상 테이블 이름
    "schema": "public",         // 스키마 이름
    "record": null,             // (INSERT, UPDATE일 때) 새로 들어온/수정된 데이터
    "old_record": {             // (UPDATE, DELETE일 때) 바뀌기 전/삭제된 데이터
      "id": "123",
      "performance_id": "P-001",
      "poster": "image.jpg",
      ... 모든 컬럼들 ...
  }
}
*/
Deno.serve(async (req) => {
  let performanceId: string | number | null = null;

  try {
    const { old_record, type } = await req.json();

    if (type !== "DELETE" || !old_record) {
      // Webhook에게 응답을 보낸다.
      return getResponse({ message: "Not a Delete event. skipping..." });
    }

    performanceId = old_record.id;
    const bucketName = BUCKET_NAME;

    // 2. 해당 performance_id 폴더 내의 모든 파일 목록 조회
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(bucketName)
      .list(String(performanceId));

    if (listError) {
      console.error(
        `[LIST_ERROR] Failed to list files for ID: ${performanceId}`,
        listError,
      );
      throw listError;
    }

    // 3. 폴더 내에 파일이 있다면 전체 경로 생성 후 삭제
    if (files && files.length > 0) {
      const pathsToDelete = files.map(
        (file) => `${performanceId}/${file.name}`,
      );

      const { error: deleteError } = await supabaseAdmin.storage
        .from(bucketName)
        .remove(pathsToDelete);

      if (deleteError) {
        console.error(
          `[DELETE_ERROR] Failed to remove files for ID: ${performanceId}`,
          deleteError,
        );
        throw deleteError;
      }

      return getResponse({
        message: `Successfully deleted all ${files.length} files in folder: ${performanceId}`,
      });
    }

    return getResponse({
      message: "Folder was already empty. Nothing to delete.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // 최종 catch 블록에서도 ID를 함께 출력하여 식별을 돕습니다.
    console.error(
      `[FINAL_CATCH] Error processing ID [${performanceId}]: ${errorMessage}`,
    );

    return getResponse({ error: errorMessage }, 500);
  }
});
