import { useSystemAdminAddRoleStore } from './useSystemAdminAddRoleStore';
import { useSystemAdminAddUserStore } from './useSystemAdminAddUser';
import { useSyStemAdminSelectedRole } from './useSyStemAdminSelectedRoleStore';

export const utilsStoreResets = (): void => {
  useSystemAdminAddRoleStore.getState().reset();
  useSystemAdminAddUserStore.getState().reset();
  useSyStemAdminSelectedRole.getState().reset();
};
