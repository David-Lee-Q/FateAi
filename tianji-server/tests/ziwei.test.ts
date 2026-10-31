import { describe, it, expect } from 'vitest';
import { calculateZiwei } from '../src/services/ziwei.service';

describe('紫微斗数真实排盘（iztro）', () => {
  const result = calculateZiwei(1995, 6, 15, 12, 'male');
  const d = result.details;

  it('十二宫完整且宫名规范', () => {
    expect(d.twelvePalaces).toHaveLength(12);
    const names = d.twelvePalaces.map((p) => p.palace);
    expect(names).toContain('命宫');
    expect(names).toContain('夫妻宫');
    expect(names).toContain('官禄宫');
    expect(names).toContain('财帛宫');
    // 不应出现重复宫名
    expect(new Set(names).size).toBe(12);
  });

  it('每宫有干支', () => {
    for (const p of d.twelvePalaces) {
      expect(p.heavenlyStem).toMatch(/^[甲乙丙丁戊己庚辛壬癸]$/);
      expect(p.earthlyBranch).toMatch(/^[子丑寅卯辰巳午未申酉戌亥]$/);
    }
  });

  it('乙亥年生年四化为天机禄/天梁权/紫微科/太阴忌', () => {
    expect(d.siHua['化禄']).toBe('天机');
    expect(d.siHua['化权']).toBe('天梁');
    expect(d.siHua['化科']).toBe('紫微');
    expect(d.siHua['化忌']).toBe('太阴');
  });

  it('五行局/命主/身主齐全', () => {
    expect(['水二局', '木三局', '金四局', '土五局', '火六局']).toContain(d.wuXingJu);
    expect(d.soul).toBeTruthy();
    expect(d.body).toBeTruthy();
  });

  it('命宫有主星（武曲天府），且与十二宫中命宫一致', () => {
    expect(d.mingGong.mainStar).toContain('武曲');
    const ming = d.twelvePalaces.find((p) => p.palace === '命宫');
    expect(ming?.mainStar).toBe(d.mingGong.mainStar);
  });

  it('大限/流年结构完整', () => {
    expect(d.horoscope?.decadal.heavenlyStem).toBeTruthy();
    expect(d.horoscope?.decadal.range).toHaveLength(2);
    expect(d.horoscope?.yearly.mutagen).toHaveLength(4);
  });

  it('同输入结果确定（无随机）', () => {
    const again = calculateZiwei(1995, 6, 15, 12, 'male');
    expect(again.summary).toBe(result.summary);
    expect(JSON.stringify(again.details)).toBe(JSON.stringify(d));
  });

  it('不同时辰命宫不同（安星随时辰变化）', () => {
    const other = calculateZiwei(1995, 6, 15, 2, 'male');
    expect(other.details.mingGong.earthlyBranch).not.toBe(d.mingGong.earthlyBranch);
  });

  it('男女命盘不同（大限顺逆）', () => {
    const female = calculateZiwei(1995, 6, 15, 12, 'female');
    expect(female.details.twelvePalaces[0].decadal?.range)
      .not.toEqual(d.twelvePalaces[0].decadal?.range);
  });
});
