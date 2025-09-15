import { Network } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { accessSwitches, coreSwitch } from '../_shared/const';
import { NMSSwitchInfoLeftSection } from './NMSSwitchInfo/NMSSwitchInfoLeftsection';
import { NMSSwitchInfoRightSection } from './NMSSwitchInfo/NMSSwitchInfoRightSection';

const coreSwitchInfo = { ...coreSwitch, type: 'Core', name: 'MDF-코어 스위치' };

// 모든 스위치를 하나의 배열로 합칩니다.
const allSwitches = [...accessSwitches.map(sw => ({ ...sw, type: 'Access' }))];

export const NMSSwitchInfo = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line
  const [selectedSwitch, setSelectedSwitch] = useState<any>(coreSwitchInfo);

  const filteredSwitches = useMemo(() => {
    if (!searchTerm) return allSwitches;
    return allSwitches.filter(
      // eslint-disable-next-line
      (sw: any) =>
        sw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sw.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sw.ip && sw.ip.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className='bg-white p-4 rounded-lg h-full grid grid-rows-[auto_1fr] gap-4'>
      <header>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Network />
          스위치 관리
        </h2>
      </header>
      <main className='grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-4 min-h-0'>
        {/* Left: Switch List */}
        <NMSSwitchInfoLeftSection
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          selectedSwitch={selectedSwitch}
          coreSwitchInfo={coreSwitchInfo}
          setSelectedSwitch={setSelectedSwitch}
          filteredSwitches={filteredSwitches}
        />

        {/* Right: Switch Details */}
        <NMSSwitchInfoRightSection selectedSwitch={selectedSwitch} />
      </main>
    </div>
  );
};
