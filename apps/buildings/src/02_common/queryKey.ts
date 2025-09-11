export const queryKey = {
  systemAdmin: {
    all: ['system-admin'] as const,
    summary: () => [...queryKey.systemAdmin.all, 'summary'] as const,
    nm_permissionsMenuByRole: () =>
      [...queryKey.systemAdmin.all, 'permissions-roles'] as const,
  },
};
