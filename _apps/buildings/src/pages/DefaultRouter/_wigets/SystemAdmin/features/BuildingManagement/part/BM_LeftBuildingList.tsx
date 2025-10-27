import { Input } from '@/_common/components';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';
import * as Entity from '../../../entities';
import * as Parts from './SearchBuildingList';

const Component = {
  Layout: ({ children }: PropsWithChildren): ReactNode => (
    <div
      className={clsx(
        'rounded-lg border-2 p-4',
        'grid min-h-0 grid-rows-[auto_1fr] space-y-2',
        'overflow-y-auto max-xl:max-h-[200px] max-xl:min-h-[220px]'
      )}
      {...{ children }}
    />
  ),
  FormLayout: ({ children }: PropsWithChildren): ReactNode => (
    <div
      className='flex items-center overflow-hidden rounded-lg border-2'
      {...{ children }}
    />
  ),
  SearchIcon: (): ReactNode => (
    <Search className='ml-4 h-5 w-5 text-gray-400' />
  ),
  OrderList: ({ children }: PropsWithChildren): ReactNode => (
    <ol className='space-y-2 overflow-y-auto' {...{ children }} />
  ),
};

export const BM_LeftBuildingList = (): ReactNode => {
  const { register, watch } = Entity.useFormSearchBuilding();
  const { data } = Entity.useGetBuildings({ watch });

  return (
    <Component.Layout>
      <Component.FormLayout>
        <Component.SearchIcon />
        <Input
          type='text'
          {...register('search')}
          placeholder='건물명을 입력해주세요'
        />
      </Component.FormLayout>
      <Component.OrderList>
        {!data?.length ? (
          <Parts.EmptyBuilding />
        ) : (
          data?.map(content => (
            <Parts.SearchBuildingList key={content.id} {...{ content }} />
          ))
        )}
      </Component.OrderList>
    </Component.Layout>
  );
};
