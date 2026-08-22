import { describe, it, expect } from 'vitest';
import { getCurrentMonthIndex, getCurrentMonthRange } from '../src/data/zodiac2026';

describe('生肖"本月"农历月份推算（2026 丙午年历表）', () => {
  const cases: [string, number][] = [
    ['2026-02-16', 0], // 年初钳位到正月
    ['2026-02-17', 0], // 正月初一
    ['2026-08-12', 5], // 六月末
    ['2026-08-13', 6], // 七月初一（边界）
    ['2026-08-22', 6], // 七月（7 月内）
    ['2026-09-10', 6], // 七月末（边界）
    ['2026-09-11', 7], // 八月初一（边界）
    ['2026-12-31', 10], // 冬月
    ['2027-01-08', 11], // 腊月初一
    ['2027-02-05', 11], // 腊月廿九（除夕）
    ['2027-06-15', 11], // 年末钳位到腊月
  ];

  for (const [iso, expectIndex] of cases) {
    it(`${iso} → 第 ${expectIndex} 个月支索引`, () => {
      expect(getCurrentMonthIndex(new Date(iso + 'T12:00:00'))).toBe(expectIndex);
    });
  }

  it('getCurrentMonthRange 返回 YYYY.MM.DD - YYYY.MM.DD 格式', () => {
    const range = getCurrentMonthRange(new Date('2026-08-22T12:00:00'));
    expect(range).toMatch(/^\d{4}\.\d{2}\.\d{2} - \d{4}\.\d{2}\.\d{2}$/);
    expect(range).toBe('2026.08.13 - 2026.09.10');
  });
});
