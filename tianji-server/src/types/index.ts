/**
 * 天机 AI 运势查询工具 - 类型定义
 * 包含所有占卜系统的输入参数与返回结果类型
 */

/** 支持的占卜系统类型 */
export type FortuneSystem = 'bazi' | 'tarot' | 'zodiac' | 'dream'
  | 'ziwei' | 'liuyao' | 'meihua' | 'qimen' | 'fengshui'
  | 'numerology' | 'astrodice' | 'moonphase' | 'rune'
  | 'nametest' | 'shengxiao' | 'almanac' | 'drawlot' | 'palm'
  | 'tieban' | 'daliuren' | 'report' | 'compare';

/** 占卜查询请求参数 */
export interface FortuneQueryRequest {
  system: FortuneSystem;
  inputParams: Record<string, unknown>;
}

/** 通用占卜结果结构 */
export interface BaseFortuneResult {
  summary: string;
  details: Record<string, unknown>;
}

// ===================== 八字排盘 =====================

/** 八字排盘输入参数 */
export interface BaziInputParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
}

/** 八字四柱 */
export interface BaziPillar {
  gan: string;       // 天干
  zhi: string;       // 地支
  ganWuXing: string; // 天干五行
  zhiWuXing: string; // 地支五行
}

/** 八字排盘结果 */
export interface BaziResult {
  yearPillar: BaziPillar;   // 年柱
  monthPillar: BaziPillar;  // 月柱
  dayPillar: BaziPillar;    // 日柱
  hourPillar: BaziPillar;   // 时柱
  wuXingCount: Record<string, number>; // 五行统计
  summary: string;           // 总体概述
}

// ===================== 塔罗牌 =====================

/** 塔罗牌 */
export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  uprightMeaning: string;
  reversedMeaning: string;
  isReversed: boolean; // 是否逆位
}

/** 塔罗牌输入参数 */
export interface TarotInputParams {
  spread: 'single' | 'three' | 'celtic';
  question?: string;
}

/** 塔罗牌抽牌结果 */
export interface TarotResult {
  cards: TarotCard[];
  interpretation: string;
}

// ===================== 星座运势 =====================

/** 星座信息 */
export interface ZodiacSign {
  name: string;
  nameEn: string;
  symbol: string;
  dateRange: string;
  element: string;
  startDate: string;
  endDate: string;
}

/** 星座运势输入参数 */
export interface ZodiacInputParams {
  birthDate: string; // YYYY-MM-DD
  type?: 'daily' | 'weekly' | 'monthly';
}

/** 星座运势结果 */
export interface ZodiacResult {
  sign: ZodiacSign;
  overallScore: number;
  love: { score: number; description: string };
  career: { score: number; description: string };
  wealth: { score: number; description: string };
  health: { score: number; description: string };
  luckyColor: string;
  luckyNumber: number;
  advice: string;
}

// ===================== 解梦 =====================

/** 解梦输入参数 */
export interface DreamInputParams {
  keywords: string[];
}

/** 解梦词条 */
export interface DreamEntry {
  keyword?: string;    // 匹配到的用户关键词（查询时附加）
  symbol: string;
  fortune: string;
  interpretation: string;
}

/** 解梦结果 */
export interface DreamResult {
  keywords: string[];
  entries: DreamEntry[];
  overallInterpretation: string;
}

// ===================== 紫微斗数 =====================

/** 紫微斗数输入参数 */
export interface ZiweiInputParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
}

/** 紫微斗数结果 */
export interface ZiweiResult extends BaseFortuneResult {
  details: {
    birthInfo: string;           // 出生信息
    mingGong: { palace: string; star: string }; // 命宫及主星
    twelvePalaces: Array<{       // 十二宫位
      palace: string;
      mainStar: string;
      subStars: string[];
    }>;
    siHua: Record<string, string>; // 四化（化禄/化权/化科/化忌）
    wuXingJu: string;              // 五行局
  };
}

