import { useSystemAdminAddRoleStore } from './storeAdminAddRole';
import { useSystemAdminAddUserStore } from './storeAdminAddUser';
import { useSyStemAdminSelectedRole } from './storeAdminSelectedRole';

export const utilsStoreResets = (): void => {
  useSystemAdminAddRoleStore.getState().reset();
  useSystemAdminAddUserStore.getState().reset();
  useSyStemAdminSelectedRole.getState().reset();
};
