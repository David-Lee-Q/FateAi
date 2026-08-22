/**
 * 八字排盘计算服务
 * 根据出生年月日时计算四柱八字、五行分布
 */

import { TIAN_GAN_WU_XING, DI_ZHI_WU_XING, WU_XING, NA_YIN } from '../utils/constants';
import {
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  getShiChen,
} from '../utils/lunar';
import { getLongitude } from '../utils/cityLongitude';
import type { BaziResult, BaziPillar } from '../types';

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 计算真太阳时校正偏移量（分钟，相对东八区标准时 120°E）
 * 偏移 = 经度差 × 4分钟/度 + 均时差（太阳时差，天文近似公式）
 */
function trueSolarOffsetMinutes(longitude: number, year: number, month: number, day: number): number {
  const lonDiffMinutes = (longitude - 120) * 4;
  const startOfYear = new Date(year, 0, 1).getTime();
  const birthDate = new Date(year, month - 1, day).getTime();
  const dayOfYear = Math.floor((birthDate - startOfYear) / 86400000) + 1;
  const b = ((2 * Math.PI) / 365) * (dayOfYear - 81);
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  return lonDiffMinutes + eot;
}

/** 将分钟数格式化为"X小时Y分"或"Y分钟" */
function formatOffset(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs >= 60) {
    return `${Math.floor(abs / 60)}小时${Math.round(abs % 60)}分`;
  }
  return `${Math.round(abs)}分钟`;
}

/**
 * 计算八字排盘
 * @param year 出生年（公历）
 * @param month 出生月（1-12）
 * @param day 出生日
 * @param hour 出生时辰索引（0-11）
 * @param gender 性别
 * @param city 出生城市（可选，用于真太阳时校正）
 * @param province 出生省份（可选，城市未命中时兜底）
 */
export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female',
  city?: string,
  province?: string
): BaziResult {
  // 0. 真太阳时校正：按出生地经度 + 均时差换算，必要时调整时辰
  let effectiveHour = hour;
  let trueSolar: BaziResult['trueSolar'];
  const longitude = getLongitude(city, province);
  if (longitude !== null) {
    const offset = trueSolarOffsetMinutes(longitude, year, month, day);
    const midMinutes = hour * 120 + 60;
    const corrected = (((Math.round((midMinutes + offset) / 120)) % 12) + 12) % 12;
    effectiveHour = corrected;
    const changed = corrected !== hour;
    const direction = offset >= 0 ? '晚于' : '早于';
    const place = city || '出生地';
    trueSolar = {
      city: place,
      longitude,
      offsetMinutes: Math.round(offset),
      originalHour: hour,
      correctedHour: corrected,
      changed,
      note: changed
        ? `真太阳时校正：${place}（东经 ${longitude}°）真太阳时比标准时${direction}约 ${formatOffset(offset)}，时辰由 ${SHICHEN_NAMES[hour]}时 调整为 ${SHICHEN_NAMES[corrected]}时`
        : `真太阳时校正：${place}（东经 ${longitude}°）真太阳时比标准时${direction}约 ${formatOffset(offset)}，时辰仍为 ${SHICHEN_NAMES[hour]}时`,
    };
  }

  // 1. 计算年柱
  const yearGZ = getYearPillar(year, month, day);

  // 2. 计算月柱
  const monthGZ = getMonthPillar(year, month, day, effectiveHour);

  // 3. 计算日柱
  const dayGZ = getDayPillar(year, month, day);

  // 4. 计算时柱（五鼠遁）
  const hourGZ = getHourPillar(yearGZ.ganIndex, effectiveHour);

  // 构建四柱
  const yearPillar = buildPillar(yearGZ.gan, yearGZ.zhi);
  const monthPillar = buildPillar(monthGZ.gan, monthGZ.zhi);
  const dayPillar = buildPillar(dayGZ.gan, dayGZ.zhi);
  const hourPillar = buildPillar(hourGZ.gan, hourGZ.zhi);

  // 5. 统计五行分布
  const wuXingCount = countWuXing([yearPillar, monthPillar, dayPillar, hourPillar]);

  // 6. 生成纳音信息
  const yearNaYin = NA_YIN[`${yearGZ.gan}${yearGZ.zhi}`] || '未知';
  const monthNaYin = NA_YIN[`${monthGZ.gan}${monthGZ.zhi}`] || '未知';
  const dayNaYin = NA_YIN[`${dayGZ.gan}${dayGZ.zhi}`] || '未知';
  const hourNaYin = NA_YIN[`${hourGZ.gan}${hourGZ.zhi}`] || '未知';

  // 7. 生成总体概述
  let summary = generateBaziSummary(yearPillar, monthPillar, dayPillar, hourPillar, wuXingCount, yearNaYin, gender);
  if (trueSolar?.changed) {
    summary += `\n时柱说明：${trueSolar.note}`;
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    wuXingCount,
    summary,
    trueSolar,
    _naYin: {
      yearNaYin,
      monthNaYin,
      dayNaYin,
      hourNaYin,
    },
  };
}

