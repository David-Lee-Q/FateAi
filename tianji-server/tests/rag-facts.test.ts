import { describe, it, expect } from 'vitest';
import { selectKnowledgeChunks, tokenize } from '../src/services/knowledge.loader';
import { buildFacts, buildRetrievalQuery } from '../src/services/fact-builder';

describe('知识库 BM25 检索', () => {
  it('分词能切出中文词块并去停用词', () => {
    const t = tokenize('我想问今年财运怎么样');
    expect(t).toContain('财运');
    expect(t).not.toContain('怎么');
  });

  it('不同问题检索到不同章节（查询真正生效）', () => {
    const a = selectKnowledgeChunks('bazi', '财运 求财 妻财');
    const b = selectKnowledgeChunks('bazi', '婚姻 感情 配偶');
    expect(a).not.toBe('');
    expect(b).not.toBe('');
    expect(a).not.toBe(b);
  });

  it('检索结果受字符预算约束', () => {
    const ctx = selectKnowledgeChunks('liuyao', '世应用神动爻六亲', 5, 800);
    expect(ctx.length).toBeLessThanOrEqual(1000);
  });

  it('未知系统返回空串而不报错', () => {
    expect(selectKnowledgeChunks('not-exist', '测试')).toBe('');
  });
});

describe('排盘事实注入', () => {
  it('六爻事实包含卦名/世应/用神/六亲', () => {
    const facts = buildFacts('liuyao', {
      details: {
        originalGua: { name: '雷天大壮', palace: '坤宫', palaceElement: '土' },
        changedGua: { name: '雷风恒' },
        shiYing: { shi: '4爻 父母庚午', ying: '1爻 妻财甲子' },
        yongShen: '妻财（求财）',
        sixLines: [
          { position: 1, yinYang: '阳', shiYing: '应', liuShen: '勾陈', liuQin: '妻财', ganZhi: '甲子', isMoving: true, changedLiuQin: '兄弟', changedGanZhi: '辛丑', isKong: false },
        ],
        castInfo: { yearPillar: '丙午', monthPillar: '戊戌', dayPillar: '戊寅', monthBuild: '戌', dayChen: '寅', xunKong: '申酉' },
      },
    });
    expect(facts).toContain('雷天大壮');
    expect(facts).toContain('世应');
    expect(facts).toContain('妻财');
    expect(facts).toContain('旬空');
    expect(facts).not.toContain('[object Object]');
  });

  it('紫微事实包含五行局/命宫/四化/大限', () => {
    const facts = buildFacts('ziwei', {
      details: {
        wuXingJu: '火六局',
        soul: '贪狼',
        body: '天机',
        mingGong: { mainStar: '武曲(旺) 天府(庙)' },
        twelvePalaces: [{ palace: '命宫', heavenlyStem: '戊', earthlyBranch: '子', mainStar: '武曲(旺)' }],
        siHua: { 化禄: '天机', 化权: '天梁', 化科: '紫微', 化忌: '太阴' },
        horoscope: { decadal: { heavenlyStem: '丙', earthlyBranch: '戌', range: [26, 35] }, yearly: { heavenlyStem: '丙', earthlyBranch: '午' } },
      },
    });
    expect(facts).toContain('火六局');
    expect(facts).toContain('化禄天机');
    expect(facts).toContain('26-35');
  });

  it('奇门事实包含局数与九宫', () => {
    const facts = buildFacts('qimen', {
      details: {
        solarTerm: '霜降', dun: '阴遁', yuan: '下元', ju: 2,
        fourPillars: { year: '丙午', month: '戊戌', day: '戊寅', hour: '戊午' },
        xunHead: '甲寅', hiddenStem: '癸', voidBranches: ['子', '丑'],
        leaders: { star: '天心', door: '开门' },
        palaces: [{ number: 2, earthStem: '戊', heavenStems: ['癸'], stars: ['天心'], door: '开门', deity: '值符', isVoid: false }],
      },
    });
    expect(facts).toContain('阴遁下元2局');
    expect(facts).toContain('值符');
    expect(facts).toContain('2宫');
  });

  it('全部已接入体系均能产出非空事实', () => {
    const systems = ['tarot', 'zodiac', 'shengxiao', 'moonphase', 'drawlot', 'nametest', 'rune', 'dream'];
    for (const sys of systems) {
      const facts = buildFacts(sys, {
        details: {
          cards: [{ name: '愚者', isReversed: false, meaning: '新开始' }],
          sign: { name: '双子座' }, overallScore: 80,
          animal: '马', scores: { overall: 80 },
          moonPhase: '满月', illumination: '100%',
          lotNumber: 1, level: '上上签', poem: '诗', interpretation: '解', advice: '建议',
          fullName: '王明', wuGe: { tianGe: { number: 5 } }, sanCai: '土木水',
          runes: [{ name: 'Fehu', nameEn: 'Fehu', meaning: '财富' }],
          keywords: ['蛇'], entries: [{ keyword: '蛇', symbol: '变化', fortune: '中吉', interpretation: '变化将至' }],
        },
      });
      expect(facts.length).toBeGreaterThan(5);
      expect(facts).not.toContain('[object Object]');
    }
  });

  it('检索查询融合用户问题与体系关键词', () => {
    const q = buildRetrievalQuery('liuyao', { details: { originalGua: { name: '乾为天' }, yongShen: '妻财（求财）' } }, '今年能升职吗');
    expect(q).toContain('今年能升职吗');
    expect(q).toContain('乾为天');
    expect(q).toContain('世应');
  });
});
