/**
 * 月相占卜服务
 * 真实天文算法：Meeus《Astronomical Algorithms》第 49 章平朔公式 + 主要周期项修正
 * 由日期的儒略日推算最近朔日，得到月龄、相位角与真实照明度
 */

import type { MoonphaseResult } from '../types';

/** 朔望月长度（天） */
const SYNODIC_MONTH = 29.530588861;

const DEG = Math.PI / 180;

/** 日期 → 儒略日（UT） */
function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** 儒略日 → Date（UT） */
function fromJulian(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

/**
 * 第 k 个朔的儒略日（Meeus 49.1，含主要周期修正）
 * @param k 朔序号（2000-01-06 附近 k=0）
 */
function newMoonJD(k: number): number {
  const T = k / 1236.85;
  const jde0 =
    2451550.09766
    + SYNODIC_MONTH * k
    + 0.00015437 * T * T
    - 0.000000150 * T * T * T
    + 0.00000000073 * T * T * T * T;

  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T * T - 0.00000011 * T * T * T) * DEG;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T * T * T - 0.000000058 * T * T * T * T) * DEG;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T * T * T + 0.000000011 * T * T * T * T) * DEG;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T * T * T) * DEG;

  const corr =
    -0.40720 * Math.sin(Mp)
    + 0.17241 * E * Math.sin(M)
    + 0.01608 * Math.sin(2 * Mp)
    + 0.01039 * Math.sin(2 * F)
    + 0.00739 * E * Math.sin(Mp - M)
    - 0.00514 * E * Math.sin(Mp + M)
    + 0.00208 * E * E * Math.sin(2 * M)
    - 0.00111 * Math.sin(Mp - 2 * F)
    - 0.00057 * Math.sin(Mp + 2 * F)
    + 0.00056 * E * Math.sin(2 * Mp + M)
    - 0.00042 * Math.sin(3 * Mp)
    + 0.00042 * E * Math.sin(M + 2 * F)
    + 0.00038 * E * Math.sin(M - 2 * F)
    - 0.00024 * E * Math.sin(2 * Mp - M)
    - 0.00017 * Math.sin(Om)
    - 0.00007 * Math.sin(Mp + 2 * M)
    + 0.00004 * Math.sin(2 * Mp - 2 * F)
    + 0.00004 * Math.sin(3 * M)
    + 0.00003 * Math.sin(Mp + M - 2 * F)
    + 0.00003 * Math.sin(2 * Mp + 2 * F)
    - 0.00003 * Math.sin(Mp + M + 2 * F)
    + 0.00003 * Math.sin(Mp - M + 2 * F)
    - 0.00002 * Math.sin(Mp - M - 2 * F)
    - 0.00002 * Math.sin(3 * Mp + M)
    + 0.00002 * Math.sin(4 * Mp);

  return jde0 + corr;
}

/** 求目标时刻之前最近的朔日（儒略日）与月龄 */
function moonAgeAt(date: Date): { age: number; newMoon: Date; nextNewMoon: Date } {
  const jd = toJulian(date);
  const kApprox = Math.floor((jd - 2451550.09766) / SYNODIC_MONTH);
  let prev = newMoonJD(kApprox);
  let next = newMoonJD(kApprox + 1);
  for (let k = kApprox - 2; k <= kApprox + 2; k++) {
    const t = newMoonJD(k);
    if (t <= jd && t > prev) prev = t;
    if (t > jd && t < next) next = t;
  }
  if (prev > jd) prev = newMoonJD(kApprox - 1);
  if (next <= jd) next = newMoonJD(kApprox + 2);
  return { age: jd - prev, newMoon: fromJulian(prev), nextNewMoon: fromJulian(next) };
}

