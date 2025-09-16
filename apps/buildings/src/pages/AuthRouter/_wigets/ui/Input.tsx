import clsx from 'clsx';
import { type ReactNode } from 'react';

export const Input = ({
  className,
  ...props
}: React.ComponentProps<'input'>): ReactNode => {
  return (
    <input
      className={clsx(
        'placeholder:text-[#717182]',
        'selection:bg-primary selection:text-primary-foreground',
        'border-transparent flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow,border] outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
};
