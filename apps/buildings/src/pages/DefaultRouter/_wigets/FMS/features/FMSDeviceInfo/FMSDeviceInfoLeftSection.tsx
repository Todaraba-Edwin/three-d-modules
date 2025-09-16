import { Input } from '@/_common/components/Input';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';
import { Controller, type Control } from 'react-hook-form';
import Select from 'react-select';
import { type FmsDeviceForm } from '../FMSDeviceInfo';

const deviceTypeOptions = [
  { value: '', label: '전체' },
  { value: 'CCTV', label: 'CCTV' },
  { value: 'AP', label: 'AP' },
  { value: 'PC', label: 'PC' },
];

export const FMSDeviceInfoLeftSection = ({
  control,
  filteredDevices,
  selectedDevice,
  setSelectedDevice,
}: {
  control: Control<FmsDeviceForm>;
  filteredDevices: any[];
  selectedDevice: any;
  setSelectedDevice: (device: any) => void;
}): ReactNode => {
  return (
    <div className='border-2 rounded-lg p-4 space-y-4 grid grid-rows-[auto_1fr] min-h-0 max-xl:h-[400px]'>
      <div className='space-y-2'>
        <Controller
          name='deviceType'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={deviceTypeOptions}
              placeholder='장비 선택'
              isClearable
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          name='searchTerm'
          control={control}
          render={({ field }) => (
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <Input
                {...field}
                placeholder='장비 이름, IP, MAC 검색'
                className='pl-10'
              />
            </div>
          )}
        />
      </div>
      <div className='overflow-y-auto space-y-2 pr-2 pt-2'>
        {filteredDevices.map((device: any) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device)}
            className={clsx(
              'w-full text-left p-3 rounded-lg border-2',
              selectedDevice?.id === device.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:bg-gray-100'
            )}
          >
            <p className='font-semibold'>{device.name}</p>
            <p className='text-sm text-gray-500'>{device.ip}</p>
            <p className='text-xs text-gray-400'>{device.mac}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
