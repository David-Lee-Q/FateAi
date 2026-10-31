import { describe, it, expect } from 'vitest';
import { castMeihua } from '../src/services/meihua.service';
import { HEXAGRAM_MEANINGS } from '../src/utils/bagua';

describe('梅花易数真实起卦', () => {
  it('数字 8/8：坤为地，动4爻，互坤为地，变雷地豫', () => {
    const r = castMeihua('number', 8, 8, '测试');
    const d = r.details;

    expect(d.upperGua.name).toBe('坤');
    expect(d.lowerGua.name).toBe('坤');
    expect(d.mainGua.name).toBe('坤为地');
    expect(d.dongYao).toBe(4);
    // 六爻皆阴，互卦仍为坤为地
    expect(d.huGua.name).toBe('坤为地');
    expect(d.bianGua?.name).toBe('雷地豫');
  });

  it('坤为地 四爻动：体用皆坤土，比和为吉', () => {
    const d = castMeihua('number', 8, 8, '测试').details;
    expect(d.tiYong.ti).toContain('坤（土）');
    expect(d.tiYong.yong).toContain('坤（土）');
    expect(d.tiYong.relation).toBe('比和');
    expect(d.tiYong.lucky).toBe('吉');
  });

  it('数字 1/1：乾为天，动2爻，变天火同人，体用比和', () => {
    const d = castMeihua('number', 1, 1, '测试').details;
    expect(d.mainGua.name).toBe('乾为天');
    expect(d.dongYao).toBe(2);
    expect(d.bianGua?.name).toBe('天火同人');
    expect(d.tiYong.ti).toContain('乾（金）');
    expect(d.tiYong.yong).toContain('乾（金）');
    expect(d.tiYong.relation).toBe('比和');
  });

  it('火天大有（上离下乾）四爻动：体乾金、用离火，用克体为凶', () => {
    const d = castMeihua('number', 3, 1, '测试').details;
    expect(d.mainGua.name).toBe('火天大有');
    expect(d.dongYao).toBe(4);
    expect(d.tiYong.ti).toContain('乾（金）');
    expect(d.tiYong.yong).toContain('离（火）');
    expect(d.tiYong.relation).toBe('用克体');
    expect(d.tiYong.lucky).toBe('凶');
  });

  it('互卦取 2/3/4 与 3/4/5 爻', () => {
    // 数字 3/4：上离下震 → 雷火丰(bits=100101)
    const d = castMeihua('number', 3, 4, '测试').details;
    const bits = d.mainGua.bits!;
    expect(d.huGua.bits).toBe(bits.slice(1, 4) + bits.slice(2, 5));
  });

  it('卦名均为标准六十四卦名（无「乾乾」式拼接）', () => {
    for (const [a, b] of [[1, 1], [2, 3], [4, 5], [6, 7], [8, 8], [3, 8], [7, 2]]) {
      const d = castMeihua('number', a, b, '测试').details;
      expect(HEXAGRAM_MEANINGS[d.mainGua.name]).toBeTruthy();
      expect(HEXAGRAM_MEANINGS[d.huGua.name]).toBeTruthy();
      expect(HEXAGRAM_MEANINGS[d.bianGua!.name]).toBeTruthy();
    }
  });

  it('时间起卦按「年支+农历月+日」计算，算式自洽', () => {
    const now = new Date(2026, 9, 31, 12);
    const d = castMeihua('time', undefined, undefined, '测试', now).details;
    expect(d.method).toBe('时间起卦法');
    expect(d.methodDetail).toContain('上卦');
    expect(d.upperGua.number).toBeGreaterThanOrEqual(1);
    expect(d.upperGua.number).toBeLessThanOrEqual(8);
    expect(d.dongYao).toBeGreaterThanOrEqual(1);
    expect(d.dongYao).toBeLessThanOrEqual(6);
    // 同一时刻结果确定
    const again = castMeihua('time', undefined, undefined, '测试', now).details;
    expect(JSON.stringify(again)).toBe(JSON.stringify(d));
  });

  it('动爻在上卦时，下卦为体', () => {
    // 3/1 得动4（上卦动）→ 体为下卦乾
    const d1 = castMeihua('number', 3, 1).details;
    expect(d1.dongYao!).toBeGreaterThan(3);
    expect(d1.tiYong.ti).toContain('乾');

    // 1/1 得动2（下卦动）→ 体为上卦乾
    const d2 = castMeihua('number', 1, 1).details;
    expect(d2.dongYao!).toBeLessThanOrEqual(3);
    expect(d2.tiYong.ti).toContain('乾');
  });

  it('输出包含卦义且无 [object Object]', () => {
    const r = castMeihua('number', 5, 3, '事业');
    expect(r.details.mainGua.meaning).toBeTruthy();
    expect(r.summary).toContain(r.details.mainGua.name);
    expect(JSON.stringify(r.details)).not.toContain('[object Object]');
  });
});
