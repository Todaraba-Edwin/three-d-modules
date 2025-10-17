import clsx from 'clsx';
import type { ReactNode } from 'react';

type ButtonProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'none';
  size?: 'default' | 'sm' | 'lg' | 'icon';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps): ReactNode => {
  // variant 별 클래스
  const variantClasses: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border',
    none: '',
  };

  // size 별 클래스
  const sizeClasses: Record<string, string> = {
    default: 'h-9 px-4 py-2 has-[>svg]:px-3',
    sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
    lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
    icon: 'size-9 rounded-md',
  };

  return (
    <button
      className={clsx(
        'h-11',
        'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};
