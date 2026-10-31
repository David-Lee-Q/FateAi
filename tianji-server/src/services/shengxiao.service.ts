/**
 * 生肖运势查询服务
 * 依据流年/月建/日辰与属相地支的刑冲合害、五行生克确定性推算各维度运势
 */

import { getDayPillar, getMonthPillar, getYearPillar } from '../utils/lunar';
import type { ShengxiaoResult } from '../types';

/** 十二生肖详细信息 */
const SHENGXIAO_INFO: Record<string, { element: string; yinYang: string; luckyColor: string; luckyNumber: number; luckyDirection: string }> = {
  '鼠': { element: '水', yinYang: '阳', luckyColor: '蓝色、金色', luckyNumber: 2, luckyDirection: '东南' },
  '牛': { element: '土', yinYang: '阴', luckyColor: '白色、绿色', luckyNumber: 1, luckyDirection: '东北' },
  '虎': { element: '木', yinYang: '阳', luckyColor: '橙色、灰色', luckyNumber: 3, luckyDirection: '南方' },
  '兔': { element: '木', yinYang: '阴', luckyColor: '粉色、紫色', luckyNumber: 4, luckyDirection: '东方' },
  '龙': { element: '土', yinYang: '阳', luckyColor: '红色、金色', luckyNumber: 5, luckyDirection: '北方' },
  '蛇': { element: '火', yinYang: '阴', luckyColor: '红色、浅黄', luckyNumber: 6, luckyDirection: '西南' },
  '马': { element: '火', yinYang: '阳', luckyColor: '黄色、绿色', luckyNumber: 7, luckyDirection: '西北' },
  '羊': { element: '土', yinYang: '阴', luckyColor: '绿色、红色', luckyNumber: 8, luckyDirection: '北方' },
  '猴': { element: '金', yinYang: '阳', luckyColor: '白色、蓝色', luckyNumber: 9, luckyDirection: '东北' },
  '鸡': { element: '金', yinYang: '阴', luckyColor: '金色、棕色', luckyNumber: 0, luckyDirection: '西方' },
  '狗': { element: '土', yinYang: '阳', luckyColor: '红色、紫色', luckyNumber: 1, luckyDirection: '南方' },
  '猪': { element: '水', yinYang: '阴', luckyColor: '灰色、黑色', luckyNumber: 2, luckyDirection: '东北' },
};

/** 运势建议库 */
const FORTUNE_ADVICE: Record<string, string> = {
  '鼠': '今年人际关系活跃，适合拓展社交圈。财运稳步上升，但需避免冲动消费。',
  '牛': '事业运势稳健，脚踏实地终获回报。感情方面需要更多耐心与沟通。',
  '虎': '充满活力的一年，适合挑战新目标。注意控制情绪，避免与人发生冲突。',
  '兔': '运势温和平稳，贵人运强。适合在稳定基础上寻求突破。',
  '龙': '运势大开大合，机遇与挑战并存。抓住时机大胆行动，但需谨慎行事。',
  '蛇': '智慧洞察的一年，适合深度思考与规划。财运方面需注意投资风险。',
  '马': '行动力旺盛，适合开拓新领域。注意劳逸结合，避免过度劳累。',
  '羊': '温和发展的一年，合作运佳。适合与他人携手共进。',
  '猴': '聪明才智得以发挥，创新灵感不断。注意言行举止，避免引起误会。',
  '鸡': '收获之年，前期努力将得到回报。财运亨通，但仍需保持谦逊。',
  '狗': '忠诚守护的一年，人际关系稳固。适合巩固已有成果。',
  '猪': '福运相随的一年，生活安稳幸福。适合享受当下，规划未来。',
};

/** 确定本命年信息 */
function getBenMingNian(animal: string, birthYear?: number): string {
  if (!birthYear) return '';
  const currentYear = new Date().getFullYear();
  // 计算该生肖的年份间隔（12年一轮）
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const animalIdx = animals.indexOf(animal);
  if (animalIdx === -1) return '';
  // 找最近的属该生肖的年份
  const baseYear = 2020 + animalIdx; // 2020年为鼠年
  const recentYear = baseYear + Math.floor((currentYear - baseYear) / 12) * 12;
  if (recentYear === currentYear) {
    return `${currentYear}年为本命年，属${animal}的人需注意太岁压制，宜稳中求进。`;
  }
  return '';
}

/**
 * 获取生肖运势
 * @param animal 生肖名
 * @param birthYear 出生年份（可选）
 * @param type 运势类型（可选）
 */