// ===================== 六爻卦象 =====================

/** 六爻输入参数 */
export interface LiuyaoInputParams {
  question: string;
}

/** 六爻结果 */
export interface LiuyaoResult extends BaseFortuneResult {
  details: {
    question: string;
    originalGua: { name: string; symbol: string };   // 本卦
    changedGua: { name: string; symbol: string };     // 变卦
    sixLines: Array<{ position: number; yao: string; yinYang: string }>; // 六爻详情
    worldResponse: { world: number; response: number }; // 世应位置
    naJia: string[];                                     // 纳甲
  };
}

// ===================== 梅花易数 =====================

/** 梅花易数输入参数 */
export interface MeihuaInputParams {
  method: 'number' | 'time';
  num1?: number;
  num2?: number;
  question?: string;
}

/** 梅花易数结果 */
export interface MeihuaResult extends BaseFortuneResult {
  details: {
    method: string;
    upperGua: { name: string; symbol: string };  // 上卦
    lowerGua: { name: string; symbol: string };  // 下卦
    mainGua: { name: string; symbol: string };    // 主卦
    huGua: { name: string; symbol: string };      // 互卦
    tiYong: { ti: string; yong: string };          // 体用关系
    interpretation: string;                        // 断卦
  };
}

// ===================== 奇门遁甲 =====================

/** 奇门遁甲输入参数 */
export interface QimenInputParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  question?: string;
}

/** 奇门遁甲结果 */
export interface QimenResult extends BaseFortuneResult {
  details: {
    juShu: string;                              // 局数（阳遁/阴遁几局）
    tianPan: Record<string, string>;           // 天盘（九星分布）
    diPan: Record<string, string>;             // 地盘（三奇六仪分布）
    baMen: Record<string, string>;             // 八门
    jiuXing: Record<string, string>;           // 九星
    baShen: Record<string, string>;             // 八神
    suggestion: string;                         // 综合建议
  };
}

// ===================== 风水罗盘 =====================

/** 风水罗盘输入参数 */
export interface FengshuiInputParams {
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  buildingType: 'residential' | 'commercial' | 'office';
}

/** 风水罗盘结果 */
export interface FengshuiResult extends BaseFortuneResult {
  details: {
    direction: string;                         // 方位名称
    buildingType: string;                      // 建筑类型
    wuXing: string;                            // 所属五行
    favorableAreas: string[];                  // 吉利方位
    unfavorableAreas: string[];               // 不利方位
    layoutAdvice: string[];                    // 布局建议
  };
}

// ===================== 数字能量 =====================

/** 数字能量输入参数 */
export interface NumerologyInputParams {
  birthDate: string; // YYYY-MM-DD
}

/** 数字能量结果 */
export interface NumerologyResult extends BaseFortuneResult {
  details: {
    lifePathNumber: number;       // 生命灵数
    lifePathMeaning: string;      // 生命灵数含义
    birthdayNumber: number;       // 生日数
    personalYear: number;         // 个人年数
    personalYearMeaning: string;   // 个人年含义
    expressionNumber: number;     // 表达数
    soulNumber: number;            // 灵魂数
    personalityNumber: number;     // 性格数
    maturityNumber: number;        // 成熟数
  };
}

// ===================== 占星骰子 =====================

/** 占星骰子输入参数 */
export interface AstrodiceInputParams {
  question?: string;
}

/** 占星骰子结果 */
export interface AstrodiceResult extends BaseFortuneResult {
  details: {
    dice1: { type: 'planet'; name: string; nameEn: string; meaning: string }; // 行星骰子
    dice2: { type: 'zodiac'; name: string; nameEn: string; meaning: string }; // 星座骰子
    dice3: { type: 'house'; name: string; meaning: string };                  // 宫位骰子
    interpretation: string;  // 综合解读
  };
}

// ===================== 月相占卜 =====================

/** 月相占卜输入参数 */
export interface MoonphaseInputParams {
  birthDate: string; // YYYY-MM-DD
}

