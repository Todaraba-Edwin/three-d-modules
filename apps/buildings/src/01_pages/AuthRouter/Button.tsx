import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Button = (): ReactNode => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        fetch(`${VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 자동 전송
          body: JSON.stringify({
            username: 'admin',
            password: '1234',
            force: true,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Login response:', data);
            navigate('/');
          });
      }}
      children='새로은 세션 로그인하기'
    />
  );
};
