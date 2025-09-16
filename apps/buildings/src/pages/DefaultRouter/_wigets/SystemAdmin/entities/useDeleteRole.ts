import { apiClient } from '@/_common/apis/apiCreate';
import { queryKey } from '@/_common/apis/queryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeleteRoleParams = {
  roleId: number;
  force?: boolean;
};

export const useDeleteRole = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: any, variables: DeleteRoleParams) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, force = false }: DeleteRoleParams) =>
      apiClient.delete('system-admin/permissions-roles', {
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
