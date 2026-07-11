/**
 * 占星骰子占卜服务
 * 掷出三颗骰子分别代表行星、星座、宫位
 * 当前为模拟数据实现，后续可接入完整算法
 */

import type { AstrodiceResult } from '../types';

/** 行星骰子 */
const PLANETS = [
  { name: '太阳', nameEn: 'Sun', meaning: '自我、核心、生命力' },
  { name: '月亮', nameEn: 'Moon', meaning: '情感、直觉、内心' },
  { name: '水星', nameEn: 'Mercury', meaning: '沟通、思维、学习' },
  { name: '金星', nameEn: 'Venus', meaning: '爱情、美、价值观' },
  { name: '火星', nameEn: 'Mars', meaning: '行动、欲望、勇气' },
  { name: '木星', nameEn: 'Jupiter', meaning: '幸运、成长、扩张' },
  { name: '土星', nameEn: 'Saturn', meaning: '责任、限制、成熟' },
  { name: '天王星', nameEn: 'Uranus', meaning: '变革、自由、创新' },
  { name: '海王星', nameEn: 'Neptune', meaning: '梦想、灵性、迷幻' },
  { name: '冥王星', nameEn: 'Pluto', meaning: '转化、重生、深度' },
  { name: '北交点', nameEn: 'North Node', meaning: '命运方向、灵性目标' },
  { name: '谷神星', nameEn: 'Ceres', meaning: '滋养、照顾、大地' },
];

/** 星座骰子 */
const ZODIACS = [
  { name: '白羊座', nameEn: 'Aries', meaning: '开创、冲动、勇敢' },
  { name: '金牛座', nameEn: 'Taurus', meaning: '稳定、物质、享乐' },
  { name: '双子座', nameEn: 'Gemini', meaning: '沟通、变化、好奇' },
  { name: '巨蟹座', nameEn: 'Cancer', meaning: '情感、家庭、保护' },
  { name: '狮子座', nameEn: 'Leo', meaning: '创造力、自信、表达' },
  { name: '处女座', nameEn: 'Virgo', meaning: '分析、服务、完美' },
  { name: '天秤座', nameEn: 'Libra', meaning: '平衡、关系、美学' },
  { name: '天蝎座', nameEn: 'Scorpio', meaning: '深度、转化、掌控' },
  { name: '射手座', nameEn: 'Sagittarius', meaning: '探索、哲学、自由' },
  { name: '摩羯座', nameEn: 'Capricorn', meaning: '事业、纪律、成就' },
  { name: '水瓶座', nameEn: 'Aquarius', meaning: '独立、创新、人道' },
  { name: '双鱼座', nameEn: 'Pisces', meaning: '直觉、慈悲、灵性' },
];

/** 宫位骰子 */
const HOUSES = [
  { name: '第一宫（自我宫）', meaning: '自我形象、外在表现' },
  { name: '第二宫（财帛宫）', meaning: '财务、物质价值' },
  { name: '第三宫（兄弟宫）', meaning: '沟通、短途旅行、学习' },
  { name: '第四宫（家庭宫）', meaning: '家庭、根基、情感基础' },
  { name: '第五宫（子女宫）', meaning: '创造力、恋爱、娱乐' },
  { name: '第六宫（健康宫）', meaning: '健康、日常工作、服务' },
  { name: '第七宫（伴侣宫）', meaning: '合作关系、婚姻、公开敌人' },
  { name: '第八宫（疾厄宫）', meaning: '共享资源、转化、重生' },
  { name: '第九宫（迁移宫）', meaning: '高等教育、哲学、远行' },
  { name: '第十宫（事业宫）', meaning: '事业、公众形象、成就' },
  { name: '第十一宫（福德宫）', meaning: '友谊、社区、愿望' },
  { name: '第十二宫（玄秘宫）', meaning: '潜意识、隐秘事务、灵性' },
];

/**
 * 掷占星骰子
 * @param question 占卜问题（可选）
 */
export function castAstrodice(question?: string): AstrodiceResult {
  // 随机掷出三颗骰子
  const planet = PLANETS[Math.floor(Math.random() * PLANETS.length)];
  const zodiac = ZODIACS[Math.floor(Math.random() * ZODIACS.length)];
  const house = HOUSES[Math.floor(Math.random() * HOUSES.length)];

  // 生成综合解读
  const interpretation = question
    ? `关于"${question}"的占星骰子解读：`
      + `${planet.name}落在${zodiac.name}的${house.name}，`
      + `意味着在${house.meaning}方面，${planet.meaning}的力量正受到${zodiac.meaning}特质的影响。`
      + `建议关注这一领域的变化与机遇。`
    : `骰子显示${planet.name}落在${zodiac.name}的${house.name}，`
      + `${planet.meaning}在${zodiac.meaning}的能量下作用于${house.meaning}领域，`
      + `暗示近期这一领域会有重要事件发生。`;

  const summary = `占星骰子结果：${planet.name}（${planet.nameEn}）`
    + `+ ${zodiac.name}（${zodiac.nameEn}）`
    + `+ ${house.name}。`
    + `${planet.meaning}与${zodiac.meaning}在${house.meaning}层面产生共振。`;

  return {
    summary,
    details: {
      dice1: { type: 'planet', name: planet.name, nameEn: planet.nameEn, meaning: planet.meaning },
      dice2: { type: 'zodiac', name: zodiac.name, nameEn: zodiac.nameEn, meaning: zodiac.meaning },
      dice3: { type: 'house', name: house.name, meaning: house.meaning },
      interpretation,
    },
  };
}
