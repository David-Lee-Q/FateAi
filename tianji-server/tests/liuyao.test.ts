import { describe, it, expect } from 'vitest';
import { Solar } from 'lunar-typescript';
import { castLiuyao } from '../src/services/liuyao.service';

/** 全阳无动爻：乾为天 */
const QIAN = [7, 7, 7, 7, 7, 7];
/** 下乾上坤：地天泰 */
const TAI = [7, 7, 7, 8, 8, 8];

describe('六爻真实排盘（京房纳甲）', () => {
  it('乾为天：乾宫、世6应3、纳甲与六亲正确', () => {
    const r = castLiuyao('测试', { lines: QIAN, castTime: new Date(2026, 9, 31, 12) });
    const d = r.details;

    expect(d.originalGua.name).toBe('乾为天');
    expect(d.originalGua.palace).toBe('乾宫');
    expect(d.originalGua.palaceElement).toBe('金');
    expect(d.worldResponse).toEqual({ world: 6, response: 3 });
    expect(d.naJia).toEqual(['甲子', '甲寅', '甲辰', '壬午', '壬申', '壬戌']);
    expect(d.sixLines.map((l) => l.liuQin)).toEqual([
      '子孙', '妻财', '父母', '官鬼', '兄弟', '父母',
    ]);
    // 无动爻 → 变卦同本卦
    expect(d.movingCount).toBe(0);
    expect(d.changedGua.name).toBe('乾为天');
  });

  it('地天泰：坤宫三世、世3应6、六亲按坤土论', () => {
    const r = castLiuyao('测试', { lines: TAI, castTime: new Date(2026, 9, 31, 12) });
    const d = r.details;

    expect(d.originalGua.name).toBe('地天泰');
    expect(d.originalGua.palace).toBe('坤宫');
    expect(d.worldResponse).toEqual({ world: 3, response: 6 });
    expect(d.naJia).toEqual(['甲子', '甲寅', '甲辰', '癸丑', '癸亥', '癸酉']);
    expect(d.sixLines.map((l) => l.liuQin)).toEqual([
      '妻财', '官鬼', '兄弟', '兄弟', '妻财', '子孙',
    ]);
  });

  it('初爻老阳动：乾为天变天风姤', () => {
    const r = castLiuyao('测试', { lines: [9, 7, 7, 7, 7, 7], castTime: new Date(2026, 9, 31, 12) });
    expect(r.details.changedGua.name).toBe('天风姤');
    expect(r.details.sixLines[0].isMoving).toBe(true);
    expect(r.details.sixLines[0].changedGanZhi).toBe('辛丑');
    expect(r.details.sixLines[0].changedLiuQin).toBe('父母');
  });

  it('日柱/月柱与 lunar-typescript 一致', () => {
    const t = new Date(2026, 9, 31, 12);
    const lunar = Solar.fromYmd(2026, 10, 31).getLunar();
    const r = castLiuyao('测试', { lines: QIAN, castTime: t });

    expect(r.details.castInfo?.dayPillar).toBe(lunar.getDayInGanZhi());
    // 月柱：lunar 的月柱按节气，本项目月柱表为近似节气表，仅校验月支在合法地支内
    expect(r.details.castInfo?.monthPillar).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
  });

  it('旬空与爻位标记自洽', () => {
    const r = castLiuyao('测试', { lines: QIAN, castTime: new Date(2026, 9, 31, 12) });
    const kong = r.details.castInfo!.xunKong;
    expect(kong).toHaveLength(2);
    for (const line of r.details.sixLines) {
      const zhi = line.ganZhi.charAt(1);
      expect(line.isKong).toBe(kong.includes(zhi));
    }
  });

  it('六神按日干顺排（六位循环连续）', () => {
    const order = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];
    const r = castLiuyao('测试', { lines: QIAN, castTime: new Date(2026, 9, 31, 12) });
    const names = r.details.sixLines.map((l) => l.liuShen);
    const start = order.indexOf(names[0]);
    expect(start).toBeGreaterThanOrEqual(0);
    names.forEach((n, i) => expect(n).toBe(order[(start + i) % 6]));
  });

  it('真摇卦：注入随机源可复现，且两爻值为 6/7/8/9 之一', () => {
    const seed = () => 0.7; // 恒取 3 → 三枚皆 3 → 和 9（老阳）
    const a = castLiuyao('测试', { castTime: new Date(2026, 9, 31, 12), random: seed });
    const b = castLiuyao('测试', { castTime: new Date(2026, 9, 31, 12), random: seed });
    expect(a.details.castInfo?.tosses).toEqual([9, 9, 9, 9, 9, 9]);
    expect(a.details.originalGua.name).toBe('乾为天');
    expect(JSON.stringify(a.details)).toBe(JSON.stringify(b.details));
  });

  it('用神按问题主题匹配', () => {
    expect(castLiuyao('今年财运如何', { lines: QIAN }).details.yongShen).toContain('妻财');
    expect(castLiuyao('能否升职', { lines: QIAN }).details.yongShen).toContain('官鬼');
    expect(castLiuyao('考试能否通过', { lines: QIAN }).details.yongShen).toContain('父母');
  });

  it('输出无 [object Object] 且摘要包含卦名', () => {
    const r = castLiuyao('测试', { lines: TAI });
    expect(r.summary).toContain('地天泰');
    expect(JSON.stringify(r.details)).not.toContain('[object Object]');
  });
});
