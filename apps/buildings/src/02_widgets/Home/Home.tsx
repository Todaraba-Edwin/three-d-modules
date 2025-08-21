import { useEffect, type ReactNode } from 'react';

export const Home = (): ReactNode => {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
    fetch(apiUrl);
  }, []);
  return <div children='Home' />;
};
