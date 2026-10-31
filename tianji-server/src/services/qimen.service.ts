/**
 * 奇门遁甲排盘服务（时家奇门 · 拆补法 · 转盘）
 * 三元九局：节气定阴阳遁，符头定上中下元，节气局数表定局数
 * 排盘：地盘三奇六仪 → 值符值使 → 天盘九星 → 八门八神
 * 口径：中五宫寄坤二宫，天禽随天芮，空亡按时柱
 */

import { Solar } from 'lunar-typescript';
import { getDayPillar, getMonthPillar, getShiChen, getYearPillar } from '../utils/lunar';
import type { QimenResult } from '../types';

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 九宫外环（洛书顺时针）：4→9→2→7→6→1→8→3 */
const RING = [4, 9, 2, 7, 6, 1, 8, 3];

/** 九星本位 */
const STAR_NATIVE: Record<number, string> = {
  1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽',
  6: '天心', 7: '天柱', 8: '天任', 9: '天英',
};

/** 八门本位（中五宫寄坤二，故 5 取死门） */
const DOOR_NATIVE: Record<number, string> = {
  1: '休门', 2: '死门', 3: '伤门', 4: '杜门', 5: '死门',
  6: '开门', 7: '惊门', 8: '生门', 9: '景门',
};

/** 八神顺布次序 */
const DEITIES = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];

/** 三奇六仪布局次序 */
const YI_ORDER = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

/** 宫位信息 */
const PALACE_INFO: Record<number, { trigram: string; direction: string; element: string; branch: string }> = {
  1: { trigram: '坎', direction: '正北', element: '水', branch: '子' },
  2: { trigram: '坤', direction: '西南', element: '土', branch: '未申' },
  3: { trigram: '震', direction: '正东', element: '木', branch: '卯' },
  4: { trigram: '巽', direction: '东南', element: '木', branch: '辰巳' },
  5: { trigram: '中', direction: '中宫', element: '土', branch: '—' },
  6: { trigram: '乾', direction: '西北', element: '金', branch: '戌亥' },
  7: { trigram: '兑', direction: '正西', element: '金', branch: '酉' },
  8: { trigram: '艮', direction: '东北', element: '土', branch: '丑寅' },
  9: { trigram: '离', direction: '正南', element: '火', branch: '午' },
};

/** 二十四节气阳遁/阴遁与上中下元局数 */
const JIEQI_JU: Record<string, { dun: 'yang' | 'yin'; ju: [number, number, number] }> = {
  冬至: { dun: 'yang', ju: [1, 7, 4] },
  小寒: { dun: 'yang', ju: [2, 8, 5] },
  大寒: { dun: 'yang', ju: [3, 9, 6] },
  立春: { dun: 'yang', ju: [8, 5, 2] },
  雨水: { dun: 'yang', ju: [9, 6, 3] },
  惊蛰: { dun: 'yang', ju: [1, 7, 4] },
  春分: { dun: 'yang', ju: [3, 9, 6] },
  清明: { dun: 'yang', ju: [4, 1, 7] },
  谷雨: { dun: 'yang', ju: [5, 2, 8] },
  立夏: { dun: 'yang', ju: [4, 1, 7] },
  小满: { dun: 'yang', ju: [5, 2, 8] },
  芒种: { dun: 'yang', ju: [6, 3, 9] },
  夏至: { dun: 'yin', ju: [9, 3, 6] },
  小暑: { dun: 'yin', ju: [8, 2, 5] },
  大暑: { dun: 'yin', ju: [7, 1, 4] },
  立秋: { dun: 'yin', ju: [2, 5, 8] },
  处暑: { dun: 'yin', ju: [1, 4, 7] },
  白露: { dun: 'yin', ju: [9, 3, 6] },
  秋分: { dun: 'yin', ju: [7, 1, 4] },
  寒露: { dun: 'yin', ju: [1, 4, 7] },
  霜降: { dun: 'yin', ju: [5, 8, 2] },
  立冬: { dun: 'yin', ju: [5, 8, 2] },
  小雪: { dun: 'yin', ju: [4, 7, 1] },
  大雪: { dun: 'yin', ju: [7, 4, 1] },
};

