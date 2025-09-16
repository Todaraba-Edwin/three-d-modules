import { type ReactNode } from 'react';

export const FMSDeviceInfoRightSection = (): ReactNode => {
  return (
    <div className='border-2 rounded-lg p-4 overflow-y-auto'>
      <div className='flex items-center justify-center h-full text-gray-500'>
        <p>왼쪽 목록에서 장비를 선택하세요.</p>
      </div>
    </div>
  );
};
