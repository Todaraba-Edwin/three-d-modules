import clsx from 'clsx';
import { type ReactNode } from 'react';
type Props = React.ComponentProps<'figure'> & {
  isMaxLength?: boolean;
  addStyles?: string | undefined;
};

export const TruncateParagraph = ({
  isMaxLength = false,
  addStyles = undefined,
  ...rest
}: Props): ReactNode => {
  return (
    <figure
      className={clsx({
        'min-w-0 truncate': isMaxLength,
        ...(addStyles && { [addStyles]: true }),
      })}
      {...rest}
    />
  );
};
