import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ZodiacResultPage from '../src/pages/ZodiacResultPage';

// 后端星座数据真实形状：sign 为对象（name/nameEn/symbol/dateRange）
vi.mock('@/services/api', () => ({
  getFortuneResult: vi.fn().mockResolvedValue({
    data: {
      id: 'zodiac-test-1',
      system: 'zodiac',
      createdAt: '2026-08-22T08:00:00.000Z',
      status: 'completed',
      input: { birthDate: '1995-06-15' },
      interpretation: '### 解读\n\n正文内容。',
      data: {
        sign: { name: '双子座', nameEn: 'Gemini', symbol: '♊', dateRange: '5月21日-6月21日' },
        overallScore: 79,
        love: { score: 56, description: '异性缘佳。' },
        career: { score: 93, description: '注意细节。' },
        wealth: { score: 69, description: '正财稳定。' },
        health: { score: 96, description: '适合运动。' },
        luckyColor: '粉色',
        luckyNumber: 4,
        advice: '保持积极心态，抓住机遇。',
        aiInterpretation: '### 解读\n\n正文内容。',
      },
    },
  }),
  submitFollowUp: vi.fn().mockResolvedValue({ data: {} }),
}));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('星座结果页 sign 对象渲染（回归：[object Object]）', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('sign 为对象时渲染星座中文名，无 [object Object]', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/result/zodiac/zodiac-test-1'] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/result/zodiac/:id',
            element: React.createElement(ZodiacResultPage),
          }),
        ),
      ),
    );
    await sleep(400);

    const text = container.textContent || '';
    expect(text).not.toContain('[object Object]');
    // 星座名正确渲染（标题 + 行星卡共 4 处）
    expect(text).toContain('双子座');
    expect(text.match(/双子座/g)?.length).toBeGreaterThanOrEqual(4);
    // signMap 命中（回退前会显示狮子座的 7月23日 - 8月22日）
    expect(text).toContain('5月21日 - 6月21日');
    expect(text).toContain('风象星座');
    expect(text).not.toContain('7月23日 - 8月22日');
    // 评分/幸运信息正常
    expect(text).toContain('幸运色：粉色');
    expect(text).toContain('幸运数字：4');
    expect(text).toContain('保持积极心态，抓住机遇。');

    root.unmount();
    container.remove();
  });
});
