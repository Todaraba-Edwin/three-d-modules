import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const ButtonLogin = (): ReactNode => {
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
            // force: true, // Optional, set to true to force login even if already logged in
          }),
        })
          .then(response => response.json())
          .then(() => {
            navigate('/');
          });
      }}
      children='로그인 하기'
    />
  );
};
