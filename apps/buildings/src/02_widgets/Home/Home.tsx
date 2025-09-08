import { type ReactNode } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';

export const Home = (): ReactNode => {
  const [cookies] = useCookies(['username']);
  const { state } = useLocation();
  const username = state?.username || cookies.username;

  return <div children={<header>HOME - {username}</header>} />;
};
