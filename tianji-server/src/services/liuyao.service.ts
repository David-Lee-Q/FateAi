/**
 * 六爻卦象服务（京房纳甲法）
 * 三枚铜钱摇卦 → 本卦/变卦 → 八宫世应 → 纳甲六亲六神 → 旬空/月建/日辰
 * 参考：火珠林纳甲、京房八宫卦序
 */

import { getDayPillar, getMonthPillar, getYearPillar, getShiChen } from '../utils/lunar';
import type { LiuyaoResult } from '../types';

/** 八卦：先天数、名称、卦象（自下而上，1=阳） */
const TRIGRAMS: Record<string, { name: string; symbol: string; bits: string; element: string }> = {
  乾: { name: '乾', symbol: '☰', bits: '111', element: '金' },
  兑: { name: '兑', symbol: '☱', bits: '110', element: '金' },
  离: { name: '离', symbol: '☲', bits: '101', element: '火' },
  震: { name: '震', symbol: '☳', bits: '100', element: '木' },
  巽: { name: '巽', symbol: '☴', bits: '011', element: '木' },
  坎: { name: '坎', symbol: '☵', bits: '010', element: '水' },
  艮: { name: '艮', symbol: '☶', bits: '001', element: '土' },
  坤: { name: '坤', symbol: '☷', bits: '000', element: '土' },
};

const BITS_TO_TRIGRAM: Record<string, string> = Object.fromEntries(
  Object.entries(TRIGRAMS).map(([k, v]) => [v.bits, k])
);

/** 京房八宫卦序：[下卦, 上卦, 卦名, 世爻位] */
const PALACES: Array<{ palace: string; element: string; gua: Array<[string, string, string, number]> }> = [
  {
    palace: '乾',
    element: '金',
    gua: [
      ['乾', '乾', '乾为天', 6],
      ['巽', '乾', '天风姤', 1],
      ['艮', '乾', '天山遁', 2],
      ['坤', '乾', '天地否', 3],
      ['坤', '巽', '风地观', 4],
      ['坤', '艮', '山地剥', 5],
      ['坤', '离', '火地晋', 4],
      ['乾', '离', '火天大有', 3],
    ],
  },
  {
    palace: '坎',
    element: '水',
    gua: [
      ['坎', '坎', '坎为水', 6],
      ['兑', '坎', '水泽节', 1],
      ['震', '坎', '水雷屯', 2],
      ['离', '坎', '水火既济', 3],
      ['离', '兑', '泽火革', 4],
      ['离', '震', '雷火丰', 5],
      ['离', '坤', '地火明夷', 4],
      ['坎', '坤', '地水师', 3],
    ],
  },
  {
    palace: '艮',
    element: '土',
    gua: [
      ['艮', '艮', '艮为山', 6],
      ['离', '艮', '山火贲', 1],
      ['乾', '艮', '山天大畜', 2],
      ['兑', '艮', '山泽损', 3],
      ['兑', '离', '火泽睽', 4],
      ['兑', '乾', '天泽履', 5],
      ['兑', '巽', '风泽中孚', 4],
      ['艮', '巽', '风山渐', 3],
    ],
  },
  {
    palace: '震',
    element: '木',
    gua: [
      ['震', '震', '震为雷', 6],
      ['坤', '震', '雷地豫', 1],
      ['坎', '震', '雷水解', 2],
      ['巽', '震', '雷风恒', 3],
      ['巽', '坤', '地风升', 4],
      ['巽', '坎', '水风井', 5],
      ['巽', '兑', '泽风大过', 4],
      ['震', '兑', '泽雷随', 3],
    ],
  },
  {
    palace: '巽',
    element: '木',
    gua: [
      ['巽', '巽', '巽为风', 6],
      ['乾', '巽', '风天小畜', 1],
      ['离', '巽', '风火家人', 2],
      ['震', '巽', '风雷益', 3],
      ['震', '乾', '天雷无妄', 4],
      ['震', '离', '火雷噬嗑', 5],
      ['震', '艮', '山雷颐', 4],
      ['巽', '艮', '山风蛊', 3],
    ],
  },
  {
    palace: '离',
    element: '火',
    gua: [
      ['离', '离', '离为火', 6],
      ['艮', '离', '火山旅', 1],
      ['巽', '离', '火风鼎', 2],
      ['坎', '离', '火水未济', 3],
      ['坎', '艮', '山水蒙', 4],
      ['坎', '巽', '风水涣', 5],
      ['坎', '乾', '天水讼', 4],
      ['离', '乾', '天火同人', 3],
    ],
  },
  {
    palace: '坤',
    element: '土',
    gua: [
      ['坤', '坤', '坤为地', 6],
      ['震', '坤', '地雷复', 1],
      ['兑', '坤', '地泽临', 2],
      ['乾', '坤', '地天泰', 3],
      ['乾', '震', '雷天大壮', 4],
      ['乾', '兑', '泽天夬', 5],
      ['乾', '坎', '水天需', 4],
      ['坤', '坎', '水地比', 3],
    ],
  },
  {
    palace: '兑',
    element: '金',
    gua: [
      ['兑', '兑', '兑为泽', 6],
      ['坎', '兑', '泽水困', 1],
      ['坤', '兑', '泽地萃', 2],
      ['艮', '兑', '泽山咸', 3],
      ['艮', '坎', '水山蹇', 4],
      ['艮', '坤', '地山谦', 5],
      ['艮', '震', '雷山小过', 4],
      ['兑', '震', '雷泽归妹', 3],
    ],
  },
];

