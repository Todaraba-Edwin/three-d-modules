import { SelectedBluePoint } from '@/_common/components';
import { usePathSegments } from '@_shared';
import clsx from 'clsx';
import { Minus } from 'lucide-react';
import { type ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const SURFACE = [
  { id: 1, floor_type: 'SURFACE', floor_name: '바닥', floor_number: 0 },
];
const BASEMENT = [
  { id: 2, floor_type: 'BASEMENT', floor_name: '지하1층', floor_number: 1 },
  { id: 3, floor_type: 'BASEMENT', floor_name: '지하2층', floor_number: 2 },
];
const GROUND = [
  { id: 14, floor_type: 'GROUND', floor_name: '지상11층', floor_number: 11 },
  { id: 13, floor_type: 'GROUND', floor_name: '지상10층', floor_number: 10 },
  { id: 12, floor_type: 'GROUND', floor_name: '지상9층', floor_number: 9 },
  { id: 11, floor_type: 'GROUND', floor_name: '지상8층', floor_number: 8 },
  { id: 10, floor_type: 'GROUND', floor_name: '지상7층', floor_number: 7 },
  { id: 9, floor_type: 'GROUND', floor_name: '지상6층', floor_number: 6 },
  { id: 8, floor_type: 'GROUND', floor_name: '지상5층', floor_number: 5 },
  { id: 7, floor_type: 'GROUND', floor_name: '지상4층', floor_number: 4 },
  { id: 6, floor_type: 'GROUND', floor_name: '지상3층', floor_number: 3 },
  { id: 5, floor_type: 'GROUND', floor_name: '지상2층', floor_number: 2 },
  { id: 4, floor_type: 'GROUND', floor_name: '지상1층', floor_number: 1 },
];

export const SearchBuildingFloorDetail = (): ReactNode => {
  const navigate = useNavigate();
  const { segments } = usePathSegments();
  const currentFloorId = parseInt(segments[4] ?? undefined);
  const onNavigate = (floorId: number) => () => {
    if (currentFloorId === floorId) {
      const unSelectedPath = segments.slice(1, 4).join('/');
      navigate(`/${unSelectedPath}`);
      return;
    }
    navigate(floorId.toString());
  };

  return (
    <div className='grid grid-cols-[auto_1fr] 2xl:grid-cols-[1fr_600px] gap-x-2 min-h-0 '>
      <ol className='max-2xl:min-w-[260px] max-xl:max-h-[512px] space-y-2 min-h-0 grid grid-rows-[aut0_1fr]'>
        {[...SURFACE].map(list => (
          <li key={list.id}>
            <button
              className={clsx(
                'w-full border-2 rounded-lg grid grid-cols-[50px_1fr] text-start text-slate-300 relative',
                {
                  'bg-blue-50 border-blue-300 text-slate-800':
                    currentFloorId === list.id,
                  'hover:bg-slate-50 ': currentFloorId != list.id,
                }
              )}
              onClick={onNavigate(list.id)}
              children={
                <>
                  <span className='w-full flex justify-center items-center'>
                    <Minus />
                  </span>
                  <span className='p-2'>{list.floor_name}</span>
                  {currentFloorId === list.id && (
                    <div className=' absolute top-1 left-1'>
                      <SelectedBluePoint />
                    </div>
                  )}
                </>
              }
            />
          </li>
        ))}
        <div className='overflow-y-auto space-y-2  rounded-lg'>
          {[...GROUND, ...BASEMENT].map(list => {
            const isFloor = list.floor_type === 'GROUND';
            return (
              <li key={list.id}>
                <button
                  onClick={onNavigate(list.id)}
                  className={clsx(
                    'w-full border-2 rounded-lg grid grid-cols-[50px_1fr] text-start text-slate-300 relative',
                    {
                      'bg-blue-50 border-blue-300 text-slate-800':
                        currentFloorId === list.id,
                      'hover:bg-slate-50 ': currentFloorId != list.id,
                    }
                  )}
                  children={
                    <>
                      <span
                        className={clsx(
                          'w-full flex items-center justify-center  text-white font-semibold',
                          {
                            'bg-black': currentFloorId === list.id,
                            'bg-slate-300': currentFloorId != list.id,
                          }
                        )}
                      >{`${isFloor ? `F${list.floor_number}` : `B${list.floor_number}`}`}</span>
                      <span className='p-2'>{list.floor_name}</span>
                      {currentFloorId === list.id && (
                        <div className=' absolute top-1 left-1'>
                          <SelectedBluePoint color='white' />
                        </div>
                      )}
                    </>
                  }
                />
              </li>
            );
          })}
        </div>
      </ol>
      <div
        className={clsx(
          'bg-violet-300',

          'flex justify-center items-center border-2 rounded-md overflow-hidden',
          'w-full h-full'
          //   '2xl:w-[600px]'
        )}
      >
        <Outlet />
      </div>
    </div>
  );
};
