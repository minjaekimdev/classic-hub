import { supabaseAdmin } from "./supabaseAdmin.ts";

export const insertToDB = async <T>(
  table: string,
  data: T,
  onConflict: string,
) => {
  const { error } = await supabaseAdmin
    .from(table)
    .upsert(data, { onConflict });

  if (error) {
    throw new Error("[INSERT_FAIL] DB Insert failed");
  }
};

export const deleteFromDB = async <T>(
  table: string,
  column: string,
  data: Array<T>,
) => {
  const { error } = await supabaseAdmin.from(table).delete().in(column, data);

  if (error) {
    throw new Error("[DELTE_FAIL] DB data delete failed");
  }
};

export const getRowsByInFilter = async (
  table: string,
  column: string,
  columnDatas: Array<string>,
) => {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .in(column, columnDatas);

  if (error) {
    throw new Error("[FETCH_FAIL] DB data fetch failed");
  }

  return data;
};

export const deleteFromStorage = async (bucket: string, path: string[]) => {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(path);

  if (error) {
    throw new Error("[DELETE_FAIL] Storage File delete failed");
  }
};