/** 卦象（6 位，自下而上）→ 卦信息 */
const GUA_INDEX = new Map<string, { name: string; palace: string; palaceElement: string; shi: number }>();
for (const p of PALACES) {
  for (const [lower, upper, name, shi] of p.gua) {
    const bits = TRIGRAMS[lower].bits + TRIGRAMS[upper].bits;
    GUA_INDEX.set(bits, { name, palace: p.palace, palaceElement: p.element, shi });
  }
}

/** 纳甲：每卦 6 位（初爻→上爻）的天干地支 */
const NA_JIA: Record<string, string[]> = {
  乾: ['甲子', '甲寅', '甲辰', '壬午', '壬申', '壬戌'],
  坤: ['乙未', '乙巳', '乙卯', '癸丑', '癸亥', '癸酉'],
  震: ['庚子', '庚寅', '庚辰', '庚午', '庚申', '庚戌'],
  巽: ['辛丑', '辛亥', '辛酉', '辛未', '辛巳', '辛卯'],
  坎: ['戊寅', '戊辰', '戊午', '戊申', '戊戌', '戊子'],
  离: ['己卯', '己丑', '己亥', '己酉', '己未', '己巳'],
  艮: ['丙辰', '丙午', '丙申', '丙戌', '丙子', '丙寅'],
  兑: ['丁巳', '丁卯', '丁丑', '丁亥', '丁酉', '丁未'],
};

const ZHI_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const LIU_SHEN = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];

const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const BEI_KE: Record<string, string> = { 土: '木', 水: '土', 火: '水', 金: '火', 木: '金' };

/** 以宫五行为我，判断六亲 */
function liuQinOf(palaceElement: string, yaoElement: string): string {
  if (palaceElement === yaoElement) return '兄弟';
  if (SHENG[yaoElement] === palaceElement) return '父母';
  if (SHENG[palaceElement] === yaoElement) return '子孙';
  if (KE[yaoElement] === palaceElement) return '官鬼';
  if (KE[palaceElement] === yaoElement) return '妻财';
  return '兄弟';
}

/** 五行关系描述 */
function relationOf(a: string, b: string): string {
  if (a === b) return '同';
  if (SHENG[a] === b) return '生';
  if (SHENG[b] === a) return '被生';
  if (KE[a] === b) return '克';
  if (BEI_KE[a] === b) return '被克';
  return '—';
}

/** 六神起点（按日干） */
const LIU_SHEN_START: Record<string, number> = {
  甲: 0, 乙: 0, 丙: 1, 丁: 1, 戊: 2, 己: 3, 庚: 4, 辛: 4, 壬: 5, 癸: 5,
};

/** 干支→六十甲子序号 */
function ganZhiIndex(gan: string, zhi: string): number {
  const g = GAN.indexOf(gan);
  const z = ZHI.indexOf(zhi);
  for (let i = 0; i < 60; i++) {
    if (i % 10 === g && i % 12 === z) return i;
  }
  return 0;
}

/** 旬空两地支 */
function xunKong(dayGan: string, dayZhi: string): [string, string] {
  const idx = ganZhiIndex(dayGan, dayZhi);
  const xunStart = idx - (idx % 10);
  return [ZHI[(xunStart + 10) % 12], ZHI[(xunStart + 11) % 12]];
}

/** 摇一爻：三枚铜钱，字=2 背=3；6 老阴 7 少阳 8 少阴 9 老阳 */
function tossOneLine(random: () => number): { sum: number; coins: number[] } {
  const coins = Array.from({ length: 3 }, () => (random() < 0.5 ? 2 : 3));
  return { sum: coins.reduce((a, b) => a + b, 0), coins };
}