/** 月相占卜结果 */
export interface MoonphaseResult extends BaseFortuneResult {
  details: {
    moonPhase: string;            // 月相名称
    moonEmoji: string;            // 月相符号
    illumination: string;         // 亮度描述
    traits: string[];             // 个人特质
    emotionalPattern: string;     // 情感模式
    advice: string;               // 建议
  };
}

// ===================== 符文占卜 =====================

/** 符文占卜输入参数 */
export interface RuneInputParams {
  spread: 'single' | 'three';
  question?: string;
}

/** 符文占卜结果 */
export interface RuneResult extends BaseFortuneResult {
  details: {
    spread: string;               // 牌阵类型
    runes: Array<{
      name: string;               // 符文名称
      symbol: string;             // 符文符号
      meaning: string;            // 含义
      reversed: boolean;          // 是否逆位
      position?: string;          // 位置说明（三牌阵）
    }>;
  };
}

// ===================== 姓名测试 =====================

/** 姓名测试输入参数 */
export interface NametestInputParams {
  surname: string;    // 姓
  givenName: string;   // 名
  gender: 'male' | 'female';
}

/** 姓名测试结果 */
export interface NametestResult extends BaseFortuneResult {
  details: {
    fullName: string;              // 全名
    surnameStrokes: number;        // 姓笔画
    givenNameStrokes: number;      // 名笔画
    totalStrokes: number;          // 总笔画
    wuGe: {                        // 五格
      tianGe: { number: number; meaning: string };  // 天格
      renGe: { number: number; meaning: string };   // 人格
      diGe: { number: number; meaning: string };    // 地格
      waiGe: { number: number; meaning: string };   // 外格
      zongGe: { number: number; meaning: string }; // 总格
    };
    sanCai: string;                // 三才配置
    sanCaiMeaning: string;         // 三才含义
    score: number;                 // 综合评分（满分100）
  };
}

// ===================== 生肖运势 =====================

/** 生肖运势输入参数 */
export interface ShengxiaoInputParams {
  animal: string;      // 生肖名
  birthYear?: number;  // 出生年份（可选）
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

/** 生肖运势结果 */
export interface ShengxiaoResult extends BaseFortuneResult {
  details: {
    animal: string;                    // 生肖
    benMingNian: string;              // 本命年信息
    scores: {                          // 各维度运势评分
      overall: number;
      career: number;
      wealth: number;
      love: number;
      health: number;
    };
    luckyItems: {                     // 幸运元素
      color: string;
      number: number;
      direction: string;
    };
    advice: string;                   // 建议
  };
}

// ===================== 每日黄历 =====================

/** 每日黄历输入参数 */
export interface AlmanacInputParams {
  date: string; // YYYY-MM-DD
}

/** 每日黄历结果 */
export interface AlmanacResult extends BaseFortuneResult {
  details: {
    date: string;                        // 公历日期
    lunarDate: string;                   // 农历日期
    ganZhi: { year: string; month: string; day: string }; // 干支
    yi: string[];                        // 宜
    ji: string[];                         // 忌
    chongSha: string;                     // 冲煞
    jiShen: string[];                     // 吉神
   xiongShen: string[];                  // 凶神
    shiChenLuck: Array<{                  // 时辰吉凶
      name: string;
      luck: '吉' | '凶' | '中';
    }>;
  };
}

// ===================== 求签 =====================

/** 求签输入参数 */
export interface DrawlotInputParams {
  // 无必要参数，求签为随机抽取
}

/** 求签结果 */
export interface DrawlotResult extends BaseFortuneResult {
  details: {
    lotNumber: number;       // 签号
    level: string;           // 签等级
    poem: string;            // 签诗
    interpretation: string;   // 解签
    advice: string;          // 建议
  };
}

// ===================== 手相算命 =====================

/** 手相算命输入参数 */
export interface PalmInputParams {
  gender: 'male' | 'female';  // 性别
  image: string;              // Base64 编码的手掌图片
}

/** 手相主线结构 */
export interface PalmLine {
  name: string;         // 线的名称
  type: string;         // 线的类型（长/短/深/浅）
  description: string;  // 描述
  interpretation: string; // 解读
}

/** 手相算命结果 */
export interface PalmResult extends BaseFortuneResult {
  details: {
    palmType: string;         // 掌型（如：金型手、木型手、水型手、火型手、土型手）
    palmTypeDesc: string;     // 掌型描述
    wuXing: string;           // 五行属性
    gender: string;           // 性别
    lines: {                  // 三大主线
      life: PalmLine;         // 生命线
      heart: PalmLine;        // 感情线
      mind: PalmLine;         // 智慧线
    };
  };
}

// ===================== 铁板神数 =====================

/** 铁板神数输入参数 */
export interface TiebanInputParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  name?: string;
}

