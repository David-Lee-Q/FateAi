import { describe, it, expect } from 'vitest';
import { analyzeFengshui } from '../src/services/fengshui.service';

const at = (y: number) => new Date(y, 10, 1);

describe('风水（八宅 + 玄空年飞星）', () => {
  it('2026 年一白入中，八白在正东、五黄在正南', () => {
    const d = analyzeFengshui('S', 'residential', undefined, 'male', at(2026)).details;
    expect(d.yearStarCenter?.star).toBe(1);
    const byDir = Object.fromEntries((d.flyingStars ?? []).map((f) => [f.direction, f.star]));
    expect(byDir['正东']).toBe(8);
    expect(byDir['正南']).toBe(5);
    expect(byDir['东南']).toBe(9);
  });

  it('2024 年三碧入中（对照公开年飞星：八白正北、九紫西南、五黄正西）', () => {
    const d = analyzeFengshui('S', 'residential', undefined, 'male', at(2024)).details;
    expect(d.yearStarCenter?.star).toBe(3);
    const byDir = Object.fromEntries((d.flyingStars ?? []).map((f) => [f.direction, f.star]));
    expect(byDir['正北']).toBe(8);
    expect(byDir['西南']).toBe(9);
    expect(byDir['正西']).toBe(5);
  });

  it('命卦按出生年推算：1990 男命为坎卦（东四命）', () => {
    const d = analyzeFengshui('S', 'residential', 1990, 'male', at(2026)).details;
    expect(d.baZhai?.mingGua).toContain('坎');
    expect(d.baZhai?.group).toBe('东四命');
    expect(d.baZhai?.goodDirections).toContain('东南');
  });

  it('1990 女命为艮卦（西四命）', () => {
    const d = analyzeFengshui('S', 'residential', 1990, 'female', at(2026)).details;
    expect(d.baZhai?.mingGua).toContain('艮');
    expect(d.baZhai?.group).toBe('西四命');
  });

  it('五黄方会写入布局建议', () => {
    const d = analyzeFengshui('N', 'office', undefined, 'male', at(2026)).details;
    expect(d.layoutAdvice.join('')).toContain('五黄');
  });

  it('无出生年时只返回流年飞星，不报错', () => {
    const r = analyzeFengshui('E', 'commercial', undefined, 'male', at(2026));
    expect(r.details.baZhai).toBeUndefined();
    expect(r.details.favorableAreas.length).toBeGreaterThan(0);
    expect(JSON.stringify(r)).not.toContain('[object Object]');
  });
});
