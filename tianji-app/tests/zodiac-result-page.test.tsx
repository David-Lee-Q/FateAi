import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ZodiacResultPage from '../src/pages/ZodiacResultPage';
import { getFortuneResult } from '@/services/api';

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

function renderResultPage(id = 'zodiac-test-1') {
  return render(
    <MemoryRouter initialEntries={[`/result/zodiac/${id}`]}>
      <Routes>
        <Route path="/result/zodiac/:id" element={<ZodiacResultPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('星座结果页 sign 对象渲染（回归：[object Object]）', () => {
  afterEach(cleanup);

  it('sign 为对象时渲染星座中文名，无 [object Object]', async () => {
    renderResultPage();

    // 星座名在标题等处出现，findAllByText 避免多匹配抛异常
    const signMatches = await screen.findAllByText('双子座', {}, { timeout: 3000 });
    expect(signMatches.length).toBeGreaterThanOrEqual(1);
    // 三张行星卡各含"在双子座"
    expect(screen.getAllByText(/在双子座/)).toHaveLength(3);
    // signMap 命中（回退前会显示狮子座的 7月23日 - 8月22日）
    expect(screen.getByText(/5月21日 - 6月21日/)).toBeInTheDocument();
    expect(screen.getByText(/风象星座/)).toBeInTheDocument();
    expect(screen.queryByText(/7月23日 - 8月22日/)).not.toBeInTheDocument();
    // 幸运信息与建议
    expect(screen.getByText('幸运色：粉色')).toBeInTheDocument();
    expect(screen.getByText('幸运数字：4')).toBeInTheDocument();
    expect(screen.getByText('保持积极心态，抓住机遇。')).toBeInTheDocument();
    // 无 [object Object]
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });

  it('data.sign 缺失时回退 input.sign（对象），同样取 name', async () => {
    // 覆盖本次调用的返回值：sign 只在 input 里且为对象
    vi.mocked(getFortuneResult).mockResolvedValueOnce({
      data: {
        id: 'zodiac-test-2',
        system: 'zodiac',
        createdAt: '2026-08-22T08:00:00.000Z',
        status: 'completed',
        input: { sign: { name: '天蝎座', nameEn: 'Scorpio', symbol: '♏' } },
        data: { overallScore: 70, luckyColor: '黑色', luckyNumber: 7 },
      },
    });

    renderResultPage('zodiac-test-2');

    const signMatches = await screen.findAllByText('天蝎座', {}, { timeout: 3000 });
    expect(signMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/在天蝎座/)).toHaveLength(3);
    expect(screen.getByText(/10月24日 - 11月22日/)).toBeInTheDocument();
    expect(screen.getByText(/水象星座/)).toBeInTheDocument();
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
