import { Building2 } from 'lucide-react';
import { type ReactNode } from 'react';
import {
  CardDesc,
  CardHeader,
  CardIconBox,
  CardLayout,
  CardLBody,
  CardSpan,
  CardTitle,
} from './ui/LoginCard';

export const Login = (): ReactNode => {
  return (
    <CardLayout className='w-full max-w-md relative z-10'>
      <CardLBody className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-xl p-4'>
        <CardHeader className='text-center pb-2'>
          <CardIconBox className='mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg'>
            <Building2 className='w-8 h-8 text-white' />
          </CardIconBox>
          <CardTitle
            className='text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
            children='PRIZM'
          />
          <CardDesc className='text-center'>
            <CardSpan
              className='block text-sm font-medium text-gray-700 mb-1'
              children='3D 모델 기반 건물관리 시스템'
            />
            <CardSpan
              className='block text-xs text-gray-500 whitespace-pre-line'
              children={`Projection planes for resource integration\nin zone-based management`}
            />
          </CardDesc>
        </CardHeader>
      </CardLBody>
    </CardLayout>
  );
};

{
  /* 
    <ButtonLogin />
    <br />
    <Button />
    <br />
    <ButtonLogout />   
  */
}
