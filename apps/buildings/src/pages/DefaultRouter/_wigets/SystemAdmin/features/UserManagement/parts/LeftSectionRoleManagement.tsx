import { apiClient } from '@/_common/apis/apiCreate';
import { queryKey } from '@/_common/apis/queryKey';
import { Button } from '@/_common/components/Button';
import { useSyStemAdminSelectedRole } from '@/_common/zustandStores/useSyStemAdminSelectedRoleStore';
import { useSystemAdminAddRoleStore } from '@/_common/zustandStores/useSystemAdminAddRoleStore';

import { SelectedBluePoint } from '@/_common/components';
import { ConfirmPortal } from '@/pages/DefaultRouter/_wigets/_reactPortals/ConfirmPortal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { CircleCheckBig, CircleX, Settings, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useDeleteRole } from '../../../entities/useDeleteRole';
import { UM_CONST } from '../../../shared/const';
import { AddFormRole } from './AddFormRole';
import { GridSections } from './GridSections';

export type PermissionsRolesQueryResult = {
  permissionMenu: {
    menu_id: number;
    menu_label: string;
    menu_can_access: boolean;
  }[];
  role_code: string;
  role_id: number;
  role_name: string;
  role_description: string;
};

// 유틸리티 함수
const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN_MAIN':
      return 'bg-red-100 text-red-800';
    case 'ADMIN_SUB':
      return 'bg-blue-100 text-blue-800';
    case 'unActive':
      return 'bg-gray-100 text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Badge = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      data-slot='badge'
      className={clsx(
        'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
        className
      )}
      {...props}
    />
  );
};

type ConfirmPortalState = {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  onConfirmPortal: () => void;
} | null;

