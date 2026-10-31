/**
 * 大六壬服务（时家六壬 · 月将加时）
 * 四柱 → 月将（中气定将）→ 天地盘 → 四课 → 三传（贼克/比用/涉害/遥克/昴星/别责/八专/伏吟/返吟）→ 十二天将
 * 口径：日干寄宫用标准寄宫表，贵人按昼贵/夜贵与顺逆
 */

import { Solar } from 'lunar-typescript';
import { getDayPillar, getMonthPillar, getShiChen, getYearPillar } from '../utils/lunar';
import type { DaliurenResult } from '../types';

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 五行 */
const ZHI_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};
const GAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

/** 日干寄宫（十干寄十二支） */
const GAN_JI_GONG: Record<string, string> = {
  甲: '寅', 乙: '辰', 丙: '巳', 丁: '未', 戊: '巳',
  己: '未', 庚: '申', 辛: '戌', 壬: '亥', 癸: '丑',
};

/** 中气 → 月将（太阳过宫） */
const ZHONGQI_YUEJIANG: Array<[string, string]> = [
  ['雨水', '亥'], ['春分', '戌'], ['谷雨', '酉'], ['小满', '申'],
  ['夏至', '未'], ['大暑', '午'], ['处暑', '巳'], ['秋分', '辰'],
  ['霜降', '卯'], ['小雪', '寅'], ['冬至', '丑'], ['大寒', '子'],
];

/** 月将名 */
const YUEJIANG_NAME: Record<string, string> = {
  亥: '登明', 戌: '河魁', 酉: '从魁', 申: '传送', 未: '小吉', 午: '胜光',
  巳: '太乙', 辰: '天罡', 卯: '太冲', 寅: '功曹', 丑: '大吉', 子: '神后',
};

/** 十二天将（顺布次序） */
const TIANJIANG = ['贵人', '腾蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后'];

/** 昼贵/夜贵（日干 → [昼贵支, 夜贵支]） */
const GUI_REN: Record<string, [string, string]> = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  辛: ['午', '寅'],
  壬: ['巳', '卯'], 癸: ['巳', '卯'],
};

/** 地支序差（0-11） */
function zhiDiff(a: string, b: string): number {
  return ((ZHI.indexOf(a) - ZHI.indexOf(b)) % 12 + 12) % 12;
}

/** 某支的旬空（按日柱） */
function xunKong(dayGan: string, dayZhi: string): [string, string] {
  const g = GAN.indexOf(dayGan);
  const z = ZHI.indexOf(dayZhi);
  let idx = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === g && i % 12 === z) { idx = i; break; }
  }
  const start = idx - (idx % 10);
  return [ZHI[(start + 10) % 12], ZHI[(start + 11) % 12]];
}

/** 取当前已过的中气对应的月将 */
function currentYuejiang(now: Date): { yuejiang: string; zhongqi: string } {
  const lunar = Solar.fromYmdHms(
    now.getFullYear(), now.getMonth() + 1, now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds()
  ).getLunar();
  const table = lunar.getJieQiTable();
  const names = ZHONGQI_YUEJIANG.map(([n]) => n);
  let best: { name: string; time: number } | null = null;
  for (const [name, solar] of Object.entries(table)) {
    if (!names.includes(name)) continue;
    const t = new Date(
      solar.getYear(), solar.getMonth() - 1, solar.getDay(),
      solar.getHour(), solar.getMinute(), solar.getSecond()
    ).getTime();
    if (t <= now.getTime() && (!best || t > best.time)) best = { name, time: t };
  }
  // 表内未覆盖（年初）时回落到上一年冬至/大寒
  if (!best) {
    const prev = Solar.fromYmd(now.getFullYear() - 1, 12, 25).getLunar();
    for (const [name, solar] of Object.entries(prev.getJieQiTable())) {
      if (!names.includes(name)) continue;
      const t = new Date(
        solar.getYear(), solar.getMonth() - 1, solar.getDay(),
        solar.getHour(), solar.getMinute(), solar.getSecond()
      ).getTime();
      if (t <= now.getTime() && (!best || t > best.time)) best = { name, time: t };
    }
  }
  const zhongqi = best?.name ?? '冬至';
  const yuejiang = ZHONGQI_YUEJIANG.find(([n]) => n === zhongqi)?.[1] ?? '丑';
  return { yuejiang, zhongqi };
}

