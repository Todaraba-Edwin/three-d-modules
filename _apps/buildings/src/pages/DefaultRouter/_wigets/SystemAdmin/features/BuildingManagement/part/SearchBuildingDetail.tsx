import { apiClient, BMS_PATH, queryKey } from '@/_common/apis';
import { Button } from '@/_common/components';
import { DefaultPathEnum } from '@/_common/const';
import { utilsBuildingFloorInfo, utilsGetImageSrc } from '@/_common/utils';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Building2, ImageOff, Mouse, Plus } from 'lucide-react';
import { type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchBuildingFloorDetail } from './SearchBuildingFloorDetail';

export const SearchBuildingNone = (): ReactNode => {
  const navigate = useNavigate();
  return (
    <div className='border-2 rounded-lg flex flex-col space-y-2 items-center justify-center'>
      <Mouse className='w-10 h-10' />
      <p>왼쪽에서 건물동을 선택해주세요.</p>
      <p className='space-x-2'>
        <span>또는</span>
        <Button
          onClick={() =>
            navigate(DefaultPathEnum.SYSTEM_ADMIN.SEGMENTS.BUILDINGS_CREATE)
          }
          size='sm'
          className='bg-purple-600 hover:bg-purple-700 text-white'
        >
          <Plus className='w-4 h-4' />
          건물 추가하기
        </Button>
      </p>
    </div>
  );
};

export const SearchBuildingDetail = (): ReactNode => {
  const { buildingId: findBuildingId } = useParams<{ buildingId: string }>();

  const { data, isLoading } = useQuery<SearchBuildingDetailType>({
    queryKey: queryKey.buildings.bms_buildings_Detail(findBuildingId),
    queryFn: () => {
      return apiClient
        .get(`${BMS_PATH.SEGMENTS.GET_BUILDINGS}/${findBuildingId}`)
        .json();
    },
  });

  if (isLoading || !data) {
    return <div>데이터를 찾을 수 없음</div>;
  }

  const {
    buildingName,
    address,
    buildingDesc,
    buildingImageUrl,
    groundFloors,
    basementFloors,
    latitude,
    longitude,
  } = data;

  return (
    <div className='border-2  p-2 rounded-lg grid grid-rows-[auto_1fr] w-full h-full min-h-0 space-y-4'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold flex space-x-2 items-center'>
          <Building2 className='text-slate-400' />
          <p children={buildingName} />
        </h2>
        <div className='grid grid-cols-1 2xl:grid-cols-[1fr_auto] max-2xl:space-y-2 gap-x-2'>
          <dl
            className={clsx(
              'grid grid-cols-[80px_auto] w-full h-fit  gap-y-2 text-base',
              'max-xl:grid-rows-[1fr_1fr_1fr_minmax[0_180px]]'
            )}
          >
            <dt className='text-slate-500' children='건물주소' />
            <dd className='font-semibold pr-4' children={address} />
            <dt className='text-slate-500' children='건물정보' />
            <dd
              className='pr-4'
              children={utilsBuildingFloorInfo({
                groundFloors,
                basementFloors,
              })}
            />

            <dt className='text-slate-500' children='건물위치' />
            <dd className='pr-4' children={`${latitude}, ${longitude}`} />
            <dt className='text-slate-500' children='건물설명' />
            <dd
              className={clsx(
                'h-full min-h-0 max-h-[280px] overflow-y-auto text-justify pr-4',
                { 'text-slate-300': !buildingDesc }
              )}
              children={
                buildingDesc ? buildingDesc : '설명이 기록되지 않았습니다.'
              }
            />
          </dl>
          <div
            className={clsx(
              'flex justify-center items-center border-2 rounded-md overflow-hidden',
              'max-2xl:w-full h-full',
              '2xl:w-[600px]'
            )}
          >
            {!buildingImageUrl ? (
              <figure className='flex flex-col justify-center items-center gap-2 w-full max-2xl:min-h-[180px] '>
                <ImageOff className='w-14 h-14 text-slate-100' />
                <p className='text-sm text-slate-400'>이미지 없음</p>
              </figure>
            ) : (
              <figure className='h-full w-full '>
                <img
                  src={utilsGetImageSrc({ url: buildingImageUrl })}
                  alt='building_images'
                  className='h-full w-full object-cover object-center'
                />
              </figure>
            )}
          </div>
        </div>
      </div>
      <SearchBuildingFloorDetail />
    </div>
  );
};
