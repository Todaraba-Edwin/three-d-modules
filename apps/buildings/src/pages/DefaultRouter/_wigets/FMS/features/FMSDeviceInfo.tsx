import { Network } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { deviceDetails } from '../../NMS/_shared/const';
import { FMSDeviceInfoLeftSection } from './FMSDeviceInfo/FMSDeviceInfoLeftSection';
import { FMSDeviceInfoRightSection } from './FMSDeviceInfo/FMSDeviceInfoRightSection';

const allDevices = Object.values(deviceDetails).map((device, index) => ({
  ...device,
  id: Object.keys(deviceDetails)[index],
}));

export type FmsDeviceForm = {
  searchTerm: string;
  deviceType: { value: string; label: string } | null;
};

export const FMSDeviceInfo = (): ReactNode => {
  const { watch, control } = useForm<FmsDeviceForm>({
    defaultValues: { searchTerm: '', deviceType: null },
  });

  const [selectedDevice, setSelectedDevice] = useState<any>(allDevices[0]);

  const searchTerm = watch('searchTerm');
  const deviceType = watch('deviceType');

  const filteredDevices = useMemo(() => {
    return allDevices.filter(device => {
      // const typeMatch = !deviceType?.value || device.type === deviceType.value ;
      const typeMatch = false;
      const termMatch =
        !searchTerm ||
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.mac.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && termMatch;
    });
  }, [searchTerm, deviceType]);

  return (
    <div className='bg-white p-4 rounded-lg h-full grid grid-rows-[auto_1fr] gap-4'>
      <header>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Network />
          장비 상세 정보
        </h2>
      </header>
      <main className='grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-4 min-h-0'>
        <FMSDeviceInfoLeftSection
          control={control}
          filteredDevices={filteredDevices}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
        />
        <FMSDeviceInfoRightSection />
      </main>
    </div>
  );
};
