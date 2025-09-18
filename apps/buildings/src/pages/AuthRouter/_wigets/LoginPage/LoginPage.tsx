import clsx from 'clsx';
import { AlertTriangle, Building2, Eye, EyeOff, Package } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../_common/components/Button';
import { MANUFACTURE_INFO, QUICKSTART_LOGIN_LIST } from '../../_shared';
import { Input } from './features/Input';
import {
  CardContent,
  CardDesc,
  CardHeader,
  CardIconBox,
  CardLayout,
  CardLBody,
  CardSpan,
  CardTitle,
} from './features/LoginCard';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const LoginPage = (): ReactNode => {
  const [isFocusLogin, setIsFocusLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    processLogin(username, password);
  };

  const onForceSubmit = (e: FormEvent) => {
    e.preventDefault();
    processLogin(username, password, true);
  };

  const processLogin = (user: string, pass: string, force?: boolean) => {
    setIsLoading(true);
    fetch(`${VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 자동 전송
      body: JSON.stringify({
        username: user,
        password: pass,
        force: force,
      }),
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        return data; // 200일 때
      })
      .then(data => {
        setIsLoading(false);
        setIsFocusLogin(false);
        setErrMessage('');
        navigate('/', { state: { username: data.username } });
      })
      .catch(
        (errData: { message: string; error: string; statusCode: number }) => {
          const { statusCode } = errData;
          switch (statusCode) {
            case 409:
              setIsFocusLogin(true);
              break;
            default:
              setErrMessage(errData.message);
              break;
          }

          setIsLoading(false);
        }
      );
  };

  const handleQuickLogin = (account: (typeof QUICKSTART_LOGIN_LIST)[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    processLogin(account.username, account.password);
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex items-center justify-center p-4 relative',
        isMobile
          ? ''
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      )}
    >
      <CardLayout>
        <CardLBody>
          <CardHeader>
            <CardIconBox>
              <Building2 className='w-8 h-8 text-white' />
            </CardIconBox>
            <CardTitle children={MANUFACTURE_INFO.PROJECT_NAME} />
            <CardDesc>
              <CardSpan
                spanType='text-sm'
                className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                children={MANUFACTURE_INFO.PROJECT_DESC}
              />
              <CardSpan
                spanType='text-xs-pre-line'
                children={MANUFACTURE_INFO.PROJECT_FULL_NAME}
              />
            </CardDesc>
          </CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={onSubmit}>
              <div className=' space-y-2'>
                <label
                  children='사용자명'
                  className='text-sm font-medium text-gray-700'
                />
              </div>
              <div className='relative'>
                <Input
                  id='username'
                  autoComplete='username'
                  type='text'
                  placeholder='사용자명을 입력하세요'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className='h-11 bg-white/70'
                />
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  비밀번호
                </label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='비밀번호를 입력하세요'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='h-11 bg-white/70 pr-11'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
              {errMessage && <div>{errMessage}</div>}
              <Button
                type='submit'
                className='w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>
            {/* 보안 정보 */}
            <div className='space-y-3 pt-4 border-t border-gray-200'>
              <p className='text-sm text-gray-600 text-center'>빠른 접속</p>
              <div className='space-y-2'>
                {QUICKSTART_LOGIN_LIST.map(account => (
                  <Button
                    key={account.username}
                    variant='outline'
                    onClick={() => handleQuickLogin(account)}
                    className={`w-full h-auto p-3 ${account.color} border hover:shadow-md transition-all duration-200`}
                    disabled={isLoading}
                  >
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex items-center gap-3'>
                        <account.icon className='w-5 h-5' />
                        <div className='text-left'>
                          <p className='font-medium'>{account.role}</p>
                          <p className='text-xs opacity-75'>
                            {account.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className='text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg'>
              <Package className='w-4 h-4 inline mr-1' />
              {MANUFACTURE_INFO.PROGRAM_PROVIDER}
            </div>
          </CardContent>
        </CardLBody>
        {isFocusLogin && (
          <div className='fixed top-0 left-0 w-full h-full'>
            <div className='w-full h-full bg-gray-600 opacity-40' />
            <div className='absolute w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4'>
              <div className=' bg-white p-4  rounded-2xl'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <AlertTriangle className='w-5 h-5 text-amber-500' />
                    로그인 이력 감지
                  </div>

                  <div className='space-y-3'>
                    <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                      <p className='text-sm font-medium text-amber-800'>
                        현재 다른 위치에서 이 계정으로 접속 중입니다. 계속하시면
                        기존 접속은 종료됩니다.
                      </p>
                    </div>

                    <div className='flex flex-col gap-2 '>
                      <Button
                        onClick={onForceSubmit}
                        className='flex-1 bg-amber-500 hover:bg-amber-600  text-white'
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                            현재 PC에서 로그인 중...
                          </>
                        ) : (
                          '현재 PC에서 로그인'
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setIsFocusLogin(false)}
                        className='flex-1'
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardLayout>
    </div>
  );
};
