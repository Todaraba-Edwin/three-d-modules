import { create } from 'zustand';

type AuthState = {
  roleCode: string;
  nickname?: string;
  isAdmin: boolean;
  permissions: PermissionsType[];
  setAuth: (_store: {
    roleCode: string;
    nickname?: string;
    permissions: PermissionsType[];
  }) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  roleCode: '',
  nickname: '',
  permissions: [],
  isAdmin: false,

  setAuth: _store =>
    set({
      roleCode: _store.roleCode,
      isAdmin: 'ADMIN_MAIN' == _store.roleCode,
      nickname: _store.nickname || '',
      permissions: _store.permissions,
    }),
}));
