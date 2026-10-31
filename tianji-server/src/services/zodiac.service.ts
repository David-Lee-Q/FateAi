/**
 * 星座运势服务
 * 12星座信息、日期判断、模拟运势生成
 */

import { calculateMoonphase } from './moonphase.service';
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

/** 七曜对应星期（0=周日） */
const WEEKDAY_PLANET: Array<{ name: string; boost: { career: number; wealth: number; love: number; health: number } }> = [
  { name: '太阳', boost: { career: 4, wealth: 2, love: 2, health: 2 } },
  { name: '月亮', boost: { career: 1, wealth: 1, love: 5, health: 3 } },
  { name: '火星', boost: { career: 5, wealth: 1, love: 1, health: -2 } },
  { name: '水星', boost: { career: 4, wealth: 4, love: 1, health: 1 } },
  { name: '木星', boost: { career: 3, wealth: 6, love: 2, health: 2 } },
  { name: '金星', boost: { career: 2, wealth: 4, love: 6, health: 2 } },
  { name: '土星', boost: { career: 2, wealth: -2, love: 1, health: -1 } },
];

/** 星座元素（火土风水） */
const SIGN_ELEMENT: Record<string, string> = {
  白羊座: '火', 狮子座: '火', 射手座: '火',
  金牛座: '土', 处女座: '土', 摩羯座: '土',
  双子座: '风', 天秤座: '风', 水瓶座: '风',
  巨蟹座: '水', 天蝎座: '水', 双鱼座: '水',
};

/**
 * 生成星座运势（确定性：真实月相 + 星期主星 + 星座元素，无随机）
 * @param sign 星座
 * @param type 运势类型：daily/weekly/monthly
 * @param now 参考时间（默认当前，便于测试）
 */
export function generateZodiacFortune(
  sign: ZodiacSign,
  type: 'daily' | 'weekly' | 'monthly' = 'daily',
  now: Date = new Date()
): ZodiacResult {
  const weekday = WEEKDAY_PLANET[now.getDay()];
  const element = SIGN_ELEMENT[sign.name] ?? '风';

  // 真实月相：照明度越高，情绪与健康能量越强；渐亏偏内省
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const moon = calculateMoonphase(iso).details;
  const moonIllum = moon.illuminationPercent ?? 50;
  const moonLove = Math.round((moonIllum - 50) * 0.12);
  const moonHealth = Math.round((moonIllum - 50) * 0.10);

  // 元素自身的稳定偏置
  const elementBoost: Record<string, { career: number; wealth: number; love: number; health: number }> = {
    火: { career: 3, wealth: 1, love: 2, health: 1 },
    土: { career: 2, wealth: 4, love: 1, health: 3 },
    风: { career: 3, wealth: 1, love: 3, health: 0 },
    水: { career: 1, wealth: 2, love: 4, health: 2 },
  };
  const eb = elementBoost[element];

  // 周期波动（按年内周序，确定性）
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const signIndex = (sign.name.charCodeAt(0) + sign.name.charCodeAt(1)) % 7;
  const wave = ((dayOfYear + signIndex) % 11) - 5;

  const clamp = (n: number) => Math.max(50, Math.min(97, Math.round(n)));
  const base = type === 'daily' ? 68 : type === 'weekly' ? 70 : 72;

  const loveScore = clamp(base + eb.love + weekday.boost.love + moonLove + wave);
  const careerScore = clamp(base + eb.career + weekday.boost.career + wave - 1);
  const wealthScore = clamp(base + eb.wealth + weekday.boost.wealth + Math.round(moonIllum * 0.03) + wave);
  const healthScore = clamp(base + eb.health + weekday.boost.health + moonHealth - Math.round(wave / 2));
  const overallScore = Math.round((loveScore + careerScore + wealthScore + healthScore) / 4);

  // 描述按分数档位确定性选取
  const tierOf = (score: number) => (score >= 88 ? 0 : score >= 76 ? 2 : score >= 64 ? 1 : 3);
  const pick = (arr: string[], score: number) => arr[tierOf(score) % arr.length];

  const luckyColorIndex = (dayOfYear + signIndex + (moonIllum > 50 ? 2 : 0)) % LUCKY_COLORS.length;
  const luckyNumber = ((dayOfYear + signIndex) % 9) + 1;

  return {
    sign,
    overallScore,
    love: { score: loveScore, description: pick(FORTUNE_DESCRIPTIONS.love, loveScore) },
    career: { score: careerScore, description: pick(FORTUNE_DESCRIPTIONS.career, careerScore) },
    wealth: { score: wealthScore, description: pick(FORTUNE_DESCRIPTIONS.wealth, wealthScore) },
    health: { score: healthScore, description: pick(FORTUNE_DESCRIPTIONS.health, healthScore) },
    luckyColor: LUCKY_COLORS[luckyColorIndex],
    luckyNumber,
    advice: `${sign.name}（${element}象）${weekday.name}日，月相照明度${moonIllum.toFixed(0)}%（${moon.moonPhase}）。`
      + `${overallScore >= 80 ? '整体运势极佳，宜主动出击。' : overallScore >= 65 ? '整体运势良好，按部就班即可。' : '整体运势偏平，宜稳守蓄力。'}`,
  };
}

