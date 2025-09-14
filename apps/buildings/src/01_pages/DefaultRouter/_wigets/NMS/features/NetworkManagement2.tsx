import clsx from 'clsx';
import {
  EthernetPort,
  HardDrive,
  Link2,
  Router,
  Server,
  Square,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { NMSHeader } from './NMSHeader';

// Type Definitions for Index Signatures
type DeviceInfo = { id: number; type: string; name: string };

type PortDeviceMap = {
  [key: number]: {
    // switchId
    [key: number]: DeviceInfo; // portId
  };
};

type DeviceDetailMap = {
  [key: number]: { name: string; ip: string; mac: string; status: string };
};

// Mock Data
const coreSwitch = {
  ip: '192.168.1.1',
  model: 'Cisco Catalyst 9500',
  ports: Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    connected: i < 20,
  })),
};

const accessSwitches = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `IDF-${i + 1} 액세스 스위치`,
  model: 'Cisco Catalyst 2960',
  uplinkPort: 25 + i,
  ports: {
    rj45: Array.from({ length: 8 }, (__, j) => ({
      id: j + 1,
      connected: Math.random() > 0.5,
    })),
    sfp: Array.from({ length: 4 }, (__, j) => ({
      id: j + 9,
      connected: j === 0,
    })),
  },
}));

// Updated mock data to be port-centric
const devices: PortDeviceMap = {
  1: {
    // switchId
    1: { id: 1, type: 'CCTV', name: 'CAM-01' }, // portId
    3: { id: 2, type: 'AP', name: 'AP-01-01' },
  },
  2: {
    2: { id: 3, type: 'PC', name: 'PC-DEV-01' },
  },
  3: {
    1: { id: 4, type: 'CCTV', name: 'CAM-02' },
  },
};

const deviceDetails: DeviceDetailMap = {
  1: {
    name: 'CAM-01',
    ip: '10.10.1.101',
    mac: '00:1A:2B:3C:4D:5E',
    status: '활성',
  },
  2: {
    name: 'AP-01-01',
    ip: '10.10.1.102',
    mac: '00:1A:2B:3C:4D:5F',
    status: '활성',
  },
  3: {
    name: 'PC-DEV-01',
    ip: '10.10.2.50',
    mac: '00:1A:2B:3C:4D:6A',
    status: '활성',
  },
  4: {
    name: 'CAM-02',
    ip: '10.10.3.101',
    mac: '00:1A:2B:3C:4D:7B',
    status: '비활성',
  },
};

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'CCTV':
      return <HardDrive className='w-5 h-5' />;
    case 'AP':
      return <Router className='w-5 h-5' />;
    case 'PC':
      return <Server className='w-5 h-5' />;
    default:
      return <HardDrive className='w-5 h-5' />;
  }
};

