import { supabaseAdmin } from "./supabaseAdmin.ts";

export const storageDelete = async (bucket: string, path: string[]) => {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(path);

  if (error) {
    throw new Error("[DELETE_FAIL] Storage File delete failed");
  }
};
