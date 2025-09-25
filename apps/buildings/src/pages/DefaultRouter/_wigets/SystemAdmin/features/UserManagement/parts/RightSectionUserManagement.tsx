import { apiClient } from '@/_common/apis/apiCreate';
import { queryKey } from '@/_common/apis/queryKey';
import { Button } from '@/_common/components/Button';
import { useSyStemAdminSelectedRole } from '@/_common/zustandStores/useSyStemAdminSelectedRoleStore';
import { useSystemAdminAddRoleStore } from '@/_common/zustandStores/useSystemAdminAddRoleStore';
import { useSystemAdminAddUSerStore } from '@/_common/zustandStores/useSystemAdminAddUSerStore';
import { ConfirmPortal } from '@/pages/DefaultRouter/_wigets/_reactPortals/ConfirmPortal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { UM_CONST } from '../../../shared/const';
import { AddFormUser } from './AddFormUser';
import { GridSections } from './GridSections';

export type UserWithRole = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  last_login_at: string | null;
  role_name: string;
  role_code: string;
};

type ConfirmPortalState = {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  onConfirmPortal: () => void;
} | null;

export const RightSectionUserManagement = (): ReactNode => {
  const { isEditModeRole, targetEditRole } = useSystemAdminAddRoleStore();
  const { selectedRoleId, selectedRoleName } = useSyStemAdminSelectedRole();
  const queryClient = useQueryClient();
  const [confirmState, setConfirmPortalState] =
    useState<ConfirmPortalState>(null);

  const {
    // isShowPassword,
    isShowAddUserNode,
    // isEditModeUser,
    openIsShowAddUserNode,
    // targetEditUser,
    // toggleIsShowPassword,
    closeAllStated,
    // openIsEditModeUser,
  } = useSystemAdminAddUSerStore();

  const roleIdToFilter = isEditModeRole ? targetEditRole?.role_id : undefined;

  const { data: users, isLoading } = useQuery<UserWithRole[]>({
    queryKey: queryKey.systemAdmin.users(selectedRoleId),
    queryFn: () =>
      apiClient
        .get('users', {
          searchParams: {
            role_id: selectedRoleId,
          },
        })
        .json(),
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: (userIds: number[]) => {
      return apiClient.delete('users', { json: { userIds } }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.users(roleIdToFilter),
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.summary(),
      });
      setConfirmPortalState(null);
    },
    onError: error => {
      console.error('Error deleting user(s):', error);
      alert('사용자 삭제 중 오류가 발생했습니다.');
      setConfirmPortalState(null);
    },
  });

  const handleDeleteClick = (userId: number, username: string) => {
    setConfirmPortalState({
      isOpen: true,
      title: '사용자 삭제 확인',
      content: `'${username}' 사용자를 삭제하시겠습니까?`,
      onConfirmPortal: () => {
        deleteUserMutation([userId]);
      },
    });
  };

  return (
    <>
      <GridSections
        ICON={UM_CONST.RightSection.ICON}
        sectionTitle={UM_CONST.RightSection.title}
        sectionDesc={`${selectedRoleName} ${UM_CONST.RightSection.desc}`}
        addActions={{
          addActionName: UM_CONST.RightSection.addActionName,
          addActionClick: () => {
            if (isShowAddUserNode) return closeAllStated();
            return openIsShowAddUserNode();
          },
          addActionNode: (isShowAddUserNode || isEditModeRole) && (
            <AddFormUser />
          ),
        }}
        children={
          <div
            className={clsx(
              'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
              'overflow-scroll',
              'max-xl:h-[150px]'
            )}
          >
            <div className='p-2 bg-blue-100 grid grid-cols-[200px_150px_1fr_80px] text-sm font-medium'>
              <div className='text-center'>사용자</div>
              <div className='text-center'>권한(역할)</div>
              <div className='text-center'>마지막 로그인</div>
              <div className='text-center'>작업</div>
            </div>
            <div className='overflow-auto'>
              {!isLoading &&
                users?.map(user => {
                  const isAdminMain = user.role_code === 'ADMIN_MAIN';
                  return (
                    <div
                      key={user.id}
                      className='p-2 grid grid-cols-[200px_150px_1fr_80px] text-sm border-b border-slate-200'
                    >
                      <div className='flex flex-col justify-center px-2'>
                        <p className='font-semibold'>
                          {user.username} ({user.nickname})
                        </p>
                        <p className='text-xs text-gray-500'>{user.email}</p>
                      </div>
                      <div className='flex items-center justify-start'>
                        {user.role_name}
                      </div>
                      <div className='flex items-center justify-center text-xs'>
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleString()
                          : 'N/A'}
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        {/* <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <Settings className='w-3 h-3' />
                        </Button> */}
                        {!isAdminMain && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleDeleteClick(user.id, user.username)
                            }
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='w-3 h-3' />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
