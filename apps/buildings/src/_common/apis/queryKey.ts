import { BMS_PATH } from './apiPaths';

export const queryKey = {
  systemAdmin: {
    all: ['system-admin'] as const,
    summary: () => [...queryKey.systemAdmin.all, 'summary'] as const,
    nm_permissionsMenuByRole: (): string[] =>
      [...queryKey.systemAdmin.all, 'permissions-roles'] as const,
    users: (roleId?: number): (string | number)[] =>
      roleId
        ? [...queryKey.systemAdmin.all, 'users', roleId]
        : [...queryKey.systemAdmin.all, 'users'],
    bms_buildings: (search?: string): string[] =>
      search
        ? [...queryKey.systemAdmin.all, BMS_PATH.SEGMENTS.GET_BUILDINGS, search]
        : [...queryKey.systemAdmin.all, BMS_PATH.SEGMENTS.GET_BUILDINGS],
  },
};
