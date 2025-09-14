import { Progress } from '@/02_common/Progress';
import dayjs from 'dayjs';
import {
  AlertTriangle,
  BrickWallShield,
  CalendarCheck,
  Cctv,
  EthernetPort,
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
    id: 8,
    typeName: '차단벽',
    TypeIcon: BrickWallShield,
  },
];

export const HomeNetworkManagements = (): ReactNode => {
  return (
    <div className='bg-white border-2 border-slate-300 rounded-xl p-4 space-y-4'>
      {/* LMS 관리 */}
      <div className='flex items-center gap-2 '>
        <Zap className='w-5 h-5 text-orange-500' />
        <span className=' text-[20px]  text-orange-500'>
          네트워크/스위치 관리
        </span>
        <span className=' text-slate-400'>Light Management System</span>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 광섬유 관리 */}
        <div className='border-2 border-slate-300 rounded-xl p-4 space-y-4'>
          <div className='text-slate-500  flex items-center space-x-2'>
            <EthernetPort className='w-5 h-5 text-slate-900' />
            <p>MDF - 코어 스위치</p>
          </div>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  총 코어 스위치 포트
                </p>
                <p className='text-2xl font-semibold'>{24}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>정상 동작</p>
                <p className='text-2xl font-semibold text-green-600'>{20}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>비활성화 포트</p>
                <p className='text-2xl font-semibold text-gray-600'>{2}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>SFP 포트상태</span>
                <span>{Math.round((22 / 24) * 100)}%</span>
              </div>
              <Progress value={Math.round((22 / 24) * 100)} />
            </div>

            <dl className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>금일 - LLDP 테스트</dt>
                <dd>{10} 회 완료</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>최근 테스트</dt>
                <dd>{dayjs().format('YYYY.MM.DD A HH:mm:ss')}</dd>
              </div>
              <div className='flex justify-between text-red-600'>
                <dt className='flex items-center gap-1'>
                  <AlertTriangle className='w-3 h-3' />
                  장애 PORT
                </dt>
                <dd>{2}개</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 광스위치 관리 */}
        <div className='border-2 border-slate-300 rounded-xl p-4 space-y-4'>
          <div className='text-slate-500  flex items-center space-x-2'>
            <EthernetPort className='w-5 h-5 text-slate-900' />
            <p>RJ45(UFP) 연결된 장비 관리</p>
          </div>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>총 연결장비</p>
                <p className='text-2xl font-semibold'>{50}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>정상 연결</p>
                <p className='text-2xl font-semibold text-green-600'>{45}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>장비별 RJ45 연결상태</span>
                <span>{Math.round((50 / 45) * 100)}%</span>
              </div>
              <Progress value={Math.round((50 / 45) * 100)} />
            </div>

            <dl className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>
                  금일 - 연결상태 LLDP 테스트
                </dt>
                <dd>{10} 회 완료</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>최근 테스트</dt>
                <dd>{dayjs().format('YYYY.MM.DD A HH:mm:ss')}</dd>
              </div>
              <div className='flex justify-between text-red-600'>
                <dt className='flex items-center gap-1'>
                  <AlertTriangle className='w-3 h-3' />
                  장애 장비
                </dt>
                <dd>{5}개</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className='bg-white border-2 border-slate-300 rounded-xl p-4 space-y-4'>
        {/* LMS 관리 */}
        <div className='flex items-center gap-2 '>
          <Zap className='w-5 h-5 text-orange-500' />
          <span className=' text-[20px]  text-orange-500'>
            {' '}
            통신 장비 관리{' '}
          </span>
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
    </div>
  );
};
