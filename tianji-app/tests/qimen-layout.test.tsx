import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import QimenLayout from '../src/pages/result/layouts/QimenLayout';

/** 与后端 calculateQimen(2026-10-31 12:00) 真实返回一致 */
const backendData = {
  time: '2026年10月31日 12时',
  fourPillars: { year: '丙午', month: '戊戌', day: '戊寅', hour: '戊午' },
  solarTerm: '霜降',
  dun: '阴遁',
  yuan: '下元',
  juShu: '阴遁2局',
  ju: 2,
  xunHead: '甲寅',
  hiddenStem: '癸',
  voidBranches: ['子', '丑'],
  leaders: { star: '天心', door: '开门', originalPalace: 6, starPalace: 2, doorPalace: 2 },
  horse: { branch: '申', palace: 2 },
  palaces: [
    { number: 1, trigram: '坎', direction: '正北', element: '水', earthStem: '己', heavenStems: ['乙'], stars: ['天冲'], door: '伤门', deity: '玄武', isVoid: true, isHorse: false },
    { number: 2, trigram: '坤', direction: '西南', element: '土', earthStem: '戊', hostedStem: '丁', heavenStems: ['癸'], stars: ['天心'], door: '开门', deity: '值符', isVoid: false, isHorse: true },
    { number: 3, trigram: '震', direction: '正东', element: '木', earthStem: '乙', heavenStems: ['庚'], stars: ['天英'], door: '景门', deity: '六合', isVoid: false, isHorse: false },
    { number: 4, trigram: '巽', direction: '东南', element: '木', earthStem: '丙', heavenStems: ['戊', '丁'], stars: ['天芮', '天禽'], door: '死门', deity: '太阴', isVoid: false, isHorse: false },
    { number: 5, trigram: '中', direction: '中宫', element: '土', earthStem: '丁', heavenStems: [], stars: [], door: '', deity: '', isVoid: false, isHorse: false },
    { number: 6, trigram: '乾', direction: '西北', element: '金', earthStem: '癸', heavenStems: ['辛'], stars: ['天任'], door: '生门', deity: '九地', isVoid: false, isHorse: false },
    { number: 7, trigram: '兑', direction: '正西', element: '金', earthStem: '壬', heavenStems: ['己'], stars: ['天蓬'], door: '休门', deity: '九天', isVoid: false, isHorse: false },
    { number: 8, trigram: '艮', direction: '东北', element: '土', earthStem: '辛', heavenStems: ['丙'], stars: ['天辅'], door: '杜门', deity: '白虎', isVoid: true, isHorse: false },
    { number: 9, trigram: '离', direction: '正南', element: '火', earthStem: '庚', heavenStems: ['壬'], stars: ['天柱'], door: '惊门', deity: '腾蛇', isVoid: false, isHorse: false },
  ],
};

describe('奇门遁甲九宫盘渲染', () => {
  afterEach(cleanup);

  it('展示局数、节气、四柱、旬空、值符值使', () => {
    render(<QimenLayout data={backendData} system="qimen" />);

    expect(screen.getByText('阴遁2局')).toBeInTheDocument();
    expect(screen.getByText(/霜降 · 下元 · 时家奇门/)).toBeInTheDocument();
    expect(screen.getByText(/四柱 丙午 戊戌 戊寅 戊午/)).toBeInTheDocument();
    expect(screen.getByText(/旬首 甲寅（遁癸）/)).toBeInTheDocument();
    expect(screen.getByText('旬空 子丑')).toBeInTheDocument();
    expect(screen.getByText(/值符 天心 · 值使 开门/)).toBeInTheDocument();
  });

  it('九宫每宫展示八神/九星/天地盘干/八门', () => {
    render(<QimenLayout data={backendData} system="qimen" />);

    for (const deity of ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天']) {
      expect(screen.getByText(deity)).toBeInTheDocument();
    }
    for (const door of ['开门', '休门', '生门', '伤门', '杜门', '景门', '死门', '惊门']) {
      expect(screen.getByText(door)).toBeInTheDocument();
    }
    expect(screen.getByText('天芮 天禽')).toBeInTheDocument();
  });

  it('标记旬空与马星', () => {
    render(<QimenLayout data={backendData} system="qimen" />);
    expect(screen.getAllByText('空')).toHaveLength(2);
    expect(screen.getAllByText('马')).toHaveLength(1);
    expect(screen.getByText(/马星：申（2宫）/)).toBeInTheDocument();
  });

  it('无 [object Object]', () => {
    render(<QimenLayout data={backendData} system="qimen" />);
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
