import { apiClient, BMS_PATH, queryKey } from '@/_common/apis';
import { SelectedBluePoint } from '@/_common/components';
import { ConfirmPortal } from '@/pages/DefaultRouter/_wigets/_reactPortals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import type { HTTPError } from 'ky';
import { Building2, TextSearch, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePathSegments } from '../../../../../../../../../shared/src/features/_shared';

type Props = {
  content: GetBuildingsType;
};

export const EmptyBuilding = (): ReactNode => {
  return (
    <div className='mt-2 flex justify-center gap-2 text-slate-500'>
      <TextSearch />
      <span>건물 정보를 찾을 수 없습니다</span>
    </div>
  );
};

export const SearchBuildingList = ({
  content: { id, buildingName, address },
}: Props): ReactNode => {
  const { segments } = usePathSegments();
  const selectedBuildingId = parseInt(segments[3]) ?? 0;
  const isSelected = selectedBuildingId === parseInt(id);
  const navigate = useNavigate();
  const liRef = useRef<HTMLLIElement>(null);

  const onNavigate = (id: string) => () => {
    if (isSelected) {
      navigate('.');
      return;
    }
    navigate(id.toString());
  };

  useEffect(() => {
    if (isSelected) {
      liRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  const queryClient = useQueryClient();

  const [isNotDeleteBuilding, setIsNotDeleteBuilding] = useState<
    string | undefined
  >(undefined);

  const { mutate } = useMutation({
    mutationFn: (reqData: {
      buildingId: number;
    }): Promise<{
      message: string;
      deleteBuildingId: number;
    }> =>
      apiClient
        .delete(`${BMS_PATH.SEGMENTS.GET_BUILDINGS}`, { json: reqData })
        .json(),

    onSuccess: ({ deleteBuildingId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKey.systemAdmin.bms_buildings(),
      });
      if (selectedBuildingId === deleteBuildingId) {
        navigate('.');
      }
    },
    onError: async (
      error: HTTPError<{
        error: string;
        message: string;
        status: number;
      }>
    ) => {
      if (error.name === 'HTTPError') {
        const errData = await error.response.json();
        console.log('status:', error.response.status); // 409
        console.log('error:', errData.error); // "Conflict"
        console.log('message:', errData.message); // "하위 층 정보가 있어 삭제할 수 없습니다."
        setIsNotDeleteBuilding(errData.message);
      } else {
        console.error(error);
      }
    },
  });

  const onDeleteBuildings = (id: number) => async () => {
    mutate({ buildingId: id });
  };

  return (
    <li
      ref={liRef}
      className={clsx(
        'grid grid-cols-[1fr_auto] rounded-lg border-2',
        { 'border-blue-400 bg-blue-50': isSelected },
        { 'hover:bg-slate-100': !isSelected }
      )}
    >
      <button
        onClick={onNavigate(id)}
        className={clsx(
          'grid w-full grid-cols-[auto_1fr] items-center space-x-4 p-2'
        )}
      >
        <figure className='relative'>
          <Building2 className='ml-2 text-slate-400' />
          {isSelected && (
            <div className='absolute -top-1 left-0'>
              <SelectedBluePoint />
            </div>
          )}
        </figure>
        <span className='flex flex-col items-start overflow-hidden'>
          <span className='text-start'>{buildingName}</span>
          <span className='w-full truncate text-start text-sm'>{address}</span>
        </span>
      </button>
      <button
        onClick={onDeleteBuildings(Number(id))}
        className='flex items-center justify-center px-4'
      >
        <Trash2 className='h-4 w-4 text-destructive' />
      </button>
      {isNotDeleteBuilding && (
        <ConfirmPortal
          title={'건물을 삭제할 수 없습니다.'}
          children={`${isNotDeleteBuilding}\n${!isSelected ? '해당층 상세보기로 이동하시겠습니까?' : ''}`}
          noneConfirm={!isSelected ? undefined : isNotDeleteBuilding}
          onConfirmPortal={() => {
            if (isSelected) return;
            setIsNotDeleteBuilding(undefined);
            navigate(id);
          }}
          onCancel={() => setIsNotDeleteBuilding(undefined)}
        />
      )}
    </li>
  );
};
