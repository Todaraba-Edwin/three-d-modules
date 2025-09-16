import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode } from 'react';

type Props = PropsWithChildren & {
  tabTitle: string;
  tabDesc: string;
};

type SystemAdminTabLayoutProps = Props & {
  tabBodyChildren: ReactNode[];
};

const TabLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-white h-full rounded-xl p-4 grid grid-rows-[auto_1fr] space-y-4'>
      {children}
    </div>
  );
};

const TabHeader = ({ tabTitle, tabDesc }: Props) => {
  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900' children={tabTitle} />
      <p className='text-gray-600' children={tabDesc} />
    </div>
  );
};

const TabBody = ({ tabBodyChildren }: { tabBodyChildren: ReactNode[] }) => {
  return (
    <div
      className={clsx(
        'grid min-h-0',
        'grid-cols-1 grid-rows-[auto_1fr] gap-y-4',
        'xl:grid-cols-2 xl:grid-rows-1 gap-x-4'
      )}
    >
      {...tabBodyChildren}
    </div>
  );
};

export const SystemAdminTabLayout = ({
  tabTitle,
  tabDesc,
  tabBodyChildren,
}: SystemAdminTabLayoutProps): ReactNode => {
  return (
    <TabLayout>
      <TabHeader tabTitle={tabTitle} tabDesc={tabDesc} />
      <TabBody tabBodyChildren={tabBodyChildren} />
    </TabLayout>
  );
};
