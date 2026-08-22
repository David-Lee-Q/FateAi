import { describe, it, expect } from 'vitest';
import { getDailyAlmanac } from '../src/services/almanac.service';

describe('黄历服务（真实农历数据）', () => {
  it('2026-08-22：干支 丙午 丙申 戊辰，冲狗（戌）煞北', () => {
    const r = getDailyAlmanac('2026-08-22');
    expect(r.details.ganZhi.year).toBe('丙午');
    expect(r.details.ganZhi.month).toBe('丙申');
    expect(r.details.ganZhi.day).toBe('戊辰');
    expect(r.details.chongSha).toBe('冲狗（戌）煞北');
    expect(r.details.lunarDate).toContain('七月初十');
  });

  it('2026-08-22：吉时为 寅辰巳申酉亥 六时', () => {
    const r = getDailyAlmanac('2026-08-22');
    const ji = r.details.shiChenLuck.filter((s) => s.luck === '吉').map((s) => s.name);
    expect(ji).toEqual(['寅时', '辰时', '巳时', '申时', '酉时', '亥时']);
  });

  it('2026-08-22：宜忌非空且吉神含天德合', () => {
    const r = getDailyAlmanac('2026-08-22');
    expect(r.details.yi.length).toBeGreaterThan(0);
    expect(r.details.ji.length).toBeGreaterThan(0);
    expect(r.details.jiShen).toContain('天德合');
  });

  it('十二时辰吉凶共 12 条，取值仅 吉/凶', () => {
    const r = getDailyAlmanac('2026-08-22');
    expect(r.details.shiChenLuck).toHaveLength(12);
    for (const s of r.details.shiChenLuck) {
      expect(['吉', '凶']).toContain(s.luck);
    }
  });

  it('2026-02-17：正月初一（春节），年柱立春后为丙午', () => {
    const r = getDailyAlmanac('2026-02-17');
    expect(r.details.ganZhi.year).toBe('丙午');
    expect(r.details.lunarDate).toContain('正月初一');
  });

  it('2027-02-05 腊月三十 → 2027-02-06 正月初一 跨年正确', () => {
    const last = getDailyAlmanac('2027-02-05');
    const first = getDailyAlmanac('2027-02-06');
    expect(last.details.lunarDate).toContain('腊月');
    expect(first.details.lunarDate).toContain('正月初一');
  });

  it('summary 含冲煞与吉时信息', () => {
    const r = getDailyAlmanac('2026-08-22');
    expect(r.summary).toContain('冲狗（戌）煞北');
    expect(r.summary).toContain('吉时');
    expect(r.summary).toContain('宜');
    expect(r.summary).toContain('忌');
  });

  it('节气日 summary 追加节气说明', () => {
    // 2026 立秋为 8 月 7 日
    const r = getDailyAlmanac('2026-08-07');
    expect(r.summary).toContain('立秋');
  });
});
