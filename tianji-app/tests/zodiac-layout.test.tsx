import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import ZodiacLayout from '../src/pages/result/layouts/ZodiacLayout';

// 后端星座数据真实形状：love/career/wealth/health 为 { score, description } 对象
const backendData = {
  sign: {
    name: '双子座',
    nameEn: 'Gemini',
    symbol: '♊',
    dateRange: '5月21日-6月21日',
    element: '风',
    startDate: '05-21',
    endDate: '06-21',
  },
  overallScore: 79,
  love: { score: 56, description: '贵人星入命。' },
  career: { score: 93, description: '注意细节。' },
  wealth: { score: 69, description: '正财稳定。' },
  health: { score: 96, description: '适合运动。' },
  luckyColor: '粉色',
  luckyNumber: 4,
  advice: '保持积极心态。',
};

describe('ZodiacLayout 五维评分（回归：后端 {score} 对象形态）', () => {
  afterEach(cleanup);

  it('love/career/wealth/health 对象正确取 score，无 0 分条', () => {
    render(<ZodiacLayout data={backendData} system="zodiac" />);
    const text = document.body.textContent || '';

    expect(text).not.toContain('[object Object]');
    expect(text).toContain('双子座');
    expect(text).toContain('风象星座');
    expect(text).toContain('56分');
    expect(text).toContain('93分');
    expect(text).toContain('69分');
    expect(text).toContain('96分');
    expect(text).toContain('79分');
    expect(text).not.toContain('0分');
  });

  it('纯数字形态（旧数据）仍兼容', () => {
    render(
      <ZodiacLayout
        data={{
          sign: '狮子座',
          overallScore: 88,
          loveScore: 72,
          careerScore: 61,
          wealthScore: 80,
          healthScore: 90,
        }}
        system="zodiac"
      />,
    );
    const text = document.body.textContent || '';

    expect(text).toContain('狮子座');
    expect(text).toContain('72分');
    expect(text).toContain('61分');
    expect(text).toContain('80分');
    expect(text).toContain('90分');
    expect(text).toContain('88分');
  });
});