/** 月相名（按相位角 8 分，新月/上弦/满月/下弦各占中心窗口） */
function phaseOf(age: number): {
  name: string;
  emoji: string;
  traits: string[];
  desc: string;
  emotionalPattern: string;
  advice: string;
} {
  const t = ((age % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH / SYNODIC_MONTH;
  const table = [
    { max: 0.0339, name: '新月', emoji: '🌑', traits: ['富有远见', '善于开启新事物', '内心深邃'], desc: '新开始、黑暗中的种子' },
    { max: 0.1856, name: '蛾眉月', emoji: '🌒', traits: ['充满好奇心', '积极进取', '善于学习'], desc: '希望萌芽、初步显现' },
    { max: 0.3125, name: '上弦月', emoji: '🌓', traits: ['果断决断', '勇于面对挑战', '注重行动'], desc: '决策时刻、行动推进' },
    { max: 0.4368, name: '盈凸月', emoji: '🌔', traits: ['精益求精', '耐心执着', '追求完美'], desc: '调整优化、接近目标' },
    { max: 0.5632, name: '满月', emoji: '🌕', traits: ['情感丰富', '表现力强', '人际交往能力突出'], desc: '圆满成就、能量顶峰' },
    { max: 0.6875, name: '亏凸月', emoji: '🌖', traits: ['慷慨大方', '善于传授', '富有同情心'], desc: '感恩收获、回馈分享' },
    { max: 0.8144, name: '下弦月', emoji: '🌗', traits: ['善于反思', '内心成熟', '懂得放下'], desc: '释放放下、内心清理' },
    { max: 0.9661, name: '残月', emoji: '🌘', traits: ['直觉敏锐', '富有灵性', '善于内省'], desc: '休养生息、静待重生' },
    { max: 1.0001, name: '新月', emoji: '🌑', traits: ['富有远见', '善于开启新事物', '内心深邃'], desc: '新开始、黑暗中的种子' },
  ];
  const found = table.find((p) => t < p.max) ?? table[0];
  const isWaxing = t < 0.5;
  return {
    name: found.name,
    emoji: found.emoji,
    traits: found.traits,
    desc: found.desc,
    emotionalPattern: isWaxing
      ? '处于渐盈阶段：情感外放、主动进取，适合对外表达与推动事情向前。'
      : '处于渐亏阶段：情感内敛、善于沉淀，适合复盘总结与内在整理。',
    advice: t < 0.125
      ? '适合许愿立项、开启新计划，把种子种下。'
      : t < 0.375
        ? '适合推进执行、做出决断，把想法变成行动。'
        : t < 0.625
          ? '能量高峰，适合展示成果、维护关系，也要注意情绪过满。'
          : t < 0.875
            ? '适合收尾复盘、释放负担，为下一轮腾出空间。'
            : '适合静养内省、沉淀积累，等待新的开始。',
  };
}

/**
 * 计算月相占卜
 * @param birthDate 出生日期（YYYY-MM-DD）
 */
export function calculateMoonphase(birthDate: string): MoonphaseResult {
  const parts = birthDate.split('-').map((p) => parseInt(p, 10));
  const [year, month, day] = parts;
  // 以当地正午代表当日（月相日间变化很小）
  const target = new Date(year, (month || 1) - 1, day || 1, 12, 0, 0);

  const { age, newMoon, nextNewMoon } = moonAgeAt(target);
  const phaseAngle = (age / SYNODIC_MONTH) * 360;
  const illumination = ((1 - Math.cos(phaseAngle * DEG)) / 2) * 100;
  const phase = phaseOf(age);

  const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    + ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const summary =
    `${birthDate} 出生时月相为${phase.name}${phase.emoji}，月龄 ${age.toFixed(1)} 天，`
    + `照明度 ${illumination.toFixed(0)}%，${phase.desc}。`
    + `个人特质：${phase.traits.join('、')}。建议：${phase.advice}`;

  return {
    summary,
    details: {
      moonPhase: phase.name,
      moonEmoji: phase.emoji,
      illumination: `${illumination.toFixed(0)}%`,
      illuminationPercent: Number(illumination.toFixed(1)),
      moonAge: Number(age.toFixed(2)),
      phaseAngle: Number(phaseAngle.toFixed(1)),
      waxing: phaseAngle < 180,
      newMoonAt: fmtDate(newMoon),
      nextNewMoonAt: fmtDate(nextNewMoon),
      birthDate,
      traits: phase.traits,
      emotionalPattern: phase.emotionalPattern,
      advice: phase.advice,
    },
  };
}

/** 八相基础数据（供手动选相使用） */
const PHASE_TABLE = [
  { key: 'new', name: '新月', emoji: '🌑', illumination: '0%', desc: '新开始、黑暗中的种子', traits: ['富有远见', '善于开启新事物', '内心深邃'] },
  { key: 'waxing-crescent', name: '蛾眉月', emoji: '🌒', illumination: '10%', desc: '希望萌芽、初步显现', traits: ['充满好奇心', '积极进取', '善于学习'] },
  { key: 'first-quarter', name: '上弦月', emoji: '🌓', illumination: '50%', desc: '决策时刻、行动推进', traits: ['果断决断', '勇于面对挑战', '注重行动'] },
  { key: 'waxing-gibbous', name: '盈凸月', emoji: '🌔', illumination: '75%', desc: '调整优化、接近目标', traits: ['精益求精', '耐心执着', '追求完美'] },
  { key: 'full', name: '满月', emoji: '🌕', illumination: '100%', desc: '圆满成就、能量顶峰', traits: ['情感丰富', '表现力强', '人际交往能力突出'] },
  { key: 'waning-gibbous', name: '亏凸月', emoji: '🌖', illumination: '75%', desc: '感恩收获、回馈分享', traits: ['慷慨大方', '善于传授', '富有同情心'] },
  { key: 'last-quarter', name: '下弦月', emoji: '🌗', illumination: '50%', desc: '释放放下、内心清理', traits: ['善于反思', '内心成熟', '懂得放下'] },
  { key: 'waning-crescent', name: '残月', emoji: '🌘', illumination: '10%', desc: '休养生息、静待重生', traits: ['直觉敏锐', '富有灵性', '善于内省'] },
];

/**
 * 按指定月相生成占卜解读（用户主动选择月相时使用）
 * @param phaseKey 月相标识（new/waxing-crescent/first-quarter/waxing-gibbous/full/waning-gibbous/last-quarter/waning-crescent）
 * @param question 占卜问题（可选）
 */
export function calculateMoonphaseByPhase(phaseKey: string, question?: string): MoonphaseResult {
  const idx = PHASE_TABLE.findIndex((p) => p.key === phaseKey);
  const phase = PHASE_TABLE[idx >= 0 ? idx : 4];
  const isWaxing = idx >= 0 ? idx <= 3 : false;

  const emotionalPattern = isWaxing
    ? '处于渐盈阶段：情感外放、主动进取，适合对外表达与推动事情向前。'
    : '处于渐亏阶段：情感内敛、善于沉淀，适合复盘总结与内在整理。';

  const advice = idx <= 2
    ? '适合开启新计划，抓住时机大胆行动。'
    : idx <= 5
      ? '适合巩固已有成果，维护人际关系。'
      : '适合放慢节奏，反思过去，为下一个周期积蓄能量。';

  const questionStr = question ? `关于「${question}」，` : '';
  const summary =
    `${questionStr}当前选择${phase.name}${phase.emoji}，${phase.desc}。`
    + `该阶段特质：${phase.traits.join('、')}。建议：${advice}`;

  return {
    summary,
    details: {
      moonPhase: phase.name,
      moonEmoji: phase.emoji,
      illumination: phase.illumination,
      waxing: isWaxing,
      traits: phase.traits,
      emotionalPattern,
      advice,
    },
  };
}
