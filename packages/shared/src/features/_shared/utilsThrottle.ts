import _ from 'lodash';
import type { utilsThrottleReturn } from './types';

const ThrottleMap = new Map<string, utilsThrottleReturn>();

export const utilsThrottle = (
  key: string,
  callback: () => void,
  delay: number,
  IsTrailing: boolean
): utilsThrottleReturn => {
  if (!ThrottleMap.has(key)) {
    const throttled = _.throttle(callback, delay, {
      leading: true,
      trailing: IsTrailing,
    });
    ThrottleMap.set(key, throttled);
  }

  return ThrottleMap.get(key)!;
};
