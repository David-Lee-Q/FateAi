/**
 * 统一字段映射配置
 * 自动同步后端所有服务的返回字段
 * 格式：system -> field -> 中文标签
 */

// 通用字段（所有系统共享）
export const COMMON_FIELDS: Record<string, string> = {
  summary: '总结',
  details: '详细信息',
  aiInterpretation: 'AI深度解读',
  interpretation: '解读',
  score: '评分',
  total_score: '综合评分',
  score_summary: '评分说明',
  ai_analysis: 'AI分析',
  question: '问题',
  analysis: '分析',
  suggestions: '建议',
  description: '描述',
  name: '名称',
  nameEn: '英文名',
  symbol: '符号',
  value: '数值',
  label: '标签',
  date: '日期',
  time: '时间',
  type: '类型',
  result: '结果',
  forecast: '预测',
  advice: '建议',
  keywords: '关键词',
  meaning: '含义',
  position: '位置',
};

// 八字排盘
export const BAZI_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  pillars: '四柱八字',
  yearPillar: '年柱',
  monthPillar: '月柱',
  dayPillar: '日柱',
  hourPillar: '时柱',
  gan: '天干',
  zhi: '地支',
  ganWuXing: '天干五行',
  zhiWuXing: '地支五行',
  wuxing: '五行分析',
  wuXingCount: '五行分布',
  shensha: '神煞',
  personality: '性格特征',
  career: '事业方向',
  love: '感情婚姻',
  health: '健康提醒',
  fortune: '大运流年',
};

// 紫微斗数
export const ZIWEI_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  birthInfo: '出生信息',
  mingGong: '命宫',
  palace: '宫位',
  star: '主星',
  mainStar: '主星',
  subStars: '辅星',
  twelvePalaces: '十二宫位',
  siHua: '四化飞星',
  wuXingJu: '五行局',
  化禄: '化禄',
  化权: '化权',
  化科: '化科',
  化忌: '化忌',
};

// 风水罗盘
export const FENGSHUI_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  direction: '坐向',
  buildingType: '建筑类型',
  wuXing: '五行属性',
  favorableAreas: '吉利方位',
  unfavorableAreas: '不利方位',
  layoutAdvice: '布局建议',
  luckyDirection: '吉位',
  unluckyDirection: '凶位',
};

// 奇门遁甲
export const QIMEN_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  juShu: '局数',
  pan: '排盘信息',
  tianPan: '天盘',
  diPan: '地盘',
  baMen: '八门',
  jiuXing: '九星',
  baShen: '八神',
  star: '九星',
  door: '八门',
  god: '八神',
  suggestion: '综合建议',
  date: '日期',
  hour: '时辰',
};

// 梅花易数
export const MEIHUA_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  method: '起卦方式',
  upperGua: '上卦',
  lowerGua: '下卦',
  mainGua: '主卦',
  huGua: '互卦',
  tiYong: '体用关系',
  ti: '体卦',
  yong: '用卦',
  upperHex: '上卦',
  lowerHex: '下卦',
  changeLine: '动爻',
  hexName: '卦名',
  interpretation: '断卦解读',
};

// 六爻卦象
export const LIUYAO_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  hexagram: '卦象',
  originalGua: '本卦',
  changedGua: '变卦',
  sixLines: '六爻详情',
  lines: '六爻',
  yao: '爻',
  yinYang: '阴阳',
  worldResponse: '世应位置',
  world: '世爻',
  response: '应爻',
  naJia: '纳甲',
};

// 星座运势
export const ZODIAC_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  sign: '星座',
  overallScore: '综合评分',
  dateRange: '日期范围',
  startDate: '开始日期',
  endDate: '结束日期',
  element: '元素属性',
  today: '今日运势',
  week: '本周运势',
  month: '本月运势',
  year: '本年运势',
  love: '爱情运势',
  career: '事业运势',
  wealth: '财运',
  health: '健康',
  score: '评分',
  luckyColor: '幸运颜色',
  luckyNumber: '幸运数字',
};

// 塔罗牌
export const TAROT_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  spread: '牌阵',
  cards: '牌面',
  cardName: '牌名',
  suit: '牌组',
  uprightMeaning: '正位牌意',
  reversedMeaning: '逆位牌意',
  isReversed: '是否逆位',
  upright: '正位',
  reversed: '逆位',
};

// 每日黄历
export const ALMANAC_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  lunarDate: '农历日期',
  ganZhi: '干支',
  year: '年柱',
  month: '月柱',
  day: '日柱',
  yi: '宜',
  ji: '忌',
  chongSha: '冲煞',
  jiShen: '吉神',
  xiongShen: '凶神',
  shiChenLuck: '时辰吉凶',
  luck: '吉凶',
};

// 周公解梦
export const DREAM_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  keywords: '梦境关键词',
  entries: '梦境条目',
  overallInterpretation: '整体解读',
  symbol: '象征意义',
  fortune: '吉凶提示',
  suggestion: '建议',
};

// 姓名测试
export const NAMETEST_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  fullName: '姓名',
  surname: '姓氏',
  givenName: '名字',
  surnameStrokes: '姓笔画',
  givenNameStrokes: '名笔画',
  totalStrokes: '总笔画',
  wuGe: '五格数理',
  tianGe: '天格',
  renGe: '人格',
  diGe: '地格',
  waiGe: '外格',
  zongGe: '总格',
  number: '数值',
  meaning: '含义',
  sanCai: '三才配置',
  sanCaiMeaning: '三才含义',
};

