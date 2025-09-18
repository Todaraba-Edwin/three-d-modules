import { Button, PortalLayout } from '@/_common/components';
import { AlertTriangle } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

type ConfirmPortalProps = PropsWithChildren<{
  title: string;
  onConfirmPortal: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'destructive';
}>;

export const ConfirmPortal = ({
  title,
  children,
  onConfirmPortal,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'primary',
}: ConfirmPortalProps): ReactNode => {
  const confirmButtonClass = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <PortalLayout
      onClosePortal={onCancel}
      children={
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
                onClick={onConfirmPortal}
                className={confirmButtonClass[confirmVariant]}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};
