/**
 * 六爻卦象服务
 * 通过铜钱摇卦法起卦，排布六爻纳甲
 * 当前为模拟数据实现，后续可接入完整算法
 */

import type { LiuyaoResult } from '../types';

/** 八卦名称与符号 */
const BA_GUA = [
  { name: '乾', symbol: '☰', nature: '天' },
  { name: '坤', symbol: '☷', nature: '地' },
  { name: '震', symbol: '☳', nature: '雷' },
  { name: '巽', symbol: '☴', nature: '风' },
  { name: '坎', symbol: '☵', nature: '水' },
  { name: '离', symbol: '☲', nature: '火' },
  { name: '艮', symbol: '☶', nature: '山' },
  { name: '兑', symbol: '☱', nature: '泽' },
];

/** 六十四卦名称映射（简化版，取部分常见卦象） */
const GUA_NAMES: Record<string, string> = {
  '乾乾': '乾为天', '坤坤': '坤为地', '坎坎': '坎为水', '离离': '离为火',
  '震震': '震为雷', '巽巽': '巽为风', '艮艮': '艮为山', '兑兑': '兑为泽',
  '乾坤': '天地否', '坤乾': '地天泰', '坎离': '水火既济', '离坎': '火水未济',
  '震巽': '雷风恒', '巽震': '风雷益', '艮兑': '山泽损', '兑艮': '泽山咸',
  '坎艮': '水山蹇', '艮坎': '山水蒙', '离震': '火雷噬嗑', '震离': '雷火丰',
  '巽坤': '风地观', '坤巽': '地风升', '乾坎': '天水讼', '坎乾': '水天需',
  '坤离': '地火明夷', '离坤': '火地晋', '乾巽': '天风姤', '巽乾': '风天小畜',
  '坤兑': '地泽临', '兑坤': '泽地萃', '乾震': '天雷无妄', '震乾': '雷天大壮',
  '巽坎': '风水涣', '坎巽': '水风井', '离兑': '火泽睽', '兑离': '泽火革',
};

/** 纳甲天干地支 */
const NA_JIA_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const NA_JIA_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 根据问题文本生成确定性随机数 */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 起六爻卦象
 * @param question 占卜问题
 */
export function castLiuyao(question: string): LiuyaoResult {
  const seed = seededRandom(question);
  const rand = () => {
    // 简单伪随机，基于种子递增
    const value = (seed + Math.floor(Math.random() * 1000)) % 8;
    return value;
  };

  // 生成上卦和下卦
  const upperIdx = rand();
  const lowerIdx = rand();
  const upperGua = BA_GUA[upperIdx];
  const lowerGua = BA_GUA[lowerIdx];

  // 生成变卦
  const changeIdx = rand();
  const changedGua = BA_GUA[changeIdx];

  // 查找卦名
  const mainKey = `${upperGua.name}${lowerGua.name}`;
  const originalName = GUA_NAMES[mainKey] || `${upperGua.name}${lowerGua.name}卦`;
  const changedKey = `${changedGua.name}${lowerGua.name}`;
  const changedName = GUA_NAMES[changedKey] || `${changedGua.name}${lowerGua.name}卦`;

  // 生成六爻详情（从初爻到上爻）
  const sixLines = Array.from({ length: 6 }, (_, i) => ({
    position: i + 1,
    yao: i % 2 === 0 ? '阳爻' : '阴爻',
    yinYang: i % 2 === 0 ? '阳' : '阴',
  }));

  // 随机确定世应位置（1-6爻）
  const world = (seed % 6) + 1;
  const response = (world + 3) % 6 || 6;

  // 生成纳甲
  const naJia = sixLines.map((_, i) => {
    const ganIdx = (seed + i * 2) % 10;
    const zhiIdx = (seed + i * 3) % 12;
    return `${NA_JIA_GAN[ganIdx]}${NA_JIA_ZHI[zhiIdx]}`;
  });

  const summary = `关于"${question}"的六爻占卜结果：`
    + `本卦为${originalName}（${upperGua.name}上${lowerGua.name}下），`
    + `变卦为${changedName}。`
    + `世在第${world}爻，应在第${response}爻，`
    + `整体卦象显示需审慎行事，顺势而为。`;

  return {
    summary,
    details: {
      question,
      originalGua: { name: originalName, symbol: `${upperGua.symbol}\n${lowerGua.symbol}` },
      changedGua: { name: changedName, symbol: `${changedGua.symbol}\n${lowerGua.symbol}` },
      sixLines,
      worldResponse: { world, response },
      naJia,
    },
  };
}
