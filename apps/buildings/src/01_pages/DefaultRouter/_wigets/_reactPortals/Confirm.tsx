import { Button } from '@/02_common/Button';
import { AlertTriangle } from 'lucide-react';
import { type ReactNode, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type ConfirmProps = PropsWithChildren<{
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'destructive';
}>;

export const Confirm = ({
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'primary',
}: ConfirmProps): ReactNode => {
  const confirmButtonClass = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return createPortal(
    <div className='fixed top-0 left-0 w-full h-full z-50'>
      <div className='w-full h-full bg-gray-600 opacity-40' onClick={onCancel} />
      <div className='absolute w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4'>
        <div className='bg-white p-4 rounded-2xl shadow-lg'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2 font-semibold text-gray-800'>
              <AlertTriangle className='w-5 h-5 text-amber-500' />
              {title}
            </div>

            <div className='space-y-3'>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
                <div className='text-sm text-gray-700'>{children}</div>
              </div>

              <div className='flex gap-2 justify-end'>
                <Button variant='outline' onClick={onCancel}>
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={confirmButtonClass[confirmVariant]}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
