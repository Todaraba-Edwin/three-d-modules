import { useEffect, type ReactNode } from 'react';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const Home = (): ReactNode => {
  useEffect(() => {
    fetch(VITE_API_URL);

    fetch(`${VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '1234',
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Login response:', data);
      });
  }, []);
  return <div children='Home' />;
};
