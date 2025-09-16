import clsx from 'clsx';
import { Cable, Circle } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import {
  devices,
  accessSwitches,
  coreSwitch,
} from '../../_shared/const';

const allSwitches = [
  { ...coreSwitch, type: 'Core', name: 'MDF-코어 스위치' },
  ...accessSwitches.map(sw => ({ ...sw, type: 'Access' })),
];

const switchesMap = new Map(allSwitches.map(sw => [sw.id.toString(), sw]));

export const NMSDeviceInfoRightSection = ({
  selectedDevice,
}: any): ReactNode => {
  const connectionInfo = useMemo(() => {
    if (!selectedDevice) return null;

    for (const switchId in devices) {
      for (const portId in devices[switchId]) {
        if (devices[switchId][portId].id.toString() === selectedDevice.id) {
          const switchDetails = switchesMap.get(switchId);
          return {
            switchId,
            portId,
            switchName: switchDetails?.name || 'Unknown Switch',
          };
        }
      }
    }
    return null;
  }, [selectedDevice]);

  return (
    <div className='border-2 rounded-lg p-4 overflow-y-auto'>
      {selectedDevice ? (
        <div className='space-y-4'>
          <h2 className='text-lg font-bold'>장비 상세정보</h2>
          <h3 className='text-base font-bold'>{selectedDevice.name}</h3>

          <div className='border-2 py-4 rounded-xl space-y-4'>
            <dl className='grid grid-cols-[100px_1fr] gap-y-4 px-4'>
              <dt>IP 주소</dt>
              <dd className='text-gray-500'>{selectedDevice.ip}</dd>
              <dt>MAC 주소</dt>
              <dd className='text-gray-500'>{selectedDevice.mac}</dd>
              <dt>상태</dt>
              <dd className='flex items-center gap-2'>
                <Circle
                  size={10}
                  className={clsx({
                    'text-green-500 fill-green-500':
                      selectedDevice.status === '활성',
                    'text-red-500 fill-red-500':
                      selectedDevice.status !== '활성',
                  })}
                />
                <span
                  className={clsx({
                    'text-gray-800': selectedDevice.status === '활성',
                    'text-gray-400': selectedDevice.status !== '활성',
                  })}
                >
                  {selectedDevice.status}
                </span>
              </dd>
            </dl>
          </div>

          {connectionInfo && (
            <div className='border-2 p-4 rounded-xl space-y-2'>
              <h4 className='font-bold flex items-center gap-2'>
                <Cable size={16} />
                연결 정보
              </h4>
              <p>
                <span className='font-semibold'>{connectionInfo.switchName}</span>
                <span> 스위치의 </span>
                <span className='font-semibold'>{connectionInfo.portId}번</span>
                <span> 포트에 연결되어 있습니다.</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className='flex items-center justify-center h-full text-gray-500'>
          <p>왼쪽 목록에서 장비를 선택하세요.</p>
        </div>
      )}
    </div>
  );
};
