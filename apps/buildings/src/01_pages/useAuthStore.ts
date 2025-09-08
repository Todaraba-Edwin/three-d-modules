import { create } from 'zustand';

type AuthState = {
  userType: string;
  isAdmin: boolean;
  setAuth: (user: { userType: string }) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  userType: '',
  isAdmin: false,
  setAuth: user =>
    set({ userType: user.userType, isAdmin: 'ADMIN_MAIN' == user.userType }),
}));
