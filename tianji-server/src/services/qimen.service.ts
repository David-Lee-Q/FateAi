/**
 * 奇门遁甲排盘服务
 * 根据时间排布奇门局，分析天盘地盘八门九星八神
 * 当前为模拟数据实现，后续可接入完整算法
 */

import { getYearPillar, getShiChen } from '../utils/lunar';
import type { QimenResult } from '../types';

/** 奇门九星 */
const JIU_XING = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心', '天禽'];

/** 奇门八门 */
const BA_MEN = ['开门', '休门', '生门', '伤门', '杜门', '景门', '死门', '惊门'];

/** 奇门八神 */
const BA_SHEN = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];

/** 三奇六仪 */
const SAN_QI_LIU_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

/** 奇门九宫格方位 */
const JIU_GONG = ['坎一宫', '坤二宫', '震三宫', '巽四宫', '中五宫', '乾六宫', '兑七宫', '艮八宫', '离九宫'];

/**
 * 奇门遁甲排盘
 * @param year 年
 * @param month 月
 * @param day 日
 * @param hour 时（24小时制）
 * @param question 问题（可选）
 */
export function castQimen(
  year: number,
  month: number,
  day: number,
  hour: number,
  question?: string
): QimenResult {
  const yearGZ = getYearPillar(year, month, day);
  const shiChen = getShiChen(hour);

  // 确定局数（阳遁/阴遁 + 局数 1-9）
  const totalSeed = year + month * 3 + day * 5 + hour * 7;
  const isYangDun = totalSeed % 2 === 0;
  const juNumber = (totalSeed % 9) + 1;
  const juShu = `${isYangDun ? '阳遁' : '阴遁'}${juNumber}局`;

  // 模拟天盘分布（九星落入九宫）
  const tianPan: Record<string, string> = {};
  const shuffledXing = [...JIU_XING].sort((a, b) => ((totalSeed * a.charCodeAt(0)) % 9) - ((totalSeed * b.charCodeAt(0)) % 9));
  shuffledXing.forEach((star, i) => {
    tianPan[JIU_GONG[i]] = star;
  });

  // 模拟地盘分布（三奇六仪落入九宫）
  const diPan: Record<string, string> = {};
  const shuffledYi = [...SAN_QI_LIU_YI].sort((a, b) => ((totalSeed * a.charCodeAt(1)) % 9) - ((totalSeed * b.charCodeAt(1)) % 9));
  shuffledYi.forEach((yi, i) => {
    diPan[JIU_GONG[i]] = yi;
  });
  // 中五宫寄坤二宫
  diPan[JIU_GONG[4]] = diPan[JIU_GONG[1]];

  // 模拟八门分布
  const baMen: Record<string, string> = {};
  const shuffledMen = [...BA_MEN].sort((a, b) => ((totalSeed * a.charCodeAt(0)) % 8) - ((totalSeed * b.charCodeAt(0)) % 8));
  shuffledMen.forEach((men, i) => {
    baMen[JIU_GONG[i]] = men;
  });

  // 模拟八神分布
  const baShen: Record<string, string> = {};
  const shuffledShen = [...BA_SHEN].sort((a, b) => ((totalSeed * a.charCodeAt(0)) % 8) - ((totalSeed * b.charCodeAt(0)) % 8));
  shuffledShen.forEach((shen, i) => {
    baShen[JIU_GONG[i]] = shen;
  });

  // 生成综合建议
  const suggestion = question
    ? `针对"${question}"的奇门分析：${juShu}格局下，`
      + `生门在${JIU_GONG[shuffledMen.indexOf('生门')]}，`
      + `值符在${JIU_GONG[0]}，`
      + `整体格局为${isYangDun ? '阳气旺盛' : '阴气较重'}，建议顺势而为。`
    : `${juShu}，当前时辰${shiChen}，${yearGZ.gan}${yearGZ.zhi}年。`
      + `生门吉方位，值符护佑，整体运势平稳。`;

  const summary = `奇门遁甲排盘结果：${juShu}，`
    + `${yearGZ.gan}${yearGZ.zhi}年${month}月${day}日${shiChen}时。`
    + `天盘主星${shuffledXing[0]}，八门主门${shuffledMen[0]}，`
    + `${isYangDun ? '阳气主导，利主动出击' : '阴气主导，宜静待时机'}。`;

  return {
    summary,
    details: {
      juShu,
      tianPan,
      diPan,
      baMen,
      jiuXing: Object.fromEntries(JIU_GONG.map((gong, i) => [gong, shuffledXing[i]])),
      baShen,
      suggestion,
    },
  };
}
