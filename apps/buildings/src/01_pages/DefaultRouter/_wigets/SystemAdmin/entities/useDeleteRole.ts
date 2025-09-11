import { apiClient } from '@/02_common/apiClient';
import { queryKey } from '@/02_common/queryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeleteRoleParams = {
  roleId: number;
  force?: boolean;
};

export const useDeleteRole = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: any, variables: DeleteRoleParams) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, force = false }: DeleteRoleParams) =>
      apiClient.delete('api/system-admin/permissions-roles', {
        json: { roleIds: [roleId], force },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any, variables) => {
      if (onErrorCallback) onErrorCallback(error, variables);
    },
  });
};
