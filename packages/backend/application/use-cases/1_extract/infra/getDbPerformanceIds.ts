interface Dependencies {
  getColumnData: (table: string, column: string) => Promise<string[]>;
}

export const createGetDbPerformanceIds = ({ getColumnData }: Dependencies) => {
  return async (): Promise<string[]> => {
    const dbIds = await getColumnData("performances", "performance_id");
    
    return dbIds;
  };
};