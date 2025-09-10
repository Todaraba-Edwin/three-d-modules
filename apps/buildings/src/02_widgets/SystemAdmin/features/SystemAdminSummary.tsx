import clsx from 'clsx';
import { Bot, Database, Router, Users } from 'lucide-react';
import { type ReactNode } from 'react';

const Card = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot='card'
      className={clsx('flex flex-col gap-6 rounded-xl border', className)}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot='card-content'
      className={clsx('px-6 [&:last-child]:pb-6', className)}
      {...props}
    />
  );
};

export const SystemAdminSummary = (): ReactNode => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-6'>
      <Card className='bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-blue-600 font-medium'>총 사용자</p>
              <p className='text-2xl font-bold text-blue-900'>{0}</p>
            </div>
            <Users className='w-8 h-8 text-blue-600' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-r from-green-50 to-green-100 border-green-200'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-green-600 font-medium'>등록 제조사</p>
              <p className='text-2xl font-bold text-green-900'>{0}</p>
            </div>
            <Database className='w-8 h-8 text-green-600' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-purple-600 font-medium'>스위치 모델</p>
              <p className='text-2xl font-bold text-purple-900'>{0}</p>
            </div>
            <Router className='w-8 h-8 text-purple-600' />
          </div>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-orange-600 font-medium'>장비 모델</p>
              <p className='text-2xl font-bold text-orange-900'>{0}</p>
            </div>
            <Bot className='w-8 h-8 text-orange-600' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
