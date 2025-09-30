export const API_PREFIX = 'api';

export const AUTH = {
  SEGMENTS: {
    BASE: 'auth',
    LOGIN: 'login',
    lOGOUT: 'logout',
    get VALIDATE_SESSION(): string {
      return `${this.BASE}/validate-session`;
    },
    VALIDATE: 'validate-session',
  },
  PARAMS: {},
  COOKIES: {
    SESSION_ID: 'sessionId',
    USER_NAME: 'username',
  },
};

export const REDIRECT_PATH = {
  SEGMENTS: {
    ROOT: '/',
    LOGIN: `/${AUTH.SEGMENTS.LOGIN}`,
  },
};

export const BMS_PATH = {
  SEGMENTS: {
    ROOT: 'bms',
    get GET_BUILDINGS(): string {
      return `${this.ROOT}/buildings`;
    },
    get CHECK_BUILDINGS(): string {
      return `${this.ROOT}/buildings/check-building-name`;
    },
    get SET_BUILDINGS(): string {
      return `${this.ROOT}/buildings`;
    },
  },
};
