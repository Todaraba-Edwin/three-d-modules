import clsx from 'clsx';
import * as React from 'react';

export const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>): React.ReactNode => {
  return (
    <input
      type={type}
      data-slot='input'
      className={clsx(
        // Focus outline
        'focus:outline-none',
        'focus-visible:outline-none ',
        // File input
        'file:text-foreground',
        // Placeholder / selection
        'placeholder:text-[#a1a1aa]',
        'selection:bg-primary selection:text-primary-foreground',
        // Background and layout
        'dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border border-transparent outline-none px-3 py-1 text-base',
        // Transition and disabled state
        'transition-[color,box-shadow,border] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // File input specifics
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        // Responsive text size
        'md:text-sm',
        // Invalid state
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
};
