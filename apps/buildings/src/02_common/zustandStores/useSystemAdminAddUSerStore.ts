import { create } from 'zustand';

type useSystemAdminAddUSerStoreType = {
  isShowPassword: boolean;
  isShowAddUserNode: boolean;
  isEditModeUser: boolean;
  targetEditUser: any | undefined;
  toggleIsShowPassword: () => void;
  openIsShowAddUserNode: () => void;
  openIsEditModeUser: (_state: { targetEditUser: any }) => void;
  closeAllStated: () => void;
  reset: () => void;
};

const initialState = {
  isShowPassword: false,
  isShowAddUserNode: false,
  isEditModeUser: false,
  targetEditUser: undefined,
};

export const useSystemAdminAddUSerStore =
  create<useSystemAdminAddUSerStoreType>((set, get) => ({
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
        targetEditUser: undefined,
      });
    },
    reset() {
      set(initialState);
    },
  }));
