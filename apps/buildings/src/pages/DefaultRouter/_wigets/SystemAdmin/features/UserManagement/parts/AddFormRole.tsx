import { apiClient } from '@/common/apis/apiCreate';
import { queryKey } from '@/common/apis/queryKey';
import { Button } from '@/common/components/Button';
import { Input } from '@/common/components/Input';
import { useAuthStore } from '@/common/zustandStores/useAuthStore';
import { useSyStemAdminSelectedRole } from '@/common/zustandStores/useSyStemAdminSelectedRoleStore';
import { useSystemAdminAddRoleStore } from '@/common/zustandStores/useSystemAdminAddRoleStore';
import {
  defaultMenuLists,
  noneIcon,
} from '@/pages/DefaultRouter/_shared/const';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Save, X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { PermissionsRolesQueryResult } from './LeftSectionRoleManagement';

type RoleFormDateType = {
  role_id?: number | undefined;
  role_code: string;
  role_name: string;
  role_description: string;
  permissionMenu: {
    menu_id: number;
    menu_label: string;
    menu_can_access: boolean;
  }[];
};

export const AddFormRole = (): ReactNode => {
  const {
    isShowAddRoleNode,
    isEditModeRole,
    targetEditRole,
    closeAllStated,
    openIsEditModeRole,
  } = useSystemAdminAddRoleStore();
  const { permissions } = useAuthStore();
  const queryClient = useQueryClient();
  const { selectedRoleId, setUpdateSelectedName } =
    useSyStemAdminSelectedRole();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoleFormDateType>({
    defaultValues: {
      role_id: undefined,
      role_code: '',
      role_name: '',
      role_description: '',
      permissionMenu: permissions.map((p, index) => {
        const isRoot = index === 0;
        return {
          menu_id: p.id,
          menu_label: p.label,
          menu_can_access: isRoot ? true : false,
        };
      }),
    },
  });

  useEffect(() => {
    if (isEditModeRole && targetEditRole) {
      reset(targetEditRole);
    } else {
      reset({
        role_id: undefined,
        role_code: '',
        role_name: '',
        role_description: '',
        permissionMenu: permissions.map((p, index) => {
          const isRoot = index === 0;
          return {
            menu_id: p.id,
            menu_label: p.label,
            menu_can_access: isRoot ? true : false,
          };
        }),
      });
    }
  }, [isEditModeRole, targetEditRole, reset, permissions]);

  const { mutate, isPending } = useMutation({
    mutationFn: (newRole: RoleFormDateType) => {
      const payload = {
        role_id: newRole.role_id,
        role_code: newRole.role_code,
        role_name: newRole.role_name,
        role_description: newRole.role_description,
        menu_permissions: newRole.permissionMenu.map(
          ({ menu_id, menu_can_access }) => ({
            menu_id,
            menu_can_access,
          })
        ),
      };
      return apiClient.post('users/role', { json: payload }).json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.summary(),
      });

      if (isEditModeRole) {
        if (
          typeof variables.role_id === 'number' &&
          selectedRoleId === variables.role_id
        )
          setUpdateSelectedName({
            selectedRoleName: variables.role_name,
          });

        openIsEditModeRole({
          targetEditRole: variables as PermissionsRolesQueryResult,
        });
        reset(variables);
      } else {
        reset();
      }
    },
    onError: error => {
      console.error('Error saving role:', error);
    },
  });

  const permissionMenu = watch('permissionMenu');

  const onSubmit = handleSubmit(
    data => {
      mutate(data);
    },
    errors => console.error('Form validation errors:', errors)
  );

  const isMainAdmin =
    isEditModeRole && targetEditRole?.role_code === 'ADMIN_MAIN';

  return (
    <form onSubmit={onSubmit} className='bg-orange-50 border-orange-200'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h5 className='font-medium text-orange-900'>
            {isShowAddRoleNode && '새 역할 추가'}
            {isEditModeRole && '관리자 권한 수정'}
          </h5>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={closeAllStated}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        <div className='space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-sm'>역할명 (영문, 대문자)</label>
              <Input
                {...register('role_code', {
                  required: '역할명(영문)은 필수 항목입니다.',
                  pattern: {
                    value: /^[A-Z_]+[A-Z]$/,
                    message: '마지막은 _로 끝날 수 없습니다.',
                  },
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    e.target.value = value
                      .toUpperCase()
                      .replace(/\s+/g, '_')
                      .replace(/[^A-Z_]/g, '');
                  },
                })}
                placeholder='예: VIEWER, VIEWER_A, VIEWER_A'
                className='text-sm'
                disabled={
                  isEditModeRole && targetEditRole?.role_code === 'ADMIN_MAIN'
                }
              />
              {errors.role_code && (
                <span className='text-red-500'>{errors.role_code.message}</span>
              )}
            </div>

            <div className='space-y-1'>
              <label className='text-sm'>역할명 (국문)</label>
              <Input
                {...register('role_name', {
                  required: '역할명(국문)은 필수 항목입니다.',
                  pattern: {
                    value: /^[가-힣\s_-]+$/,
                    message:
                      '역할명(국문)은 한글 및 일부 특수문자(언더바, 하이픈) 입력 가능하며, 한글은 완성된 음절로 작성해주세요.',
                  },

                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    e.target.value = value.replace(/[a-zA-Z0-9]/g, '');
                  },
                })}
                placeholder='예: 매니저'
                className='text-sm'
              />
              {errors.role_name && (
                <span className='text-red-500'>{errors.role_name.message}</span>
              )}
            </div>
          </div>
          <div className='space-y-1'>
            <label className='text-sm'>설명</label>
            <Input
              {...register('role_description')}
              placeholder='역할에 대한 설명'
              className='text-sm'
            />
          </div>
          <div>
            <label className='text-sm'>역할에 대한 권한 설정</label>
            <div className='grid grid-cols-2 gap-2 text-xs'>
              {permissions.map((module, index) => {
                const isRoot = index === 0;
                const hasAccess = permissionMenu?.[index]?.menu_can_access;

                const ICON =
                  defaultMenuLists.find(({ path }) => path === module.path)
                    ?.icon || noneIcon;
                return (
                  <label
                    key={module.id}
                    className={clsx(
                      'flex items-center gap-2 p-2 border border-orange-200 rounded',
                      {
                        'hover:bg-orange-50 cursor-pointer':
                          !isMainAdmin && !isRoot,
                        'bg-white': !hasAccess,
                        'bg-orange-100': hasAccess,
                      }
                    )}
                  >
                    <input
                      type='checkbox'
                      {...register(`permissionMenu.${index}.menu_can_access`)}
                      className='rounded'
                      disabled={isMainAdmin || isRoot}
                    />
                    <span
                      className={`text-xs font-medium ${
                        hasAccess ? 'text-gray-900' : 'text-gray-500'
                      } inline-flex gap-2 items-center`}
                    >
                      <ICON className='w-3 h-3' />
                      {module.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant='outline'
            type='button'
            className='bg-white hover:bg-slate-200'
            size='sm'
            onClick={closeAllStated}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            size='sm'
            type='submit'
            className='bg-orange-600 hover:bg-orange-700 text-white '
            disabled={isPending}
          >
            {isPending ? (
              '저장 중...'
            ) : (
              <>
                <Save className='w-3 h-3 mr-1' />
                {isShowAddRoleNode ? '추가하기' : '수정하기'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
