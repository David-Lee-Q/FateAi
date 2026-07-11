/**
 * 农历转换算法 —— 经典数据表法
 * 覆盖范围：1900-2100 年
 * 参考基准日：1900-01-31（农历庚子年正月初一）
 */

import {
  TIAN_GAN,
  DI_ZHI,
  DI_ZHI_WU_XING,
  TIAN_GAN_WU_XING,
  SHI_CHEN,
} from './constants';

// ======================== 类型定义 ========================

/** 农历日期信息 */
export interface LunarInfo {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  lunarYearGanZhi: string;
  lunarMonthName: string;
  lunarDayName: string;
  zodiac: string;
}

// ======================== 农历数据表 ========================

/**
 * 农历数据编码表（1900-2100，共 201 条）
 * 每条数值编码规则：
 *   - 高 4 位（bit 16-19）：闰月月份，0 表示该年无闰月
 *   - 低 12 位（bit 0-11）：对应 1-12 月大小，1 = 30 天（大月），0 = 29 天（小月）
 */
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260,
  0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255,
  0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40,
  0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0,
  0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4,
  0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0,
  0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570,
  0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4,
  0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a,
  0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50,
  0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552,
  0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9,
  0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60,
  0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0,
  0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577,
  0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0,
  0x168a6, 0x0ea50, 0x06aa0, 0x0a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0,
  0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6,
  0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50,
  0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0,
  0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
];

/** 十二生肖 */
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/** 农历月名称 */
const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
];

/** 农历日名称（初一到三十） */
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

/**
 * 节气日期表（简化版，每月大约节气日期）
 * 格式：[月份, 日期]，用于判断月柱的地支分界
 * 从寅月开始（立春为一年之始），共 12 个节气
 */
const JIE_QI_DAYS: [number, number][] = [
  [2, 4],   // 立春 —— 寅月开始
  [3, 6],   // 惊蛰 —— 卯月开始
  [4, 5],   // 清明 —— 辰月开始
  [5, 6],   // 立夏 —— 巳月开始
  [6, 6],   // 芒种 —— 午月开始
  [7, 7],   // 小暑 —— 未月开始
  [8, 8],   // 立秋 —— 申月开始
  [9, 8],   // 白露 —— 酉月开始
  [10, 8],  // 寒露 —— 戌月开始
  [11, 7],  // 立冬 —— 亥月开始
  [12, 7],  // 大雪 —— 子月开始
  [1, 6],   // 小寒 —— 丑月开始
];

// ======================== 内部辅助函数 ========================

/**
 * 获取农历某年的闰月月份，0 表示无闰月
 * @param yearOffset 年份偏移量（0 = 1900 年）
 */
function getLeapMonth(yearOffset: number): number {
  return LUNAR_INFO[yearOffset] & 0xf;
}

/**
 * 获取农历某年闰月的天数（29 或 30），无闰月返回 0
 * @param yearOffset 年份偏移量（0 = 1900 年）
 */
function getLeapMonthDays(yearOffset: number): number {
  if (getLeapMonth(yearOffset) === 0) return 0;
  return (LUNAR_INFO[yearOffset] & 0x10000) ? 30 : 29;
}

/**
 * 获取农历某年某月的天数（29 或 30）
 * @param yearOffset 年份偏移量（0 = 1900 年）
 * @param month 月份（1-12）
 */
