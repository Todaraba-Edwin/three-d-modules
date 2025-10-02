export const API_MESSAGES = {
  AUTH: {
    INVALID_USERS: '로그인 정보(사용자)가 유효하지 않습니다.',
    INVALID_PASSWORD: '로그인 정보(비밀번호)가 유효하지 않습니다.',
    ALREADY_LOGGED_ID: '이미 해당 계정의 로그인 정보가 존재합니다.',
    SUCCEED_LOGIN: '로그인을 성공했습니다.',
    SUCCEED_LOGOUT: '로그아웃을 성공했습니다.',
    NOT_FOUND_SESSION_BROWSER: '브라우저에서 세선 정보를 찾을 수 없습니다.',
    NOT_FOUND_SESSION_SERVER: '유효하지 않은 세션정보입니다.',
    NOT_ADMIN_SESSION: '관리자가 아니면 접근이 허용되지 않습니다.',
    VALID_SESSION: '세션정보가 유효합니다.',
  },
  ADMIN: {
    SUMMARY: '관리자 페이지 관련 수치들을 조회합니다.',
  },
  BUILDING: {
    EXIST_BUILDING_NAME: '이미 존재하는 건물명입니다.',
    CREATE_BUILDING: '건물이 성공적으로 생성되었습니다.',
    VALID_BUILDING_NAME: '사용 가능한 건물명입니다.',
    DELETED_BUILDING: '건물 삭제가 왼료되었습니다.',
    NOT_FOUND_BUILDING: ({ id }: { id: number }): string =>
      `Building with ID ${id} not found`,
  },
  FILES: {
    NOT_SAVE_FILE: '파일이 업로드되지 않았습니다.',
    SAVE_FILE: '파일을 업로드 했습니다. ',
    MOVE_FILE: '파일 이동을 완료 했습니다.',
  },
};
