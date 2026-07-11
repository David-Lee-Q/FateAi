/**
 * 梅花易数占卜服务
 * 支持按数字起卦和按时间起卦两种方式
 * 当前为模拟数据实现，后续可接入完整算法
 */

import type { MeihuaResult } from '../types';

/** 先天八卦数 */
const XIAN_TIAN_GUA = [
  { name: '乾', symbol: '☰', number: 1, wuXing: '金' },
  { name: '兑', symbol: '☱', number: 2, wuXing: '金' },
  { name: '离', symbol: '☲', number: 3, wuXing: '火' },
  { name: '震', symbol: '☳', number: 4, wuXing: '木' },
  { name: '巽', symbol: '☴', number: 5, wuXing: '木' },
  { name: '坎', symbol: '☵', number: 6, wuXing: '水' },
  { name: '艮', symbol: '☶', number: 7, wuXing: '土' },
  { name: '坤', symbol: '☷', number: 8, wuXing: '土' },
];

/** 五行体用关系 */
const TI_YONG_MAP: Record<string, string> = {
  '金': '金生水，金克木。体金用金，比和为吉；体金用水，泄气为凶。',
  '木': '木生火，木克土。体木用木，比和为吉；体木用水，生体为吉。',
  '水': '水生木，水克火。体水用水，比和为吉；体水用金，生体为吉。',
  '火': '火生土，火克金。体火用火，比和为吉；体火用木，生体为吉。',
  '土': '土生金，土克水。体土用土，比和为吉；体土用火，生体为吉。',
};

/** 根据数字获取对应卦象 */
function getGuaByNumber(num: number) {
  // 先天八卦数：1乾 2兑 3离 4震 5巽 6坎 7艮 8坤（0视为8坤）
  const idx = num === 0 ? 7 : (num - 1) % 8;
  return XIAN_TIAN_GUA[idx];
}

/**
 * 梅花易数起卦
 * @param method 起卦方式：'number'（数字起卦）或 'time'（时间起卦）
 * @param num1 第一个数字（数字起卦时使用）
 * @param num2 第二个数字（数字起卦时使用）
 * @param question 占卜问题（可选）
 */
export function castMeihua(
  method: 'number' | 'time',
  num1?: number,
  num2?: number,
  question?: string
): MeihuaResult {
  let upperNum: number, lowerNum: number;

  if (method === 'time') {
    // 时间起卦：上卦=时辰数，下卦=日期数
    const now = new Date();
    upperNum = now.getHours() % 12 + 1;
    lowerNum = now.getDate();
  } else {
    // 数字起卦
    upperNum = num1 || 1;
    lowerNum = num2 || 1;
  }

  // 上卦 = 上数 % 8，下卦 = 下数 % 8
  const upperGua = getGuaByNumber(upperNum % 8);
  const lowerGua = getGuaByNumber(lowerNum % 8);

  // 动爻 = (上数 + 下数 + 时辰数) % 6
  const nowHour = new Date().getHours();
  const dongYao = ((upperNum % 8) + (lowerNum % 8) + (nowHour % 12 + 1)) % 6;

  // 互卦：取本卦2、3、4爻为下互，3、4、5爻为上互
  const huLower = getGuaByNumber((upperNum + lowerNum + dongYao) % 8);
  const huUpper = getGuaByNumber((upperNum + lowerNum + dongYao + 1) % 8);

  // 确定体用关系（动爻所在卦为用卦，另一卦为体卦）
  const tiIsUpper = dongYao < 3;
  const tiGua = tiIsUpper ? upperGua : lowerGua;
  const yongGua = tiIsUpper ? lowerGua : upperGua;

  // 生成断卦解读
  const tiYongRelation = TI_YONG_MAP[tiGua.wuXing] || '五行平和，运势中平。';
  const interpretation = question
    ? `关于"${question}"的占断：本卦${upperGua.name}上${lowerGua.name}下，第${dongYao + 1}爻动。`
      + `体卦为${tiGua.name}（${tiGua.wuXing}），用卦为${yongGua.name}（${yongGua.wuXing}）。`
      + tiYongRelation
    : `本卦${upperGua.name}上${lowerGua.name}下，互卦${huUpper.name}上${huLower.name}下。`
      + `体卦为${tiGua.name}，用卦为${yongGua.name}。` + tiYongRelation;

  const methodStr = method === 'time' ? '时间起卦法' : '数字起卦法';

  const summary = `梅花易数（${methodStr}）占卜结果：`
    + `上卦${upperGua.name}${upperGua.symbol}，下卦${lowerGua.name}${lowerGua.symbol}，`
    + `第${dongYao + 1}爻动，互卦${huUpper.name}${huLower.name}。`
    + `体${tiGua.name}用${yongGua.name}，运势平稳中带有转机。`;

  return {
    summary,
    details: {
      method: methodStr,
      upperGua: { name: upperGua.name, symbol: upperGua.symbol },
      lowerGua: { name: lowerGua.name, symbol: lowerGua.symbol },
      mainGua: { name: `${upperGua.name}${lowerGua.name}`, symbol: `${upperGua.symbol}\n${lowerGua.symbol}` },
      huGua: { name: `${huUpper.name}${huLower.name}`, symbol: `${huUpper.symbol}\n${huLower.symbol}` },
      tiYong: { ti: `${tiGua.name}（${tiGua.wuXing}）`, yong: `${yongGua.name}（${yongGua.wuXing}）` },
      interpretation,
    },
  };
}