function getMonthDays(yearOffset: number, month: number): number {
  return (LUNAR_INFO[yearOffset] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 获取农历某年的总天数
 * @param yearOffset 年份偏移量（0 = 1900 年）
 */
function getYearDays(yearOffset: number): number {
  let sum = 348; // 12 个月，每月 29 天的基础
  let info = LUNAR_INFO[yearOffset];

  // 逐位检查 12 个月的大小月标记
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }

  // 加上闰月天数
  sum += getLeapMonthDays(yearOffset);
  return sum;
}

/**
 * 公历转 Julian Day Number（简化版，用于计算天数差）
 */
function dateToDays(year: number, month: number, day: number): number {
  // 以 1900-01-31（农历庚子年正月初一）为基准日
  const base = new Date(1900, 0, 31); // 注意：JS 中月份从 0 开始
  const target = new Date(year, month - 1, day);
  return Math.floor((target.getTime() - base.getTime()) / (86400 * 1000));
}

// ======================== 导出函数 ========================

/**
 * 公历转农历
 * @param year 公历年
 * @param month 公历月（1-12）
 * @param day 公历日
 * @returns 完整的农历日期信息
 */
export function solarToLunar(year: number, month: number, day: number): LunarInfo {
  // 参数范围校验
  if (year < 1900 || year > 2100) {
    throw new RangeError(`公历年份 ${year} 超出支持范围（1900-2100）`);
  }

  // 1. 计算从基准日（1900-01-31）到目标日期的总天数
  let offset = dateToDays(year, month, day);

  // 2. 逐年减去每年总天数，确定农历年
  let yearOffset = 0; // 相对于 1900 的偏移
  let lunarYear = 1900;

  for (; yearOffset < LUNAR_INFO.length && offset > 0; yearOffset++) {
    const yearDays = getYearDays(yearOffset);
    if (offset < yearDays) break;
    offset -= yearDays;
    lunarYear++;
  }

  // 3. 逐月减去每月天数，确定农历月和日（含闰月判断）
  //    闰月紧跟在对应的正常月之后，例如闰四月插在四月和五月之间
  const leapMonth = getLeapMonth(yearOffset);
  let lunarMonth = 1;
  let isLeapMonth = false;

  let remainOffset = offset;

  for (let m = 1; m <= 12; m++) {
    // 遇到闰月所在月份，先检查闰月天数
    if (leapMonth > 0 && m === leapMonth) {
      const leapDays = getLeapMonthDays(yearOffset);
      if (remainOffset < leapDays) {
        // 落在闰月内
        isLeapMonth = true;
        lunarMonth = m;
        break;
      }
      remainOffset -= leapDays;
    }

    // 检查正常月份
    const days = getMonthDays(yearOffset, m);
    if (remainOffset < days) {
      lunarMonth = m;
      break;
    }
    remainOffset -= days;
  }

  // 4. 剩余偏移量 + 1 即为农历日（offset=0 对应初一）
  const lunarDay = remainOffset + 1;

  // 5. 计算干支纪年
  const ganIndex = (lunarYear - 4) % 10;
  const zhiIndex = (lunarYear - 4) % 12;
  const lunarYearGanZhi = `${TIAN_GAN[ganIndex]}${DI_ZHI[zhiIndex]}`;

  // 6. 生肖
  const zodiac = SHENG_XIAO[zhiIndex];

  // 7. 月日名称
  const lunarMonthName = LUNAR_MONTH_NAMES[(lunarMonth - 1) % 12];
  const lunarDayName = LUNAR_DAY_NAMES[(lunarDay - 1) % 30];

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeapMonth,
    lunarYearGanZhi,
    lunarMonthName,
    lunarDayName,
    zodiac,
  };
}

/**
 * 根据小时获取对应时辰的地支索引（0-11）
 * 子时：23:00-01:00，丑时：01:00-03:00，以此类推
 * @param hour 24 小时制（0-23）
 * @returns 地支索引 0-11
 */
export function getShiChen(hour: number): number {
  // 子时跨日（23 点和 0 点），统一映射为索引 0
  if (hour === 23 || hour === 0) return 0;
  // 其他时辰：每 2 小时一个时辰，从丑时开始
  return Math.floor((hour + 1) / 2);
}

/**
 * 计算年柱（以立春为分界，立春前属于上一年）
 * @param year 公历年
 * @param month 公历月（1-12）
 * @param day 公历日
 */
export function getYearPillar(
  year: number,
  month: number,
  day: number
): { gan: string; zhi: string; ganIndex: number; zhiIndex: number } {
  // 判断是否在立春之前（立春约在 2 月 4 日）
  let actualYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    actualYear = year - 1;
  }

  const ganIndex = (actualYear - 4) % 10;
  const zhiIndex = (actualYear - 4) % 12;

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
    ganIndex,
    zhiIndex,
  };
}

/**
 * 计算月柱（以节气为月界）
 * 月地支从寅月开始：寅=0, 卯=1, 辰=2, ..., 丑=11
 * 月天干由年干推算：(年干索引 % 5) * 2 + 月支索引，再 % 10
 *
 * @param year 公历年
 * @param month 公历月（1-12）
 * @param day 公历日
 * @param shiChenIndex 时辰地支索引（0-11），影响月柱是否跨月（子时跨日）
 */
