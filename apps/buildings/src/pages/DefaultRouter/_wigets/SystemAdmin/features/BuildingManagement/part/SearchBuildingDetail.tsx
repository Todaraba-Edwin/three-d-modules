import { Button } from '@/_common/components';
import { DefaultPathEnum } from '@/_common/const';
import clsx from 'clsx';
import { Building2, Mouse, Plus } from 'lucide-react';
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

  return (
    <div className='border-2  p-2 rounded-lg grid grid-rows-[auto_1fr] w-full h-full min-h-0 space-y-4'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold flex space-x-2 items-center'>
          <Building2 className='text-slate-400' />
          <p>{`${findBuildingId} 강원정보문화산업진흥원`}</p>
        </h2>
        <div className='grid grid-cols-1 xl:grid-cols-[1fr_auto] max-xl:space-y-2 gap-x-2'>
          <dl
            className={clsx(
              'grid grid-cols-[80px_auto] w-full h-fit  gap-y-2 text-base',
              'max-xl:grid-rows-[1fr_1fr_1fr_180px]'
            )}
          >
            <dt className='text-slate-500'>건물주소</dt>
            <dd className='font-semibold pr-4'>
              강원 춘천시 서면 박사로 882 강원창작개발센터
            </dd>
            <dt className='text-slate-500'>건물정보</dt>
            <dd className='pr-4'>지상 4층</dd>
            <dt className='text-slate-500'>건물위치</dt>
            <dd className='pr-4'>37.56535253323751, 126.98043995723783</dd>
            <dt className='text-slate-500'>건물설명</dt>
            <dd className='h-full min-h-0 max-h-[280px] overflow-y-auto text-justify pr-4'>
              건물 설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다. 건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다. 건물 설명이 이렇게 들어갑니다.건물
              설명이 이렇게 들어갑니다.
            </dd>
          </dl>
          <div
            className={clsx(
              'flex justify-center items-center border-2 rounded-md overflow-hidden',
              'max-xl:w-full h-full',
              '2xl:w-[600px]'
            )}
          >
            {/* <figure className='flex flex-col justify-center items-center gap-2 w-full '>
            <ImageOff className='w-14 h-14 text-slate-200' />
            <button className='w-full truncate'>이미지 추가하기</button>
          </figure> */}
            <figure className='h-full w-full '>
              <img
                src='http://192.168.40.100:8080/media/images/강원정보문화산업진흥원.png'
                alt='building_images'
                className='h-full w-full object-cover object-center'
              />
            </figure>
          </div>
        </div>
      </div>
      <SearchBuildingFloorDetail />
    </div>
  );
};
