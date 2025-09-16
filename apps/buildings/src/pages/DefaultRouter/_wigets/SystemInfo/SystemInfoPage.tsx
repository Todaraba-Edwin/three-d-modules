import { Server, ShieldCheck } from 'lucide-react';
import { type ReactNode } from 'react';
import { SystemInfoHeader } from './features/SystemInfoHeader';

const licenseData = [
  {
    title: '자원 통합의 투영도 지역기반 관리 v1.0 Server',
    items: [
      { label: '증서번호', value: 'PZ250611-001' },
      { label: '수량', value: '1' },
      { label: 'License NO.', value: 'PCN250611-PRIZM-S-110' },
    ],
  },
  {
    title: '자원 통합의 투영도 지역기반 관리 v1.0 Node',
    items: [
      { label: '증서번호', value: 'PZ250611-001' },
      { label: '수량', value: '19' },
      { label: 'License NO.', value: 'PCN250611-PRIZM-F-110' },
    ],
  },
];

const systemData = [
  { label: '제조사', value: 'Lenovo' },
  { label: '모델명', value: 'Power Server TR630 V2' },
  { label: 'CPU', value: 'Intel(R) Xeon(R) Silver 4309Y CPU @ 2.80GHz' },
  { label: 'RAM', value: '64GB' },
  { label: '저장공간', value: '2.2TB' },
  { label: 'OS', value: 'RockyLinux 9.5' },
  { label: 'WEB', value: 'Apache 2.4.41' },
  { label: 'WAS', value: 'Tomcat 9.0.63' },
  { label: 'Database', value: 'PostgreSQL 12' },
  { label: 'Machine Type', value: '7Z71CTO1WW' },
  { label: 'Serial Number', value: 'J902E49V' },
];

const InfoCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
}) => (
  <div className='bg-white p-6 rounded-lg border-2'>
    <h3 className='text-lg font-semibold flex items-center gap-2 mb-4'>
      <Icon className='w-5 h-5 text-gray-600' />
      {title}
    </h3>
    <div className='space-y-4'>{children}</div>
  </div>
);

const InfoList = ({ items }: { items: { label: string; value: string }[] }) => (
  <dl className='space-y-2 text-sm'>
    {items.map(({ label, value }) => (
      <div key={label} className='grid grid-cols-[120px_1fr] gap-2'>
        <dt className='font-medium text-gray-500'>{label}</dt>
        <dd className='text-gray-800'>{value}</dd>
      </div>
    ))}
  </dl>
);

export const SystemInfoPage = (): ReactNode => {
  return (
    <div className='w-full h-full space-y-4'>
      <SystemInfoHeader />
      <main className='space-y-6'>
        <InfoCard title='라이선스 정보' icon={ShieldCheck}>
          <div className='space-y-6'>
            {licenseData.map(license => (
              <div key={license.title}>
                <h4 className='font-semibold mb-2'>{license.title}</h4>
                <InfoList items={license.items} />
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title='시스템 정보' icon={Server}>
          <InfoList items={systemData} />
        </InfoCard>
      </main>
    </div>
  );
};
