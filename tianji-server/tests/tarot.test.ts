import { describe, it, expect } from 'vitest';
import { getAllCards } from '../src/services/tarot.service';

describe('塔罗 78 张牌组数据', () => {
  const cards = getAllCards();

  it('共 78 张（22 大阿卡纳 + 56 小阿卡纳）', () => {
    expect(cards).toHaveLength(78);
    expect(cards.filter((c) => c.suit === 'major')).toHaveLength(22);
    for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
      expect(cards.filter((c) => c.suit === suit)).toHaveLength(14);
    }
  });

  it('每张牌都有非空且互不相同的正位/逆位牌义', () => {
    const seen = new Set<string>();
    for (const c of cards) {
      expect(c.uprightMeaning.length).toBeGreaterThanOrEqual(6);
      expect(c.reversedMeaning.length).toBeGreaterThanOrEqual(6);
      expect(c.uprightMeaning).not.toBe(c.reversedMeaning);
      const key = `${c.uprightMeaning}|${c.reversedMeaning}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('小牌牌义为专属含义（不含通用花色模板前缀）', () => {
    const ace = cards.find((c) => c.suit === 'wands' && c.name === '权杖首牌')!;
    expect(ace.uprightMeaning).toContain('灵感迸发');
    const ten = cards.find((c) => c.suit === 'cups' && c.name === '圣杯十')!;
    expect(ten.uprightMeaning).toContain('圆满');
    const king = cards.find((c) => c.suit === 'swords' && c.name === '宝剑国王')!;
    expect(king.reversedMeaning).toContain('专断');
  });
});
