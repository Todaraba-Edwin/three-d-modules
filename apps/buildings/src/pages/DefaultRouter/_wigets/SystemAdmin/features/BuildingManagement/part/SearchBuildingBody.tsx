import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

import { Input } from '@/_common/components';
import * as Entity from '../../../entities';
import * as Parts from './SearchBuildingList';

export const SearchBuildingBody = (): ReactNode => {
  const { register, watch } = Entity.useFormSearchBuilding();
  const { data } = Entity.useGetBuildings({ watch });
  return (
    <div
      className={clsx(
        'border-2 p-4 rounded-lg',
        'grid grid-rows-[auto_1fr] space-y-2 min-h-0',
        'max-xl:min-h-[200px] max-xl:max-h-[200px] overflow-y-auto'
      )}
    >
      <form className='border-2 rounded-lg flex gap-2 items-center '>
        <Input
          type='text'
          {...register('search')}
          placeholder='건물명을 입력해주세요'
        />
        <button
          disabled
          className='mr-2'
          children={<Search className='w-5 h-5 text-gray-400' />}
        />
      </form>
      <ol className='overflow-y-auto space-y-2'>
        {!data?.length ? (
          <Parts.EmptyBuilding />
        ) : (
          data?.map(content => (
            <Parts.SearchBuildingList key={content.id} {...{ content }} />
          ))
        )}
      </ol>
    </div>
  );
};
