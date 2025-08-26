import { type PropsWithChildren, type ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
export const CookiesTemplates = ({
  children,
}: PropsWithChildren): ReactNode => {
  return <CookiesProvider children={children} />;
};
