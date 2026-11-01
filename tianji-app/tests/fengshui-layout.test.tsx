import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import FengshuiLayout from '../src/pages/result/layouts/FengshuiLayout';

const backendData = {
  direction: '正南',
  buildingType: '住宅',
  wuXing: '火',
  favorableAreas: ['正东', '正北'],
  unfavorableAreas: ['正南', '正西', '东北', '西南'],
  layoutAdvice: ['客厅宜宽敞明亮', '2026 年五黄临正南，此方忌动土'],
  year: 2026,
  yearStarCenter: { star: 1, name: '一白贪狼', meaning: '人缘、桃花、仕途' },
  baZhai: { mingGua: '坎卦（1数）', group: '东四命', goodDirections: ['东南', '正东', '正南', '正北'], badDirections: ['西南', '东北', '西北', '正西'] },
  flyingStars: [
    { palace: '中', direction: '中宫', star: 1, name: '一白贪狼', nature: '吉', meaning: '人缘' },
    { palace: '乾', direction: '西北', star: 2, name: '二黑巨门', nature: '凶', meaning: '病符' },
    { palace: '兑', direction: '正西', star: 3, name: '三碧禄存', nature: '凶', meaning: '是非' },
    { palace: '艮', direction: '东北', star: 4, name: '四绿文曲', nature: '中', meaning: '文昌' },
    { palace: '离', direction: '正南', star: 5, name: '五黄廉贞', nature: '凶', meaning: '灾煞' },
    { palace: '坎', direction: '正北', star: 6, name: '六白武曲', nature: '吉', meaning: '偏财' },
    { palace: '坤', direction: '西南', star: 7, name: '七赤破军', nature: '凶', meaning: '破财' },
    { palace: '震', direction: '正东', star: 8, name: '八白左辅', nature: '吉', meaning: '正财' },
    { palace: '巽', direction: '东南', star: 9, name: '九紫右弼', nature: '吉', meaning: '喜庆' },
  ],
};

describe('风水布局渲染（八宅 + 年飞星）', () => {
  afterEach(cleanup);

  it('展示坐向、入中星与命卦', () => {
    render(<FengshuiLayout data={backendData} system="fengshui" />);
    expect(screen.getByText(/住宅坐正南 · 2026 年九宫飞星/)).toBeInTheDocument();
    expect(screen.getByText('一白贪狼入中')).toBeInTheDocument();
    expect(screen.getByText(/坎卦（1数）/)).toBeInTheDocument();
    expect(screen.getAllByText(/东四命/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/寓意：人缘、桃花、仕途/)).toBeInTheDocument();
  });

  it('九宫按飞星数据渲染（上南下北）', () => {
    render(<FengshuiLayout data={backendData} system="fengshui" />);
    // 东南9 正南5 西南7 正东8 中宫1 正西3 东北4 正北6 西北2
    for (const dir of ['东南', '正南', '西南', '正东', '中宫', '正西', '东北', '正北', '西北']) {
      expect(screen.getByText(dir)).toBeInTheDocument();
    }
    expect(screen.getByText('九宫飞星（上南下北）')).toBeInTheDocument();
  });

  it('展示吉方、煞方与建议', () => {
    render(<FengshuiLayout data={backendData} system="fengshui" />);
    expect(screen.getByText('吉方')).toBeInTheDocument();
    expect(screen.getByText('煞方（宜静忌动土）')).toBeInTheDocument();
    expect(screen.getByText(/2026 年五黄临正南，此方忌动土/)).toBeInTheDocument();
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