/** 构建单柱信息 */
function buildPillar(gan: string, zhi: string): BaziPillar {
  return {
    gan,
    zhi,
    ganWuXing: TIAN_GAN_WU_XING[gan] || '未知',
    zhiWuXing: DI_ZHI_WU_XING[zhi] || '未知',
  };
}

/** 统计四柱中五行出现次数 */
function countWuXing(pillars: BaziPillar[]): Record<string, number> {
  const count: Record<string, number> = {};
  for (const wx of WU_XING) {
    count[wx] = 0;
  }
  for (const p of pillars) {
    count[p.ganWuXing] = (count[p.ganWuXing] || 0) + 1;
    count[p.zhiWuXing] = (count[p.zhiWuXing] || 0) + 1;
  }
  return count;
}

/** 生成八字概述文字 */
function generateBaziSummary(
  yearP: BaziPillar,
  monthP: BaziPillar,
  dayP: BaziPillar,
  hourP: BaziPillar,
  wuXingCount: Record<string, number>,
  yearNaYin: string,
  gender: 'male' | 'female'
): string {
  const baziStr = `${yearP.gan}${yearP.zhi} ${monthP.gan}${monthP.zhi} ${dayP.gan}${dayP.zhi} ${hourP.gan}${hourP.zhi}`;
  const genderStr = gender === 'male' ? '乾造（男命）' : '坤造（女命）';

  // 找出最旺和最弱的五行
  let maxWx = '金', minWx = '金';
  let maxCount = 0, minCount = 9;
  for (const wx of WU_XING) {
    if (wuXingCount[wx] > maxCount) { maxCount = wuXingCount[wx]; maxWx = wx; }
    if (wuXingCount[wx] < minCount) { minCount = wuXingCount[wx]; minWx = wx; }
  }

  return [
    `${genderStr}`,
    `四柱八字：${baziStr}`,
    `年柱纳音：${yearNaYin}`,
    `日主（日干）：${dayP.gan}（${dayP.ganWuXing}）`,
    `五行分布：金${wuXingCount['金']} 木${wuXingCount['木']} 水${wuXingCount['水']} 火${wuXingCount['火']} 土${wuXingCount['土']}`,
    `五行旺衰：最旺为${maxWx}，最弱为${minWx}`,
    `建议：${generateAdvice(dayP.ganWuXing, maxWx, minWx, wuXingCount)}`,
  ].join('\n');
}

/** 根据五行分布生成简略建议 */
function generateAdvice(
  dayMasterWx: string,
  strongestWx: string,
  weakestWx: string,
  wuXingCount: Record<string, number>
): string {
  if (dayMasterWx === strongestWx) {
    return `日主${dayMasterWx}旺，宜泄耗为主，可从事与${weakestWx}相关行业以平衡五行。`;
  }
  if (dayMasterWx === weakestWx) {
    return `日主${dayMasterWx}弱，宜生扶为主，可借助${strongestWx}之力增强自身。`;
  }
  return `日主${dayMasterWx}中和偏弱，五行基本平衡，注意补充${weakestWx}元素以完善格局。`;
}