export const LeftSectionRoleManagement = (): ReactNode => {
  const queryClient = useQueryClient();
  const { selectedRoleId, setAction } = useSyStemAdminSelectedRole();
  const { data: permissionsMenuByRoleData, isLoading } = useQuery<
    PermissionsRolesQueryResult[]
  >({
    queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
    queryFn: () => apiClient.get('system-admin/permissions-roles').json(),
  });
  const [confirmState, setConfirmPortalState] =
    useState<ConfirmPortalState>(null);

  const { mutate: deleteRole } = useDeleteRole(
    () => {
      setAction({
        selectedRoleId: '',
        selectedRoleName: '',
      });
      setConfirmPortalState(null);
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.summary(),
      });
    },
    async (error, variables) => {
      try {
        const response = await error.response.json();
        if (response.code === 'ROLE_IN_USE') {
          const roleInfo = response.details[0];
          const users = roleInfo.users;

          const showUserNum = 3;
          setConfirmPortalState({
            isOpen: true,
            title: '강제 삭제 확인',
            content: (
              <div className='space-y-2'>
                <p>
                  '{roleInfo.role_name}' 역할에 {roleInfo.user_count}명의
                  사용자가 할당되어 있습니다:
                </p>
                {[...users].slice(0, showUserNum).map(list => {
                  return (
                    <p
                      key={list.id}
                      className='text-xs bg-gray-100 p-2 rounded'
                      children={`${list.username} - ${list.email}`}
                    />
                  );
                })}
                {users.length > 3 && (
                  <p
                    className='text-xs bg-gray-100 p-2 rounded'
                    children={`... 외 ${users.length - showUserNum}명`}
                  />
                )}
                <p>
                  강제로 삭제하면 역할과 사용자가 모두 삭제됩니다. 정말로 강제
                  삭제하시겠습니까?
                </p>
              </div>
            ),
            onConfirmPortal: () => {
              deleteRole({ roleId: variables.roleId, force: true });
            },
          });
        } else {
          alert(`Error: ${response.message}`);
          setConfirmPortalState(null);
        }
        // eslint-disable-next-line
      } catch (e) {
        alert('An unexpected error occurred.');
        setConfirmPortalState(null);
      }
    }
  );

  const handleDeleteClick = (roleId: number, roleName: string) => {
    setConfirmPortalState({
      isOpen: true,
      title: '역할 삭제 확인',
      content: `'${roleName}' 역할을 삭제하시겠습니까?`,
      onConfirmPortal: () => {
        deleteRole({ roleId });
      },
    });
  };

  const {
    isShowAddRoleNode,
    isEditModeRole,
    openIsShowAddRoleNode,
    openIsEditModeRole,
    closeAllStated,
  } = useSystemAdminAddRoleStore();

  return (
    <>
      <GridSections
        ICON={UM_CONST.LeftSection.ICON}
        sectionTitle={UM_CONST.LeftSection.title}
        sectionDesc={UM_CONST.LeftSection.desc}
        addActions={{
          addActionName: UM_CONST.LeftSection.addActionName,
          addActionClick: () => {
            if (isShowAddRoleNode) return closeAllStated();
            return openIsShowAddRoleNode();
          },
          addActionNode: (isShowAddRoleNode || isEditModeRole) && (
            <AddFormRole />
          ),
        }}
        children={
          <div
            className={clsx(
              'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
              'overflow-scroll',
              'max-xl:h-[300px]'
            )}
          >
            <div
              className={clsx(
                'p-2 bg-slate-200 grid grid-cols-[180px_1fr_68px]',
                'text-sm'
              )}
            >
              <div className='text-center'>역할</div>
              <div className=''>권한</div>
              <div className='text-center'>설정</div>
            </div>
            <div className='overflow-auto'>
              {!isLoading &&
                permissionsMenuByRoleData?.length &&
                permissionsMenuByRoleData.map(
                  ({
                    role_code,
                    role_name,
                    role_id,
                    role_description,
                    permissionMenu,
                  }) => {
                    const isSelected = selectedRoleId === role_id;
                    return (
                      <div
                        key={role_id}
                        onClick={() => {
                          setAction({
                            selectedRoleId: role_id,
                            selectedRoleName: role_name,
                          });
                        }}
                        className={clsx(
                          'p-2 grid grid-cols-[180px_1fr_68px]',
                          'text-sm',
                          {
                            'hover:bg-slate-100': !isSelected,
                            'bg-blue-50': isSelected,
                            'border-b-2 border-blue-300': isSelected,
                            'border-b-2 border-slate-200': !isSelected,
                          }
                        )}
                      >
                        <div className='flex flex-col justify-center'>
                          <div className='flex items-center gap-2'>
                            <Badge
                              className={getRoleColor(role_code)}
                              children={role_name}
                            />
                            {selectedRoleId === role_id && (
                              <SelectedBluePoint />
                            )}
                          </div>
                          <div className='text-xs text-gray-500 mt-1'>
                            {role_description}
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {permissionMenu.map(
                            ({ menu_label, menu_can_access }, idx) => {
                              const PermissionMene = menu_can_access
                                ? CircleCheckBig
                                : CircleX;
                              return (
                                <Badge
                                  key={idx}
                                  className={clsx(
                                    `${getRoleColor(
                                      menu_can_access ? menu_label : 'unActive'
                                    )}`,
                                    'w-fit h-fit',
                                    'space-x-2',
                                    'flex items-center'
                                  )}
                                  children={
                                    <>
                                      {menu_label}
                                      <PermissionMene
                                        className={clsx('w-8 h-8', {
                                          'text-green-500': menu_can_access,
                                          'text-slate-300': !menu_can_access,
                                        })}
                                      />
                                    </>
                                  }
                                />
                              );
                            }
                          )}
                        </div>
                        <div className='flex flex-col justify-center'>
                          <div className='flex gap-1'>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={e => {
                                if (selectedRoleId === role_id) {
                                  e.stopPropagation();
                                }

                                openIsEditModeRole({
                                  targetEditRole: {
                                    permissionMenu,
                                    role_code,
                                    role_id,
                                    role_name,
                                    role_description,
                                  },
                                });
                              }}
                              className='h-8 w-8 p-0'
                            >
                              <Settings className='w-3 h-3' />
                            </Button>
                            {role_code != 'ADMIN_MAIN' && (
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={e => {
                                  if (selectedRoleId === role_id) {
                                    e.stopPropagation();
                                  }
                                  handleDeleteClick(role_id, role_name);
                                }}
                                className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                              >
                                <Trash2 className='w-3 h-3' />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        }
      />
      {confirmState?.isOpen && (
        <ConfirmPortal
          title={confirmState.title}
          onConfirmPortal={confirmState.onConfirmPortal}
          onCancel={() => setConfirmPortalState(null)}
          confirmVariant='destructive'
        >
          {confirmState.content}
        </ConfirmPortal>
      )}
    </>
  );
};
