import { useEffect, type ReactNode } from 'react';

export const Home = (): ReactNode => {
  useEffect(() => {
    fetch('http://127.0.0.1:8080');
  }, []);
  return <div children='Home' />;
};
