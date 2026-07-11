/**
 * 符文占卜服务
 * 支持单牌阵和三牌阵（过去/现在/未来）
 * 当前为模拟数据实现
 */

import type { RuneResult } from '../types';

/** 北欧符文（Elder Futhark 24符文） */
const RUNE_SET = [
  { name: '费胡', symbol: 'ᚠ', meaning: '财富、丰盛、新的开始', reversedMeaning: '损失、停滞' },
  { name: '乌鲁兹', symbol: 'ᚢ', meaning: '力量、健康、生命力', reversedMeaning: '虚弱、疾病' },
  { name: '苏里萨兹', symbol: 'ᚦ', meaning: '守护、防御、 gateway', reversedMeaning: '危险、攻击' },
  { name: '安苏兹', symbol: 'ᚨ', meaning: '智慧、沟通、灵感', reversedMeaning: '误导、误解' },
  { name: '莱多', symbol: 'ᚱ', meaning: '旅行、旅程、节奏', reversedMeaning: '延误、停滞' },
  { name: '肯纳兹', symbol: 'ᚲ', meaning: '光明、知识、创造力', reversedMeaning: '黑暗、无知' },
  { name: '盖博', symbol: 'ᚷ', meaning: '礼物、伙伴关系、平衡', reversedMeaning: '孤独、失衡' },
  { name: '温尤', symbol: 'ᚹ', meaning: '喜悦、和谐、幸福', reversedMeaning: '悲伤、冲突' },
  { name: '哈格拉兹', symbol: 'ᚺ', meaning: '变革、破坏与创造', reversedMeaning: '混乱、失控' },
  { name: '纳乌迪兹', symbol: 'ᚾ', meaning: '忍耐、限制、需求', reversedMeaning: '束缚、绝望' },
  { name: '伊莎', symbol: 'ᛁ', meaning: '静止、冰、冻结', reversedMeaning: '冷漠、无情' },
  { name: '耶拉', symbol: 'ᛃ', meaning: '收获、循环、季节', reversedMeaning: '荒芜、错过时机' },
  { name: '埃瓦兹', symbol: 'ᛇ', meaning: '马、移动、信任', reversedMeaning: '运动受阻、背叛' },
  { name: '佩索', symbol: 'ᛈ', meaning: '神秘、宿命、概率', reversedMeaning: '困惑、迷失' },
  { name: '艾瓦兹', symbol: 'ᛉ', meaning: '防御、弓箭、挑战', reversedMeaning: '脆弱、无力' },
  { name: '阿尔吉兹', symbol: 'ᛊ', meaning: '保护、觉醒、守护', reversedMeaning: '危险、暴露' },
  { name: '索维洛', symbol: 'ᛋ', meaning: '太阳、胜利、力量', reversedMeaning: '失败、阴郁' },
  { name: '提瓦兹', symbol: 'ᛏ', meaning: '战神、正义、荣誉', reversedMeaning: '不公、失败' },
  { name: '贝尔卡纳', symbol: 'ᛒ', meaning: '诞生、成长、滋养', reversedMeaning: '阻碍、不育' },
  { name: '艾瓦兹', symbol: 'ᛖ', meaning: '马、旅途、合作', reversedMeaning: '障碍、孤立' },
  { name: '曼纳兹', symbol: 'ᛗ', meaning: '人类、自我、意识', reversedMeaning: '自我封闭、孤立' },
  { name: '拉格兹', symbol: 'ᛚ', meaning: '水流、直觉、流动', reversedMeaning: '恐惧、阻碍' },
  { name: '英格瓦兹', symbol: 'ᛜ', meaning: '丰饶、和平、完成', reversedMeaning: '空虚、未完成' },
  { name: '达格兹', symbol: 'ᛞ', meaning: '黎明、突破、觉醒', reversedMeaning: '延误、幻灭' },
];

/** 三牌阵位置名称 */
const THREE_SPREAD_POSITIONS = ['过去', '现在', '未来'];

/**
 * 符文占卜
 * @param spread 牌阵类型：single（单牌）或 three（三牌阵）
 * @param question 占卜问题（可选）
 */
export function castRune(spread: 'single' | 'three', question?: string): RuneResult {
  // 随机抽取符文
  const drawSingleRune = () => {
    const idx = Math.floor(Math.random() * RUNE_SET.length);
    const rune = RUNE_SET[idx];
    const isReversed = Math.random() < 0.3; // 30%概率逆位
    return {
      name: rune.name,
      symbol: rune.symbol,
      meaning: isReversed ? rune.reversedMeaning : rune.meaning,
      reversed: isReversed,
      position: undefined as string | undefined,
    };
  };

  // 根据牌阵类型抽取
  const count = spread === 'single' ? 1 : 3;
  const runes = Array.from({ length: count }, (_, i) => {
    const rune = drawSingleRune();
    if (spread === 'three') {
      rune.position = THREE_SPREAD_POSITIONS[i];
    }
    return rune;
  });

  const spreadName = spread === 'single' ? '单符文占卜' : '三符文占卜（过去-现在-未来）';
  const questionStr = question ? `关于"${question}"的` : '';

  const summary = `${questionStr}符文占卜结果：`
    + runes.map(r => `${r.name}${r.reversed ? '（逆位）' : ''}`).join('、')
    + `。整体能量显示当前处于转变阶段，保持觉察与开放心态。`;

  return {
    summary,
    details: {
      spread: spreadName,
      runes,
    },
  };
}
