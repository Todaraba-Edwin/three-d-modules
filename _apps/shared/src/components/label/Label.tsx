import { type ReactNode } from 'react';

type Props = React.ComponentProps<'label'>;

export const Label = (Props: Props): ReactNode => {
  return <label className='text-sm text-primary' {...Props} />;
};
