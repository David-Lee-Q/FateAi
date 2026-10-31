/**
 * 八卦与六十四卦基础数据（共用）
 * 卦象以「自下而上」6 位二进制字符串表示：1=阳爻，0=阴爻
 */

export interface Trigram {
  name: string;
  symbol: string;
  /** 自下而上 3 位 */
  bits: string;
  element: string;
  /** 先天卦数（乾1 兑2 离3 震4 巽5 坎6 艮7 坤8） */
  number: number;
}

export const TRIGRAMS: Record<string, Trigram> = {
  乾: { name: '乾', symbol: '☰', bits: '111', element: '金', number: 1 },
  兑: { name: '兑', symbol: '☱', bits: '110', element: '金', number: 2 },
  离: { name: '离', symbol: '☲', bits: '101', element: '火', number: 3 },
  震: { name: '震', symbol: '☳', bits: '100', element: '木', number: 4 },
  巽: { name: '巽', symbol: '☴', bits: '011', element: '木', number: 5 },
  坎: { name: '坎', symbol: '☵', bits: '010', element: '水', number: 6 },
  艮: { name: '艮', symbol: '☶', bits: '001', element: '土', number: 7 },
  坤: { name: '坤', symbol: '☷', bits: '000', element: '土', number: 8 },
};

/** 先天卦数 → 卦名 */
export const NUMBER_TO_TRIGRAM: Record<number, string> = Object.fromEntries(
  Object.entries(TRIGRAMS).map(([name, t]) => [t.number, name])
);

/** 3 位卦象 → 卦名 */
export const BITS_TO_TRIGRAM: Record<string, string> = Object.fromEntries(
  Object.entries(TRIGRAMS).map(([name, t]) => [t.bits, name])
);

/** 京房八宫卦序：[下卦, 上卦, 卦名, 世爻位] */
export const PALACES: Array<{
  palace: string;
  element: string;
  gua: Array<[string, string, string, number]>;
}> = [
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

export interface Hexagram {
  /** 卦名，如「地天泰」 */
  name: string;
  /** 自下而上 6 位 */
  bits: string;
  upper: string;
  lower: string;
  palace: string;
  palaceElement: string;
  /** 世爻位（1-6） */
  shi: number;
}

/** 6 位卦象 → 卦信息 */
export const HEXAGRAMS: Record<string, Hexagram> = (() => {
  const map: Record<string, Hexagram> = {};
  for (const p of PALACES) {
    for (const [lower, upper, name, shi] of p.gua) {
      const bits = TRIGRAMS[lower].bits + TRIGRAMS[upper].bits;
      map[bits] = { name, bits, upper, lower, palace: p.palace, palaceElement: p.element, shi };
    }
  }
  return map;
})();

/** 六十四卦卦义（简释） */
export const HEXAGRAM_MEANINGS: Record<string, string> = {
  乾为天: '刚健中正，自强不息',
  坤为地: '厚德载物，柔顺包容',
  水雷屯: '万事起头难，宜守正待时',
  山水蒙: '蒙昧未开，宜求教启蒙',
  水天需: '需待时机，不可躁进',
  天水讼: '争讼是非，宜和解退让',
  地水师: '兴师动众，宜有纪律与统帅',
  水地比: '亲比相辅，择善而从',
  风天小畜: '小有积蓄，宜积微成著',
  天泽履: '履险如夷，谨慎前行',
  地天泰: '天地交泰，通顺安康',
  天地否: '闭塞不通，宜守待变',
  天火同人: '同心同德，合作共事',
  火天大有: '大有所获，盛大丰盈',
  地山谦: '谦逊受益，卑以自牧',
  雷地豫: '安乐顺动，宜有备而行',
  泽雷随: '随时应变，择善而随',
  山风蛊: '积弊待治，宜整饬革新',
  地泽临: '居高临下，亲民临事',
  风地观: '观察审势，静观其变',
  火雷噬嗑: '明断是非，除梗去阻',
  山火贲: '文饰之美，宜质胜于文',
  山地剥: '剥落衰退，宜守不宜进',
  地雷复: '一阳来复，转机初现',
  天雷无妄: '不妄为则吉，守正自然',
  山天大畜: '大有蓄养，宜厚积薄发',
  山雷颐: '颐养之道，慎言节食',
  泽风大过: '过中失常，宜权变支撑',
  坎为水: '险中求通，习险守信',
  离为火: '附丽光明，柔顺中正',
  泽山咸: '感应相与，以诚相待',
  雷风恒: '恒久不变，守常持久',
  天山遁: '遁世退避，宜退守待时',
  雷天大壮: '壮盛当止，不可恃强',
  火地晋: '晋长升进，光明日上',
  地火明夷: '明入地中，宜晦藏守正',
  风火家人: '家道齐整，内治为先',
  火泽睽: '乖离相背，宜求同存异',
  水山蹇: '蹇难险阻，宜反身修德',
  雷水解: '解除险难，宜趁势舒解',
  山泽损: '损下益上，惩忿窒欲',
  风雷益: '损上益下，见善则迁',
  泽天夬: '决断去疑，刚决柔退',
  天风姤: '不期而遇，宜防女壮',
  泽地萃: '荟萃聚合，聚众成事',
  地风升: '积小成高，顺势上升',
  泽水困: '困顿受制，宜守正待通',
  水风井: '井养不穷，修身利人',
  泽火革: '变革除旧，顺天应人',
  火风鼎: '鼎新取象，稳重调和',
  震为雷: '震动奋发，恐惧修省',
  艮为山: '止而不进，时止则止',
  风山渐: '循序渐进，稳步向前',
  雷泽归妹: '婚嫁之象，宜守正防失',
  雷火丰: '丰大盛满，宜日中则昃',
  火山旅: '羁旅在外，宜柔顺守分',
  巽为风: '顺入无孔不入，宜申命行事',
  兑为泽: '喜悦和顺，朋友讲习',
  风水涣: '涣散待聚，宜聚人心',
  水泽节: '节制有度，宜量入为出',
  风泽中孚: '诚信中实，以诚感人',
  雷山小过: '小事可为，宜谦下过恭',
  水火既济: '事已成，宜守成防变',
  火水未济: '事未竟，宜慎终如始',
};

/** 五行生克 */
export const WUXING_SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
export const WUXING_KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

/** 体用五行关系判定 */
export function tiYongRelation(ti: string, yong: string): { key: string; text: string; lucky: '大吉' | '吉' | '平' | '凶' | '大凶' } {
  if (ti === yong) return { key: '比和', text: '体用比和，谋为吉利', lucky: '吉' };
  if (WUXING_SHENG[yong] === ti) return { key: '用生体', text: '用生体，有进益之喜，事多顺遂', lucky: '大吉' };
  if (WUXING_SHENG[ti] === yong) return { key: '体生用', text: '体生用，有耗失之忧，费力而成', lucky: '平' };
  if (WUXING_KE[ti] === yong) return { key: '体克用', text: '体克用，己胜人，谋事可成但需费力', lucky: '吉' };
  if (WUXING_KE[yong] === ti) return { key: '用克体', text: '用克体，人胜己，事多阻滞', lucky: '凶' };
  return { key: '平和', text: '体用平和，运势中平', lucky: '平' };
}

/** 由 6 位卦象取卦信息 */
export function hexagramOf(bits: string): Hexagram | undefined {
  return HEXAGRAMS[bits];
}