/** 用神取法：按问题主题匹配 */
function guessYongShen(question: string): string {
  const q = question || '';
  if (/(财|钱|收入|投资|生意|买卖|奖金|回款)/.test(q)) return '妻财（求财）';
  if (/(官|工作|事业|升职|职位|官司|诉讼|公务员)/.test(q)) return '官鬼（事业/官讼）';
  if (/(考试|学业|升学|证书|学历|文书|合同)/.test(q)) return '父母（文书/学业）';
  if (/(感情|婚姻|恋爱|对象|复合|桃花|结婚)/.test(q)) return '男测妻财 / 女测官鬼（婚恋）';
  if (/(病|健康|身体|手术|康复)/.test(q)) return '官鬼（病）与子孙（医药）同参';
  if (/(出行|搬迁|旅行|出差|远行)/.test(q)) return '父母（车船/行李）与世爻';
  if (/(孩子|子女|怀孕|生育)/.test(q)) return '子孙（子女）';
  return '世爻（自身）';
}

/** 摇卦结果中的一爻 */
export interface LiuyaoLine {
  position: number;
  ganZhi: string;
  yinYang: '阳' | '阴';
  isMoving: boolean;
  liuQin: string;
  liuShen: string;
  element: string;
  shiYing: '' | '世' | '应';
  isKong: boolean;
  monthRelation: string;
  dayRelation: string;
  changedGanZhi?: string;
  changedLiuQin?: string;
  changedRelation?: string;
}

export interface LiuyaoCastOptions {
  /** 摇卦时间，默认当前 */
  castTime?: Date;
  /** 手动录入的六爻数值（6/7/8/9，初爻→上爻），为空则真摇卦 */
  lines?: number[];
  /** 随机源，默认 Math.random */
  random?: () => number;
}

/**
 * 六爻起卦（京房纳甲装卦）
 * @param question 所问之事
 * @param options 摇卦选项
 */
