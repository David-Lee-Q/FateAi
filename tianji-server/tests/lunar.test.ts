import { describe, it, expect } from 'vitest';
import { getYearPillar, getDayPillar, getMonthPillar, getShiChen } from '../src/utils/lunar';

describe('干支基础算法（与 lunar-typescript 交叉验证的已知值）', () => {
  it('年柱：立春前后分界', () => {
    expect(getYearPillar(2026, 1, 1).gan + getYearPillar(2026, 1, 1).zhi).toBe('乙巳');
    expect(getYearPillar(2026, 12, 31).gan + getYearPillar(2026, 12, 31).zhi).toBe('丙午');
    expect(getYearPillar(2026, 8, 22).gan + getYearPillar(2026, 8, 22).zhi).toBe('丙午');
  });

  it('日柱：2026-08-22 为戊辰日', () => {
    const p = getDayPillar(2026, 8, 22);
    expect(p.gan + p.zhi).toBe('戊辰');
  });

  it('月柱：2026-08-22（立秋后）为丙申月', () => {
    const p = getMonthPillar(2026, 8, 22, 6);
    expect(p.gan + p.zhi).toBe('丙申');
  });

  it('getShiChen：23/0 点归子时，其余每两小时一段', () => {
    expect(getShiChen(23)).toBe(0);
    expect(getShiChen(0)).toBe(0);
    expect(getShiChen(1)).toBe(1);
    expect(getShiChen(12)).toBe(6);
    expect(getShiChen(22)).toBe(11);
  });
});
