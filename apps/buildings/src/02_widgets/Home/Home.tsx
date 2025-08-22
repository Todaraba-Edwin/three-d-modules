import { useEffect, type ReactNode } from 'react';

export const Home = (): ReactNode => {
  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8080';
    fetch(apiUrl);

    fetch(`${apiUrl}/api/auth/login`, {
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
