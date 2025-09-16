import { Input } from '@/_common/components/Input';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

// eslint-disable-next-line
export const NMSSwitchInfoLeftSection = ({
  setSearchTerm,
  searchTerm,
  selectedSwitch,
  coreSwitchInfo,
  setSelectedSwitch,
  filteredSwitches,
  // eslint-disable-next-line
}: any): ReactNode => {
  return (
    <div className='border-2 rounded-lg p-4 space-y-4 grid grid-rows-[auto_auto_1fr] min-h-0 max-xl:h-[400px]'>
      <button
        onClick={() => setSelectedSwitch(coreSwitchInfo)}
        className={clsx(
          'w-full text-left p-3 rounded-lg border-2',
          // eslint-disable-next-line
          selectedSwitch?.id === coreSwitchInfo.id
            ? 'border-blue-500 bg-blue-50'
            : 'hover:bg-gray-100'
        )}
      >
        <p className='font-semibold'>{coreSwitchInfo.name}</p>
        <p className='text-sm text-gray-500'>{coreSwitchInfo.model}</p>
        {coreSwitchInfo.ip && (
          <p className='text-xs text-gray-400'>{coreSwitchInfo.ip}</p>
        )}
      </button>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          placeholder='스위치 이름, 모델, IP 검색'
          className='pl-10'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='overflow-y-auto space-y-2 pr-2'>
        {/* eslint-disable-next-line */}
        {filteredSwitches.map((sw: any) => (
          <button
            key={sw.id}
            onClick={() => setSelectedSwitch(sw)}
            className={clsx(
              'w-full text-left p-3 rounded-lg border-2',
              selectedSwitch?.id === sw.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:bg-gray-100'
            )}
          >
            <p className='font-semibold'>{sw.name}</p>
            <p className='text-sm text-gray-500'>{sw.model}</p>
            {sw.ip && <p className='text-xs text-gray-400'>{sw.ip}</p>}
          </button>
        ))}
      </div>
    </div>
  );
};
