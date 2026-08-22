import { describe, it, expect } from 'vitest';
import { calculateBazi } from '../src/services/bazi.service';
import { getLongitude } from '../src/utils/cityLongitude';

describe('城市经度查询', () => {
  it('城市精确命中（含市后缀容错）', () => {
    expect(getLongitude('乌鲁木齐')).toBeCloseTo(87.62, 1);
    expect(getLongitude('北京市')).toBeCloseTo(116.41, 1);
    expect(getLongitude('北京')).toBeCloseTo(116.41, 1);
  });

  it('城市未命中退回省份兜底', () => {
    expect(getLongitude('不存在的地名', 'xj')).toBeCloseTo(87.62, 1);
  });

  it('无城市无省份返回 null', () => {
    expect(getLongitude()).toBeNull();
    expect(getLongitude(undefined, undefined)).toBeNull();
  });
});

describe('八字真太阳时校正', () => {
  // 2026-08-22 12 点（午时 index 6）
  const y = 2026, m = 8, d = 22, hour = 6;

  it('乌鲁木齐（东经 87.6°）真太阳时早约 2 小时，午时→巳时', () => {
    const r = calculateBazi(y, m, d, hour, 'male', '乌鲁木齐');
    expect(r.trueSolar).toBeTruthy();
    expect(r.trueSolar!.changed).toBe(true);
    expect(r.trueSolar!.originalHour).toBe(6);
    expect(r.trueSolar!.correctedHour).toBe(5);
    // 巳时地支
    expect(r.hourPillar.zhi).toBe('巳');
    // summary 追加时柱说明
    expect(r.summary).toContain('真太阳时校正');
    expect(r.summary).toContain('午时 调整为 巳时');
  });

  it('北京（东经 116.4°）偏移小，时辰仍为午时', () => {
    const r = calculateBazi(y, m, d, hour, 'male', '北京');
    expect(r.trueSolar).toBeTruthy();
    expect(r.trueSolar!.changed).toBe(false);
    expect(r.hourPillar.zhi).toBe('午');
    // 未变时不在 summary 追加说明
    expect(r.summary).not.toContain('时柱说明');
  });

  it('未提供出生地则不校正', () => {
    const r = calculateBazi(y, m, d, hour, 'male');
    expect(r.trueSolar).toBeUndefined();
    expect(r.hourPillar.zhi).toBe('午');
  });

  it('仅提供省份时用省会经度兜底', () => {
    const r = calculateBazi(y, m, d, hour, 'male', undefined, 'xj');
    expect(r.trueSolar).toBeTruthy();
    expect(r.trueSolar!.longitude).toBeCloseTo(87.62, 1);
    expect(r.trueSolar!.changed).toBe(true);
  });

  it('时辰索引边界不越界（子时/亥时）', () => {
    for (const h of [0, 1, 5, 10, 11]) {
      const r = calculateBazi(y, m, d, h, 'male', '乌鲁木齐');
      expect(r.trueSolar!.correctedHour).toBeGreaterThanOrEqual(0);
      expect(r.trueSolar!.correctedHour).toBeLessThan(12);
    }
  });
});