/** 六十甲子序号（0=甲子） */
function ganZhiIndex(gan: string, zhi: string): number {
  const g = GAN.indexOf(gan);
  const z = ZHI.indexOf(zhi);
  for (let i = 0; i < 60; i++) {
    if (i % 10 === g && i % 12 === z) return i;
  }
  return 0;
}

/** 五鼠遁：日干推时干 */
function hourGanOf(dayGan: string, hourZhi: string): string {
  const dayGanIndex = GAN.indexOf(dayGan);
  const zhiIndex = ZHI.indexOf(hourZhi);
  const start = (dayGanIndex % 5) * 2;
  return GAN[(start + zhiIndex) % 10];
}

/** 九宫数字循环：阳遁顺行 +step，阴遁逆行 -step */
function flyPalace(from: number, step: number, dun: 'yang' | 'yin'): number {
  const delta = dun === 'yang' ? step : -step;
  let p = ((from - 1 + delta) % 9 + 9) % 9;
  return p + 1;
}

/** 取当前所处节气（含交节时刻） */
function currentJieQi(now: Date): string {
  const solar = Solar.fromYmdHms(
    now.getFullYear(), now.getMonth() + 1, now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds()
  );
  // 取最近已交的节气（按交节时刻，非整日）
  const jq = solar.getLunar().getPrevJieQi(false);
  return jq.getName();
}

/** 符头：日柱往前（含当日）最近的甲/己日 */
function yuanHead(dayIndex: number): { gan: string; zhi: string; index: number } {
  // 日干为甲(0)或己(5)时，当日即符头；否则回溯至最近的甲/己日
  const offset = dayIndex % 10;
  const back = offset === 0 || offset === 5 ? 0 : offset % 5;
  const h = ((dayIndex - back) % 60 + 60) % 60;
  return { gan: GAN[h % 10], zhi: ZHI[h % 12], index: h };
}

/** 由符头地支定上中下元 */
function yuanOf(headZhi: string): { key: '上元' | '中元' | '下元'; idx: number } {
  if ('子午卯酉'.includes(headZhi)) return { key: '上元', idx: 0 };
  if ('寅申巳亥'.includes(headZhi)) return { key: '中元', idx: 1 };
  return { key: '下元', idx: 2 };
}

export interface QimenPalace {
  number: number;
  trigram: string;
  direction: string;
  element: string;
  /** 地盘干 */
  earthStem: string;
  /** 中五宫寄坤二的干 */
  hostedStem?: string;
  /** 天盘干（多干表示寄宫同宫） */
  heavenStems: string[];
  stars: string[];
  door: string;
  deity: string;
  isVoid: boolean;
  isHorse: boolean;
}

/**
 * 奇门遁甲排盘
 * @param now 起局时间（默认当前）
 */