/** 铁板神数神数 */
export interface TiebanNumber {
  number: number;       // 铁板神数
  mainNumber: number;   // 主数
  subNumbers: number[]; // 附数
  category: string;     // 分类
  description: string;  // 描述
}

/** 铁板神数结果 */
export interface TiebanResult extends BaseFortuneResult {
  details: {
    birthTime: string;        // 出生时辰
    ganZhiYear: string;       // 干支年
    ganZhiMonth: string;      // 干支月
    ganZhiDay: string;        // 干支日
    ganZhiHour: string;       // 干支时
    mainCode: number;         // 主码（铁板神数）
    mainNumber: TiebanNumber; // 主数详情
    subNumbers: TiebanNumber[]; // 附数列表（通常3个）
    lifeFortune: string;      // 一生命运总论
    careerFortune: string;    // 事业运势
    loveFortune: string;      // 感情婚姻
    healthFortune: string;    // 健康状况
  };
}

// ===================== 大六壬 =====================

/** 大六壬输入参数 */
export interface DaliurenInputParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  question?: string;
}

/** 大六壬三传 */
export interface DaliurenChuan {
  chuan: string;        // 传名（初传/中传/末传）
  gan: string;          // 天干
  zhi: string;          // 地支
  shen: string;         // 六神
  yi: string;           // 六仪
  description: string;  // 解读
}

/** 大六壬地盘 */
export interface DaliurenDiPan {
  positions: Record<string, string>; // 宫位 -> 地支
  gan: string;            // 月将
  diZhu: string;          // 地盘
}

/** 大六壬天盘 */
export interface DaliurenTianPan {
  positions: Record<string, string>; // 宫位 -> 天盘地支
  tianZhang: string;      // 天将
}

/** 大六壬结果 */
export interface DaliurenResult extends BaseFortuneResult {
  details: {
    date: string;            // 占卜日期
    ganZhiDate: string;      // 干支纪日
    hour: string;            // 占时
    monthJiang: string;      // 月将
    shen: string;            // 六壬神将（如：大吉、功曹、太冲等）
    diPan: DaliurenDiPan;    // 地盘
    tianPan: DaliurenTianPan; // 天盘
    liuShen: Record<string, string>; // 六神（青龙、白虎、朱雀等对应地支）
    chuan: DaliurenChuan[];  // 三传
    overallJudgment: string; // 整体判断
    question: string;        // 所问之事
  };
}

/** 统一查询结果 */
export interface FortuneResult {
  id: string;
  system: FortuneSystem;
  createdAt: string;
  status: 'completed' | 'pending';
  data: BaziResult | TarotResult | ZodiacResult | DreamResult
    | ZiweiResult | LiuyaoResult | MeihuaResult | QimenResult | FengshuiResult
    | NumerologyResult | AstrodiceResult | MoonphaseResult | RuneResult
    | NametestResult | ShengxiaoResult | AlmanacResult | DrawlotResult
    | PalmResult | TiebanResult | DaliurenResult;
}