// 生肖运势
export const SHENGXIAO_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  zodiac: '生肖',
  animal: '生肖',
  benMingNian: '本命年信息',
  birthYear: '出生年份',
  scores: '运势评分',
  overall: '综合运势',
  career: '事业运势',
  wealth: '财运运势',
  love: '爱情运势',
  health: '健康运势',
  luckyItems: '幸运元素',
  color: '幸运颜色',
  number: '幸运数字',
  direction: '幸运方位',
  today: '今日运势',
  week: '本周运势',
  month: '本月运势',
  year: '本年运势',
};

// 数字能量
export const NUMEROLOGY_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  lifePathNumber: '生命灵数',
  lifePathMeaning: '生命灵数含义',
  birthdayNumber: '生日数',
  personalYear: '个人年数',
  personalYearMeaning: '个人年含义',
  expressionNumber: '表达数',
  soulNumber: '灵魂数',
  personalityNumber: '性格数',
  maturityNumber: '成熟数',
};

// 占星骰子
export const ASTRODICE_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  dice: '骰子结果',
  dice1: '行星骰子',
  dice2: '星座骰子',
  dice3: '宫位骰子',
  planet: '行星',
  sign: '星座',
  house: '宫位',
  interpretation: '解读',
};

// 月相占卜
export const MOONPHASE_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  moonPhase: '月相名称',
  phase: '月相',
  moonEmoji: '月相符号',
  illumination: '亮度描述',
  traits: '个人特质',
  emotionalPattern: '情感模式',
  forecast: '运势预测',
};

// 符文占卜
export const RUNE_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  spread: '牌阵',
  runes: '符文',
  symbol: '符文符号',
  reversed: '逆位',
  position: '位置',
};

// 求签
export const DRAWLOT_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  lotNumber: '签号',
  level: '签位',
  poem: '签诗',
};

// 铁板神数
export const TIEBAN_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  birthTime: '出生时辰',
  ganZhiYear: '年柱',
  ganZhiMonth: '月柱',
  ganZhiDay: '日柱',
  ganZhiHour: '时柱',
  mainCode: '主码',
  mainNumber: '主数',
  subNumbers: '附数',
  lifeFortune: '一生命运',
  careerFortune: '事业运势',
  loveFortune: '感情婚姻',
  healthFortune: '健康状况',
  category: '分类',
  description: '描述',
};

// 大六壬
export const DALIUREN_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  date: '占卜日期',
  ganZhiDate: '干支纪日',
  hour: '占时',
  monthJiang: '月将',
  shen: '六壬神将',
  diPan: '地盘',
  tianPan: '天盘',
  liuShen: '六神',
  chuan: '三传',
  overallJudgment: '整体判断',
  question: '所问之事',
  gan: '天干',
  zhi: '地支',
};

// 手相算命
export const PALM_FIELDS: Record<string, string> = {
  ...COMMON_FIELDS,
  palmType: '掌型',
  palmTypeDesc: '掌型描述',
  wuXing: '五行属性',
  gender: '性别',
  lines: '三大主线',
  life: '生命线',
  heart: '感情线',
  mind: '智慧线',
  name: '线的名称',
  type: '线型',
  description: '描述',
  interpretation: '解读',
};

// 统一导出
export const FIELD_LABELS: Record<string, Record<string, string>> = {
  bazi: BAZI_FIELDS,
  ziwei: ZIWEI_FIELDS,
  fengshui: FENGSHUI_FIELDS,
  qimen: QIMEN_FIELDS,
  meihua: MEIHUA_FIELDS,
  liuyao: LIUYAO_FIELDS,
  zodiac: ZODIAC_FIELDS,
  tarot: TAROT_FIELDS,
  almanac: ALMANAC_FIELDS,
  dream: DREAM_FIELDS,
  nametest: NAMETEST_FIELDS,
  shengxiao: SHENGXIAO_FIELDS,
  numerology: NUMEROLOGY_FIELDS,
  astrodice: ASTRODICE_FIELDS,
  moonphase: MOONPHASE_FIELDS,
  rune: RUNE_FIELDS,
  drawlot: DRAWLOT_FIELDS,
  tieban: TIEBAN_FIELDS,
  daliuren: DALIUREN_FIELDS,
  palm: PALM_FIELDS,
};

/**
 * 获取字段的中文标签
 * @param system 系统标识
 * @param field 字段名
 * @returns 中文标签，未找到时返回原字段名
 */
export function getFieldLabel(system: string, field: string): string {
  return FIELD_LABELS[system]?.[field] || COMMON_FIELDS[field] || field;
}

/**
 * 获取系统中所有未映射的字段（用于调试）
 * @param system 系统标识
 * @param data 数据对象
 * @returns 未映射的字段列表
 */
export function getUnmappedFields(system: string, data: Record<string, unknown>): string[] {
  const mappedFields = new Set(Object.keys(FIELD_LABELS[system] || {}));
  mappedFields.add(...Object.keys(COMMON_FIELDS));
  
  const unmapped: string[] = [];
  
  function scan(obj: Record<string, unknown>) {
    for (const key of Object.keys(obj)) {
      if (!mappedFields.has(key)) {
        unmapped.push(key);
      }
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        scan(obj[key] as Record<string, unknown>);
      }
    }
  }
  
  scan(data);
  return [...new Set(unmapped)];
}