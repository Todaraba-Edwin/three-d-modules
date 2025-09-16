import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  Cable,
  EthernetPort,
  HardDrive,
  Link2,
  Link2Off,
  Network,
  Router,
  Server,
  Square,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import {
  accessSwitches,
  coreSwitch,
  deviceDetails,
  devices,
  extendSwitch,
} from '../_shared/const';

const DeviceIcon = {
  CCTV: <HardDrive className='w-5 h-5' />,
  AP: <Router className='w-5 h-5' />,
  PC: <Server className='w-5 h-5' />,
};

type DeviceIconType = keyof typeof DeviceIcon;

export const NMSMain = (): ReactNode => {
  const [selectedSwitch, setSelectedSwitch] = useState<number>(1);
  const [randomDevices, setRandomDevices] = useState<number>(1);
  const [selectedSwitchInfo, setSelectedSwitchInfo] = useState<{
    id: number | '';
    name: string;
  }>(() => {
    return {
      id: accessSwitches[0].id,
      name: accessSwitches[0].name,
    };
  });
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const onSetSelectedSwitch = (switchPortNum: number) => () => {
    setSelectedSwitch(switchPortNum);
    setSelectedDevice(null);
    setRandomDevices(Math.floor(Math.random() * 4) + 1);
    setFindDevice({
      id: 0,
      name: '',
      Type: DeviceIcon['CCTV'],
    });
  };

  const onSetSelectedSwitchInfo = ({
    id,
    name,
  }: {
    id: number;
    name: string;
  }) => {
    setSelectedSwitchInfo({ id, name });
  };

  const [findDevice, setFindDevice] = useState({
    id: 0,
    name: '',
    Type: DeviceIcon['CCTV'],
  });

  useEffect(() => {
    const device = devices?.[randomDevices]?.[selectedDevice];
    if (!device) return;

    const deviceType = device.type as DeviceIconType;

    setFindDevice({
      id: device.id as number,
      name: device.name,
      Type: DeviceIcon[deviceType] ?? DeviceIcon['CCTV'],
    });
  }, [selectedDevice, randomDevices]);

  return (
    <main
      className={clsx(
        'grid grid-cols-1 xl:grid-cols-[2fr_2fr_3.5fr_3.5fr] gap-4 h-full min-h-0 pt-2 pb-4'
      )}
    >
      {/* 1번째 섹션 */}
      <div
        className={clsx(
          'bg-white rounded-lg',
          'grid grid-rows-[auto_1fr] space-y-4  min-h-0'
        )}
      >
        <header className='space-y-1 p-4 border-b-2'>
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <Network />
            <span>메인분배함 - Core</span>
          </h2>
          <dl className={clsx('grid grid-cols-[80px_1fr]')}>
            <dt>모델명</dt>
            <dd className='text-gray-500'>{coreSwitch.model}</dd>
            <dt>IP</dt>
            <dd className='text-gray-500'>{coreSwitch.ip}</dd>
            <dt>포트수</dt>
            <dd className='text-gray-500'>{coreSwitch.ports.length} 포트</dd>
          </dl>
        </header>
        <section
          className={clsx(
            'px-4 pb-4',
            'grid grid-cols-4 gap-4 content-start',
            'overflow-y-auto',
            'max-xl:h-60',
            'max-xl:grid-cols-8'
          )}
        >
          {coreSwitch.ports.map(({ id, connected }) => (
            <button
              key={id}
              onClick={() => {
                onSetSelectedSwitch(id)();
                const find = accessSwitches.find(list => list.id === id);
                if (!find) return;
                onSetSelectedSwitchInfo({ id: find.id, name: find.name });
              }}
              className={clsx('p-2 rounded-xl', {
                'bg-gradient-to-br from-purple-500 to-blue-600':
                  selectedSwitch === id && connected,
                'bg-gradient-to-br from-purple-200 to-blue-300':
                  selectedSwitch != id && connected,
                'hover:bg-gradient-to-br hover:from-purple-400 hover:to-blue-500 ':
                  selectedSwitch != id && connected,
                'bg-gray-100': !connected,
              })}
              disabled={!connected}
            >
              <div
                className={clsx('flex flex-col justify-center items-center', {
                  ' text-white': connected,
                  ' text-gray-300': !connected,
                })}
              >
                <EthernetPort className='w-6 h-6' />
                <span className='text-xs font-bold'>{id}</span>
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* 2번째 섹션 */}
      <div
        className={clsx(
          'bg-white rounded-lg',
          'grid grid-rows-[auto_1fr] space-y-4  min-h-0'
        )}
      >
        <header className='space-y-1 p-4 border-b-2'>
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <Network />
            <span>PDF - Access Switch</span>
          </h2>
          <dl className={clsx('grid grid-cols-[80px_1fr]')}>
            <dt>총 포트</dt>
            <dd className='text-gray-500'>{coreSwitch.ports.length} 포트</dd>
            <dt>연결상태</dt>
            <dd className='text-gray-500'>
              {`${coreSwitch.ports.reduce((acc, cur) => {
                return cur.connected ? acc + 1 : acc;
              }, 0)} 포트`}
            </dd>
            <dt>미연결상태</dt>
            <dd className='text-gray-500'>
              {`${coreSwitch.ports.reduce((acc, cur) => {
                return !cur.connected ? acc + 1 : acc;
              }, 0)} 포트`}
            </dd>
          </dl>
        </header>
        <section
          className={clsx(
            'px-4 pb-4',
            'overflow-y-auto space-y-2',
            'max-xl:h-60'
          )}
        >
          {accessSwitches.map(sw => (
            <button
              key={sw.id}
              onClick={() => {
                onSetSelectedSwitch(sw.id)();
                const find = accessSwitches.find(list => list.id === sw.id);
                if (!find) return;
                onSetSelectedSwitchInfo({ id: find.id, name: find.name });
              }}
              className={clsx(
                'px-2 rounded-xl p-2 box-border w-full border-2 grid grid-cols-[auto_1fr] space-x-2',
                {
                  'border-blue-600 bg-blue-50': selectedSwitch === sw.id,
                  'hover:bg-gray-100 ': selectedSwitch != sw.id,
                }
              )}
            >
              <Link2 className='w-5 h-5 text-blue-500' />
              <p className='flex flex-col items-start'>
                <span className='font-semibold'>{sw.name}</span>
                <span className='text-sm text-gray-500'>{sw.model}</span>
              </p>
            </button>
          ))}
          {Array.from(
            { length: coreSwitch.ports.length - accessSwitches.length },
            (_, idx) => idx + 21
          ).map(list => {
            return (
              <button
                key={list}
                className={`p-2 rounded-md w-full border-2`}
                disabled
              >
                <div className='flex items-center space-x-3  text-gray-300'>
                  <Link2Off className='w-5 h-5' />
                  <p className='font-semibold'>IDF-{list} 액세스 스위치</p>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {/* 3번째 섹션 */}
      <div
        className={clsx(
          'bg-white rounded-lg',
          'grid grid-rows-[auto_1fr] space-y-4  min-h-0'
        )}
      >
        <header className='space-y-1 pt-4 px-4'>
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <EthernetPort />
            <span>Access Switch 상세정보</span>
          </h2>
          <h3 className='text-base font-bold flex space-x-2 items-center'>
            <span>{selectedSwitchInfo.name}</span>
          </h3>
          {/* 스위치 정보 */}
          <div className='border-2 py-4 rounded-xl space-y-4'>
            <dl className={clsx('grid grid-cols-[100px_1fr] gap-y-4 px-4')}>
              <dt>IP</dt>
              <dd className='text-gray-500'>192.168.1.101</dd>
              <dt>RJ45 포트</dt>
              <dd className='grid grid-cols-8 gap-4 '>
                {Array.from({ length: 8 }, (_, idx) => idx + 1).map(list => {
                  const findRJ45 = Object.keys(devices[randomDevices]).map(
                    list => Number(list)
                  );
                  const isActive = findRJ45.includes(list);

                  return (
                    <div
                      key={list}
                      className={clsx(
                        'flex flex-col justify-center items-center gap-1 p-2 rounded-xl',
                        {
                          'bg-gradient-to-br from-purple-500 to-blue-600 text-white':
                            isActive,
                          'border-2 ': !isActive,
                        }
                      )}
                    >
                      <Square size={10} />
                      <span className='text-sm'>{list}</span>
                    </div>
                  );
                })}
              </dd>
              <dt>SFP 포트</dt>
              <dd className='grid grid-cols-4 gap-4 '>
                {Array.from({ length: 4 }, (_, idx) => idx + 9).map(list => {
                  const isFirst = list === 9;
                  const extendSwitchList = extendSwitch?.[selectedSwitch];
                  const isExtentProt =
                    extendSwitchList?.filter(
                      ({ port }: { port: number }) => port === list
                    ).length ?? 0;
                  return (
                    <div
                      key={list}
                      className={clsx(
                        'flex flex-col justify-center items-center gap-1 p-2 rounded-xl',
                        {
                          'bg-gradient-to-br from-purple-500 to-blue-600 text-white':
                            isFirst || isExtentProt,
                          'border-2 ': !isFirst || !isExtentProt,
                        }
                      )}
                    >
                      <EthernetPort />
                      <span className='text-sm'>{list}포트</span>
                    </div>
                  );
                })}
              </dd>
              <dt></dt>
              <dd className='text-gray-500'>
                <p>9번포트 : 192.168.1.1(Core) - {selectedSwitch}포트 연결</p>
                {selectedSwitch &&
                  extendSwitch?.[selectedSwitch] &&
                  extendSwitch?.[selectedSwitch]?.length &&
                  extendSwitch?.[selectedSwitch]?.map(
                    (list: { id: number; port: number }) => (
                      <p key={list.id}>
                        10번포트 : 192.168.1.{list.id}(Access) - {list.port - 1}
                        포트 연결
                      </p>
                    )
                  )}
              </dd>
            </dl>{' '}
            {selectedSwitch &&
              extendSwitch?.[selectedSwitch] &&
              extendSwitch?.[selectedSwitch]?.length && (
                <>
                  <div
                    className='h-10 bg-blue-500 flex justify-center items-center text-white'
                    children='확장 PDF스위치'
                  />
                  <dl
                    className={clsx('grid grid-cols-[100px_1fr] gap-y-4  px-4')}
                  >
                    <dt>IP</dt>
                    <dd className='text-gray-500'>192.168.1.201</dd>
                    <dt>RJ45 포트</dt>
                    <dd className='grid grid-cols-8 gap-4 '>
                      {Array.from({ length: 8 }, (_, idx) => idx + 1).map(
                        list => {
                          const findRJ45 = Object.keys(
                            devices[randomDevices]
                          ).map(list => Number(list));
                          const isActive = findRJ45.includes(list);

                          return (
                            <div
                              key={list}
                              className={clsx(
                                'flex flex-col justify-center items-center gap-1 p-2 rounded-xl',
                                {
                                  'bg-gradient-to-br from-purple-500 to-blue-600 text-white':
                                    isActive,
                                  'border-2 ': !isActive,
                                }
                              )}
                            >
                              <Square size={10} />
                              <span className='text-sm'>
                                {list}({list + 8})
                              </span>
                            </div>
                          );
                        }
                      )}
                    </dd>
                    <dt>SFP 포트</dt>
                    <dd className='grid grid-cols-4 gap-4 '>
                      {Array.from({ length: 4 }, (_, idx) => idx + 9).map(
                        list => {
                          const isFirst = list === 9;
                          return (
                            <div
                              key={list}
                              className={clsx(
                                'flex flex-col justify-center items-center gap-1 p-2 rounded-xl',
                                {
                                  'bg-gradient-to-br from-purple-500 to-blue-600 text-white':
                                    isFirst,
                                  'border-2 ': !isFirst,
                                }
                              )}
                            >
                              <EthernetPort />
                              <span className='text-sm'>{list}포트</span>
                            </div>
                          );
                        }
                      )}
                    </dd>
                    <dt></dt>
                    <dd className='text-gray-500'>
                      <p>
                        9번포트 : 192.168.1.101(Core) - {10}
                        포트 연결
                      </p>
                    </dd>
                  </dl>
                </>
              )}
          </div>
        </header>
        <section
          className={clsx(
            'px-4 pb-4',
            'overflow-y-auto space-y-2',
            'max-xl:h-60'
          )}
        >
          {/* Connected Devices List */}
          <div className='mt-4'>
            <h4 className='font-medium'>연결 장비 목록</h4>
            <div className='space-y-2 mt-2 '>
              {Array.from({ length: 8 }, (_, i) => i + 1).map(portIndex => {
                const device = devices[randomDevices]?.[portIndex];
                const isConnected = !!device;
                return (
                  <button
                    key={portIndex}
                    onClick={() => {
                      setSelectedDevice(portIndex);
                    }}
                    className={clsx(
                      'p-2 rounded-md flex items-center space-x-3 w-full border-2',
                      {
                        'border-blue-600 bg-blue-50':
                          selectedDevice === portIndex,
                        'hover:bg-gray-100 ':
                          isConnected && selectedDevice != portIndex,
                        'border-white opacity-50': !isConnected,
                      }
                    )}
                    disabled={!isConnected}
                  >
                    <span className='font-mono text-sm'>{portIndex}.</span>
                    {isConnected && <Link2 className={`w-5 h-5`} />}
                    {!isConnected && <Link2Off className={`w-5 h-5`} />}
                    {isConnected ? (
                      <>
                        {/* <DeviceIcon.[device.type] /> */}
                        <span className=' text-black font-semibold'>
                          {device.name}
                        </span>
                      </>
                    ) : (
                      <span>연결 없음</span>
                    )}
                  </button>
                );
              })}
              {selectedSwitch &&
                extendSwitch?.[selectedSwitch] &&
                extendSwitch?.[selectedSwitch]?.length &&
                Array.from({ length: 8 }, (_, i) => i + 1).map(portIndex => {
                  const device = devices[randomDevices]?.[portIndex];
                  const isConnected = !!device;
                  return (
                    <button
                      key={portIndex + 10}
                      onClick={() => {
                        setSelectedDevice(portIndex + 10);
                      }}
                      className={clsx(
                        'p-2 rounded-md flex items-center space-x-3 w-full border-2',
                        {
                          'border-blue-600 bg-blue-50':
                            selectedDevice === portIndex + 10,
                          'hover:bg-gray-100 ':
                            isConnected && selectedDevice != portIndex + 10,
                          'border-white opacity-50': !isConnected,
                        }
                      )}
                      disabled={!isConnected}
                    >
                      <span className='font-mono text-sm'>
                        {portIndex + 8}.
                      </span>
                      {isConnected && <Link2 className={`w-5 h-5`} />}
                      {!isConnected && <Link2Off className={`w-5 h-5`} />}
                      {isConnected ? (
                        <>
                          {/* <DeviceIcon.[device.type] /> */}
                          <span className=' text-black font-semibold'>
                            {device.name}
                          </span>
                        </>
                      ) : (
                        <span>연결 없음</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </section>
      </div>

      {/* 4번째 섹션 */}
      <div
        className={clsx(
          'bg-white rounded-lg',
          'grid grid-rows-[auto_1fr]  min-h-0'
        )}
      >
        <header className='space-y-1 p-4 '>
          <h2 className='text-lg font-bold flex space-x-2 items-center'>
            <Cable />
            <span>장비 상세정보</span>
          </h2>
          <h3 className='text-base font-bold flex space-x-2 items-center'>
            {!findDevice.id ? (
              <div>장비를 선택해 주세요</div>
            ) : (
              <>
                {findDevice.Type}
                <div className='space-y-2'>{findDevice.name}</div>
              </>
            )}
          </h3>
        </header>
        <section className={clsx('px-4 pb-4', 'overflow-y-auto space-y-2')}>
          {findDevice.id ? (
            <dl className={clsx('grid grid-cols-[80px_1fr] gap-y-2')}>
              <dt>IP</dt>
              <dd className='text-gray-500'>
                {deviceDetails[findDevice.id].ip}
              </dd>
              <dt>MAC</dt>
              <dd className='text-gray-500'>
                {deviceDetails[findDevice.id].mac}
              </dd>
              <dt>상태</dt>
              <dd className='text-gray-500'>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${deviceDetails[findDevice.id].status === '활성' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                >
                  {deviceDetails[findDevice.id].status}
                </span>
              </dd>
              <dt>위치</dt>
              <dd className='text-gray-500'>{`본관 > ${selectedDevice > 10 ? 2 : 1}층 > ${selectedDevice > 10 ? '2-1반' : '1-1반'}`}</dd>
              <dt>설치업체 </dt>
              <dd className='text-gray-500'>AA 솔류션</dd>
              <dt>설치시기 </dt>
              <dd className='text-gray-500'>
                {dayjs('2023-10-10').format('YYYY-MM-DD')}
              </dd>
              <dt>점검시기 </dt>
              <dd className='text-gray-500'>
                {dayjs('2025-10-10').format('YYYY-MM-DD')}
              </dd>
            </dl>
          ) : null}
        </section>
      </div>
    </main>
  );
};