export function castLiuyao(question: string, options: LiuyaoCastOptions = {}): LiuyaoResult {
  const castTime = options.castTime ?? new Date();
  const random = options.random ?? Math.random;
  const year = castTime.getFullYear();
  const month = castTime.getMonth() + 1;
  const day = castTime.getDate();
  const hour = castTime.getHours();

  // 1. 摇卦六次（初爻→上爻）
  const sums = options.lines?.length === 6
    ? options.lines
    : Array.from({ length: 6 }, () => tossOneLine(random).sum);

  // 2. 本卦爻性与动爻
  const lines = sums.map((sum) => ({
    yang: sum === 7 || sum === 9,
    moving: sum === 6 || sum === 9,
  }));
  const originalBits = lines.map((l) => (l.yang ? '1' : '0')).join('');
  const changedBits = lines.map((l) => (l.moving ? (l.yang ? '0' : '1') : l.yang ? '1' : '0')).join('');

  const original = GUA_INDEX.get(originalBits);
  const changed = GUA_INDEX.get(changedBits);
  if (!original || !changed) throw new Error('卦象解析失败');

  const lowerKey = BITS_TO_TRIGRAM[originalBits.slice(0, 3)];
  const upperKey = BITS_TO_TRIGRAM[originalBits.slice(3)];
  const changedLowerKey = BITS_TO_TRIGRAM[changedBits.slice(0, 3)];
  const changedUpperKey = BITS_TO_TRIGRAM[changedBits.slice(3)];

  // 3. 世应
  const shi = original.shi;
  const ying = shi > 3 ? shi - 3 : shi + 3;

  // 4. 四柱与旬空
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day, hour);
  const dayPillar = getDayPillar(year, month, day);
  const [kong1, kong2] = xunKong(dayPillar.gan, dayPillar.zhi);
  const monthElement = ZHI_WUXING[monthPillar.zhi];
  const dayElement = ZHI_WUXING[dayPillar.zhi];

  // 5. 六神起点
  const shenStart = LIU_SHEN_START[dayPillar.gan] ?? 0;

  // 6. 装卦
  const ganZhiList = [...NA_JIA[lowerKey].slice(0, 3), ...NA_JIA[upperKey].slice(3)];
  const changedGanZhiList = [...NA_JIA[changedLowerKey].slice(0, 3), ...NA_JIA[changedUpperKey].slice(3)];

  const sixLines: LiuyaoLine[] = ganZhiList.map((gz, i) => {
    const zhi = gz.charAt(1);
    const element = ZHI_WUXING[zhi];
    const line = lines[i];
    const changing = line.moving;
    const changedZhi = changedGanZhiList[i].charAt(1);
    const changedElement = ZHI_WUXING[changedZhi];
    return {
      position: i + 1,
      ganZhi: gz,
      yinYang: line.yang ? '阳' : '阴',
      isMoving: changing,
      liuQin: liuQinOf(original.palaceElement, element),
      liuShen: LIU_SHEN[(shenStart + i) % 6],
      element,
      shiYing: i + 1 === shi ? '世' : i + 1 === ying ? '应' : '',
      isKong: zhi === kong1 || zhi === kong2,
      monthRelation: relationOf(monthElement, element),
      dayRelation: relationOf(dayElement, element),
      changedGanZhi: changing ? changedGanZhiList[i] : undefined,
      changedLiuQin: changing ? liuQinOf(original.palaceElement, changedElement) : undefined,
      changedRelation: changing ? relationOf(changedElement, element) : undefined,
    };
  });

  // 7. 结构描述
  const movingLines = sixLines.filter((l) => l.isMoving);
  const lineTable = sixLines
    .map(
      (l) =>
        `${l.position}爻${l.yinYang}${l.shiYing ? `[${l.shiYing}]` : ''} `
        + `${l.liuShen}${l.liuQin}${l.ganZhi}(${l.element})`
        + `${l.isMoving ? `→${l.changedGanZhi}${l.changedLiuQin}` : ''}`
        + `${l.isKong ? ' 空亡' : ''}`
    )
    .join('；');

  const yongShen = guessYongShen(question);
  const summary =
    `所问：${question || '未填写'}。`
    + `铜钱摇卦得【${original.name}】之【${changed.name}】，${original.palace}宫${original.palaceElement}。`
    + `世爻在${shi}爻，应爻在${ying}爻。`
    + `起卦时间${yearPillar.gan}${yearPillar.zhi}年 ${monthPillar.gan}${monthPillar.zhi}月 ${dayPillar.gan}${dayPillar.zhi}日 ${getShiChen(hour)}时，`
    + `旬空${kong1}${kong2}。`
    + `动爻${movingLines.length > 0 ? movingLines.map((l) => `${l.position}爻`).join('、') : '无'}。`
    + `建议以「${yongShen}」为用神，结合月建${monthPillar.zhi}、日辰${dayPillar.zhi}旺衰与动变生克断之。`;

  return {
    summary,
    details: {
      question,
      originalGua: {
        name: original.name,
        symbol: `${TRIGRAMS[upperKey].symbol}${TRIGRAMS[lowerKey].symbol}`,
        upperGua: TRIGRAMS[upperKey].name,
        lowerGua: TRIGRAMS[lowerKey].name,
        lowerTrigram: TRIGRAMS[lowerKey].symbol,
        upperTrigram: TRIGRAMS[upperKey].symbol,
        palace: `${original.palace}宫`,
        palaceElement: original.palaceElement,
      },
      changedGua: {
        name: changed.name,
        symbol: `${TRIGRAMS[changedUpperKey].symbol}${TRIGRAMS[changedLowerKey].symbol}`,
        upperGua: TRIGRAMS[changedUpperKey].name,
        lowerGua: TRIGRAMS[changedLowerKey].name,
        palace: `${changed.palace}宫`,
      },
      sixLines,
      worldResponse: { world: shi, response: ying },
      naJia: ganZhiList,
      castInfo: {
        time: `${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}时`,
        yearPillar: `${yearPillar.gan}${yearPillar.zhi}`,
        monthPillar: `${monthPillar.gan}${monthPillar.zhi}`,
        dayPillar: `${dayPillar.gan}${dayPillar.zhi}`,
        monthBuild: `${monthPillar.zhi}（${monthElement}）`,
        dayChen: `${dayPillar.zhi}（${dayElement}）`,
        xunKong: `${kong1}${kong2}`,
        tosses: sums,
      },
      yongShen,
      movingCount: movingLines.length,
      lineTable,
      shiYing: {
        shi: `${shi}爻 ${sixLines[shi - 1].liuQin}${sixLines[shi - 1].ganZhi}`,
        ying: `${ying}爻 ${sixLines[ying - 1].liuQin}${sixLines[ying - 1].ganZhi}`,
      },
      liuQin: Object.fromEntries(
        sixLines.map((l) => [`${l.position}爻`, `${l.liuShen} ${l.liuQin}(${l.ganZhi})`])
      ),
    },
  };
}
