/**
 * 数字能量（生命灵数）计算服务
 * 根据出生日期计算生命灵数、天赋数等核心数字
 * 当前为模拟数据实现，后续可接入完整算法
 */

import type { NumerologyResult } from '../types';
import { stableDigit, fnv1a } from '../utils/hash';

/** 生命灵数含义对照表 */
const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: '领导力强，独立自主，富有创新精神，天生领袖。',
  2: '善于合作，感性细腻，追求和谐，天生的和平使者。',
  3: '富有创造力，善于表达，乐观开朗，天生的艺术家。',
  4: '踏实稳重，注重秩序，勤奋可靠，天生的建设者。',
  5: '追求自由，适应力强，热爱冒险，天生的探索者。',
  6: '富有爱心，责任心强，注重家庭，天生的照顾者。',
  7: '善于思考，追求真理，内心深邃，天生的哲学家。',
  8: '追求成功，掌控力强，善于管理，天生的商业家。',
  9: '博爱无私，富有同情心，追求理想，天生的人道主义者。',
};

/** 个人年含义对照表 */
const PERSONAL_YEAR_MEANINGS: Record<number, string> = {
  1: '新的开始，播种希望，适合开拓新领域。',
  2: '耐心等待，合作发展，适合建立合作关系。',
  3: '创意迸发，社交活跃，适合表达与展示。',
  4: '巩固基础，脚踏实地，适合踏实工作。',
  5: '变化变革，自由探索，适合尝试新事物。',
  6: '家庭责任，关爱他人，适合回归家庭。',
  7: '内省反思，精神成长，适合深度学习。',
  8: '收获回报，财务管理，适合商业决策。',
  9: '总结反思，释放过去，适合圆满收尾。',
};

/** 将数字缩减到个位数（大师数11/22/33除外） */
function reduceToSingle(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

/**
 * 计算数字能量（生命灵数）
 * @param birthDate 出生日期（YYYY-MM-DD）
 */
export function calculateNumerology(birthDate: string): NumerologyResult {
  const parts = birthDate.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  const year = parseInt(parts[0]);

  // 生命灵数 = 年+月+日各位数字之和缩减至单数
  const yearSum = String(year).split('').reduce((s, d) => s + parseInt(d), 0);
  const daySum = String(day).split('').reduce((s, d) => s + parseInt(d), 0);
  const lifePathNumber = reduceToSingle(yearSum + month + daySum);

  // 生日数
  const birthdayNumber = reduceToSingle(day);

  // 个人年数 = 当年年份各位之和 + 出生月 + 出生日
  const currentYear = new Date().getFullYear();
  const currentYearSum = String(currentYear).split('').reduce((s, d) => s + parseInt(d), 0);
  const personalYear = reduceToSingle(currentYearSum + month + daySum);

  // 表达数（天赋数）= 名字对应（此处用出生日期模拟）
  const expressionNumber = reduceToSingle(month + day);

  // 灵魂数 = 元音对应（此处模拟）
  const soulNumber = reduceToSingle(day + month);

  // 性格数 = 辅音对应（此处模拟）
  const personalityNumber = reduceToSingle(yearSum + day);

  // 成熟数 = 生命灵数 + 表达数
  const maturityNumber = reduceToSingle(lifePathNumber + expressionNumber);

  const meaning = LIFE_PATH_MEANINGS[lifePathNumber] || '独特的数字组合，具有特殊天赋。';
  const pyMeaning = PERSONAL_YEAR_MEANINGS[personalYear] || '平稳过渡的一年。';

  const summary = `生命灵数为${lifePathNumber}，生日数为${birthdayNumber}。`
    + `${meaning}当前个人年为${personalYear}，${pyMeaning}`;

  return {
    summary,
    details: {
      lifePathNumber,
      lifePathMeaning: meaning,
      birthdayNumber,
      personalYear,
      personalYearMeaning: pyMeaning,
      expressionNumber,
      soulNumber,
      personalityNumber,
      maturityNumber,
    },
  };
}

/** 各分析类型对应的中文标签 */
const TYPE_LABELS: Record<string, string> = {
  'life-path': '生命灵数',
  'name': '姓名灵数',
  'phone': '手机号能量数',
  'plate': '车牌号能量数',
  'custom': '自定义数字能量',
};

/**
 * 基于任意输入（姓名/手机号/车牌/自定义数字）计算数字能量
 * 与 calculateNumerology 返回相同结构，核心数字由输入稳定派生
 * @param value 用户输入值
 * @param type 分析类型（life-path/name/phone/plate/custom）
 */
export function calculateNumerologyFromValue(value: string, type?: string): NumerologyResult {
  const label = TYPE_LABELS[type || ''] || '数字能量';
  const core = stableDigit(value);

  // 用哈希派生其余数字，保证同一输入结果稳定可复现
  const seed = fnv1a(`${type || 'custom'}:${value}`);
  const personalYear = (seed % 9) + 1;
  const expressionNumber = ((seed >> 3) % 9) + 1;
  const soulNumber = ((seed >> 6) % 9) + 1;
  const personalityNumber = ((seed >> 9) % 9) + 1;
  const maturityNumber = reduceToSingle(core + expressionNumber);

  const meaning = LIFE_PATH_MEANINGS[core] || '独特的数字组合，具有特殊天赋。';
  const pyMeaning = PERSONAL_YEAR_MEANINGS[personalYear] || '平稳过渡的一年。';

  const summary = `您的${label}为${core}，${meaning}当前能量年数为${personalYear}，${pyMeaning}`;

  return {
    summary,
    details: {
      lifePathNumber: core,
      lifePathMeaning: meaning,
      birthdayNumber: core,
      personalYear,
      personalYearMeaning: pyMeaning,
      expressionNumber,
      soulNumber,
      personalityNumber,
      maturityNumber,
    },
  };
}
