export interface GetDbPerformanceIdsDeps {
  getColumnData: (table: string, column: string) => Promise<string[]>;
}

// 호출부에서 전달한 table/column을 그대로 getColumnData에 전달하여
// 해당 컬럼의 값만 1차원 문자열 배열로 반환한다.
export const createGetDbPerformanceIds = ({
  getColumnData,
}: GetDbPerformanceIdsDeps) => {
  return async (table: string, column: string): Promise<string[]> => {
    return await getColumnData(table, column);
  };
};
