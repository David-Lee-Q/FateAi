import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import DaliurenLayout from '../src/pages/result/layouts/DaliurenLayout';

const backendData = {
  time: {
    year: 2026, month: 10, day: 31, hour: 12, shichen: '午时',
    yuejiang: '卯', fourPillars: '丙午 戊戌 戊寅 戊午', zhongqi: '霜降', yuejiangName: '太冲',
  },
  ke: {
    ke1: '寅', ke2: '亥', ke3: '亥', ke4: '申',
    detail: ['干阳：巳上寅', '干阴：寅上亥', '支阳：寅上亥', '支阴：亥上申'],
  },
  chuan: {
    chuan1: '戊寅', chuan2: '乙亥', chuan3: '甲申',
    chuan1Desc: '官鬼·腾蛇', chuan2Desc: '妻财·太阴', chuan3Desc: '子孙·白虎·旬空',
    detail: [
      { zhi: '寅', gan: '戊', liuqin: '官鬼', jiang: '腾蛇', kong: false },
      { zhi: '亥', gan: '乙', liuqin: '妻财', jiang: '太阴', kong: false },
      { zhi: '申', gan: '甲', liuqin: '子孙', jiang: '白虎', kong: true },
    ],
    zongmen: '遥克课',
  },
  shen: { shen1: '腾蛇', shen2: '太阴', shen3: '太阴', shen4: '白虎', guiZhi: '丑', guiEarth: '辰', direction: '顺行' },
};

describe('大六壬布局渲染', () => {
  afterEach(cleanup);

  it('展示课体、月将、四柱、贵人顺逆', () => {
    render(<DaliurenLayout data={backendData} system="daliuren" />);
    expect(screen.getByText('遥克课')).toBeInTheDocument();
    expect(screen.getByText(/月将加时 · 午时 · 丙午 戊戌 戊寅 戊午/)).toBeInTheDocument();
    expect(screen.getByText(/月将 卯（太冲）/)).toBeInTheDocument();
    expect(screen.getByText('贵人 丑（临地盘辰）')).toBeInTheDocument();
    expect(screen.getByText('天将顺行')).toBeInTheDocument();
  });

  it('展示四课与三传（含遁干/六亲/天将/旬空）', () => {
    render(<DaliurenLayout data={backendData} system="daliuren" />);
    expect(screen.getByText('干阳')).toBeInTheDocument();
    expect(screen.getByText('巳上寅')).toBeInTheDocument();
    expect(screen.getByText('支阴')).toBeInTheDocument();
    expect(screen.getByText('亥上申')).toBeInTheDocument();
    expect(screen.getByText('戊寅')).toBeInTheDocument();
    expect(screen.getByText('乙亥')).toBeInTheDocument();
    expect(screen.getByText('甲申')).toBeInTheDocument();
    expect(screen.getByText('白虎 · 旬空')).toBeInTheDocument();
  });

  it('无 [object Object]', () => {
    render(<DaliurenLayout data={backendData} system="daliuren" />);
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
