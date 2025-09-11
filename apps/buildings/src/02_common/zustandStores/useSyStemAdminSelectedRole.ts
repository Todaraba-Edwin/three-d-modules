import { create } from 'zustand';

type useSyStemAdminSelectedRoleType = {
  selectedRoleId: number | undefined;
  selectedRoleName: string;
  setAction: (_store: {
    selectedRoleId: number | string;
    selectedRoleName: string;
  }) => void;
};

export const useSyStemAdminSelectedRole =
  create<useSyStemAdminSelectedRoleType>((set, get) => ({
    selectedRoleId: undefined,
    selectedRoleName: '모든',
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
  }));
