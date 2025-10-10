export const API_PREFIX = 'api';

export const CookiesPath = '/';
export const AUTH = {
  SEGMENTS: {
    BASE: `${API_PREFIX}/auth`,
    LOGIN: 'login',
    lOGOUT: 'logout',
    VALIDATE_SESSION: 'validate-session',
  },
  PARAMS: {},
  COOKIES: {
    SESSION_ID: 'sessionId',
  },
};

export const USERS = {
  SEGMENTS: {
    BASE: 'users',
    TYPE: 'type',
  },
  PARAMS: {
    ID: 'id',
    USERNAME: 'userName',
    USERTYPE: 'userType',
  },
};

export const SWITCHES = {
  SEGMENTS: {
    BASE: 'switches',
    SNMP: 'snmp',
    PORT_STATE: 'port-state',
  },
  PARAMS: {},
};

export const SYSTEM_ADMIN = {
  SEGMENTS: {
    BASE: `${API_PREFIX}/system-admin`,
    SUMMARY: 'summary',
    PERMISSIONS_ROLES: 'permissions-roles',
  },
};

export const MEDIA_SERVE_ROOT = '/media';
export const FILES = {
  SEGMENTS: {
    BASE: 'files',
    GET_GIBS: 'glbs',
    UPLOAD: 'upload',
  },
  PARAMS: {},
};

export const BMS = {
  SEGMENTS: {
    BASE: `${API_PREFIX}/bms`,
    BUILDINGS: 'buildings',
    get BUILDING_CHECK(): string {
      return `${this.BUILDINGS}/exists`;
    },
  },
  PARAMS: {
    SEARCH: 'search',
  },
};
