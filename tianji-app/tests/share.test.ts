import { describe, it, expect } from 'vitest';
import { buildCoreLine, buildShareText } from '@/utils/share';
import type { FortuneResult } from '@/types';

function makeResult(overrides: Partial<FortuneResult>): FortuneResult {
  return {
    id: 'test-id',
    system: 'bazi',
    createdAt: '2026-08-22T08:00:00.000Z',
    status: 'completed',
    interpretation: '### 解读\n\n这是解读正文。',
    data: {},
    ...overrides,
  };
}

describe('buildCoreLine', () => {
  it('八字：四柱拼接', () => {
    const r = makeResult({
      system: 'bazi',
      data: { yearPillar: '乙亥', monthPillar: '壬午', dayPillar: '壬戌', hourPillar: '甲午' },
    });
    expect(buildCoreLine(r)).toBe('乙亥  壬午  壬戌  甲午');
  });

  it('八字：缺柱时回退 summary', () => {
    const r = makeResult({ system: 'bazi', data: { summary: '丙午年 丙申月 戊辰日' } });
    expect(buildCoreLine(r)).toBe('丙午年 丙申月 戊辰日');
  });

  it('塔罗：抽牌名 + 逆位标注', () => {
    const r = makeResult({
      system: 'tarot',
      data: {
        question: '事业如何',
        cards: [
          { id: '1', name: '力量', isReversed: 'false' },
          { id: '15', name: '恶魔', isReversed: 'True' },
        ],
      },
    });
    expect(buildCoreLine(r)).toBe('抽牌：力量、恶魔(逆)');
  });

  it('塔罗：无牌时回退问题', () => {
    const r = makeResult({ system: 'tarot', data: { question: '近期感情如何？' } });
    expect(buildCoreLine(r)).toBe('近期感情如何？');
  });

  it('默认体系：取 summary', () => {
    const r = makeResult({ system: 'almanac', data: { summary: '七月初十 戊辰日' } });
    expect(buildCoreLine(r)).toBe('七月初十 戊辰日');
  });

  it('默认体系：无 summary 时取解读纯文本', () => {
    const r = makeResult({ system: 'rune', interpretation: '符文显示近期有贵人相助。' });
    expect(buildCoreLine(r)).toBe('符文显示近期有贵人相助。');
  });
});

describe('buildShareText', () => {
  it('包含体系名、核心行、链接与时间', () => {
    const r = makeResult({
      system: 'bazi',
      data: { yearPillar: '乙亥', monthPillar: '壬午', dayPillar: '壬戌', hourPillar: '甲午' },
      interpretation: '您的八字命盘已排定。',
    });
    const text = buildShareText(r, 'http://localhost:3000/result/test-id');
    expect(text).toContain('【天机 AI 占卜 · 八字命理】');
    expect(text).toContain('乙亥  壬午  壬戌  甲午');
    expect(text).toContain('您的八字命盘已排定。');
    expect(text).toContain('http://localhost:3000/result/test-id');
    expect(text).toContain('2026-08-22');
  });

  it('未知体系使用兜底名称', () => {
    const r = makeResult({ system: 'unknown' as FortuneResult['system'], data: {} });
    const text = buildShareText(r, 'http://x/result/1');
    expect(text).toContain('占卜记录');
  });
});
