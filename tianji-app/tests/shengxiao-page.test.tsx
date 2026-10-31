import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import React from 'react';
import ShengxiaoPage from '../src/pages/ShengxiaoPage';
import { getCurrentMonthIndex, getCurrentMonthRange, MONTH_META } from '../src/data/zodiac2026';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('生肖页"本月"卡片（DOM 渲染）', () => {
  it('展示当前农历月区间与月名', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(React.createElement(ShengxiaoPage));
    await sleep(200);

    // 切换到"本月运势"tab
    const tab = Array.from(container.querySelectorAll('button, [role="tab"], div, span'))
      .find((el) => el.textContent?.trim() === '本月运势');
    expect(tab).toBeTruthy();
    (tab as HTMLElement).click();
    await sleep(300);

    const text = container.textContent || '';
    // 与页面同源推算当前农历月，避免写死日期导致跨月失效
    const monthIndex = getCurrentMonthIndex();
    const meta = MONTH_META[monthIndex];
    expect(text).toContain(getCurrentMonthRange());
    expect(text).toContain(`农历${meta.lunar}`);
    expect(text).toContain(`${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][meta.branch]}月`);
    // 旧的硬编码"本月"文案不应出现
    expect(text).not.toContain('2026.08.07 - 2026.09.07');

    root.unmount();
    container.remove();
  });
});
