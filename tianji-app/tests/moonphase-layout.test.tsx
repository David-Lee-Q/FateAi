import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import MoonphaseLayout from '../src/pages/result/layouts/MoonphaseLayout';

const backendData = {
  moonPhase: '下弦月',
  moonEmoji: '🌗',
  illumination: '64%',
  illuminationPercent: 63.8,
  moonAge: 20.84,
  phaseAngle: 254,
  waxing: false,
  newMoonAt: '2026-10-10 15:51',
  nextNewMoonAt: '2026-11-09 04:02',
  birthDate: '2026-10-31',
  traits: ['善于反思', '内心成熟', '懂得放下'],
  emotionalPattern: '处于渐亏阶段：情感内敛、善于沉淀。',
  advice: '适合收尾复盘、释放负担。',
};

describe('月相布局渲染（真实天文数据）', () => {
  afterEach(cleanup);

  it('展示月相、月龄、真实照明度、渐亏与朔日', () => {
    render(<MoonphaseLayout data={backendData} system="moonphase" />);

    expect(screen.getByText(/下弦月 · 能量解读/)).toBeInTheDocument();
    expect(screen.getByText(/月龄：20.84天/)).toBeInTheDocument();
    expect(screen.getByText(/照明度：64%/)).toBeInTheDocument();
    expect(screen.getByText('渐亏')).toBeInTheDocument();
    expect(screen.getByText(/本月朔：2026-10-10 15:51/)).toBeInTheDocument();
  });

  it('照明度不会因百分号字符串变成 NaN', () => {
    render(<MoonphaseLayout data={backendData} system="moonphase" />);
    const text = document.body.textContent || '';
    expect(text).not.toContain('NaN');
    expect(text).not.toContain('[object Object]');
  });
});