export function calculateQimen(now: Date = new Date()): QimenResult {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();

  // 1. 四柱
  const yp = getYearPillar(year, month, day);
  const mp = getMonthPillar(year, month, day, hour);
  const dp = getDayPillar(year, month, day);
  const hourZhi = ZHI[getShiChen(hour)];
  const hp = { gan: hourGanOf(dp.gan, hourZhi), zhi: hourZhi };

  // 2. 节气 / 三元 / 局数
  const term = currentJieQi(now);
  const termInfo = JIEQI_JU[term] ?? JIEQI_JU['冬至'];
  const dpIndex = ganZhiIndex(dp.gan, dp.zhi);
  const head = yuanHead(dpIndex);
  const yuan = yuanOf(head.zhi);
  const dun = termInfo.dun;
  const ju = termInfo.ju[yuan.idx];

  // 3. 地盘三奇六仪
  const earthStemOf: Record<number, string> = {};
  for (let i = 0; i < 9; i++) {
    const palace = dun === 'yang'
      ? ((ju - 1 + i) % 9) + 1
      : ((ju - 1 - i) % 9 + 9) % 9 + 1;
    earthStemOf[palace] = YI_ORDER[i];
  }
  // 中五宫寄坤二
  const hostedStem = earthStemOf[5];
  const palaceOfStem: Record<string, number> = {};
  for (const [p, stem] of Object.entries(earthStemOf)) {
    palaceOfStem[stem] = Number(p);
  }

  // 4. 旬首与空亡
  const hpIndex = ganZhiIndex(hp.gan, hp.zhi);
  const xunStart = hpIndex - (hpIndex % 10);
  const xunHeadGan = GAN[xunStart % 10];
  const xunHeadZhi = ZHI[xunStart % 12];
  const hiddenStem = YI_ORDER[(xunStart / 10) % 6] ?? YI_ORDER[0];
  const voidBranches = [ZHI[(xunStart + 10) % 12], ZHI[(xunStart + 11) % 12]];

  // 5. 值符星 / 值使门（旬首六仪所在地盘宫）
  const fuPalace = palaceOfStem[hiddenStem] ?? 1;
  const zhiFuStar = STAR_NATIVE[fuPalace];
  const zhiShiDoor = DOOR_NATIVE[fuPalace];
  const fuStarSource = fuPalace === 5 ? 2 : fuPalace;

  // 6. 天盘九星：值符随时干落宫，其余星按外环整体旋转
  const hourStemPalace = palaceOfStem[hp.gan] ?? 1;
  const target = hourStemPalace === 5 ? 2 : hourStemPalace;
  const starSourceInRing = RING.indexOf(fuStarSource);
  const targetInRing = RING.indexOf(target);
  const starDelta = ((targetInRing - starSourceInRing) % 8 + 8) % 8;

  const starsAt: Record<number, string[]> = {};
  for (const [numStr, name] of Object.entries(STAR_NATIVE)) {
    const num = Number(numStr);
    if (num === 5) continue; // 天禽随天芮
    const idx = RING.indexOf(num);
    if (idx < 0) continue;
    const dest = RING[(idx + starDelta) % 8];
    starsAt[dest] = [...(starsAt[dest] || []), name];
  }
  // 天禽随天芮
  const ruiDest = RING[(RING.indexOf(2) + starDelta) % 8];
  starsAt[ruiDest] = [...(starsAt[ruiDest] || []), '天禽'];

  // 7. 八门：值使门自值符原宫起，按旬首至时柱步数顺/逆飞
  const steps = hpIndex - xunStart;
  // 值使门自值符星原宫（中五宫按 5 计）起，按步数顺/逆飞宫
  const doorDest = flyPalace(fuPalace, steps, dun);
  // 门的整体旋转以该门的本位宫为基准（中五→死门本位坤二）
  const DOOR_NATIVE_PALACE: Record<string, number> = {
    休门: 1, 死门: 2, 伤门: 3, 杜门: 4, 开门: 6, 惊门: 7, 生门: 8, 景门: 9,
  };
  const doorNativePalace = DOOR_NATIVE_PALACE[zhiShiDoor];
  const doorDestRing = RING.indexOf(doorDest === 5 ? 2 : doorDest);
  const doorDelta = ((doorDestRing - RING.indexOf(doorNativePalace)) % 8 + 8) % 8;

  const doorAt: Record<number, string> = {};
  for (const num of RING) {
    const name = DOOR_NATIVE[num];
    const idx = RING.indexOf(num);
    const dest = RING[(idx + doorDelta) % 8];
    doorAt[dest] = name;
  }

  // 8. 八神：值符加时干宫，阳遁顺行、阴遁逆行（外环）
  const deityAt: Record<number, string> = {};
  const deityStart = RING.indexOf(target);
  for (let i = 0; i < 8; i++) {
    const idx = dun === 'yang'
      ? (deityStart + i) % 8
      : ((deityStart - i) % 8 + 8) % 8;
    deityAt[RING[idx]] = DEITIES[i];
  }

  // 9. 天盘干：各星本位的地盘干随星移动
  const heavenStemsAt: Record<number, string[]> = {};
  for (const [numStr] of Object.entries(STAR_NATIVE)) {
    const num = Number(numStr);
    if (num === 5) continue;
    const idx = RING.indexOf(num);
    if (idx < 0) continue;
    const dest = RING[(idx + starDelta) % 8];
    const stem = earthStemOf[num];
    heavenStemsAt[dest] = [...(heavenStemsAt[dest] || []), stem];
  }
  // 中五宫干随天禽寄于天芮所落之宫
  if (earthStemOf[5]) {
    heavenStemsAt[ruiDest] = [...(heavenStemsAt[ruiDest] || []), earthStemOf[5]];
  }

  // 10. 马星：按时支三合局
  const horseBranchOf: Record<string, string> = {
    申: '寅', 子: '寅', 辰: '寅',
    寅: '申', 午: '申', 戌: '申',
    亥: '巳', 卯: '巳', 未: '巳',
    巳: '亥', 酉: '亥', 丑: '亥',
  };
  const horseBranch = horseBranchOf[hp.zhi];
  const horsePalace = Object.entries(PALACE_INFO).find(([, v]) => v.branch.includes(horseBranch))?.[0];

  // 11. 组装九宫
  const palaces: QimenPalace[] = [];
  for (let n = 1; n <= 9; n++) {
    const info = PALACE_INFO[n];
    const isVoid = info.branch !== '—' && voidBranches.some((b) => info.branch.includes(b));
    const earthStem = earthStemOf[n] || '';
    palaces.push({
      number: n,
      trigram: info.trigram,
      direction: info.direction,
      element: info.element,
      earthStem,
      hostedStem: n === 2 ? hostedStem : undefined,
      heavenStems: heavenStemsAt[n] || [],
      stars: starsAt[n] || [],
      door: n === 5 ? '' : doorAt[n] || '',
      deity: n === 5 ? '' : deityAt[n] || '',
      isVoid,
      isHorse: String(horsePalace) === String(n),
    });
  }

  const dunText = dun === 'yang' ? '阳遁' : '阴遁';
  const palaceLine = palaces
    .filter((p) => p.number !== 5)
    .map((p) => `${p.number}宫(${p.trigram}) ${p.earthStem}/${p.heavenStems.join('') || '—'} ${p.stars.join('')} ${p.door} ${p.deity}`)
    .join('；');

  const summary =
    `起局时间${yp.gan}${yp.zhi}年${mp.gan}${mp.zhi}月${dp.gan}${dp.zhi}日${hp.gan}${hp.zhi}时，`
    + `节气${term}，${dunText}${yuan.key}${ju}局。`
    + `旬首${xunHeadGan}${xunHeadZhi}（遁${hiddenStem}），旬空${voidBranches.join('')}。`
    + `值符${zhiFuStar}，值使${zhiShiDoor}。`
    + `时干${hp.gan}落${hourStemPalace}宫，天盘随之转动。`;

  return {
    summary,
    details: {
      time: `${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}时`,
      fourPillars: {
        year: `${yp.gan}${yp.zhi}`,
        month: `${mp.gan}${mp.zhi}`,
        day: `${dp.gan}${dp.zhi}`,
        hour: `${hp.gan}${hp.zhi}`,
      },
      solarTerm: term,
      dun: dunText,
      yuan: yuan.key,
      juShu: `${dunText}${ju}局`,
      ju,
      xunHead: `${xunHeadGan}${xunHeadZhi}`,
      hiddenStem,
      voidBranches,
      leaders: {
        star: zhiFuStar,
        door: zhiShiDoor,
        originalPalace: fuPalace,
        starPalace: target,
        doorPalace: doorDest,
      },
      horse: { branch: horseBranch, palace: Number(horsePalace) || 0 },
      palaces,
      palaceLine,
    },
  };
}

/**
 * 兼容旧调用：按年月日时排盘
 */
export function castQimen(
  year: number,
  month: number,
  day: number,
  hour: number,
  _question?: string
): QimenResult {
  return calculateQimen(new Date(year, month - 1, day, hour));
}
