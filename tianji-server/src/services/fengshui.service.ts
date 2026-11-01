/**
 * 风水罗盘分析服务（八宅 + 玄空年飞星）
 * 八宅：按命卦（出生年）推东西四命与八宅吉凶方位
 * 玄空：按流年推年飞星入中与九宫飞布，标出当年吉方与煞方
 */

import type { FengshuiResult } from '../types';

/** 方位中英映射 */
const DIRECTION_NAMES: Record<string, string> = {
  N: '正北', NE: '东北', E: '正东', SE: '东南',
  S: '正南', SW: '西南', W: '正西', NW: '西北',
};

/** 建筑类型中文名 */
const BUILDING_TYPE_NAMES: Record<string, string> = {
  residential: '住宅',
  commercial: '商业',
  office: '办公',
};

/** 方位对应五行 */
const DIRECTION_WU_XING: Record<string, string> = {
  N: '水', NE: '土', E: '木', SE: '木',
  S: '火', SW: '土', W: '金', NW: '金',
};

/** 八卦方位（后天） */
const GUA_BY_NUMBER: Record<number, string> = {
  1: '坎', 2: '坤', 3: '震', 4: '巽', 6: '乾', 7: '兑', 8: '艮', 9: '离',
};

/** 八卦 → 方位 */
const GUA_DIRECTION: Record<string, string> = {
  坎: '正北', 坤: '西南', 震: '正东', 巽: '东南',
  乾: '西北', 兑: '正西', 艮: '东北', 离: '正南',
};

/** 八宅吉凶方位表：命卦 → {生气, 天医, 延年, 伏位} 与 {绝命, 五鬼, 六煞, 祸害} */
const BA_ZHAI: Record<string, { good: string[]; bad: string[] }> = {
  坎: { good: ['东南', '正东', '正南', '正北'], bad: ['西南', '东北', '西北', '正西'] },
  坤: { good: ['东北', '正西', '西北', '西南'], bad: ['正北', '东南', '正东', '正南'] },
  震: { good: ['正南', '正北', '东南', '正东'], bad: ['正西', '西北', '东北', '西南'] },
  巽: { good: ['正北', '正南', '正东', '东南'], bad: ['东北', '西南', '正西', '西北'] },
  乾: { good: ['正西', '东北', '西南', '西北'], bad: ['正南', '正东', '正北', '东南'] },
  兑: { good: ['西北', '西南', '东北', '正西'], bad: ['正东', '正南', '东南', '正北'] },
  艮: { good: ['西南', '西北', '正西', '东北'], bad: ['东南', '正北', '正南', '正东'] },
  离: { good: ['正东', '东南', '正北', '正南'], bad: ['西北', '正西', '西南', '东北'] },
};

/** 九星名称与属性 */
const NINE_STARS: Record<number, { name: string; nature: '吉' | '凶' | '中'; meaning: string }> = {
  1: { name: '一白贪狼', nature: '吉', meaning: '人缘、桃花、仕途' },
  2: { name: '二黑巨门', nature: '凶', meaning: '病符、健康隐患' },
  3: { name: '三碧禄存', nature: '凶', meaning: '是非、口舌、争执' },
  4: { name: '四绿文曲', nature: '中', meaning: '文昌、学业、文书' },
  5: { name: '五黄廉贞', nature: '凶', meaning: '灾煞、动土大忌' },
  6: { name: '六白武曲', nature: '吉', meaning: '偏财、权威、贵人' },
  7: { name: '七赤破军', nature: '凶', meaning: '破财、口舌、损伤' },
  8: { name: '八白左辅', nature: '吉', meaning: '正财、旺丁、置业' },
  9: { name: '九紫右弼', nature: '吉', meaning: '喜庆、姻缘、升迁' },
};

/** 洛书九宫飞布次序（中→乾→兑→艮→离→坎→坤→震→巽） */
const FEI_ORDER: Array<{ palace: string; direction: string }> = [
  { palace: '中', direction: '中宫' },
  { palace: '乾', direction: '西北' },
  { palace: '兑', direction: '正西' },
  { palace: '艮', direction: '东北' },
  { palace: '离', direction: '正南' },
  { palace: '坎', direction: '正北' },
  { palace: '坤', direction: '西南' },
  { palace: '震', direction: '正东' },
  { palace: '巽', direction: '东南' },
];

/** 数字归一到 1-9 */
function reduceToDigit(n: number): number {
  let v = Math.abs(n);
  while (v > 9) {
    v = String(v).split('').reduce((s, d) => s + Number(d), 0);
  }
  return v;
}

/** 命卦：男 11-a、女 4+a（遇 5 男寄坤、女寄艮） */
function mingGuaOf(birthYear: number, gender: 'male' | 'female'): { number: number; gua: string } {
  const a = reduceToDigit(birthYear);
  let num: number;
  if (gender === 'male') {
    num = 11 - a;
    if (num > 9) num -= 9;
    if (num === 5) num = 2;
  } else {
    num = 4 + a;
    if (num > 9) num -= 9;
    if (num === 5) num = 8;
  }
  return { number: num, gua: GUA_BY_NUMBER[num] ?? '坤' };
}

