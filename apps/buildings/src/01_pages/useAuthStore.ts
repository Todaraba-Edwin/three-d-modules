import { create } from 'zustand';

type AuthState = {
  userType: string;
  nickname?: string;
  isAdmin: boolean;
  permissions: PermissionsType[];
  setAuth: (_store: {
    userType: string;
    nickname?: string;
    permissions: PermissionsType[];
  }) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  userType: '',
  nickname: '',
  permissions: [],
  isAdmin: false,

  setAuth: _store =>
    set({
      userType: _store.userType,
      isAdmin: 'ADMIN_MAIN' == _store.userType,
      nickname: _store.nickname || '',
      permissions: _store.permissions,
    }),
}));
