/**
 * 每日黄历查询服务
 * 显示农历日期、干支、宜忌、冲煞、时辰吉凶
 * 基于 lunar-typescript 真实农历/黄历数据（宜忌、吉神凶煞、十二时辰神煞）
 */

import { Solar } from 'lunar-typescript';
import type { AlmanacResult } from '../types';

/** 地支 → 生肖 */
const BRANCH_ANIMALS: Record<string, string> = {
  子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇',
  午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪',
};

/** 日支 → 煞方（传统口诀：子午煞南，卯酉煞西，寅申煞南，巳亥煞东，辰戌丑未煞北） */
const SHA_DIRECTIONS: Record<string, string> = {
  子: '南', 午: '南', 卯: '西', 酉: '西', 寅: '南', 申: '南',
  巳: '东', 亥: '东', 辰: '北', 戌: '北', 丑: '北', 未: '北',
};

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 获取每日黄历
 * @param date 日期（YYYY-MM-DD）
 */
export function getDailyAlmanac(date: string): AlmanacResult {
  const parts = date.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const lunar = Solar.fromYmd(year, month, day).getLunar();

  // 干支：年柱按立春分界，月柱按节气分界，日柱为当日干支
  const yearGZ = lunar.getYearInGanZhiByLiChun();
  const monthGZ = lunar.getMonthInGanZhi();
  const dayGZ = lunar.getDayInGanZhi();
  const dayZhi = dayGZ[1];

  // 冲煞：日支六冲 + 传统煞方
  const chongZhi = BRANCHES[(BRANCHES.indexOf(dayZhi) + 6) % 12];
  const chongAnimal = BRANCH_ANIMALS[chongZhi];
  const shaDirection = SHA_DIRECTIONS[dayZhi];
  const chongSha = `冲${chongAnimal}（${chongZhi}）煞${shaDirection}`;

  // 宜忌 / 吉神 / 凶煞（真实黄历数据）
  const times = lunar.getTimes();
  // 日级宜忌取当日第一个时辰（子时）的宜忌，与黄历"日宜/日忌"一致
  const yiList: string[] = times.length > 0 ? [...times[0].getYi()] : [];
  const jiList: string[] = times.length > 0 ? [...times[0].getJi()] : [];
  const jiShen = lunar.getDayJiShen();
  const xiongShen = lunar.getDayXiongSha();

  // 十二时辰吉凶：按时辰十二神（青龙/明堂/金匮等吉神为吉，天牢/白虎等凶煞为凶）
  const shiChenLuck = times.slice(0, 12).map((t) => ({
    name: `${t.getZhi()}时`,
    luck: (t.getTianShenLuck() === '吉' ? '吉' : '凶') as '吉' | '凶',
  }));

  // 农历日期（含完整日期）
  const lunarDate = `${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}，${yearGZ}年${monthGZ}月${dayGZ}日`;

  const jieQi = lunar.getJieQi();
  const jieQiText = jieQi ? `今日${jieQi}。` : '';

  const summary = `${date}黄历：农历${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}。${jieQiText}`
    + `宜：${yiList.join('、') || '无'}。忌：${jiList.join('、') || '无'}。`
    + `冲煞：${chongSha}。`
    + `吉时：${shiChenLuck.filter((s) => s.luck === '吉').map((s) => s.name).join('、') || '无'}。`;

  return {
    summary,
    details: {
      date,
      lunarDate,
      ganZhi: {
        year: yearGZ,
        month: monthGZ,
        day: dayGZ,
      },
      yi: yiList,
      ji: jiList,
      chongSha,
      jiShen,
      xiongShen,
      shiChenLuck,
    },
  };
}
