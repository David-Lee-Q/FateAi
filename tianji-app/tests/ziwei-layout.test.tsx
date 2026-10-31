import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ZiweiLayout from '../src/pages/result/layouts/ZiweiLayout';

// 与后端 calculateZiwei(1995,6,15,12,'male') 的真实返回结构一致
const backendData = {
  birthInfo: '1995年6月15日 12时（男命）｜农历一九九五年五月十八｜四柱乙亥 壬午 丁丑 丙午',
  mingGong: {
    palace: '命宫',
    star: '武曲(旺) 天府(庙)',
    mainStar: '武曲(旺) 天府(庙)',
    heavenlyStem: '戊',
    earthlyBranch: '子',
  },
  twelvePalaces: [
    { palace: '命宫', mainStar: '武曲(旺) 天府(庙)', stars: '文昌(得)', heavenlyStem: '戊', earthlyBranch: '子', decadal: { range: [26, 35], heavenlyStem: '丙', earthlyBranch: '戌' }, isBodyPalace: false },
    { palace: '夫妻宫', mainStar: '太阳(陷)', stars: '右弼', heavenlyStem: '乙', earthlyBranch: '酉', decadal: { range: [16, 25], heavenlyStem: '乙', earthlyBranch: '酉' }, isBodyPalace: true },
  ],
  siHua: { 化禄: '天机', 化权: '天梁', 化科: '紫微', 化忌: '太阴' },
  wuXingJu: '火六局',
  soul: '贪狼',
  body: '天机',
  horoscope: {
    decadal: { heavenlyStem: '丙', earthlyBranch: '戌', range: [26, 35] },
    yearly: { heavenlyStem: '丙', earthlyBranch: '午', mutagen: ['天同', '天机', '文昌', '廉贞'] },
  },
};

describe('紫微布局渲染（真实排盘数据）', () => {
  afterEach(cleanup);

  it('展示命宫主星、五行局、命主身主、生年四化、大限流年', () => {
    render(<ZiweiLayout data={backendData} system="ziwei" />);

    expect(screen.getAllByText(/武曲\(旺\) 天府\(庙\)/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('五行局 火六局')).toBeInTheDocument();
    expect(screen.getByText('命主 贪狼')).toBeInTheDocument();
    expect(screen.getByText('身主 天机')).toBeInTheDocument();

    // 生年四化
    for (const star of ['天机', '天梁', '紫微', '太阴']) {
      expect(screen.getAllByText(star).length).toBeGreaterThanOrEqual(1);
    }

    // 大限流年
    expect(screen.getByText(/大限 丙戌 26-35岁/)).toBeInTheDocument();
    expect(screen.getByText(/流年 丙午/)).toBeInTheDocument();
    expect(screen.getByText(/流年四化 天同\/天机\/文昌\/廉贞/)).toBeInTheDocument();

    // 宫位干支与大限岁数
    expect(screen.getByText('夫妻宫')).toBeInTheDocument();
    expect(screen.getByText('身')).toBeInTheDocument();
    expect(screen.getByText('16-25岁')).toBeInTheDocument();
  });

  it('无新字段时保持旧数据兼容（不崩溃）', () => {
    render(
      <ZiweiLayout
        data={{
          mingGong: { palace: '命宫', star: '紫微', mainStar: '紫微' },
          twelvePalaces: [{ palace: '命宫', mainStar: '紫微', subStars: [] }],
        }}
      />,
    );
    expect(screen.getAllByText('紫微').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
