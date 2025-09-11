import { Button } from '@/03_common/Button';
import clsx from 'clsx';
import { Plus, Shield, Users } from 'lucide-react';
import { type ReactNode } from 'react';

export const UserManagement = (): ReactNode => {
  return (
    <div className='bg-white h-full rounded-xl p-4 grid grid-rows-[auto_1fr] space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            사용자 및 권한 관리
          </h3>
          <p className='text-gray-600'>
            시스템 권한과 사용자 계정을 관리합니다
          </p>
        </div>
      </div>
      <div
        className={clsx(
          'grid min-h-0',
          'grid-cols-1 grid-rows-[auto_1fr] gap-y-4',
          'xl:grid-cols-2 xl:grid-rows-1 gap-x-4'
        )}
      >
        <div className='border-2 border-slate-300 rounded-xl p-4 grid grid-rows-[auto_auto_1fr] gap-y-2'>
          {/* 헤더 */}
          <div>
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4' />
              권한 관리
            </div>
            <div>역할별 시스템 접근 권한을 설정합니다</div>
          </div>

          {/* 역할 추가로직 */}
          <div>
            <Button
              onClick={() => {}}
              disabled={false}
              size='sm'
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Plus className='w-4 h-4' />
              역할 추가
            </Button>
            <div className='h-[600px] border-2 border-red-600'>추가로직</div>
          </div>

          {/* 도표부분 */}
          <div
            className={clsx(
              'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
              'overflow-scroll',
              'max-xl:h-[150px]'
            )}
          >
            <div className='p-2 bg-blue-100 grid grid-cols-[2fr_4.5fr_1.5fr]'>
              <div>역할</div>
              <div>권한</div>
              <div>설정</div>
            </div>
            <div className='overflow-auto'>
              {Array.from({ length: 40 }, (_, idx) => idx).map(list => {
                return (
                  <div
                    key={list}
                    className='p-2 grid grid-cols-[2fr_4.5fr_1.5fr]'
                  >
                    <div>역할{list}</div>
                    <div>권한{list}</div>
                    <div>설정{list}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='border-2  border-slate-300 rounded-xl p-4 grid grid-rows-[auto_auto_1fr] gap-y-2 '>
          <div>
            {/* 헤더 */}
            <div className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              사용자 관리
            </div>
            <div>모든/특정역할의 사용자를 관리합니다.</div>
          </div>
          {/* 역할 추가로직 */}
          <div>
            <Button
              onClick={() => {}}
              disabled={false}
              size='sm'
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Plus className='w-4 h-4' />
              역할 추가
            </Button>
            <div className='h-[600px] border-2 border-red-600'>추가로직</div>
          </div>

          {/* 도표부분 */}
          <div
            className={clsx(
              'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
              'overflow-scroll'
            )}
          >
            <div className='p-2 bg-blue-100 grid grid-cols-[2fr_4.5fr_1.5fr]'>
              <div>역할</div>
              <div>권한</div>
              <div>설정</div>
            </div>
            <div className='overflow-auto'>
              {Array.from({ length: 10 }, (_, idx) => idx).map(list => {
                return (
                  <div
                    key={list}
                    className='p-2 grid grid-cols-[2fr_4.5fr_1.5fr]'
                  >
                    <div>역할{list}</div>
                    <div>권한{list}</div>
                    <div>설정{list}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
