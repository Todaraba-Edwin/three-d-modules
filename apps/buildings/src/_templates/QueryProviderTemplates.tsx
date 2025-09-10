import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren, ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient();

export const QueryProviderTemplates = ({
  children,
}: PropsWithChildren): ReactNode => {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
