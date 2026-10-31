/**
 * 塔罗牌服务
 * 78张塔罗牌数据、随机抽牌、牌面含义查询
 */

import type { TarotCard, TarotResult } from '../types';

/** 大阿卡纳（22张） */
const MAJOR_ARCANA: Array<{ id: number; name: string; nameEn: string; upright: string; reversed: string }> = [
  { id: 0, name: '愚者', nameEn: 'The Fool', upright: '新开始、冒险、天真无邪', reversed: '鲁莽、冒失、不切实际' },
  { id: 1, name: '魔术师', nameEn: 'The Magician', upright: '创造力、技巧、意志力', reversed: '欺诈、操控、缺乏计划' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess', upright: '直觉、神秘、潜意识', reversed: '秘密、缺乏方向、表面化' },
  { id: 3, name: '女皇', nameEn: 'The Empress', upright: '丰饶、母性、自然', reversed: '依赖、过度保护、创造力受阻' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', upright: '权威、领导力、稳定', reversed: '专制、固执、控制欲' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', upright: '传统、信仰、教导', reversed: '打破常规、叛逆、教条主义' },
  { id: 6, name: '恋人', nameEn: 'The Lovers', upright: '爱情、和谐、选择', reversed: '失衡、冲突、价值观不匹配' },
  { id: 7, name: '战车', nameEn: 'The Chariot', upright: '胜利、意志、决心', reversed: '失控、攻击性、方向不明' },
  { id: 8, name: '力量', nameEn: 'Strength', upright: '勇气、耐心、内在力量', reversed: '自我怀疑、软弱、缺乏勇气' },
  { id: 9, name: '隐士', nameEn: 'The Hermit', upright: '内省、独处、智慧', reversed: '孤僻、逃避、固执己见' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune', upright: '转变、机遇、命运', reversed: '厄运、抗拒变化、失去控制' },
  { id: 11, name: '正义', nameEn: 'Justice', upright: '公正、真相、因果', reversed: '不公、偏见、逃避责任' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man', upright: '牺牲、等待、新视角', reversed: '拖延、无谓牺牲、停滞' },
  { id: 13, name: '死神', nameEn: 'Death', upright: '结束、转变、重生', reversed: '抗拒改变、恐惧、停滞不前' },
  { id: 14, name: '节制', nameEn: 'Temperance', upright: '平衡、适度、耐心', reversed: '过度、失衡、缺乏远见' },
  { id: 15, name: '恶魔', nameEn: 'The Devil', upright: '束缚、诱惑、物质主义', reversed: '解脱、突破、远离不良影响' },
  { id: 16, name: '塔', nameEn: 'The Tower', upright: '突变、崩塌、觉醒', reversed: '灾难回避、恐惧变化、延后危机' },
  { id: 17, name: '星星', nameEn: 'The Star', upright: '希望、灵感、信心', reversed: '绝望、缺乏信心、迷失方向' },
  { id: 18, name: '月亮', nameEn: 'The Moon', upright: '幻觉、恐惧、潜意识', reversed: '释放恐惧、真相浮现、走出迷雾' },
  { id: 19, name: '太阳', nameEn: 'The Sun', upright: '成功、喜悦、活力', reversed: '暂时的挫折、过度乐观' },
  { id: 20, name: '审判', nameEn: 'Judgement', upright: '觉醒、重生、审视', reversed: '自我怀疑、逃避审判' },
  { id: 21, name: '世界', nameEn: 'The World', upright: '完成、圆满、成就', reversed: '未完成、缺乏闭合、拖延' },
];

/** 小阿卡纳花色 */
type MinorSuit = 'wands' | 'cups' | 'swords' | 'pentacles';
const MINOR_SUITS: Array<{ suit: MinorSuit; name: string; upright: string; reversed: string }> = [
  { suit: 'wands', name: '权杖', upright: '行动、热情、创造力', reversed: '拖延、缺乏方向' },
  { suit: 'cups', name: '圣杯', upright: '情感、关系、直觉', reversed: '情感压抑、关系问题' },
  { suit: 'swords', name: '宝剑', upright: '思考、冲突、真相', reversed: '混乱、思维受限' },
  { suit: 'pentacles', name: '星币', upright: '物质、财富、实际', reversed: '财务不稳、物质执念' },
];

/** 小阿卡纳数字/宫廷牌名称 */
const MINOR_RANKS = [
  'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Page', 'Knight', 'Queen', 'King',
];
const MINOR_RANK_NAMES: Record<string, string> = {
  'Ace': '首牌', '2': '二', '3': '三', '4': '四', '5': '五',
  '6': '六', '7': '七', '8': '八', '9': '九', '10': '十',
  'Page': '侍从', 'Knight': '骑士', 'Queen': '王后', 'King': '国王',
};


/** 五十六张小牌专属牌义（RWS 标准，正位/逆位） */
const MINOR_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  'wands-Ace': { upright: '灵感迸发、新机会、创造力启动', reversed: '动力受阻、计划延迟、缺乏热情' },
  'wands-2': { upright: '规划未来、抉择方向、远见', reversed: '恐惧未知、计划搁浅' },
  'wands-3': { upright: '扩张、远景初现、等待成果', reversed: '进展延迟、视野受限' },
  'wands-4': { upright: '庆祝、稳定、归属感', reversed: '过渡不稳、庆祝延后' },
  'wands-5': { upright: '竞争、冲突、磨合', reversed: '回避冲突、内耗' },
  'wands-6': { upright: '胜利、认可、凯旋', reversed: '缺乏认可、骄傲受挫' },
  'wands-7': { upright: '坚守立场、防御、应对挑战', reversed: '疲于应付、放弃阵地' },
  'wands-8': { upright: '迅速进展、消息传来、行动加速', reversed: '延误、混乱、节奏失控' },
  'wands-9': { upright: '坚韧、最后防线、警觉', reversed: '疲惫、固执、过度防备' },
  'wands-10': { upright: '重担、责任过载、坚持到底', reversed: '放下负担、逃避责任' },
  'wands-Page': { upright: '热情的新消息、探索、学习', reversed: '三分钟热度、消息不利' },
  'wands-Knight': { upright: '冒险、行动力、闯劲', reversed: '鲁莽、急躁、半途而废' },
  'wands-Queen': { upright: '自信、魅力、掌控局面', reversed: '嫉妒、专横、自我怀疑' },
  'wands-King': { upright: '领导力、远见、开创', reversed: '专断、傲慢、目标失焦' },
  'cups-Ace': { upright: '情感新生、爱意、直觉开启', reversed: '情感封闭、内心空虚' },
  'cups-2': { upright: '结合、互信、伴侣关系', reversed: '失衡、分歧、分离' },
  'cups-3': { upright: '友谊、庆祝、社群支持', reversed: '过度社交、关系失衡、孤立' },
  'cups-4': { upright: '倦怠、冷淡、错失机会', reversed: '重新振作、接受新机' },
  'cups-5': { upright: '失落、遗憾、执着过去', reversed: '接受现实、走出悲伤' },
  'cups-6': { upright: '怀旧、纯真、旧友重逢', reversed: '沉溺过去、成长停滞' },
  'cups-7': { upright: '幻想、选择过多、迷惑', reversed: '看清现实、做出决断' },
  'cups-8': { upright: '离开、追寻更深意义', reversed: '徘徊不定、害怕改变' },
  'cups-9': { upright: '满足、愿望达成、享受', reversed: '自满、虚假满足' },
  'cups-10': { upright: '圆满、家庭幸福、情感和谐', reversed: '关系破裂、理想落差' },
  'cups-Page': { upright: '情感讯息、灵感、温柔', reversed: '情绪化、不成熟' },
  'cups-Knight': { upright: '浪漫追求、理想主义', reversed: '空想、承诺不实' },
  'cups-Queen': { upright: '共情、包容、直觉敏锐', reversed: '情绪淹没、过度付出' },
  'cups-King': { upright: '情感成熟、稳重、宽容', reversed: '情绪操控、冷漠' },
  'swords-Ace': { upright: '真相、思路清晰、突破', reversed: '混乱、判断失误' },
  'swords-2': { upright: '僵局、两难、回避抉择', reversed: '决断、打破平衡' },
  'swords-3': { upright: '心痛、背叛、分离', reversed: '疗愈、开始释怀' },
  'swords-4': { upright: '休息、恢复、暂停', reversed: '倦怠、拒绝休息' },
  'swords-5': { upright: '冲突、胜负、代价', reversed: '和解、放下争执' },
  'swords-6': { upright: '过渡、离开困境、前行', reversed: '停滞、无法放下' },
  'swords-7': { upright: '策略、隐瞒、独自行动', reversed: '坦白、真相揭露' },
  'swords-8': { upright: '自我设限、受困', reversed: '解脱、看清出路' },
  'swords-9': { upright: '焦虑、失眠、忧惧', reversed: '走出焦虑、寻求帮助' },
  'swords-10': { upright: '终结、谷底、放手', reversed: '复苏、痛苦渐退' },
  'swords-Page': { upright: '好奇、观察、新想法', reversed: '口舌是非、多疑' },
  'swords-Knight': { upright: '果断、直率、迅速行动', reversed: '鲁莽、攻击性' },
  'swords-Queen': { upright: '理性、独立、洞察', reversed: '冷酷、刻薄、言语伤人' },
  'swords-King': { upright: '权威、逻辑、公正', reversed: '专断、滥用理性' },
  'pentacles-Ace': { upright: '物质机会、财务起点、务实', reversed: '错失机会、财务不稳' },
  'pentacles-2': { upright: '平衡、灵活、多线并行', reversed: '失衡、顾此失彼' },
  'pentacles-3': { upright: '协作、技艺、初步成果', reversed: '配合不佳、质量欠缺' },
  'pentacles-4': { upright: '守成、掌控、安全感', reversed: '吝啬或放手、失去控制' },
  'pentacles-5': { upright: '匮乏、困顿、被排除在外', reversed: '转机、援手出现' },
  'pentacles-6': { upright: '施与受、慷慨、公平', reversed: '施受失衡、债务压力' },
  'pentacles-7': { upright: '耐心、长期投入、评估', reversed: '焦躁、投入无回报' },
  'pentacles-8': { upright: '精进、专注、技艺提升', reversed: '敷衍、重复无进展' },
  'pentacles-9': { upright: '自足、丰盛、独立', reversed: '依赖、表面光鲜' },
  'pentacles-10': { upright: '家业、传承、稳固根基', reversed: '家庭财务纠纷、根基动摇' },
  'pentacles-Page': { upright: '学习、务实起步、踏实', reversed: '拖延、眼高手低' },
  'pentacles-Knight': { upright: '稳健、可靠、按部就班', reversed: '停滞、过于保守' },
  'pentacles-Queen': { upright: '务实、丰盛、照顾他人', reversed: '过度操劳、物质焦虑' },
  'pentacles-King': { upright: '富足、稳重、善于经营', reversed: '固执、贪婪、唯利是图' },
};

/** 构建完整78张牌组 */
function buildFullDeck(): TarotCard[] {
  const deck: TarotCard[] = [];

  // 大阿卡纳
  for (const card of MAJOR_ARCANA) {
    deck.push({
      id: card.id,
      name: card.name,
      nameEn: card.nameEn,
      suit: 'major',
      uprightMeaning: card.upright,
      reversedMeaning: card.reversed,
      isReversed: false,
    });
  }

  // 小阿卡纳
  let id = 22;
  for (const suitInfo of MINOR_SUITS) {
    for (const rank of MINOR_RANKS) {
      const rankName = MINOR_RANK_NAMES[rank] || rank;
      deck.push({
        id: id++,
        name: `${suitInfo.name}${rankName}`,
        nameEn: `${rank} of ${suitInfo.suit}`,
        suit: suitInfo.suit,
        uprightMeaning:
          MINOR_MEANINGS[`${suitInfo.suit}-${rank}`]?.upright
          ?? `${suitInfo.upright}（${rankName}）`,
        reversedMeaning:
          MINOR_MEANINGS[`${suitInfo.suit}-${rank}`]?.reversed
          ?? `${suitInfo.reversed}（${rankName}逆位）`,
        isReversed: false,
      });
    }
  }

  return deck;
}

/** 洗牌并随机抽牌 */
function drawCards(deck: TarotCard[], count: number): TarotCard[] {
  // 深拷贝避免修改原始牌组
  const shuffled = [...deck].map(card => ({ ...card }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 随机决定是否逆位（30%概率）
  return shuffled.slice(0, count).map(card => ({
    ...card,
    isReversed: Math.random() < 0.3,
  }));
}

/** 生成牌阵解读 */
function generateInterpretation(cards: TarotCard[], spread: string): string {
  const cardDescs = cards.map((card, i) => {
    const pos = card.isReversed ? '逆位' : '正位';
    const meaning = card.isReversed ? card.reversedMeaning : card.uprightMeaning;
    return `第${i + 1}张：${card.name}（${pos}）— ${meaning}`;
  });

  return [
    `【${spread === 'single' ? '单牌占卜' : spread === 'three' ? '三牌占卜（过去-现在-未来）' : '凯尔特十字'}】`,
    ...cardDescs,
    '',
    '综合解读：以上牌面揭示了当前的能量流动与潜在趋势，建议结合自身实际情况进行深入思考。',
  ].join('\n');
}

/**
 * 执行塔罗牌占卜
 * @param spread 牌阵类型：single（单牌）、three（三牌）、celtic（凯尔特十字）
 * @param question 占卜问题（可选）
 */
export function performTarotReading(spread: 'single' | 'three' | 'celtic', question?: string): TarotResult {
  const deck = buildFullDeck();
  const count = spread === 'single' ? 1 : spread === 'three' ? 3 : 10;
  const cards = drawCards(deck, count);
  const interpretation = generateInterpretation(cards, spread);

  return { cards, interpretation };
}

/**
 * 查询特定塔罗牌信息
 */
export function getCardInfo(cardId: number): TarotCard | undefined {
  const deck = buildFullDeck();
  return deck.find(card => card.id === cardId);
}

/**
 * 获取所有牌列表（不含逆位状态）
 */
export function getAllCards(): TarotCard[] {
  return buildFullDeck();
}
