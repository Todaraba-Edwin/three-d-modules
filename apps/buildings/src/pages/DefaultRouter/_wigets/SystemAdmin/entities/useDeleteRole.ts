import { apiClient } from '@/_common/apis/apiCreate';
import { queryKey } from '@/_common/apis/queryKey';
import {
  useMutation,
  useQueryClient,
  type DefaultError,
  type UseMutationResult,
} from '@tanstack/react-query';

type DeleteRoleParams = {
  roleId: number;
  force?: boolean;
};

export const useDeleteRole = (
  onSuccessCallback?: () => void,
  // eslint-disable-next-line
  onErrorCallback?: (_error: any, _variables: DeleteRoleParams) => void
): UseMutationResult<unknown, DefaultError, DeleteRoleParams, unknown> => {
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
    // eslint-disable-next-line
    onError: (error: any, variables) => {
      if (onErrorCallback) onErrorCallback(error, variables);
    },
  });
};
