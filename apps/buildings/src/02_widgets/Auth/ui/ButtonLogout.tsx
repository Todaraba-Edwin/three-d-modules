import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const ButtonLogout = (): ReactNode => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        fetch(`${VITE_API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 자동 전송
          body: JSON.stringify({
            username: 'admin',
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Logout response:', data);
            navigate('/login');
          });
      }}
      children='로그아웃'
    />
  );
};
