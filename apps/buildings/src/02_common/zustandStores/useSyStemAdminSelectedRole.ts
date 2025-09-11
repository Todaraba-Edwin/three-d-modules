import { create } from 'zustand';

type useSyStemAdminSelectedRoleType = {
  selectedRoleId: number | undefined;
  selectedRoleName: string;
  setAction: (_store: {
    selectedRoleId: number;
    selectedRoleName: string;
  }) => void;
};

export const useSyStemAdminSelectedRole =
  create<useSyStemAdminSelectedRoleType>((set, get) => ({
    selectedRoleId: undefined,
    selectedRoleName: '모든',
    setAction: ({ selectedRoleId, selectedRoleName }) => {
      const currentSelectedRoleId = get().selectedRoleId;
      set({
        selectedRoleId:
          currentSelectedRoleId === selectedRoleId ? undefined : selectedRoleId,
        selectedRoleName:
          currentSelectedRoleId === selectedRoleId ? '모든' : selectedRoleName,
      });
    },
  }));
