import { describe, it, expect } from 'vitest';
import { getShengxiaoFortune } from '../src/services/shengxiao.service';
import { ZODIAC_SIGNS, generateZodiacFortune } from '../src/services/zodiac.service';

describe('生肖运势：确定性推算（刑冲合害 + 五行生克）', () => {
  it('同一输入同一天结果完全一致（无随机）', () => {
    const a = getShengxiaoFortune('马', 1990, 'yearly');
    const b = getShengxiaoFortune('马', 1990, 'yearly');
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('带出流年/月建/日辰与关系判定', () => {
    const d = getShengxiaoFortune('马', 1990, 'yearly').details;
    expect(d.animalZhi).toBe('午');
    expect(d.yearPillar).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/);
    expect(['三合', '六合', '冲', '刑', '害', '本命', '平']).toContain(d.relation?.kind);
  });

  it('冲的分数显著低于三合', () => {
    // 逐年扫描，找出与今年地支相冲/相合的生肖，比较综合分
    const all = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const rows = all.map((a) => ({ a, d: getShengxiaoFortune(a, 1990, 'yearly').details }));
    const chong = rows.find((r) => r.d.relation?.kind === '冲');
    const sanhe = rows.find((r) => r.d.relation?.kind === '三合');
    expect(chong).toBeTruthy();
    expect(sanhe).toBeTruthy();
    expect(sanhe!.d.scores.overall).toBeGreaterThan(chong!.d.scores.overall);
  });

  it('各维度分数在合理区间', () => {
    const s = getShengxiaoFortune('龙', 1988, 'monthly').details.scores;
    for (const v of Object.values(s)) {
      expect(v).toBeGreaterThanOrEqual(45);
      expect(v).toBeLessThanOrEqual(96);
    }
  });
});

describe('星座运势：确定性推算（月相 + 星期主星 + 元素）', () => {
  const gemini = ZODIAC_SIGNS.find((s) => s.name === '双子座')!;

  it('同一日期结果完全一致（无随机）', () => {
    const t = new Date(2026, 9, 31, 12);
    const a = generateZodiacFortune(gemini, 'daily', t);
    const b = generateZodiacFortune(gemini, 'daily', t);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('不同日期结果不同', () => {
    const a = generateZodiacFortune(gemini, 'daily', new Date(2026, 9, 31, 12));
    const b = generateZodiacFortune(gemini, 'daily', new Date(2026, 10, 1, 12));
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it('分数区间与综合分为四项均值', () => {
    const r = generateZodiacFortune(gemini, 'daily', new Date(2026, 9, 31, 12));
    for (const dim of [r.love, r.career, r.wealth, r.health]) {
      expect(dim.score).toBeGreaterThanOrEqual(50);
      expect(dim.score).toBeLessThanOrEqual(97);
      expect(dim.description.length).toBeGreaterThan(5);
    }
    expect(r.overallScore).toBe(Math.round((r.love.score + r.career.score + r.wealth.score + r.health.score) / 4));
  });

  it('建议中体现真实月相与星期主星', () => {
    const r = generateZodiacFortune(gemini, 'daily', new Date(2026, 9, 31, 12));
    expect(r.advice).toContain('月相照明度');
    expect(r.advice).toMatch(/日/);
  });
});
