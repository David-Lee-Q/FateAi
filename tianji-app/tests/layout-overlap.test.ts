import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve(__dirname, '../src/pages');

/** 读取所有结果页源码 */
function resultPages(): Array<{ file: string; src: string }> {
  return fs
    .readdirSync(pagesDir)
    .filter((f) => f.endsWith('ResultPage.tsx'))
    .map((f) => ({ file: f, src: fs.readFileSync(path.join(pagesDir, f), 'utf8') }));
}

describe('结果页布局：吸顶头不遮挡全局导航', () => {
  it('所有吸顶头都用 top: var(--navbar-height) 且层级 z-40（低于导航 z-50）', () => {
    const offenders: string[] = [];
    for (const { file, src } of resultPages()) {
      const headerMatch = src.match(/<header[^>]*sticky[^>]*>/g) ?? [];
      for (const tag of headerMatch) {
        const hasOffset = tag.includes("top: 'var(--navbar-height)'");
        const belowNavbar = tag.includes('z-40') && !tag.includes('z-50');
        if (!hasOffset || !belowNavbar) offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('吸顶头不再使用半透明背景或 backdrop 模糊', () => {
    const offenders: string[] = [];
    for (const { file, src } of resultPages()) {
      const headerMatch = src.match(/<header[^>]*sticky[^>]*>/g) ?? [];
      for (const tag of headerMatch) {
        if (/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.\d+/.test(tag)) offenders.push(file);
        if (/backdropFilter|backdrop-blur/.test(tag)) offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('底部固定工具栏带 result-toolbar 标记（供页脚避让）', () => {
    for (const { file, src } of resultPages()) {
      if (!src.includes('fixed bottom-0')) continue;
      expect(src, file).toContain('result-toolbar');
    }
  });
});
