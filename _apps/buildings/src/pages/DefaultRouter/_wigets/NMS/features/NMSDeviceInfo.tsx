import { Network } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { deviceDetails } from '../_shared/const';
import { NMSDeviceInfoLeftSection } from './NMSDeviceInfo/NMSDeviceInfoLeftSection';
import { NMSDeviceInfoRightSection } from './NMSDeviceInfo/NMSDeviceInfoRightSection';

const allDevices = Object.values(deviceDetails).map((device, index) => ({
  ...device,
  id: Object.keys(deviceDetails)[index],
}));

export const NMSDeviceInfo = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<{
    id: string;
    name: string;
    ip: string;
    mac: string;
    status: string;
  }>(allDevices[0]);

  const filteredDevices = useMemo(() => {
    if (!searchTerm) return allDevices;
    return allDevices.filter(
      (device: {
        id: string;
        name: string;
        ip: string;
        mac: string;
        status: string;
      }) =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.mac.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className='bg-white p-4 rounded-lg h-full grid grid-rows-[auto_1fr] gap-4'>
      <header>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Network />
          장비 관리
        </h2>
      </header>
      <main className='grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-4 min-h-0'>
        <NMSDeviceInfoLeftSection
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          filteredDevices={filteredDevices}
        />
        <NMSDeviceInfoRightSection selectedDevice={selectedDevice} />
      </main>
    </div>
  );
};
