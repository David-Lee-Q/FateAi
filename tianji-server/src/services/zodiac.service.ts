/**
 * 星座运势服务
 * 12星座信息、日期判断、模拟运势生成
 */

import type { ZodiacSign, ZodiacResult } from '../types';

/** 12星座基本信息 */
export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: '白羊座', nameEn: 'Aries', symbol: '♈',
    dateRange: '3月21日-4月19日', element: '火',
    startDate: '03-21', endDate: '04-19',
  },
  {
    name: '金牛座', nameEn: 'Taurus', symbol: '♉',
    dateRange: '4月20日-5月20日', element: '土',
    startDate: '04-20', endDate: '05-20',
  },
  {
    name: '双子座', nameEn: 'Gemini', symbol: '♊',
    dateRange: '5月21日-6月21日', element: '风',
    startDate: '05-21', endDate: '06-21',
  },
  {
    name: '巨蟹座', nameEn: 'Cancer', symbol: '♋',
    dateRange: '6月22日-7月22日', element: '水',
    startDate: '06-22', endDate: '07-22',
  },
  {
    name: '狮子座', nameEn: 'Leo', symbol: '♌',
    dateRange: '7月23日-8月22日', element: '火',
    startDate: '07-23', endDate: '08-22',
  },
  {
    name: '处女座', nameEn: 'Virgo', symbol: '♍',
    dateRange: '8月23日-9月22日', element: '土',
    startDate: '08-23', endDate: '09-22',
  },
  {
    name: '天秤座', nameEn: 'Libra', symbol: '♎',
    dateRange: '9月23日-10月23日', element: '风',
    startDate: '09-23', endDate: '10-23',
  },
  {
    name: '天蝎座', nameEn: 'Scorpio', symbol: '♏',
    dateRange: '10月24日-11月22日', element: '水',
    startDate: '10-24', endDate: '11-22',
  },
  {
    name: '射手座', nameEn: 'Sagittarius', symbol: '♐',
    dateRange: '11月23日-12月21日', element: '火',
    startDate: '11-23', endDate: '12-21',
  },
  {
    name: '摩羯座', nameEn: 'Capricorn', symbol: '♑',
    dateRange: '12月22日-1月19日', element: '土',
    startDate: '12-22', endDate: '01-19',
  },
  {
    name: '水瓶座', nameEn: 'Aquarius', symbol: '♒',
    dateRange: '1月20日-2月18日', element: '风',
    startDate: '01-20', endDate: '02-18',
  },
  {
    name: '双鱼座', nameEn: 'Pisces', symbol: '♓',
    dateRange: '2月19日-3月20日', element: '水',
    startDate: '02-19', endDate: '03-20',
  },
];

/** 运势描述模板库 */
const FORTUNE_DESCRIPTIONS = {
  love: [
    '桃花运旺盛，单身者有机会遇到心仪对象，已有伴侣者感情更加甜蜜。',
    '感情方面宜保持冷静，避免冲动行事，多沟通可以化解误解。',
    '爱情运势平稳，适合享受当下的甜蜜时光，用心经营关系。',
    '感情中可能出现小波折，但只要真诚面对，终将柳暗花明。',
    '贵人星入命，异性缘佳，社交场合可能有意想不到的邂逅。',
  ],
  career: [
    '事业运势高涨，工作效率提升，适合推进重要项目或提出新方案。',
    '工作中需注意细节，避免疏忽导致失误，踏实做事终获认可。',
    '职场人际关系和谐，团队合作顺利，可借助他人力量达成目标。',
    '可能面临一些挑战和压力，但这也是成长的机会，保持积极心态。',
    '灵感爆发，适合创意类工作，把握机会展现自己的才华。',
  ],
  wealth: [
    '财运亨通，正财收入稳定，偏财运也有所提升，可适度理财。',
    '财务状况平稳，宜保守理财，避免高风险投资。',
    '有意外进财的机会，但也要注意控制开支，量入为出。',
    '财运一般，不宜进行大额消费或投资，耐心等待时机。',
    '贵人相助带来财运，可能获得奖金、加薪等好消息。',
  ],
  health: [
    '身体状况良好，精力充沛，适合进行户外运动或健身锻炼。',
    '注意作息规律，避免熬夜，饮食宜清淡为主。',
    '健康方面需留心小毛病，及时调理，防微杜渐。',
    '整体健康良好，心情愉悦有助于身心健康，保持乐观心态。',
    '运动运势佳，适合开始新的健身计划，但要注意运动安全。',
  ],
};

/** 幸运颜色 */
const LUCKY_COLORS = [
  '红色', '橙色', '黄色', '绿色', '青色', '蓝色',
  '紫色', '粉色', '白色', '金色', '银色', '棕色',
];

/**
 * 根据出生日期判断星座
 * @param birthDate 格式 YYYY-MM-DD
 */
export function getZodiacByDate(birthDate: string): ZodiacSign {
  // 处理摩羯座跨年的特殊情况
  const parts = birthDate.split('-');
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  for (const sign of ZODIAC_SIGNS) {
    if (sign.startDate <= sign.endDate) {
      // 同一年范围内的星座（大多数）
      if (mmdd >= sign.startDate && mmdd <= sign.endDate) return sign;
    } else {
      // 跨年星座（摩羯座：12-22 到 01-19）
      if (mmdd >= sign.startDate || mmdd <= sign.endDate) return sign;
    }
  }

  // 默认返回摩羯座（兜底）
  return ZODIAC_SIGNS[9];
}

/**
 * 生成模拟运势数据
 * @param sign 星座
 * @param type 运势类型：daily/weekly/monthly
 */
export function generateZodiacFortune(
  sign: ZodiacSign,
  type: 'daily' | 'weekly' | 'monthly' = 'daily'
): ZodiacResult {
  const typeMultiplier = type === 'daily' ? 1 : type === 'weekly' ? 0.9 : 0.8;
  const seed = Math.random();

  // 生成各维度分数（50-100之间）
  const loveScore = Math.floor(50 + seed * 50 * typeMultiplier);
  const careerScore = Math.floor(50 + (1 - seed) * 50 * typeMultiplier);
  const wealthScore = Math.floor(50 + (seed * 0.7 + 0.3) * 50 * typeMultiplier);
  const healthScore = Math.floor(50 + (1 - seed * 0.5) * 50 * typeMultiplier);

  // 综合评分（四项平均）
  const overallScore = Math.round((loveScore + careerScore + wealthScore + healthScore) / 4);

  // 随机选取描述
  const pickDesc = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    sign,
    overallScore,
    love: { score: loveScore, description: pickDesc(FORTUNE_DESCRIPTIONS.love) },
    career: { score: careerScore, description: pickDesc(FORTUNE_DESCRIPTIONS.career) },
    wealth: { score: wealthScore, description: pickDesc(FORTUNE_DESCRIPTIONS.wealth) },
    health: { score: healthScore, description: pickDesc(FORTUNE_DESCRIPTIONS.health) },
    luckyColor: LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)],
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    advice: `今日${sign.name}的整体运势${overallScore >= 80 ? '极佳' : overallScore >= 60 ? '良好' : '一般'}，` +
      `${overallScore >= 60 ? '保持积极心态，抓住机遇。' : '宜静不宜动，蓄势待发。'}`,
  };
}
