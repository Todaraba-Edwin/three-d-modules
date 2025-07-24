import { utilsGetDegreeFromMeter } from 'src/features/Cesium/04_utils';
import { describe, expect, it } from 'vitest';

describe('utilsGetDegreeFromMeter', () => {
  it('위도 기준으로 거리(111.32m)를 degree(1°)로 변환', () => {
    const result = utilsGetDegreeFromMeter({ type: 'lat', meter: 111.320 });
    expect(result).toBeCloseTo(0.001, 3); // 1 degree ≈ 111.32km
  });

  it('경도 기준으로 거리(m)를 degree로 변환 (위도 0°)', () => {
    const result = utilsGetDegreeFromMeter({
      type: 'lon',
      meter: 111320,
      lat: 0,
    });
    expect(result).toBe(1); // cos(0) = 1
  });

  it('경도 기준, 고위도일 경우 degree 값 증가 (위도 60°)', () => {
    const result = utilsGetDegreeFromMeter({
      type: 'lon',
      meter: 111320,
      lat: 60,
    });
    const expected = 1 / Math.cos((60 * Math.PI) / 180);
    expect(result).toBeCloseTo(expected, 0);
  });
});
