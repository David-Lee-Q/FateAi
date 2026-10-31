import { describe, it, expect } from 'vitest';
import { interpretDream } from '../src/services/dream.service';

describe('解梦词典与匹配', () => {
  it('精确命中常见意象', () => {
    const r = interpretDream(['蛇']);
    expect(r.entries.length).toBeGreaterThanOrEqual(1);
    expect(r.entries[0].keyword).toBe('蛇');
  });

  it('词库已扩容（单字/双字常见意象均可命中）', () => {
    for (const kw of ['龙', '水', '火', '树', '桥', '钥匙', '结婚', '考试', '被追', '牙齿']) {
      const r = interpretDream([kw]);
      expect(r.entries.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('模糊匹配：句子中提及意象也能命中', () => {
    const r = interpretDream(['梦见一条大蛇缠着我的腿']);
    expect(r.entries.length).toBeGreaterThanOrEqual(1);
  });

  it('吉凶汇总与解读非空', () => {
    const r = interpretDream(['蛇', '水', '火']);
    expect(r.overallInterpretation).toBeTruthy();
    expect(r.overallInterpretation.length).toBeGreaterThan(10);
    expect(JSON.stringify(r)).not.toContain('[object Object]');
  });

  it('未命中时给出兜底而不报错', () => {
    const r = interpretDream(['完全不存在的东西xyz']);
    expect(r.entries.length).toBe(0);
    expect(r.overallInterpretation.length).toBeGreaterThan(5);
  });
});
