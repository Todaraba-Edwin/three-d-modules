import { useAuthStore } from './useAuthStore';
import { useSystemAdminAddRoleStore } from './useSystemAdminAddRoleStore';
import { useSystemAdminAddUSerStore } from './useSystemAdminAddUSerStore';
import { useSyStemAdminSelectedRole } from './useSyStemAdminSelectedRoleStore';

export const utilsStoreResets = (): void => {
  useAuthStore.getState().reset();
  useSystemAdminAddRoleStore.getState().reset();
  useSystemAdminAddUSerStore.getState().reset();
  useSyStemAdminSelectedRole.getState().reset();
};
