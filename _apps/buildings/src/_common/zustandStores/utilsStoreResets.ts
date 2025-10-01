import { useSystemAdminAddRoleStore } from './useSystemAdminAddRoleStore';
import { useSystemAdminAddUSerStore } from './useSystemAdminAddUSerStore';
import { useSyStemAdminSelectedRole } from './useSyStemAdminSelectedRoleStore';

export const utilsStoreResets = (): void => {
  useSystemAdminAddRoleStore.getState().reset();
  useSystemAdminAddUSerStore.getState().reset();
  useSyStemAdminSelectedRole.getState().reset();
};
