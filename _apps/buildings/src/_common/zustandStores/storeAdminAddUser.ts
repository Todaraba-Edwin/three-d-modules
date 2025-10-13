import type { UserWithRole } from '@/pages/DefaultRouter/_wigets/SystemAdmin/features/UserManagement/parts/RightSectionUserManagement';
import { create } from 'zustand';

type useSystemAdminAddUserStoreType = {
  isShowPassword: boolean;
  isShowAddUserNode: boolean;
  isEditModeUser: boolean;
  targetEditUser: UserWithRole | undefined;
  toggleIsShowPassword: () => void;
  openIsShowAddUserNode: () => void;
  openIsEditModeUser: (_state: { targetEditUser: UserWithRole }) => void;
  closeAllStated: () => void;
  reset: () => void;
};

const initialState = {
  isShowPassword: false,
  isShowAddUserNode: false,
  isEditModeUser: false,
  targetEditUser: undefined,
};

export const useSystemAdminAddUserStore =
  create<useSystemAdminAddUserStoreType>((set, get) => ({
    ...initialState,
    toggleIsShowPassword: () => {
      set({ isShowPassword: !get().isShowPassword });
    },
    openIsShowAddUserNode: () => {
      set({
        isShowAddUserNode: true,
        isEditModeUser: false,
        targetEditUser: undefined,
      });
    },
    openIsEditModeUser: _state => {
      set({
        isShowAddUserNode: false,
        isEditModeUser: true,
        targetEditUser: _state.targetEditUser,
      });
    },
    closeAllStated: () => {
      set({
        isShowAddUserNode: false,
        isEditModeUser: false,
        // targetEditUser: undefined,
      });
    },
    reset() {
      set(initialState);
    },
  }));
