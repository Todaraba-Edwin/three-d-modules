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
        'border-2 p-4 rounded-lg',
        'grid grid-rows-[auto_1fr] space-y-2 min-h-0',
        'max-xl:min-h-[200px] max-xl:max-h-[200px] overflow-y-auto'
      )}
      {...{ children }}
    />
  ),
  FormLayout: ({ children }: PropsWithChildren): ReactNode => (
    <div className='border-2 rounded-lg flex items-center ' {...{ children }} />
  ),
  SearchIcon: (): ReactNode => (
    <Search className='w-5 h-5 text-gray-400 ml-4' />
  ),
  OrderList: ({ children }: PropsWithChildren): ReactNode => (
    <ol className='overflow-y-auto space-y-2' {...{ children }} />
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
