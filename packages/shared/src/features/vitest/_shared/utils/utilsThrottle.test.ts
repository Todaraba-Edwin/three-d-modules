import { utilsThrottle } from '@_shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// setup: lodash의 throttle 내부 타이머를 컨트롤

/*
  * 단위 : beforeEach, afterEach는 각 테스트 케이스(it)마다 실행
    ** beforeEach : 각 테스트가 실행되기 전에 매번 실행되는 함수
    - vi.useFakeTimers()
    - vi.clearAllTimers() : vi.useFakeTimers() 직후 선언하여, 이전 테스트 타이머 제거 
  
    ** afterEach : 각 테스트가 끝난 후에 매번 실행되는 함수 
    - 가짜 타이머 환경을 종료하고 실제 타이머 환경으로 되돌림
    - 다른 테스트나 코드가 실제 타이머를 사용하지 못할 수 있음으로

    ** toHaveBeenCalledTimes()
    - mock 함수(스파이 함수)가 예상한 횟수만큼 호출됐는지 확인

    ** vi.advanceTimersByTime()
    - 가짜 타이머 환경에서 시간을 인위적으로 이동, 실제시간을 기다리지 않음

    ** vi.fn()
    - vitest 에서 제공하는 스파이(Spy) 혹은 모킹(Mock) 함수
    - 실제 구현 없이 함수가 몇번 호출되었는지, 어떤 인자로 호출되는지 등을 테스트 
    - const mockCallback = vi.fn();
    - mockCallback('hello');  
    - expect(mockCallback).toHaveBeenCalledTimes(1);  
    - expect(mockCallback).toHaveBeenCalledWith('hello'); 
*/

describe('utilsThrottle 유틸함수 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('(1) Trailing:true - 지연시간 중에 발생 된 이벤트는 지연시간 후에 한 번 더 실행됨', () => {
    const callback = vi.fn();
    const throttled = utilsThrottle('test-key', callback, 1000, true);

    throttled(); // 호출
    expect(callback).toHaveBeenCalledTimes(1);

    // 시간 경과 없이 추가 호출 → throttle로 무시됨
    throttled();
    expect(callback).toHaveBeenCalledTimes(1);

    // 1초 뒤 trailing 실행될 수 있도록
    vi.advanceTimersByTime(1000);

    // trailing true면 실행
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('(2) Trailing:false - 지연시간 중에 발생 된 이벤트는 그대로 소멸', () => {
    const callback = vi.fn();
    const throttled = utilsThrottle('no-trailing', callback, 1000, false);

    throttled(); // leading
    throttled(); // 무시됨
    vi.advanceTimersByTime(1000);

    // trailing false이므로 1회만 호출
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('(3) 동일한 key로 생성된 인스턴스인 경우, callback이 달라도 먼저 실행된 동작만 수행됨', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const throttled1 = utilsThrottle('same-key', callback1, 1000, false);
    const throttled2 = utilsThrottle('same-key', callback2, 1000, false);

    throttled1();
    throttled2();

    // 두 callback이 달라도 key가 같으면 동일 인스턴스
    expect(throttled1).toBe(throttled2);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(0);
  });
});
