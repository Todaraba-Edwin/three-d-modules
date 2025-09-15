import clsx from 'clsx';
import { EthernetPort, Square } from 'lucide-react';
import { type ReactNode } from 'react';
import { devices } from '../../_shared/const';

// eslint-disable-next-line
export const NMSSwitchInfoRightSection = ({
  selectedSwitch,
  // eslint-disable-next-line
}: any): ReactNode => {
  return (
    <div className='border-2 rounded-lg p-4 overflow-y-auto'>
      {selectedSwitch ? (
        <div className='space-y-4'>
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <EthernetPort />
            <span>스위치 상세정보</span>
          </h2>
          <h3 className='text-base font-bold'>{selectedSwitch.name}</h3>

          <div className='border-2 py-4 rounded-xl space-y-4'>
            <dl className={clsx('grid grid-cols-[100px_1fr] gap-y-4 px-4')}>
              <dt>타입</dt>
              <dd className='text-gray-500'>{selectedSwitch.type}</dd>
              <dt>IP</dt>
              <dd className='text-gray-500'>{selectedSwitch.ip || 'N/A'}</dd>
              <dt>MAC</dt>
              <dd className='text-gray-500'>{selectedSwitch.mac || 'N/A'}</dd>
              <dt>포트</dt>
              <dd className='grid grid-cols-8 gap-4 '>
                {Array.from(
                  { length: selectedSwitch.ports?.length || 24 },
                  (_, idx) => idx + 1
                ).map(portNum => {
                  const isDeviceConnected =
                    devices[selectedSwitch.id] &&
                    devices[selectedSwitch.id][portNum];
                  return (
                    <div
                      key={portNum}
                      className={clsx(
                        'flex flex-col justify-center items-center gap-1 p-2 rounded-xl',
                        {
                          'bg-gradient-to-br from-purple-500 to-blue-600 text-white':
                            isDeviceConnected,
                          'border-2 ': !isDeviceConnected,
                        }
                      )}
                    >
                      <Square size={10} />
                      <span className='text-sm'>{portNum}</span>
                    </div>
                  );
                })}
              </dd>
            </dl>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>왼쪽 목록에서 스위치를 선택하세요.</p>
        </div>
      )}
    </div>
  );
};
