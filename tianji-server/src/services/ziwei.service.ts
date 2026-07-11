/**
 * 紫微斗数排盘服务
 * 根据出生年月日时排出紫微斗数命盘
 * 当前为模拟数据实现，后续可接入完整算法
 */

import { getYearPillar, getShiChen } from '../utils/lunar';
import type { ZiweiResult } from '../types';

/** 紫微斗数主星库 */
const ZIWEI_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同',
  '廉贞', '天府', '太阴', '贪狼', '巨门',
  '天相', '天梁', '七杀', '破军',
];

/** 紫微十二宫名称 */
const TWELVE_PALACES = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫',
];

/** 五行局名称 */
const WU_XING_JU = ['水二局', '木三局', '金四局', '土五局', '火六局'];

/** 根据出生参数随机分配主星到宫位（模拟算法） */
function assignStarsToPalaces(year: number, month: number, day: number, hour: number) {
  // 使用出生信息作为种子，生成确定性分布
  const seed = year * 10000 + month * 100 + day * 10 + hour;
  const shuffledStars = [...ZIWEI_STARS].sort((a, b) => {
    const ha = (seed * a.charCodeAt(0)) % 100;
    const hb = (seed * b.charCodeAt(0)) % 100;
    return ha - hb;
  });

  // 为每个宫位分配主星和辅星
  return TWELVE_PALACES.map((palace, i) => ({
    palace,
    mainStar: i < shuffledStars.length ? shuffledStars[i] : '空宫',
    subStars: i % 3 === 0 ? ['左辅', '右弼'] : i % 3 === 1 ? ['文昌', '文曲'] : ['天魁', '天钺'],
  }));
}

/**
 * 计算紫微斗数命盘
 * @param year 出生年（公历）
 * @param month 出生月（1-12）
 * @param day 出生日
 * @param hour 出生时（24小时制）
 * @param gender 性别
 */
export function calculateZiwei(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female'
): ZiweiResult {
  const yearGZ = getYearPillar(year, month, day);
  const shiChen = getShiChen(hour);
  const genderStr = gender === 'male' ? '男命' : '女命';

  // 确定命宫主星
  const palaces = assignStarsToPalaces(year, month, day, hour);
  const mingGong = palaces[0];

  // 生成四化（化禄/化权/化科/化忌）
  const siHuaStars = [...ZIWEI_STARS].sort((a, b) => {
    const seed = year + month + day + hour;
    return ((seed * a.charCodeAt(0)) % 10) - ((seed * b.charCodeAt(0)) % 10);
  });
  const siHua: Record<string, string> = {
    化禄: siHuaStars[0],
    化权: siHuaStars[1],
    化科: siHuaStars[2],
    化忌: siHuaStars[3],
  };

  // 确定五行局
  const wuXingJu = WU_XING_JU[(year + month + day) % 5];

  const summary = `${genderStr}，${yearGZ.gan}${yearGZ.zhi}年生，${shiChen}时出身。`
    + `命宫主星为${mingGong.mainStar}，`
    + `五行属${wuXingJu.charAt(0)}，格局独特。`
    + `四化飞星：${siHua.化禄}化禄、${siHua.化权}化权、${siHua.化科}化科、${siHua.化忌}化忌，`
    + `综合命盘分析显示整体运势平稳向好。`;

  return {
    summary,
    details: {
      birthInfo: `${year}年${month}月${day}日${shiChen}时（${genderStr}）`,
      mingGong: { palace: mingGong.palace, star: mingGong.mainStar },
      twelvePalaces: palaces,
      siHua,
      wuXingJu,
    },
  };
}
