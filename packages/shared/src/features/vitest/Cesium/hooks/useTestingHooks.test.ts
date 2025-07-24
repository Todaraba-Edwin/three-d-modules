// src/hooks/useCounter.test.ts
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTestingHooks } from './useTestingHooks';

describe('useTestingHooks', () => {
  it('초기값을 설정하고 증가/감소/리셋이 잘 동작하는지 테스트', () => {
    // renderHook: useTestingHooks 훅을 테스트 환경에서 실행
    const { result } = renderHook(() => useTestingHooks(5));

    // result.current: useCounter 훅의 현재 반환값을 나타냄
    expect(result.current.count).toBe(5);

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(6);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(5);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(5);
  });
});
