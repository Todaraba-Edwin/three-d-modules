import type { PermissionsRolesQueryResult } from '@/01_pages/DefaultRouter/_wigets/SystemAdmin/features/UserManagement/parts/LeftSectionRoleManagement';
import { create } from 'zustand';

type useSystemAdminAddRoleStoreType = {
  isShowAddRoleNode: boolean;
  isEditModeRole: boolean;
  targetEditRole: PermissionsRolesQueryResult | undefined;
  openIsShowAddRoleNode: () => void;
  openIsEditModeRole: (_state: {
    targetEditRole: PermissionsRolesQueryResult;
  }) => void;
  closeAllStated: () => void;
};

export const useSystemAdminAddRoleStore =
  create<useSystemAdminAddRoleStoreType>(set => ({
    isShowAddRoleNode: false,
    isEditModeRole: false,
    targetEditRole: undefined,
    openIsShowAddRoleNode: () => {
      set({
        isShowAddRoleNode: true,
        isEditModeRole: false,
        targetEditRole: undefined,
      });
    },
    openIsEditModeRole: _state => {
      set({
        isShowAddRoleNode: false,
        isEditModeRole: true,
        targetEditRole: _state.targetEditRole,
      });
    },
    closeAllStated: () => {
      set({
        isShowAddRoleNode: false,
        isEditModeRole: false,
        targetEditRole: undefined,
      });
    },
  }));
