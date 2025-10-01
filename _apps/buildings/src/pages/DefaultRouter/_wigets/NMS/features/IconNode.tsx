import { Handle, type NodeProps } from '@xyflow/react';
import { HardDrive, Router, Server } from 'lucide-react';
import { memo } from 'react';

const iconMap = {
  server: Server,
  router: Router,
  device: HardDrive,
};

const StyledNode = {
  ['core']: ({ label, Icon }: { label: string; Icon: LucideIconType }) => (
    <div
      style={{
        border: '1px solid #333',
        borderRadius: 5,
      }}
      className='flex flex-col'
    >
      <figure
        className='bg-blue-500 p-2'
        children={<Icon className='text-white w-5 h-5' />}
      />
      <p className='px-2 flex items-center'>{label}</p>
    </div>
  ),
  ['access']: ({ label, Icon }: { label: string; Icon: LucideIconType }) => (
    <div
      style={{
        border: '1px solid #333',
        borderRadius: 5,
      }}
      className='flex flex-col'
    >
      <figure
        className='bg-violet-400 p-2'
        children={<Icon className='text-white w-5 h-5' />}
      />
      <p className='px-2 flex items-center'>{label}</p>
    </div>
  ),
  ['device']: ({ label, Icon }: { label: string; Icon: LucideIconType }) => (
    <div
      style={{
        border: '1px solid #333',
        borderRadius: 5,
      }}
      className='flex flex-col'
    >
      <figure
        className='bg-green-400 p-2'
        children={<Icon className='text-white w-5 h-5' />}
      />
      <p className='px-2 flex items-center'>{label}</p>
    </div>
  ),
};

const IconNode = ({
  data,
  sourcePosition,
  targetPosition,
}: NodeProps & {
  data: {
    label: string;
    type: 'core' | 'access' | 'device';
  };
}) => {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || HardDrive;
  return (
    <>
      {targetPosition && <Handle type='target' position={targetPosition} />}
      {StyledNode[data.type]({ label: data.label, Icon })}
      {sourcePosition && <Handle type='source' position={sourcePosition} />}
    </>
  );
};

export default memo(IconNode);
