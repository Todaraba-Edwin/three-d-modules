import clsx from 'clsx';
import * as React from 'react';

type ProgressProps = {
  className?: string;
  value?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    const progressValue = Math.max(0, Math.min(100, value || 0));

    return (
      <div
        ref={ref}
        className={clsx(
          'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 h-[10px]',
          className
        )}
        {...props}
      >
        <div
          className='h-full transition-all rounded-xl bg-gradient-to-r from-green-400 to-blue-500'
          style={{ width: `${progressValue}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
