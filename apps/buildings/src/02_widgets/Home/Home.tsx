import { useEffect, type ReactNode } from 'react';
import { ButtonLogout } from '../Auth/ui/ButtonLogout';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Home = (): ReactNode => {
  useEffect(() => {
    fetch(VITE_API_URL);
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
