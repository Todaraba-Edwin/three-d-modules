export const queryKey = {
  systemAdmin: {
    all: ['system-admin'] as const,
    summary: () => [...queryKey.systemAdmin.all, 'summary'] as const,
  },
};