/** 年飞星入中数：11 - 年份各位和，0 取 9 */
function yearStarCenter(year: number): number {
  const sum = String(year).split('').reduce((s, d) => s + Number(d), 0);
  let star = 11 - sum;
  while (star > 9) star -= 9;
  if (star <= 0) star += 9;
  return star;
}

/** 九宫年飞星分布 */
function yearFlyingStars(year: number): Array<{ palace: string; direction: string; star: number; name: string; nature: string; meaning: string }> {
  const center = yearStarCenter(year);
  return FEI_ORDER.map((item, i) => {
    let star = center + i;
    while (star > 9) star -= 9;
    const info = NINE_STARS[star];
    return {
      palace: item.palace,
      direction: item.direction,
      star,
      name: info.name,
      nature: info.nature,
      meaning: info.meaning,
    };
  });
}

/** 风水布局建议库 */
const FENGSHUI_ADVICE: Record<string, string[]> = {
  residential: [
    '客厅宜宽敞明亮，保持通风良好',
    '卧室不宜正对大门，床头避免正对窗',
    '厨房与卫生间不宜相邻，水火相冲',
    '财位宜静宜聚，忌堆放杂物或开窗直泄',
  ],
  commercial: [
    '收银台宜位于当年财星方位，忌背门',
    '入口应宽敞明亮，利于纳气',
    '货架陈列有序，忌堆积过高遮挡明堂',
    '灯光柔和充足，避免眩光与死角',
  ],
  office: [
    '办公桌宜坐实朝虚，背后有靠',
    '主管位宜在当年吉星方，忌正对门口',
    '会议室宜设于吉方，避免五黄方动土',
    '入口不宜正对走廊尽头，可设玄关缓冲',
  ],
};

/**
 * 风水分析
 * @param direction 坐方（建筑所朝的反向）
 * @param buildingType 建筑类型
 * @param birthYear 屋主出生年（用于八宅命卦，可选）
 * @param gender 性别（配合出生年）
 * @param now 参考年份（默认当年）
 */
export function analyzeFengshui(
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW',
  buildingType: 'residential' | 'commercial' | 'office',
  birthYear?: number,
  gender: 'male' | 'female' = 'male',
  now: Date = new Date()
): FengshuiResult {
  const directionName = DIRECTION_NAMES[direction];
  const buildingName = BUILDING_TYPE_NAMES[buildingType];
  const wuXing = DIRECTION_WU_XING[direction];
  const year = now.getFullYear();

  // 玄空年飞星
  const flying = yearFlyingStars(year);
  const goodStars = flying.filter((f) => f.nature === '吉' && f.palace !== '中');
  const badStars = flying.filter((f) => f.nature === '凶' && f.palace !== '中');
  const wuHuang = flying.find((f) => f.star === 5);

  // 八宅（有出生年才计算命卦）
  let baZhai: FengshuiResult['details']['baZhai'];
  let favorableAreas: string[] = goodStars.map((f) => f.direction);
  let unfavorableAreas: string[] = badStars.map((f) => f.direction);

  if (birthYear && birthYear >= 1900 && birthYear <= 2100) {
    const ming = mingGuaOf(birthYear, gender);
    const table = BA_ZHAI[ming.gua];
    const eastGroup = ['坎', '离', '震', '巽'].includes(ming.gua);
    baZhai = {
      mingGua: `${ming.gua}卦（${ming.number}数）`,
      group: eastGroup ? '东四命' : '西四命',
      goodDirections: table.good,
      badDirections: table.bad,
    };
    // 八宅与流年吉方取交集优先，再补各自吉方
    const intersect = table.good.filter((d) => favorableAreas.includes(d));
    favorableAreas = Array.from(new Set([...intersect, ...table.good, ...favorableAreas]));
    unfavorableAreas = Array.from(new Set([...table.bad, ...unfavorableAreas]));
  }

  const layoutAdvice = [...(FENGSHUI_ADVICE[buildingType] || FENGSHUI_ADVICE.residential)];
  if (wuHuang) {
    layoutAdvice.push(`${year} 年五黄临${wuHuang.direction}，此方忌动土、装修与久坐`);
  }

  const summary =
    `${buildingName}坐${directionName}，五行属${wuXing}。`
    + (baZhai ? `${baZhai.mingGua}${baZhai.group}，八宅吉方：${baZhai.goodDirections.join('、')}。` : '')
    + `${year} 年${NINE_STARS[yearStarCenter(year)].name}入中，`
    + `吉星临${goodStars.map((f) => `${f.direction}（${f.star}${f.name.slice(0, 2)}）`).join('、')}；`
    + `凶星在${badStars.map((f) => f.direction).join('、')}。`
    + `建议：${layoutAdvice[0]}。`;

  return {
    summary,
    details: {
      direction: directionName,
      buildingType: buildingName,
      wuXing,
      favorableAreas,
      unfavorableAreas,
      layoutAdvice,
      year,
      yearStarCenter: {
        star: yearStarCenter(year),
        name: NINE_STARS[yearStarCenter(year)].name,
        meaning: NINE_STARS[yearStarCenter(year)].meaning,
      },
      flyingStars: flying,
      baZhai,
    },
  };
}
