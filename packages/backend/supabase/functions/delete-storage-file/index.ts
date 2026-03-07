import { storageDelete } from "../_shared/service.ts";
import { getResponse, getStoragePath } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  try {
    const { old_record, type } = await req.json();

    if (type !== "DELETE" || !old_record) {
      return getResponse({ message: "Not a Delete event. skipping..." });
    }

    const storagePaths = [
      old_record.poster,
      ...(Array.isArray(old_record.detail_image)
        ? old_record.detail_image
        : []),
    ]
      .map(getStoragePath)
      .filter((path): path is string => Boolean(path));

    if (storagePaths.length > 0) {
      try {
        await storageDelete("performances", storagePaths);
      } catch (err) {
        throw new Error("[DELETE_FAIL] Storage File Delete failed", {
          cause: err,
        });
      }
    }

    return getResponse({ message: "Success" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return getResponse({ error: errorMessage }, 500);
  }
});
