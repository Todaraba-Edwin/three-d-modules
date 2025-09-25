import { Input, SelectedBluePoint } from '@/_common/components';
import { usePathSegments } from '@_shared';
import clsx from 'clsx';
import { Building2, Search } from 'lucide-react';
import { type ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const SearchBuildings = (): ReactNode => {
  const navigate = useNavigate();
  const onNavigate = (number: number) => () => {
    navigate(number.toString());
  };
  const { segments } = usePathSegments();
  const selectedBuildingId = parseInt(segments[3]) ?? 0;

  return (
    <div
      className={clsx('grid', 'grid-cols-[350px_1fr] space-x-4 h-full min-h-0')}
    >
      <div
        className={clsx(
          'border-2 p-4 rounded-lg',
          'grid grid-rows-[1fr_auto] space-y-2 min-h-0'
        )}
      >
        <form className='border-2 rounded-lg flex gap-2 items-center '>
          <Input type='text' placeholder='건물명을 입력해주세요' />
          <button
            disabled
            className='mr-2'
            children={<Search className='w-5 h-5 text-gray-400' />}
          />
        </form>
        <ol className='overflow-y-auto space-y-2'>
          {Array.from({ length: 50 }, (_, idx) => idx + 1).map(list => {
            const isSelected = selectedBuildingId === list;
            return (
              <li key={list}>
                <button
                  onClick={onNavigate(list)}
                  className={clsx(
                    'border-2 rounded-lg grid grid-cols-[auto_1fr] space-x-4 w-full items-center p-2',
                    { 'bg-blue-50 border-blue-400': isSelected },
                    { 'hover:bg-slate-100': !isSelected }
                  )}
                >
                  <figure className='relative'>
                    <Building2 className='text-slate-400 ml-2' />
                    {isSelected && (
                      <div className=' absolute -top-1 left-0'>
                        <SelectedBluePoint />
                      </div>
                    )}
                  </figure>
                  <span className='flex flex-col items-start overflow-hidden'>
                    <span>{list} 강원정보문화산업진흥원</span>
                    <span className='text-sm truncate w-full'>
                      강원 춘천시 서면 박사로 882 강원창작개발센터 나는 말줄임이
                      될꺼야
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <Outlet />
    </div>
  );
};
