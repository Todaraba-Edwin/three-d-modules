import { create } from 'zustand';

type AuthState = {
  userType: string;
  nickname?: string;
  isAdmin: boolean;
  setAuth: (user: { userType: string; nickname?: string }) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  userType: '',
  nickname: '',
  isAdmin: false,

  setAuth: user =>
    set({
      userType: user.userType,
      isAdmin: 'ADMIN_MAIN' == user.userType,
      nickname: user.nickname || '',
    }),
}));
