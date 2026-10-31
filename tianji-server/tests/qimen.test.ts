import { describe, it, expect } from 'vitest';
import { calculateQimen } from '../src/services/qimen.service';
import type { QimenPalaceData } from '../src/types';

/** 由 qimen-rs 0.2.1 生成的基准盘（时家奇门·拆补·转盘，中五寄坤二） */
interface Golden {
  time: [number, number, number, number];
  term: string;
  dun: string;
  yuan: string;
  ju: number;
  xunHead: string;
  hiddenStem: string;
  voidBranches: string;
  star: string;
  door: string;
  origPalace: number;
  starPalace: number;
  doorPalace: number;
  palaces: Array<[number, string, string, string, string, string]>;
}

const GOLDENS: Golden[] = [
  {
    time: [2026, 10, 31, 12], term: '霜降', dun: '阴遁', yuan: '下元', ju: 2,
    xunHead: '甲寅', hiddenStem: '癸', voidBranches: '子丑',
    star: '天心', door: '开门', origPalace: 6, starPalace: 2, doorPalace: 2,
    palaces: [
      [1, '己', '乙', '天冲', '伤门', '玄武'],
      [2, '戊', '癸', '天心', '开门', '值符'],
      [3, '乙', '庚', '天英', '景门', '六合'],
      [4, '丙', '戊丁', '天芮天禽', '死门', '太阴'],
      [5, '丁', '', '', '', ''],
      [6, '癸', '辛', '天任', '生门', '九地'],
      [7, '壬', '己', '天蓬', '休门', '九天'],
      [8, '辛', '丙', '天辅', '杜门', '白虎'],
      [9, '庚', '壬', '天柱', '惊门', '腾蛇'],
    ],
  },
  {
    time: [2026, 1, 15, 9], term: '小寒', dun: '阳遁', yuan: '下元', ju: 5,
    xunHead: '甲子', hiddenStem: '戊', voidBranches: '戌亥',
    star: '天禽', door: '死门', origPalace: 5, starPalace: 6, doorPalace: 1,
    palaces: [
      [1, '癸', '庚', '天柱', '死门', '腾蛇'],
      [2, '丁', '乙', '天辅', '伤门', '九地'],
      [3, '丙', '癸', '天蓬', '开门', '六合'],
      [4, '乙', '辛', '天任', '休门', '白虎'],
      [5, '戊', '', '', '', ''],
      [6, '己', '丁戊', '天芮天禽', '景门', '值符'],
      [7, '庚', '壬', '天英', '杜门', '九天'],
      [8, '辛', '己', '天心', '惊门', '太阴'],
      [9, '壬', '丙', '天冲', '生门', '玄武'],
    ],
  },
  {
    time: [2026, 6, 21, 15], term: '芒种', dun: '阳遁', yuan: '上元', ju: 6,
    xunHead: '甲午', hiddenStem: '辛', voidBranches: '辰巳',
    star: '天英', door: '景门', origPalace: 9, starPalace: 4, doorPalace: 2,
    palaces: [
      [1, '壬', '庚', '天任', '开门', '玄武'],
      [2, '癸', '己', '天柱', '景门', '太阴'],
      [3, '丁', '丙', '天辅', '生门', '九天'],
      [4, '丙', '辛', '天英', '伤门', '值符'],
      [5, '乙', '', '', '', ''],
      [6, '戊', '壬', '天蓬', '惊门', '白虎'],
      [7, '己', '戊', '天心', '死门', '六合'],
      [8, '庚', '丁', '天冲', '休门', '九地'],
      [9, '辛', '癸乙', '天芮天禽', '杜门', '腾蛇'],
    ],
  },
  {
    time: [2025, 12, 22, 8], term: '冬至', dun: '阳遁', yuan: '上元', ju: 1,
    xunHead: '甲戌', hiddenStem: '己', voidBranches: '申酉',
    star: '天芮', door: '死门', origPalace: 2, starPalace: 3, doorPalace: 8,
    palaces: [
      [1, '戊', '辛', '天辅', '景门', '九地'],
      [2, '己', '戊', '天蓬', '生门', '六合'],
      [3, '庚', '己壬', '天芮天禽', '惊门', '值符'],
      [4, '辛', '丁', '天柱', '开门', '腾蛇'],
      [5, '壬', '', '', '', ''],
      [6, '癸', '庚', '天冲', '杜门', '玄武'],
      [7, '丁', '丙', '天任', '伤门', '白虎'],
      [8, '丙', '乙', '天英', '死门', '九天'],
      [9, '乙', '癸', '天心', '休门', '太阴'],
    ],
  },
];

const byNumber = (ps: QimenPalaceData[], n: number) => ps.find((p) => p.number === n)!;

describe('奇门遁甲排盘（对拍 qimen-rs 基准盘）', () => {
  for (const g of GOLDENS) {
    const [y, m, d, h] = g.time;
    it(`${y}-${m}-${d} ${h}时：节气/遁/元/局/旬/值符值使`, () => {
      const r = calculateQimen(new Date(y, m - 1, d, h)).details;
      expect(r.solarTerm).toBe(g.term);
      expect(r.dun).toBe(g.dun);
      expect(r.yuan).toBe(g.yuan);
      expect(r.ju).toBe(g.ju);
      expect(r.xunHead).toBe(g.xunHead);
      expect(r.hiddenStem).toBe(g.hiddenStem);
      expect(r.voidBranches?.join('')).toBe(g.voidBranches);
      expect(r.leaders?.star).toBe(g.star);
      expect(r.leaders?.door).toBe(g.door);
      expect(r.leaders?.originalPalace).toBe(g.origPalace);
      expect(r.leaders?.starPalace).toBe(g.starPalace);
      expect(r.leaders?.doorPalace).toBe(g.doorPalace);
    });

    it(`${y}-${m}-${d} ${h}时：九宫地盘/天盘/星/门/神`, () => {
      const r = calculateQimen(new Date(y, m - 1, d, h)).details;
      for (const [num, earth, heaven, stars, door, deity] of g.palaces) {
        const p = byNumber(r.palaces!, num);
        expect(`${num}宫地盘`).toBe(`${num}宫地盘`);
        expect([num, p.earthStem]).toEqual([num, earth]);
        expect([num, p.heavenStems.join('')]).toEqual([num, heaven]);
        expect([num, p.stars.join('')]).toEqual([num, stars]);
        expect([num, p.door]).toEqual([num, door]);
        expect([num, p.deity]).toEqual([num, deity]);
      }
    });
  }

  it('四柱与节气一致', () => {
    const r = calculateQimen(new Date(2026, 9, 31, 12)).details;
    expect(r.fourPillars?.year).toBe('丙午');
    expect(r.fourPillars?.month).toBe('戊戌');
    expect(r.fourPillars?.day).toBe('戊寅');
    expect(r.fourPillars?.hour).toBe('戊午');
    expect(r.solarTerm).toBe('霜降');
  });

  it('同一时刻结果确定', () => {
    const a = calculateQimen(new Date(2026, 9, 31, 12)).details;
    const b = calculateQimen(new Date(2026, 9, 31, 12)).details;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
