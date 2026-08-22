/**
 * 月相占卜服务
 * 根据出生日期计算出生时的月相，分析个人特质
 * 当前为模拟数据实现，后续可接入天文算法
 */

import type { MoonphaseResult } from '../types';

/** 月相数据 */
const MOON_PHASES = [
  { name: '新月', emoji: '🌑', illumination: '0%', desc: '新开始、黑暗中的种子' },
  { name: '蛾眉月', emoji: '🌒', illumination: '10%', desc: '希望萌芽、初步显现' },
  { name: '上弦月', emoji: '🌓', illumination: '50%', desc: '决策时刻、行动推进' },
  { name: '盈凸月', emoji: '🌔', illumination: '75%', desc: '调整优化、接近目标' },
  { name: '满月', emoji: '🌕', illumination: '100%', desc: '圆满成就、能量顶峰' },
  { name: '亏凸月', emoji: '🌖', illumination: '75%', desc: '感恩收获、回馈分享' },
  { name: '下弦月', emoji: '🌗', illumination: '50%', desc: '释放放下、内心清理' },
  { name: '残月', emoji: '🌘', illumination: '10%', desc: '休养生息、静待重生' },
];

/** 月相特质分析 */
const PHASE_TRAITS: Record<string, string[]> = {
  '新月': ['富有远见', '善于开启新事物', '内心深邃'],
  '蛾眉月': ['充满好奇心', '积极进取', '善于学习'],
  '上弦月': ['果断决断', '勇于面对挑战', '注重行动'],
  '盈凸月': ['精益求精', '耐心执着', '追求完美'],
  '满月': ['情感丰富', '表现力强', '人际交往能力突出'],
  '亏凸月': ['慷慨大方', '善于传授', '富有同情心'],
  '下弦月': ['善于反思', '内心成熟', '懂得放下'],
  '残月': ['直觉敏锐', '富有灵性', '善于内省'],
};

/**
 * 计算月相占卜
 * @param birthDate 出生日期（YYYY-MM-DD）
 */
export function calculateMoonphase(birthDate: string): MoonphaseResult {
  const parts = birthDate.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  const year = parseInt(parts[0]);

  // 简化月相计算：基于日期生成确定性月相索引
  // 实际应使用天文算法计算精确月相
  const moonCycle = 29.53; // 月相周期（天）
  // 以已知新月日期为基准（2000年1月6日为新月）
  const baseDate = new Date(2000, 0, 6);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const phaseIndex = Math.floor(Math.abs(diffDays % moonCycle) / (moonCycle / 8)) % 8;

  const phase = MOON_PHASES[phaseIndex];
  const traits = PHASE_TRAITS[phase.name] || ['适应力强', '思维灵活'];

  // 情感模式分析
  const emotionalPattern = phaseIndex <= 3
    ? '情感表达偏向外放，容易受外界影响，适合在社交环境中释放情绪。'
    : '情感表达偏向内敛，善于处理内心感受，适合独处时进行情绪调节。';

  // 建议
  const advice = phaseIndex <= 2
    ? '适合开启新计划，抓住时机大胆行动。'
    : phaseIndex <= 5
      ? '适合巩固已有成果，维护人际关系。'
      : '适合放慢节奏，反思过去，为下一个周期积蓄能量。';

  const summary = `出生月相为${phase.name}${phase.emoji}，`
    + `${phase.desc}。`
    + `个人特质：${traits.join('、')}。`
    + `建议：${advice}`;

  return {
    summary,
    details: {
      moonPhase: phase.name,
      moonEmoji: phase.emoji,
      illumination: phase.illumination,
      traits,
      emotionalPattern,
      advice,
    },
  };
}

/** 前端月相 key 到月相索引的映射（与 MOON_PHASES 顺序一致） */
const PHASE_KEY_INDEX: Record<string, number> = {
  'new': 0,
  'waxing-crescent': 1,
  'first-quarter': 2,
  'waxing-gibbous': 3,
  'full': 4,
  'waning-gibbous': 5,
  'last-quarter': 6,
  'waning-crescent': 7,
};

/**
 * 按指定月相生成占卜解读（用户主动选择月相时使用）
 * @param phaseKey 月相标识（new/waxing-crescent/first-quarter/waxing-gibbous/full/waning-gibbous/last-quarter/waning-crescent）
 * @param question 占卜问题（可选）
 */
export function calculateMoonphaseByPhase(phaseKey: string, question?: string): MoonphaseResult {
  const phaseIndex = PHASE_KEY_INDEX[phaseKey] ?? 4;
  const phase = MOON_PHASES[phaseIndex];
  const traits = PHASE_TRAITS[phase.name] || ['适应力强', '思维灵活'];

  const emotionalPattern = phaseIndex <= 3
    ? '情感表达偏向外放，容易受外界影响，适合在社交环境中释放情绪。'
    : '情感表达偏向内敛，善于处理内心感受，适合独处时进行情绪调节。';

  const advice = phaseIndex <= 2
    ? '适合开启新计划，抓住时机大胆行动。'
    : phaseIndex <= 5
      ? '适合巩固已有成果，维护人际关系。'
      : '适合放慢节奏，反思过去，为下一个周期积蓄能量。';

  const questionStr = question ? `关于"${question}"，` : '';
  const summary = `${questionStr}当前选择${phase.name}${phase.emoji}，`
    + `${phase.desc}`
    + `该阶段特质：${traits.join('、')}。`
    + `建议：${advice}`;

  return {
    summary,
    details: {
      moonPhase: phase.name,
      moonEmoji: phase.emoji,
      illumination: phase.illumination,
      traits,
      emotionalPattern,
      advice,
    },
  };
}
