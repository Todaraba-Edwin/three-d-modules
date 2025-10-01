// src/hooks/useCounter.ts
import { useState } from 'react';

export const useTestingHooks = (
  initialValue = 0
): {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
} => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};
