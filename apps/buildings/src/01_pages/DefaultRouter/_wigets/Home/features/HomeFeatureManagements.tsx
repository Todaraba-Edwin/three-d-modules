import { Progress } from '@/02_common/Progress';
import dayjs from 'dayjs';
import {
  AlertTriangle,
  BrickWallShield,
  CalendarCheck,
  Cctv,
  DoorOpen,
  FireExtinguisher,
  LayoutGrid,
  Monitor,
  Speaker,
  Wifi,
  Zap,
} from 'lucide-react';
import { type ReactNode } from 'react';

const featureList = [
  {
    id: 1,
    typeName: 'CCTV',
    TypeIcon: Cctv,
  },
  {
    id: 2,
    typeName: 'WIFI',
    TypeIcon: Wifi,
  },
  {
    id: 3,
    typeName: 'PC',
    TypeIcon: Monitor,
  },
  {
    id: 4,
    typeName: '방송스피커',
    TypeIcon: Speaker,
  },
  {
    id: 5,
    typeName: '석면자제',
    TypeIcon: LayoutGrid,
  },
  {
    id: 6,
    typeName: '출입문',
    TypeIcon: DoorOpen,
  },
  {
    id: 7,
    typeName: '소화전',
    TypeIcon: FireExtinguisher,
  },
  {
    id: 8,
    typeName: '차단벽',
    TypeIcon: BrickWallShield,
  },
];

export const HomeFeatureManagements = (): ReactNode => {
  return (
    <div className='bg-white border-2 border-slate-300 rounded-xl p-4 space-y-4'>
      {/* LMS 관리 */}
      <div className='flex items-center gap-2 '>
        <Zap className='w-5 h-5 text-orange-500' />
        FMS (Feature Management System)
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* 광섬유 관리 */}
        {featureList.map(({ typeName, id, TypeIcon }) => {
          return (
            <div
              key={id}
              className='border-2 border-slate-300 rounded-xl p-4 space-y-4'
            >
              <div className='text-slate-500  flex items-center space-x-2'>
                <TypeIcon className='w-5 h-5 text-slate-900' />
                <p>{typeName} 관리</p>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      총 {typeName}
                    </p>
                    <p className='text-2xl font-semibold'>{24}</p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>정상 동작</p>
                    <p className='text-2xl font-semibold text-green-600'>
                      {22}
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>{typeName} 운영상태</span>
                    <span>{Math.round((22 / 24) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((22 / 24) * 100)} />
                </div>
              </div>
              <div>
                <div className='flex justify-between text-blue-600'>
                  <dt className='flex items-center gap-1'>
                    <CalendarCheck className='w-3 h-3' />
                    정기점검일
                  </dt>
                  <dd>
                    {`${dayjs().add(1, 'week').format('MM/DD')} (D-${dayjs().add(1, 'week').diff(dayjs(), 'day')})`}
                  </dd>
                </div>
                <div className='flex justify-between text-red-600'>
                  <dt className='flex items-center gap-1'>
                    <AlertTriangle className='w-3 h-3' />
                    교체대상 및 장애장비
                  </dt>
                  <dd>{2}개</dd>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