export function getShengxiaoFortune(
  animal: string,
  birthYear?: number,
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly'
): ShengxiaoResult {
  const info = SHENGXIAO_INFO[animal] || SHENGXIAO_INFO['鼠'];
  const benMingNian = getBenMingNian(animal, birthYear);
  const advice = FORTUNE_ADVICE[animal] || FORTUNE_ADVICE['鼠'];

  const typeStr = type || 'daily';
  const now = new Date();
  const yearPillar = getYearPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const monthPillar = getMonthPillar(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
  const dayPillar = getDayPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const animalZhi = ZHI_OF_ANIMAL[animal] ?? '子';

  // 与流年地支的刑冲合害关系
  const relYear = relationOf(animalZhi, yearPillar.zhi);
  // 每月看月建，每周/每日额外看日支
  const relMonth = relationOf(animalZhi, monthPillar.zhi);
  const relDay = relationOf(animalZhi, dayPillar.zhi);
  const rel = typeStr === 'yearly' ? relYear : typeStr === 'monthly' ? relMonth : typeStr === 'weekly' ? relMonth : relDay;

  // 五行生克：流年五行 vs 属相五行
  const yearElement = ZHI_WUXING[yearPillar.zhi];
  const animalElement = ZHI_WUXING[animalZhi];
  const wx = relationOfElement(yearElement, animalElement);

  const clamp = (n: number) => Math.max(45, Math.min(96, Math.round(n)));
  const base = 70 + rel.score + wx.score + (benMingNian ? 4 : 0);

  const scores = {
    overall: clamp(base),
    career: clamp(base + (rel.kind === '三合' ? 4 : 0) + (wx.kind === '生' ? 3 : 0)),
    wealth: clamp(base + (wx.kind === '同' ? 4 : 0) + (rel.kind === '六合' ? 3 : 0) - (rel.kind === '冲' ? 5 : 0)),
    love: clamp(base + (rel.kind === '六合' ? 7 : 0) + (rel.kind === '害' ? -4 : 0)),
    health: clamp(base + (rel.kind === '刑' ? -6 : 0) + (wx.kind === '被克' ? -5 : 0)),
  };

  const trend = rel.kind === '三合' || rel.kind === '六合'
    ? '得流年（月建）相助，宜主动出击'
    : rel.kind === '冲'
      ? '与流年（月建）相冲，宜稳守避险'
      : rel.kind === '刑' || rel.kind === '害'
        ? '逢刑害，留意口舌与小人'
        : '关系平顺，按部就班即可';

  const summary = `${animal}（${animalZhi}）${typeStr === 'yearly' ? '流年' : typeStr === 'monthly' ? '本月' : typeStr === 'weekly' ? '本周' : '今日'}运势：`
    + `综合${scores.overall}分，事业${scores.career}分，财运${scores.wealth}分，感情${scores.love}分，健康${scores.health}分。`
    + `流年${yearPillar.gan}${yearPillar.zhi}，属相与${typeStr === 'yearly' ? '流年' : typeStr === 'monthly' ? '月建' : '日辰'}${rel.target}${rel.kind}，${trend}。`
    + `${benMingNian ? benMingNian + ' ' : ''}幸运色：${info.luckyColor}，幸运方位：${info.luckyDirection}。`;

  return {
    summary,
    details: {
      animal,
      animalZhi,
      benMingNian,
      yearPillar: `${yearPillar.gan}${yearPillar.zhi}`,
      monthPillar: `${monthPillar.gan}${monthPillar.zhi}`,
      dayPillar: `${dayPillar.gan}${dayPillar.zhi}`,
      relation: { kind: rel.kind, target: rel.target, score: rel.score },
      elementRelation: wx.kind,
      scores,
      luckyItems: {
        color: info.luckyColor,
        number: info.luckyNumber,
        direction: info.luckyDirection,
      },
      advice,
    },
  };
}

/** 生肖 → 地支 */
const ZHI_OF_ANIMAL: Record<string, string> = {
  鼠: '子', 牛: '丑', 虎: '寅', 兔: '卯', 龙: '辰', 蛇: '巳',
  马: '午', 羊: '未', 猴: '申', 鸡: '酉', 狗: '戌', 猪: '亥',
};

const ZHI_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

const LIU_HE: Array<[string, string]> = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
];
const LIU_CHONG: Array<[string, string]> = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];
const SAN_HE: string[][] = [['申', '子', '辰'], ['亥', '卯', '未'], ['寅', '午', '戌'], ['巳', '酉', '丑']];
const LIU_HAI: Array<[string, string]> = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌'],
];
const XING: Array<[string, string]> = [
  ['子', '卯'], ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥'],
];

/** 属相与目标地支的关系 */
function relationOf(animalZhi: string, target: string): { kind: string; target: string; score: number } {
  if (animalZhi === target) return { kind: '本命', target, score: 2 };
  if (SAN_HE.some((g) => g.includes(animalZhi) && g.includes(target))) return { kind: '三合', target, score: 10 };
  if (LIU_HE.some(([a, b]) => (a === animalZhi && b === target) || (b === animalZhi && a === target))) {
    return { kind: '六合', target, score: 8 };
  }
  if (LIU_CHONG.some(([a, b]) => (a === animalZhi && b === target) || (b === animalZhi && a === target))) {
    return { kind: '冲', target, score: -12 };
  }
  if (XING.some(([a, b]) => (a === animalZhi && b === target) || (b === animalZhi && a === target))) {
    return { kind: '刑', target, score: -8 };
  }
  if (LIU_HAI.some(([a, b]) => (a === animalZhi && b === target) || (b === animalZhi && a === target))) {
    return { kind: '害', target, score: -6 };
  }
  return { kind: '平', target, score: 0 };
}

const SHENG_WX: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };

/** 五行关系（目标五行 对 属相五行） */
function relationOfElement(target: string, self: string): { kind: string; score: number } {
  if (target === self) return { kind: '同', score: 4 };
  if (SHENG_WX[target] === self) return { kind: '生', score: 6 };
  if (SHENG_WX[self] === target) return { kind: '被生', score: 2 };
  if (SHENG_WX[target] === self) return { kind: '克', score: -6 };
  return { kind: '被克', score: -4 };
}

