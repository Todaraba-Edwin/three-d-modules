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
        })
          .then(async response => {
            const data = await response.json();
            if (response.ok) {
              return data;
            } else {
              throw data;
            }
          })
          .then(() => {
            navigate('/login');
          })
          .catch(errorDate => {
            console.log(errorDate.message);
            navigate('/login');
          });
      }}
      children='로그아웃'
    />
  );
};
