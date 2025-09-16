import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { isMobile } from 'react-device-detect';

export const CardLayout = ({
  className,
  ...props
}: React.ComponentProps<'div'>): ReactNode => {
  return (
    <div
      className={clsx(
        'w-full relative z-10',
        isMobile ? 'max-w-md ' : ' max-w-lg',
        className
      )}
      {...props}
    />
  );
};

export const CardLBody = ({
  className,
  ...props
}: React.ComponentProps<'div'>): ReactNode => {
  return (
    <div
      className={clsx(
        'shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-xl p-4',
        className
      )}
      {...props}
    />
  );
};

export const CardHeader = ({
  className,
  ...props
}: React.ComponentProps<'header'>): ReactNode => {
  return <header className={clsx('text-center pb-2', className)} {...props} />;
};

export const CardIconBox = ({
  className,
  ...props
}: React.ComponentProps<'figure'>): ReactNode => {
  return (
    <figure
      className={clsx(
        'mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg',
        className
      )}
      {...props}
    />
  );
};

export const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<'h1'>): ReactNode => {
  return (
    <h1
      className={clsx(
        'text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  );
};

export const CardDesc = ({
  className,
  ...props
}: React.ComponentProps<'p'>): ReactNode => {
  return <p className={clsx('text-center', className)} {...props} />;
};

export const CardSpan = ({
  spanType,
  className,
  ...props
}: React.ComponentProps<'span'> & {
  spanType: 'text-sm' | 'text-xs-pre-line';
}): ReactNode => {
  const styled = {
    ['text-sm']: 'block text-sm font-medium text-gray-700 mb-1',
    ['text-xs-pre-line']:
      'block text-sm font-medium text-gray-700 mb-1  whitespace-pre-line',
  };
  return (
    <span className={clsx(className, styled[spanType] || '')} {...props} />
  );
};

export const CardContent = ({
  className,
  ...props
}: React.ComponentProps<'span'>): ReactNode => {
  return <section className={clsx(className, 'space-y-6')} {...props} />;
};
