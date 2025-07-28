import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const usePathSegments = (): {
  isRoot: boolean;
  layout: string;
  currentSegments: string;
} => {
  const { pathname } = useLocation();

  const segments = useMemo(() => pathname.split('/'), [pathname]);

  const layout = segments[1] ?? '';
  const currentSegments = segments[2] ?? '';
  const isRoot = !layout && !currentSegments;

  return { isRoot, layout, currentSegments };
};
