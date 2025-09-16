import clsx from 'clsx';
import { Circle, EthernetPort, FilePenLine, Link2, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { deviceDetails, devices } from '../../_shared/const';

// eslint-disable-next-line
export const NMSSwitchInfoRightSection = ({
  selectedSwitch,
  // eslint-disable-next-line
}: any): ReactNode => {
  return (
    <div className='border-2 rounded-lg p-4 overflow-y-auto max-xl:h-[800px]'>
      {/* selectedSwitch 값이 없는 경우 */}
      {!selectedSwitch ? (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>왼쪽 목록에서 스위치를 선택하세요.</p>
        </div>
      ) : null}

      {selectedSwitch ? (
        <div className='space-y-4 min-h-0 h-full grid grid-rows-[auto_auto_1fr] '>
          {/* 컴포넌트 정보 */}
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <EthernetPort />
            <span>스위치 상세정보</span>
          </h2>

          {/* 선택된 스위치 이름 및 기초정보 */}
          <div>
            <h3 className='text-base font-bold'>{selectedSwitch.name}</h3>
            <div className='border-2 py-4 rounded-xl space-y-4 px-2 mt-2'>
              <dl className='grid grid-cols-[200px_1fr] gap-y-4 px-4'>
                <dt>타입</dt>
                <dd className='text-gray-500'>{selectedSwitch.type}</dd>
                <dt>IP</dt>
                <dd className='text-gray-500'>{selectedSwitch.ip || 'N/A'}</dd>
                <dt>MAC</dt>
                <dd className='text-gray-500'>{selectedSwitch.mac || 'N/A'}</dd>
                <dt>Core Switch 정보</dt>
                <dd className='text-gray-500'>{'N/A'}</dd>
                <dt>상위 Access Switch 정보</dt>
                <dd className='text-gray-500'>{'N/A'}</dd>
              </dl>
            </div>
          </div>
          <div className='grid grid-rows-[auto_1fr] overflow-y-auto'>
            <h4 className='font-bold'>포트 정보</h4>
            <div className='grid grid-cols-[50px_80px_1fr_80px] gap-x-4 text-sm text-gray-500 border-b pb-2  px-2'>
              <span>포트</span>
              <span>연결 상태</span>
              <span>연결된 장비 정보</span>
              <span className='text-center'>관리</span>
            </div>
            <div className='min-h-0 overflow-y-auto'>
              {Array.from(
                { length: selectedSwitch.ports?.length || 24 },
                (_, idx) => idx + 1
              ).map(portNum => {
                const device = devices[selectedSwitch.id]?.[portNum];
                const details = device ? deviceDetails[device.id] : null;
                const isDeviceConnected = !!device;
                const isError = portNum === 1;

                return (
                  <div
                    key={portNum}
                    className={clsx(
                      'grid grid-cols-[50px_80px_1fr_100px] gap-x-4 items-center text-sm py-2 last:border-none min-h-16 px-2',
                      {
                        'bg-red-100 border-t border-b border-red-400':
                          isError && isDeviceConnected,
                        'border-b': !(isError && isDeviceConnected),
                      }
                    )}
                  >
                    <span className='font-semibold'>{portNum}</span>
                    <div className='flex items-center gap-2'>
                      <Circle
                        size={10}
                        className={clsx({
                          'text-red-500 fill-red-500':
                            isError && isDeviceConnected,
                          'text-green-500 fill-green-500':
                            !isError && isDeviceConnected,
                          'text-gray-300 fill-gray-300': !isDeviceConnected,
                        })}
                      />
                      <span
                        className={clsx({
                          'text-gray-800': isDeviceConnected,
                          'text-gray-400': !isDeviceConnected,
                        })}
                      >
                        {isDeviceConnected && isError
                          ? '포트장애'
                          : isDeviceConnected
                            ? '연결됨'
                            : '없음'}
                      </span>
                    </div>

                    {details && device ? (
                      <div className='flex flex-col'>
                        <span className='font-semibold'>{details.name}</span>
                        <span className='text-gray-500'>
                          {details.ip} (ID: {device.id})
                        </span>
                      </div>
                    ) : (
                      <span className='text-gray-400'>N/A</span>
                    )}

                    <div className='flex items-center justify-center gap-2'>
                      {isDeviceConnected && (
                        <>
                          <button className='text-gray-500 hover:text-blue-600'>
                            <FilePenLine size={16} />
                          </button>
                          <button className='text-gray-500 hover:text-red-600'>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {!isDeviceConnected && (
                        <>
                          <button className='text-gray-500 hover:text-green-600 flex gap-2 justify-center items-center'>
                            <Link2
                              size={16}
                              className='text-green-400 hover:text-green-600'
                            />
                            <p>연결하기</p>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
