import { describe, it, expect } from 'vitest';
import { analyzeName } from '../src/services/nametest.service';

const wuge = (s: string, g: string) => analyzeName(s, g, 'male').details;

describe('姓名五格（康熙笔画 + 标准公式）', () => {
  it('常见姓氏康熙笔画正确（张11/刘15/陈16/杨13/黄12）', () => {
    for (const [surname, strokes] of [['张', 11], ['刘', 15], ['陈', 16], ['杨', 13], ['黄', 12], ['王', 4], ['李', 7]]) {
      expect(wuge(surname, '明').surnameStrokes).toBe(strokes);
    }
  });

  it('单姓单名：天格=姓+1，地格=名+1，外格=2', () => {
    const d = wuge('王', '明');
    expect(d.wuGe.tianGe.number).toBe(5);
    expect(d.wuGe.renGe.number).toBe(12);
    expect(d.wuGe.diGe.number).toBe(9);
    expect(d.wuGe.waiGe.number).toBe(2);
    expect(d.wuGe.zongGe.number).toBe(12);
  });

  it('单姓双名：地格=名两字和，外格=名末字+1', () => {
    const d = wuge('李', '嘉欣'); // 李7 嘉14 欣8
    expect(d.wuGe.tianGe.number).toBe(8);
    expect(d.wuGe.renGe.number).toBe(21);
    expect(d.wuGe.diGe.number).toBe(22);
    expect(d.wuGe.waiGe.number).toBe(9);
    expect(d.wuGe.zongGe.number).toBe(29);
  });

  it('复姓单名：天格=姓两字和，外格=姓首字+1', () => {
    const d = wuge('欧阳', '修'); // 欧15 阳17 修10
    expect(d.wuGe.tianGe.number).toBe(32);
    expect(d.wuGe.renGe.number).toBe(27);
    expect(d.wuGe.diGe.number).toBe(11);
    expect(d.wuGe.waiGe.number).toBe(16);
    expect(d.wuGe.zongGe.number).toBe(42);
  });

  it('复姓双名：外格=姓首字+名末字', () => {
    const d = wuge('司马', '相如'); // 司5 马10 相9 如6
    expect(d.wuGe.tianGe.number).toBe(15);
    expect(d.wuGe.renGe.number).toBe(19);
    expect(d.wuGe.diGe.number).toBe(15);
    expect(d.wuGe.waiGe.number).toBe(11);
    expect(d.wuGe.zongGe.number).toBe(30);
  });

  it('三才按数理尾数取五行（1,2木 3,4火 5,6土 7,8金 9,0水）', () => {
    const d = wuge('王', '明'); // 天5土 人12木 地9水
    expect(d.sanCai).toBe('土木水');
  });

  it('未收录字会被标记，不伪造笔画', () => {
    const d = wuge('王', '龘');
    expect(d.unresolvedChars).toContain('龘');
    expect(d.score).toBeLessThanOrEqual(75);
  });

  it('评分在 40-99 之间且输出无 [object Object]', () => {
    for (const [s, g] of [['王', '明'], ['李', '嘉欣'], ['欧阳', '修']]) {
      const r = analyzeName(s, g, 'female');
      expect(r.details.score).toBeGreaterThanOrEqual(40);
      expect(r.details.score).toBeLessThanOrEqual(99);
      expect(JSON.stringify(r)).not.toContain('[object Object]');
    }
  });
});
