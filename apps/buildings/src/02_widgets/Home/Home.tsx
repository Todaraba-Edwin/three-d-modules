import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonLogout } from '../Auth/ui/ButtonLogout';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Home = (): ReactNode => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('VITE_API_URL:', VITE_API_URL);

    fetch(VITE_API_URL);

    fetch(`${VITE_API_URL}/api/auth/validate-session`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log('data : ', data);
        const { statusCode } = data;
        if (statusCode === 401) {
          navigate('/login');
        }
      });
  }, []);
  return (
    <div
      children={
        <>
          <header>HOME</header>
          <ButtonLogout />
        </>
      }
    />
  );
};