/** 五行生克关系（上神对下神） */
function relationOf(upper: string, lower: string): '克' | '贼' | '生' | '被生' | '同' {
  const up = ZHI_WUXING[upper];
  const low = ZHI_WUXING[lower];
  if (up === low) return '同';
  if (KE[up] === low) return '克';
  if (KE[low] === up) return '贼';
  if (SHENG[up] === low) return '生';
  return '被生';
}

export interface DaliurenChuan {
  zhi: string;
  gan?: string;
  liuqin?: string;
  jiang?: string;
  kong?: boolean;
}

/**
 * 大六壬起课
 * @param now 起课时间
 */
export function calculateDaliuren(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: string,
  now: Date = new Date(year, month - 1, day, hour)
): DaliurenResult {
  // 1. 四柱
  const yp = getYearPillar(year, month, day);
  const mp = getMonthPillar(year, month, day, hour);
  const dp = getDayPillar(year, month, day);
  const hourZhi = ZHI[getShiChen(hour)];
  const hourGanIndex = ((GAN.indexOf(dp.gan) % 5) * 2 + ZHI.indexOf(hourZhi)) % 10;
  const hp = { gan: GAN[hourGanIndex], zhi: hourZhi };

  // 2. 月将
  const { yuejiang, zhongqi } = currentYuejiang(now);

  // 3. 天地盘：天盘 = 地盘 + (月将 - 占时)
  const shift = zhiDiff(yuejiang, hourZhi);
  const tianOf = (diZhi: string): string => ZHI[(ZHI.indexOf(diZhi) + shift) % 12];
  const tianpan: Record<string, string> = {};
  const dipan: Record<string, string> = {};
  for (const z of ZHI) {
    tianpan[z] = tianOf(z);
    dipan[z] = z;
  }

  // 4. 四课
  const ganGong = GAN_JI_GONG[dp.gan];
  const ke1Upper = tianOf(ganGong);
  const ke2Upper = tianOf(ke1Upper);
  const ke3Upper = tianOf(dp.zhi);
  const ke4Upper = tianOf(ke3Upper);
  const kePairs: Array<{ lower: string; upper: string; label: string }> = [
    { lower: ganGong, upper: ke1Upper, label: '干阳' },
    { lower: ke1Upper, upper: ke2Upper, label: '干阴' },
    { lower: dp.zhi, upper: ke3Upper, label: '支阳' },
    { lower: ke3Upper, upper: ke4Upper, label: '支阴' },
  ];

  // 5. 三传（九宗门）
  const relations = kePairs.map((k) => relationOf(k.upper, k.lower));
  const keIdx = relations.map((r, i) => (r === '克' ? i : -1)).filter((i) => i >= 0);
  const zeiIdx = relations.map((r, i) => (r === '贼' ? i : -1)).filter((i) => i >= 0);

  let chuanUpper: string[] = [];
  let zongmen = '';

  if (shift === 0) {
    // 伏吟：天地盘相同
    zongmen = '伏吟课';
    const xing = ke1Upper;
    chuanUpper = [xing, tianOf(xing), tianOf(tianOf(xing))];
  } else if (shift === 6) {
    // 返吟：天地盘相冲
    zongmen = '返吟课';
    const xing = ke1Upper;
    chuanUpper = [xing, tianOf(xing), tianOf(tianOf(xing))];
  } else if (keIdx.length === 1 && zeiIdx.length === 0) {
    zongmen = '元首课';
    chuanUpper = [kePairs[keIdx[0]].upper];
  } else if (zeiIdx.length === 1 && keIdx.length === 0) {
    zongmen = '重审课';
    chuanUpper = [kePairs[zeiIdx[0]].upper];
  } else if (keIdx.length + zeiIdx.length > 1) {
    // 比用：取与日干阴阳相同者
    const ganYang = GAN.indexOf(dp.gan) % 2 === 0;
    const all = [...keIdx.map((i) => ({ i, type: '克' })), ...zeiIdx.map((i) => ({ i, type: '贼' }))]
      .map((o) => ({ ...o, zhi: kePairs[o.i].upper }))
      .filter((o) => {
        const yang = ZHI.indexOf(o.zhi) % 2 === 0;
        return yang === ganYang;
      });
    if (all.length === 1) {
      zongmen = '知一课';
      chuanUpper = [all[0].zhi];
    } else {
      // 涉害：取涉害最深者（按地支序差计）
      zongmen = '涉害课';
      const scored = all.map((o) => ({ ...o, depth: zhiDiff(o.zhi, ganGong) + zhiDiff(o.zhi, dp.zhi) }));
      scored.sort((a, b) => b.depth - a.depth);
      chuanUpper = [scored[0]?.zhi ?? ke1Upper];
    }
  } else {
    // 无克：遥克（上神克日干或日干克上神），否则昴星
    const ganWx = GAN_WUXING[dp.gan];
    const yaoKe = kePairs.filter((k) => {
      const up = ZHI_WUXING[k.upper];
      return (KE[up] === ganWx) || (KE[ganWx] === up);
    });
    if (yaoKe.length > 0) {
      zongmen = '遥克课';
      chuanUpper = [yaoKe[0].upper];
    } else if (ganGong === dp.zhi) {
      zongmen = '八专课';
      chuanUpper = [ke3Upper];
    } else {
      zongmen = '昴星课';
      chuanUpper = [ke1Upper];
    }
  }

  // 三传：初传 → 中传（天盘所临）→ 末传
  const chuanZhi: string[] = [chuanUpper[0]];
  if (chuanUpper[1]) chuanZhi.push(chuanUpper[1]);
  else chuanZhi.push(tianOf(chuanZhi[0]));
  if (chuanUpper[2]) chuanZhi.push(chuanUpper[2]);
  else chuanZhi.push(tianOf(chuanZhi[1]));

  // 6. 遁干（按日柱旬）
  const dpIndex = (() => {
    for (let i = 0; i < 60; i++) {
      if (i % 10 === GAN.indexOf(dp.gan) && i % 12 === ZHI.indexOf(dp.zhi)) return i;
    }
    return 0;
  })();
  const xunStart = dpIndex - (dpIndex % 10);
  const dunGanOf = (zhi: string): string => {
    const offset = (ZHI.indexOf(zhi) - ZHI.indexOf(ZHI[xunStart % 12]) + 12) % 12;
    return GAN[(xunStart % 10 + offset) % 10];
  };

  // 7. 旬空
  const [kong1, kong2] = xunKong(dp.gan, dp.zhi);

  // 8. 十二天将：昼贵/夜贵 + 顺逆
  const isDay = ['卯', '辰', '巳', '午', '未', '申'].includes(hourZhi);
  const [dayGui, nightGui] = GUI_REN[dp.gan] ?? ['丑', '未'];
  const guiZhi = isDay ? dayGui : nightGui;
  const guiPalace = ZHI.indexOf(guiZhi);
  // 贵人所临地盘的支 → 顺逆：亥子丑寅卯辰顺行
  const guiOnEarth = ZHI[(ZHI.indexOf(guiZhi) - shift + 12) % 12];
  const forward = ['亥', '子', '丑', '寅', '卯', '辰'].includes(guiOnEarth);
  const jiangAt: Record<string, string> = {};
  for (let i = 0; i < 12; i++) {
    const zhi = ZHI[(guiPalace + (forward ? i : -i) + 24) % 12];
    jiangAt[zhi] = TIANJIANG[i];
  }

  // 9. 六亲（以日干五行为我）
  const ganWx = GAN_WUXING[dp.gan];
  const liuQinOf = (zhi: string): string => {
    const wx = ZHI_WUXING[zhi];
    if (wx === ganWx) return '兄弟';
    if (SHENG[wx] === ganWx) return '父母';
    if (SHENG[ganWx] === wx) return '子孙';
    if (KE[wx] === ganWx) return '官鬼';
    return '妻财';
  };

  const chuanDetail: DaliurenChuan[] = chuanZhi.map((zhi) => ({
    zhi,
    gan: dunGanOf(zhi),
    liuqin: liuQinOf(zhi),
    jiang: jiangAt[zhi],
    kong: zhi === kong1 || zhi === kong2,
  }));

  // 10. 结构摘要
  const keText = kePairs.map((k) => `${k.lower}→${k.upper}`).join('  ');
  const chuanText = chuanDetail
    .map((c) => `${c.gan}${c.zhi}(${c.liuqin}${c.jiang ? '·' + c.jiang : ''}${c.kong ? '·空' : ''})`)
    .join(' → ');

  const judgments = {
    overall: `${zongmen}，初传${chuanDetail[0].gan}${chuanDetail[0].zhi}（${chuanDetail[0].liuqin}）`,
    goodAspects: chuanDetail
      .filter((c) => ['父母', '子孙', '妻财', '兄弟'].includes(c.liuqin ?? ''))
      .map((c) => `${c.zhi}临${c.jiang ?? '—'}（${c.liuqin}）`),
    badAspects: chuanDetail
      .filter((c) => c.liuqin === '官鬼')
      .map((c) => `${c.zhi}临${c.jiang ?? '—'}（官鬼）需防是非`),
    fortune: chuanDetail.some((c) => c.kong) ? '中平（三传有落空，事多虚耗）' : '顺（三传不空）',
  };

  const interpretation =
    `${yp.gan}${yp.zhi}年 ${mp.gan}${mp.zhi}月 ${dp.gan}${dp.zhi}日 ${hp.gan}${hp.zhi}时占。`
    + `${zhongqi}后月将${yuejiang}（${YUEJIANG_NAME[yuejiang]}）加${hourZhi}时。`
    + `四课：${keText}。`
    + `${zongmen}，三传：${chuanText}。`
    + `日干${dp.gan}${ganWx}，旬空${kong1}${kong2}，${isDay ? '昼' : '夜'}占，贵人${guiZhi}，天将${forward ? '顺行' : '逆行'}。`;

  return {
    time: {
      year,
      month,
      day,
      hour,
      shichen: `${hourZhi}时`,
      yuejiang,
      fourPillars: `${yp.gan}${yp.zhi} ${mp.gan}${mp.zhi} ${dp.gan}${dp.zhi} ${hp.gan}${hp.zhi}`,
      zhongqi,
      yuejiangName: YUEJIANG_NAME[yuejiang],
    },
    ke: {
      ke1: `${ke1Upper}`,
      ke2: `${ke2Upper}`,
      ke3: `${ke3Upper}`,
      ke4: `${ke4Upper}`,
      detail: kePairs.map((k) => `${k.label}：${k.lower}上${k.upper}`),
    },
    chuan: {
      chuan1: `${dunGanOf(chuanZhi[0])}${chuanZhi[0]}`,
      chuan2: `${dunGanOf(chuanZhi[1])}${chuanZhi[1]}`,
      chuan3: `${dunGanOf(chuanZhi[2])}${chuanZhi[2]}`,
      chuan1Desc: `${chuanDetail[0].liuqin}·${chuanDetail[0].jiang ?? '—'}${chuanDetail[0].kong ? '·旬空' : ''}`,
      chuan2Desc: `${chuanDetail[1].liuqin}·${chuanDetail[1].jiang ?? '—'}${chuanDetail[1].kong ? '·旬空' : ''}`,
      chuan3Desc: `${chuanDetail[2].liuqin}·${chuanDetail[2].jiang ?? '—'}${chuanDetail[2].kong ? '·旬空' : ''}`,
      detail: chuanDetail,
      text: chuanText,
      zongmen,
    },
    shen: {
      shen1: jiangAt[ke1Upper] ?? '',
      shen2: jiangAt[ke2Upper] ?? '',
      shen3: jiangAt[ke3Upper] ?? '',
      shen4: jiangAt[ke4Upper] ?? '',
      guiZhi,
      guiEarth: guiOnEarth,
      direction: forward ? '顺行' : '逆行',
    },
    liuqin: chuanDetail.map((c) => `${c.zhi}：${c.liuqin}`),
    tianpan,
    dipan,
    judgments,
    interpretation,
  };
}
