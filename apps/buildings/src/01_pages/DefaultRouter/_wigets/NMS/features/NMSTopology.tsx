import { EthernetPort, Network, Router, Server, Square } from 'lucide-react';
import { type ReactNode } from 'react';
import {
  accessSwitches,
  coreSwitch,
  devices,
  extendSwitch,
} from '../_shared/const';

export const NMSTopology = (): ReactNode => {
  const mdfPorts = Array.from({ length: 48 }, (_, i) => i + 1);

  return (
    <div className='p-4 bg-white rounded-lg'>
      <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
        <Network />
        네트워크 전체 구성도
      </h2>
      <div className='space-y-4'>
        {/* Core Switch */}
        <div className='p-4 border-2 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Server />
            <h3 className='font-bold text-lg'>
              MDF - 코어 스위치 ({coreSwitch.model})
            </h3>
          </div>
          <p className='text-sm text-gray-500 ml-8'>IP: {coreSwitch.ip}</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4'>
            {mdfPorts.map(portId => {
              const connectedAccessSwitch = accessSwitches.find(
                sw => sw.id === portId
              );

              // MDF 1번 포트 특별 케이스
              if (portId === 1 && connectedAccessSwitch) {
                const extendedSwitches = extendSwitch[portId] || [];
                return (
                  <div
                    key={portId}
                    className='p-3 border-2 rounded-md space-y-2'
                  >
                    <div className='flex items-center gap-2 font-semibold'>
                      <EthernetPort className='w-5 h-5' />
                      <span>MDF Port #{portId}</span>
                    </div>

                    {/* Primary Access Switch */}
                    <div className='pl-3 border-l-4 border-blue-500 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Router className='w-5 h-5 text-blue-600' />
                        <div>
                          <p className='font-semibold text-blue-600'>
                            {connectedAccessSwitch.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {connectedAccessSwitch.model}
                          </p>
                        </div>
                      </div>
                      <div className='space-y-1 pl-3'>
                        <p className='font-bold text-xs'>연결된 장비:</p>
                        {devices[connectedAccessSwitch.id] ? (
                          Object.entries(devices[connectedAccessSwitch.id]).map(
                            ([devicePort, deviceInfo]) => (
                              <div
                                key={devicePort}
                                className='flex items-center gap-2 text-xs'
                              >
                                <Square className='w-3 h-3' />
                                <span>
                                  Port #{devicePort}: {deviceInfo.name}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <p className='text-xs text-gray-400'>
                            연결된 장비 없음
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Extended Access Switch */}
                    {/* eslint-disable-next-line */}
                    {extendedSwitches.map((ext: any) => (
                      <div
                        key={ext.id}
                        className='pl-3 border-l-4 border-purple-500 space-y-2'
                      >
                        <div className='flex items-center gap-2'>
                          <Router className='w-5 h-5 text-purple-600' />
                          <div>
                            <p className='font-semibold text-purple-600'>
                              IDF-1-1 (중계)
                            </p>
                            <p className='text-xs text-gray-500'>
                              FS-1000D (mock)
                            </p>
                          </div>
                        </div>
                        <div className='space-y-1 pl-3'>
                          <p className='font-bold text-xs'>연결된 장비:</p>
                          {/* Mock devices for extended switch */}
                          <div className='flex items-center gap-2 text-xs'>
                            <Square className='w-3 h-3' />
                            <span>Port #1: CCTV-101</span>
                          </div>
                          <div className='flex items-center gap-2 text-xs'>
                            <Square className='w-3 h-3' />
                            <span>Port #2: AP-101</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              // 일반 포트
              return (
                <div key={portId} className='p-3 border-2 rounded-md space-y-2'>
                  <div className='flex items-center gap-2 font-semibold'>
                    <EthernetPort className='w-5 h-5' />
                    <span>MDF Port #{portId}</span>
                  </div>

                  {connectedAccessSwitch ? (
                    <div className='pl-3 border-l-4 border-blue-500 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Router className='w-5 h-5 text-blue-600' />
                        <div>
                          <p className='font-semibold text-blue-600'>
                            {connectedAccessSwitch.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {connectedAccessSwitch.model}
                          </p>
                        </div>
                      </div>

                      <div className='space-y-1 pl-3'>
                        <p className='font-bold text-xs'>연결된 장비:</p>
                        {devices[connectedAccessSwitch.id] ? (
                          Object.entries(devices[connectedAccessSwitch.id]).map(
                            ([devicePort, deviceInfo]) => (
                              <div
                                key={devicePort}
                                className='flex items-center gap-2 text-xs'
                              >
                                <Square className='w-3 h-3' />
                                <span>
                                  Port #{devicePort}: {deviceInfo.name}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <p className='text-xs text-gray-400'>
                            연결된 장비 없음
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='pl-4 mt-2 text-sm text-gray-400'>
                      <p>미연결</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