export function getMonthPillar(
  year: number,
  month: number,
  day: number,
  shiChenIndex: number
): { gan: string; zhi: string } {
  // 获取年柱的干索引，用于推算月干
  const yearPillar = getYearPillar(year, month, day);
  const yearGanIndex = yearPillar.ganIndex;

  // 根据节气判断当前属于农历哪个月支
  // 月支从寅月开始，地支索引为：寅=2, 卯=3, ..., 丑=1
  let monthZhiIndex = -1; // 在 DI_ZHI 中的索引

  for (let i = 0; i < JIE_QI_DAYS.length; i++) {
    const [jieMonth, jieDay] = JIE_QI_DAYS[i];

    // 特殊处理：小寒（1月6日）作为丑月开始，仅适用于1月份
    if (i === 11) {
      // 小寒：1月6日之后 → 丑月（仅判断1月份）
      if (month === 1 && day >= jieDay) {
        monthZhiIndex = 1; // 丑
      }
      continue;
    }

    // 立春（2月4日）为寅月开始，是判断年份的分界点
    if (month > jieMonth || (month === jieMonth && day >= jieDay)) {
      monthZhiIndex = (i + 2) % 12; // i=0 → 寅(2), i=1 → 卯(3), ...
    }
  }

  // 如果以上循环未能确定（通常在 1 月 6 日之前），则为子月
  if (monthZhiIndex === -1) {
    monthZhiIndex = 0; // 子月
  }

  // 转换为节气月索引（寅月=0, 卯月=1, ..., 丑月=11）
  const monthIndex = (monthZhiIndex - 2 + 12) % 12;

  // 月天干推算公式：(年干索引 % 5) * 2 + 月支索引，再 % 10
  const monthGanIndex = ((yearGanIndex % 5) * 2 + monthZhiIndex) % 10;

  return {
    gan: TIAN_GAN[monthGanIndex],
    zhi: DI_ZHI[monthZhiIndex],
  };
}

/**
 * 计算日柱
 * 以 1900-01-01 为基准日（甲戌日，天干索引 0，地支索引 10）
 * 天数差对 60 取模得到干支序号
 *
 * @param year 公历年
 * @param month 公历月（1-12）
 * @param day 公历日
 */
export function getDayPillar(
  year: number,
  month: number,
  day: number
): { gan: string; zhi: string } {
  // 基准日：1900-01-01 为甲戌日
  const base = new Date(1900, 0, 1);
  const target = new Date(year, month - 1, day);
  const diffDays = Math.floor((target.getTime() - base.getTime()) / (86400 * 1000));

  // 基准日天干索引 = 0（甲），地支索引 = 10（戌）
  // 偏移量模运算后加上基准偏移
  const ganIndex = ((diffDays % 10) + 10) % 10;
  const zhiIndex = ((diffDays % 12) + 10 + 12) % 12;

  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex],
  };
}

/**
 * 计算时柱（五鼠遁规则）
 * 根据日干确定时干起点：
 *   日干 % 5 = 0 (甲/己) → 时干从甲起
 *   日干 % 5 = 1 (乙/庚) → 时干从丙起
 *   日干 % 5 = 2 (丙/辛) → 时干从戊起
 *   日干 % 5 = 3 (丁/壬) → 时干从庚起
 *   日干 % 5 = 4 (戊/癸) → 时干从壬起
 *
 * @param dayGanIndex 日干在 TIAN_GAN 中的索引（0-9）
 * @param shiChenIndex 时辰地支索引（0-11）
 */
export function getHourPillar(
  dayGanIndex: number,
  shiChenIndex: number
): { gan: string; zhi: string } {
  // 五鼠遁：日干 % 5 决定时干起始天干
  const startGanMap = [0, 2, 4, 6, 8]; // 甲、丙、戊、庚、壬
  const startGanIndex = startGanMap[dayGanIndex % 5];

  // 时干 = 起始天干索引 + 时辰地支索引，对 10 取模
  const hourGanIndex = (startGanIndex + shiChenIndex) % 10;

  return {
    gan: TIAN_GAN[hourGanIndex],
    zhi: DI_ZHI[shiChenIndex],
  };
}

// ===================== 兼容性别名（供 bazi/almanac 等服务使用）=====================

/** 年干支字符串，如 "甲子" */
export function getYearGanZhi(year: number, month?: number, day?: number): string {
  const pillar = getYearPillar(year, month ?? 1, day ?? 1);
  return pillar.gan + pillar.zhi;
}

/** 月天干 */
export function getMonthGan(year: number, month: number, day: number): string {
  const shiChenIdx = getShiChen(12); // 默认午时
  return getMonthPillar(year, month, day, shiChenIdx).gan;
}

/** 月地支 */
export function getMonthZhi(year: number, month: number, day: number): string {
  const shiChenIdx = getShiChen(12);
  return getMonthPillar(year, month, day, shiChenIdx).zhi;
}

/** 日干支字符串 */
export function getDayGanZhi(year: number, month: number, day: number): string {
  const pillar = getDayPillar(year, month, day);
  return pillar.gan + pillar.zhi;
}

/** 时天干 */
export function getHourGan(dayGanIndex: number, shiChenIndex: number): string {
  return getHourPillar(dayGanIndex, shiChenIndex).gan;
}
