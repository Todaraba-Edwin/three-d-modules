import { utilsVworldUrl } from 'src/features/Cesium/04_utils';
import { vWorldUrl } from 'src/features/Cesium/05_shared/cesiumConst';
import { describe, expect, it } from 'vitest';

const apiKey = 'API_KEY';
describe('utilsVworldUrl 유틸함수 테스트', () => {
  it('(1) apiKey 누락에 대한 테스트', () => {
    const type = 'Base';
    const result = utilsVworldUrl({
      type,
      apiKey: '',
    });
    expect(result).toBe('');
  });
  it('(2) type - Base 인 경우에 대한 테스트', () => {
    const type = 'Base';
    const result = utilsVworldUrl({
      type,
      apiKey,
    });
    expect(result).toBe(`${vWorldUrl}/${apiKey}/${type}/{z}/{y}/{x}.png`);
  });
  it('(2) type - Satellite 인 경우에 대한 테스트', () => {
    const type = 'Satellite';
    const result = utilsVworldUrl({
      type,
      apiKey,
    });
    expect(result).toBe(`${vWorldUrl}/${apiKey}/${type}/{z}/{y}/{x}.jpeg`);
  });
});
