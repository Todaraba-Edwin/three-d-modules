import { create } from 'zustand';

type useSyStemAdminSelectedRoleType = {
  selectedRoleId: number | undefined;
  selectedRoleName: string;
  setAction: (_store: {
    selectedRoleId: number | string;
    selectedRoleName: string;
  }) => void;
  setUpdateSelectedName: (_store: { selectedRoleName: string }) => void;
  reset: () => void;
};

const initialState = {
  selectedRoleId: undefined,
  selectedRoleName: '모든',
};

export const useSyStemAdminSelectedRole =
  create<useSyStemAdminSelectedRoleType>((set, get) => ({
    ...initialState,
    setAction: ({ selectedRoleId, selectedRoleName }) => {
      const currentSelectedRoleId = get().selectedRoleId;
      const isInit = typeof selectedRoleId === 'string';
      set({
        selectedRoleId: isInit
          ? undefined
          : currentSelectedRoleId === selectedRoleId
            ? undefined
            : selectedRoleId,
        selectedRoleName: isInit
          ? '모든'
          : currentSelectedRoleId === selectedRoleId
            ? '모든'
            : selectedRoleName,
      });
    },
    setUpdateSelectedName: _store => {
      set({
        selectedRoleName: _store.selectedRoleName,
      });
    },
    reset() {
      set(initialState);
    },
  }));
