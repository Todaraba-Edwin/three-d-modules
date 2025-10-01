import { apiClient } from '@/_common/apis';
import { utilsStoreResets } from '@/_common/zustandStores';
import clsx from 'clsx';
import { LogOut } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';
import * as RD from 'react-router-dom';

type Props = PropsWithChildren & {
  is3DmsMode: boolean;
  isGnbOpen: boolean;
  nickname: string;
};

export const NavFooter = ({
  is3DmsMode,
  isGnbOpen,
  nickname,
}: Props): ReactNode => {
  const isShowNickname = isGnbOpen && !is3DmsMode;
  const navigate = RD.useNavigate();
  return (
    <footer
      className={clsx('NavFooter', {
        'h-gnb-footer': isGnbOpen && !is3DmsMode,
        'h-gnb-footer-close': !isGnbOpen,
        'bg-white shadow-[0_-5px_15px_-3px_rgb(0,0,0,0.1),0_-4px_6px_-4px_rgb(0,0,0,0.1)]':
          !is3DmsMode,
        'bg-black shadow-[0_-5px_40px_-3px_rgb(255,255,255,0.1),0_-4px_40px_-4px_rgb(255,255,255,0.1)]':
          is3DmsMode,
      })}
    >
      {isShowNickname && (
        <p className='px-4 flex items-center gap-2'>
          <span className='text-xl'>{nickname}</span>
          <span className='font-normal'>님</span>
        </p>
      )}

      <button
        className={clsx('p-4 block', 'w-gnb-content', 'flex gap-gnb')}
        onClick={async () => {
          // ✅ zustand Store에 대한 초기화 코드
          utilsStoreResets();

          try {
            await apiClient.post('auth/logout').json();
          } catch (err) {
            console.error(err);
          } finally {
            navigate('/login');
          }
        }}
      >
        <LogOut
          className={clsx('text-gray-500 font-bold', 'w-gnb-icon h-gnb-icon')}
        />
        {isGnbOpen && <p children='로그아웃' />}
      </button>
    </footer>
  );
};
