export const API_PREFIX = 'api';

export const USERS = {
  SEGMENTS: {
    BASE: 'users',
    TYPE: 'type',
  },
  PARAMS: {
    USERNAME: 'userName',
    USERTYPE: 'userType',
  },
};

export const AUTH = {
  SEGMENTS: {
    BASE: 'auth',
    LOGIN: 'login',
    lOGOUT: 'logout',
    VALIDATE_SESSION: 'validate-session',
  },
  PARAMS: {},
  COOKIES: {
    SESSION_ID: 'sessionId',
    USER_NAME: 'username',
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
    BASE: 'system-admin',
    SUMMARY: 'summary',
  },
};
