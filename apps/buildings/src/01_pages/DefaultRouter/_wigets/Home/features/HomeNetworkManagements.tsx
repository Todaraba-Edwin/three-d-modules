import { Progress } from '@/02_common/Progress';
import dayjs from 'dayjs';
import { AlertTriangle, Cable, EthernetPort, Zap } from 'lucide-react';
import { type ReactNode } from 'react';

export const HomeNetworkManagements = (): ReactNode => {
  return (
    <div className='bg-white border-2 border-slate-300 rounded-xl p-4 space-y-4'>
      {/* LMS 관리 */}
      <div className='flex items-center gap-2 '>
        <Zap className='w-5 h-5 text-orange-500' />
        LMS (Light Management System)
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 광섬유 관리 */}
        <div className='border-2 border-slate-300 rounded-xl p-4 space-y-4'>
          <div className='text-slate-500  flex items-center space-x-2'>
            <Cable className='w-5 h-5 text-slate-900' />
            <p>광선로 기반 OTDR 관리</p>
          </div>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>총 광섬유</p>
                <p className='text-2xl font-semibold'>{24}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>정상 동작</p>
                <p className='text-2xl font-semibold text-green-600'>{22}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>광섬유 상태</span>
                <span>{Math.round((22 / 24) * 100)}%</span>
              </div>
              <Progress value={Math.round((22 / 24) * 100)} />
            </div>

            <dl className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>OTDR 테스트</dt>
                <dd>{100} 회 완료</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>최근 테스트</dt>
                <dd>{dayjs().format('YYYY.MM.DD A HH:mm:ss')}</dd>
              </div>
              <div className='flex justify-between text-red-600'>
                <dt className='flex items-center gap-1'>
                  <AlertTriangle className='w-3 h-3' />
                  장애 광섬유
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
            <p>광스위치 기반 전원 관리</p>
          </div>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>총 광스위치</p>
                <p className='text-2xl font-semibold'>{24}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>정상 동작</p>
                <p className='text-2xl font-semibold text-green-600'>{22}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>광스위치 전원상태</span>
                <span>{Math.round((22 / 24) * 100)}%</span>
              </div>
              <Progress value={Math.round((22 / 24) * 100)} />
            </div>

            <dl className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>전원상태 테스트</dt>
                <dd>{100} 회 완료</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>최근 테스트</dt>
                <dd>{dayjs().format('YYYY.MM.DD A HH:mm:ss')}</dd>
              </div>
              <div className='flex justify-between text-red-600'>
                <dt className='flex items-center gap-1'>
                  <AlertTriangle className='w-3 h-3' />
                  장애 광스위치
                </dt>
                <dd>{2}개</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
