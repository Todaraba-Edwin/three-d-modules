export const ERROR_CODE = {
  FS_ERROR: {
    NO_ENTRY: {
      CODE: 'ENOENT',
      MESSAGE: ({ sourcePath }: { sourcePath: string }) =>
        `Temporary image file not found at ${sourcePath}`,
    },
    OTHER_CASE_MESSAGE: ({ target }: { target: string }) =>
      `Error processing ${target}`,
  },
  SQL_ERROR: {
    IS_REFERENCED: {
      CODE: 'ER_ROW_IS_REFERENCED_2',
      MESSAGE: ({ id }: { id: number }) =>
        `건물(id : ${id})에 대한 하위 층 정보가 있어 삭제할 수 없습니다.`,
    },
  },
} as const;
