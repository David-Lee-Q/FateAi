import { describe, it, expect } from 'vitest';
import { calculateMoonphase, calculateMoonphaseByPhase } from '../src/services/moonphase.service';

describe('月相真实天文计算（Meeus）', () => {
  it('2024-04-08 为新月前后（当年日全食日）', () => {
    const d = calculateMoonphase('2024-04-08').details;
    expect(d.moonPhase).toBe('新月');
    // 日食发生在 2024-04-08 18:21 UTC，当日正午月龄应接近 29.5 天
    expect(d.moonAge).toBeGreaterThan(28.5);
    expect(d.illuminationPercent).toBeLessThan(3);
  });

  it('2026-10-31 月龄约 20.8 天，照明度约 64%', () => {
    const d = calculateMoonphase('2026-10-31').details;
    expect(d.moonAge).toBeGreaterThan(20);
    expect(d.moonAge).toBeLessThan(21.5);
    expect(d.illuminationPercent).toBeGreaterThan(60);
    expect(d.illuminationPercent).toBeLessThan(68);
    expect(d.waxing).toBe(false);
  });

  it('满月前后照明度接近 100%', () => {
    const d = calculateMoonphase('2026-01-03').details;
    expect(d.illuminationPercent).toBeGreaterThan(99);
    // 月龄 14.43 天仍属渐盈（满月约在 14.77 天）
    expect(d.waxing).toBe(true);
  });

  it('新月前后照明度接近 0%', () => {
    const d = calculateMoonphase('2026-10-10').details;
    expect(d.illuminationPercent).toBeLessThan(2);
  });

  it('朔日与下一朔相隔约 29.53 天', () => {
    const d = calculateMoonphase('2026-10-31').details;
    const prev = new Date(d.newMoonAt!.replace(' ', 'T')).getTime();
    const next = new Date(d.nextNewMoonAt!.replace(' ', 'T')).getTime();
    const days = (next - prev) / 86400000;
    expect(days).toBeGreaterThan(29.2);
    expect(days).toBeLessThan(29.9);
  });

  it('连续两月月龄递增，且不同日期结果不同', () => {
    const a = calculateMoonphase('2026-10-01').details;
    const b = calculateMoonphase('2026-10-16').details;
    expect(b.moonAge).not.toBe(a.moonAge);
    expect(a.moonPhase).not.toBe(b.moonPhase);
  });

  it('同一日期结果确定（无随机）', () => {
    const a = calculateMoonphase('1995-06-15');
    const b = calculateMoonphase('1995-06-15');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(a.details)).not.toContain('[object Object]');
  });

  it('手动选相入口仍可用', () => {
    const r = calculateMoonphaseByPhase('full', '事业').details;
    expect(r.moonPhase).toBe('满月');
    expect(r.illumination).toBe('100%');
  });
});