export const NetworkManagement2 = (): ReactNode => {
  const [selectedSwitch, setSelectedSwitch] = useState<
    (typeof accessSwitches)[0] | null
  >(accessSwitches[0]);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  const handleCorePortClick = (portIndex: number) => {
    // portIndex is 0-based
    if (portIndex < accessSwitches.length) {
      const targetSwitch = accessSwitches[portIndex];
      setSelectedSwitch(targetSwitch);
      setSelectedDevice(null);
    }
  };

  const selectedSwitchIndex = selectedSwitch
    ? accessSwitches.findIndex(sw => sw.id === selectedSwitch.id)
    : -1;

  console.log('selectedDevice', selectedDevice);

  return (
    <div className='p-4 bg-gray-50'>
      <NMSHeader />
      <div className='grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_3fr_4fr] gap-4 mt-4'>
        {/* 1. MDF - 코어 스위치 */}
        <div className='bg-white p-4 rounded-lg shadow flex flex-col h-[900px]'>
          <h2 className='text-lg font-bold'>MDF - 코어 스위치</h2>
          <p className='text-sm text-gray-500'>{coreSwitch.ip}</p>
          <p className='text-sm text-gray-600'>{coreSwitch.model}</p>
          <div className='mt-4 pt-4 border-t border-gray-200 flex-grow flex flex-col min-h-0'>
            <h3 className='font-semibold'>SFP 포트 (24)</h3>
            <div className='overflow-y-auto mt-2'>
              <div className='grid grid-cols-2 gap-4'>
                {coreSwitch.ports.map((port, index) => (
                  <div key={port.id} className='w-4/5 m-auto'>
                    <div
                      onClick={() =>
                        port.connected && handleCorePortClick(index)
                      }
                      className={clsx(
                        'flex items-center space-x-1 justify-center p-1 rounded-md',
                        port.connected
                          ? 'cursor-pointer hover:bg-gray-100'
                          : 'cursor-not-allowed opacity-50',
                        selectedSwitchIndex === index &&
                          'bg-blue-100 ring-2 ring-blue-400'
                      )}
                    >
                      <EthernetPort
                        className={`w-5 h-5 ${port.connected ? 'text-green-500' : 'text-gray-300'}`}
                      />
                      <span className='text-xs font-bold'>{port.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 액세스 스위치 */}
        <div className='bg-white p-4 rounded-lg shadow flex flex-col h-[900px]'>
          <h2 className='text-lg font-bold'>액세스 스위치</h2>
          <div className='space-y-2 mt-4 overflow-y-auto flex-grow'>
            {accessSwitches.map(sw => (
              <div
                key={sw.id}
                onClick={() => {
                  setSelectedSwitch(sw);
                  setSelectedDevice(null);
                }}
                className={`p-2 rounded-md cursor-pointer ${selectedSwitch?.id === sw.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'}`}
              >
                <div className='flex items-center space-x-3'>
                  <Link2 className='w-5 h-5 text-blue-500' />
                  <p className='font-semibold'>{sw.name}</p>
                </div>
                <p className='text-sm text-gray-500 pl-8'>{sw.model}</p>
              </div>
            ))}
            {Array.from({ length: 4 }, (_, idx) => idx + 21).map(list => {
              return (
                <div key={list} className={`p-2 rounded-md `}>
                  <div className='flex items-center space-x-3  text-gray-300'>
                    <Link2 className='w-5 h-5' />
                    <p className='font-semibold'>IDF-{list} 액세스 스위치</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 스위치 상세 정보 */}
        <div className='bg-white p-4 rounded-lg shadow flex flex-col h-[900px]'>
          <h2 className='text-lg font-bold'>스위치 상세 정보</h2>
          <div className='overflow-y-auto mt-4 flex-grow'>
            {selectedSwitch ? (
              <div>
                <h3 className='font-semibold'>{selectedSwitch.name}</h3>
                {/* Port Information */}
                <div className='mt-4'>
                  <h4 className='font-medium'>포트 정보</h4>
                  <div className='mt-2 p-3 border rounded-md bg-gray-50'>
                    <p className='text-sm font-semibold'>RJ45 포트 (8)</p>
                    <div className='grid grid-cols-8 gap-3 mt-2'>
                      {selectedSwitch.ports.rj45.map((port, index) => (
                        <div
                          key={port.id}
                          title={`Port ${port.id}`}
                          className='flex flex-col items-center space-y-1'
                        >
                          <span className='text-xs font-medium'>
                            {index + 1}
                          </span>
                          <Square
                            className={`w-5 h-5 ${port.connected ? 'fill-current text-green-500' : 'text-gray-300'}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className='text-sm font-semibold mt-4'>SFP 포트 (4)</p>
                    <div className='grid grid-cols-4 gap-3 mt-2'>
                      {selectedSwitch.ports.sfp.map(port => (
                        <div
                          key={port.id}
                          title={`SFP ${port.id}`}
                          className='relative flex flex-col items-center cursor-pointer space-y-1'
                        >
                          <EthernetPort
                            className={`w-5 h-5 ${port.connected ? 'text-blue-500' : 'text-gray-300'}`}
                          />
                          {port.connected && (
                            <span className='text-xs text-blue-600 hover:underline'>
                              LLDP
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connected Devices List */}
                <div className='mt-4'>
                  <h4 className='font-medium'>연결 장비 목록</h4>
                  <div className='space-y-2 mt-2'>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map(
                      portIndex => {
                        const device = devices[selectedSwitch.id]?.[portIndex];
                        const isConnected = !!device;
                        return (
                          <div
                            key={portIndex}
                            onClick={() =>
                              isConnected &&
                              setSelectedDevice(deviceDetails[device.id])
                            }
                            className={`p-2 rounded-md flex items-center space-x-3 ${isConnected ? `cursor-pointer ${selectedDevice?.name === device.name ? 'bg-blue-100' : 'hover:bg-gray-100'}` : 'opacity-50'}`}
                          >
                            <span className='font-mono text-sm'>
                              {portIndex}.
                            </span>
                            <Link2
                              className={`w-5 h-5 ${isConnected ? 'text-gray-400' : 'text-gray-300'}`}
                            />
                            {isConnected ? (
                              <>
                                <DeviceIcon type={device.type} />
                                <span>{device.name}</span>
                              </>
                            ) : (
                              <span className='text-gray-400'>연결 없음</span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className='mt-4 text-gray-500'>
                액세스 스위치를 선택하여 상세 정보를 확인하세요.
              </p>
            )}
          </div>
        </div>

        {/* 4. 장비 상세 정보 */}
        <div className='bg-white p-4 rounded-lg shadow flex flex-col h-[900px]'>
          <h2 className='text-lg font-bold'>장비 상세 정보</h2>
          <div className='overflow-y-auto mt-4 flex-grow'>
            {selectedDevice ? (
              <div className='space-y-2'>
                <p>
                  <strong>이름:</strong> {selectedDevice.name}
                </p>
                <p>
                  <strong>IP 주소:</strong> {selectedDevice.ip}
                </p>
                <p>
                  <strong>MAC 주소:</strong> {selectedDevice.mac}
                </p>
                <p>
                  <strong>상태:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${selectedDevice.status === '활성' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                  >
                    {selectedDevice.status}
                  </span>
                </p>
              </div>
            ) : (
              <p className='mt-4 text-gray-500'>
                장비를 선택하여 상세 정보를 확인하세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
