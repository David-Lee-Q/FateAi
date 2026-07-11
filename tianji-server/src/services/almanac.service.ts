/**
 * 每日黄历查询服务
 * 显示农历日期、干支、宜忌、冲煞、时辰吉凶
 * 当前为模拟数据实现，后续可接入农历专业库
 */

import { getYearPillar, getMonthPillar, getDayPillar, getShiChen, solarToLunar } from '../utils/lunar';
import type { AlmanacResult } from '../types';

/** 宜事列表 */
const YI_ITEMS = [
  '祭祀', '祈福', '求嗣', '开光', '出行', '纳采', '冠笄', '嫁娶',
  '纳婿', '入宅', '移徙', '安床', '安香', '解除', '治病', '栽种',
  '动土', '上梁', '竖柱', '开仓', '交易', '立券', '纳财', '入殓',
  '安葬', '破土', '启钻', '修造', '装修', '安门', '作灶',
];

/** 忌事列表 */
const JI_ITEMS = [
  '嫁娶', '开市', '动土', '破土', '安葬', '出行', '入宅',
  '移徙', '上梁', '修造', '开仓', '纳财', '纳畜', '祈福',
];

/** 吉神列表 */
const JI_SHEN_LIST = [
  '天德', '月德', '天恩', '天赦', '天喜', '福星', '驿马', '天医',
  '青龙', '明堂', '金匮', '天贵', '天门', '天月', '天官',
];

/** 凶神列表 */
const XIONG_SHEN_LIST = [
  '月破', '日破', '四废', '五虚', '八风', '咸池', '劫煞', '灾煞',
  '月煞', '月刑', '大耗', '小耗', '暗建',
];

/** 时辰名称与地支 */
const SHI_CHEN_NAMES = [
  '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
  '午时', '未时', '申时', '酉时', '戌时', '亥时',
];

/** 根据日期生成时辰吉凶 */
function getShiChenLuck(seed: number): Array<{ name: string; luck: '吉' | '凶' | '中' }> {
  return SHI_CHEN_NAMES.map((name, i) => {
    // 基于种子生成吉凶
    const hash = (seed + i * 7 + i * i * 3) % 10;
    const luck = hash <= 4 ? '吉' as const : hash <= 7 ? '中' as const : '凶' as const;
    return { name, luck };
  });
}

/**
 * 获取每日黄历
 * @param date 日期（YYYY-MM-DD）
 */
export function getDailyAlmanac(date: string): AlmanacResult {
  const parts = date.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  // 计算干支（使用节气感知的 API）
  const shiChenIdx = getShiChen(8); // 取辰时作为参考
  const yearGZ = getYearPillar(year, month, day);
  const monthGZ = getMonthPillar(year, month, day, shiChenIdx);
  const dayGZ = getDayPillar(year, month, day);

  // 农历信息
  const lunar = solarToLunar(year, month, day);

  // 冲煞信息（基于日支推算）
  const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const dayZhiIdx = zhiList.indexOf(dayGZ.zhi);
  const chongAnimal = animals[(dayZhiIdx + 6) % 12]; // 冝 = 对冲
  const shaDirection = ['北', '西', '南', '东', '北', '西', '南', '东', '北', '西', '南', '东'][dayZhiIdx];

  // 生成宜忌（基于日期确定性选取）
  const yiSeed = year * 10000 + month * 100 + day;
  const yiCount = 3 + yiSeed % 5;
  const jiCount = 2 + yiSeed % 4;
  const yi = YI_ITEMS.sort((a, b) => ((yiSeed * a.charCodeAt(0)) % 30) - ((yiSeed * b.charCodeAt(0)) % 30)).slice(0, yiCount);
  const ji = JI_ITEMS.sort((a, b) => ((yiSeed * a.charCodeAt(0)) % 20) - ((yiSeed * b.charCodeAt(0)) % 20)).slice(0, jiCount);

  // 吉神凶神
  const jiShen = JI_SHEN_LIST.sort((a, b) => ((yiSeed * a.charCodeAt(0)) % 15) - ((yiSeed * b.charCodeAt(0)) % 15)).slice(0, 3);
  const xiongShen = XIONG_SHEN_LIST.sort((a, b) => ((yiSeed * a.charCodeAt(0)) % 13) - ((yiSeed * b.charCodeAt(0)) % 13)).slice(0, 2);

  // 时辰吉凶
  const shiChenLuck = getShiChenLuck(yiSeed);

  // 农历信息（包含完整日期）
  const lunarMonthStr = `${lunar.lunarYearGanZhi}年${lunar.lunarMonthName}${lunar.lunarDayName}，${yearGZ.gan}${yearGZ.zhi}年${monthGZ.gan}${monthGZ.zhi}月${dayGZ.gan}${dayGZ.zhi}日`;

  const summary = `${date}黄历：农历${lunar.lunarYearGanZhi}年${lunar.lunarMonthName}${lunar.lunarDayName}。`
    + `宜：${yi.join('、')}。忌：${ji.join('、')}。`
    + `冲煞：冲${chongAnimal}煞${shaDirection}。`
    + `吉时：${shiChenLuck.filter(s => s.luck === '吉').map(s => s.name).join('、')}。`;

  return {
    summary,
    details: {
      date,
      lunarDate: lunarMonthStr,
      ganZhi: {
        year: `${yearGZ.gan}${yearGZ.zhi}`,
        month: `${monthGZ.gan}${monthGZ.zhi}`,
        day: `${dayGZ.gan}${dayGZ.zhi}`,
      },
      yi,
      ji,
      chongSha: `冲${chongAnimal}（${zhiList[(dayZhiIdx + 6) % 12]}）煞${shaDirection}`,
      jiShen,
      xiongShen,
      shiChenLuck,
    },
  };
}
