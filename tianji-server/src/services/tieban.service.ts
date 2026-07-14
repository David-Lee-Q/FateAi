/**
 * 铁板神数服务
 * 根据四柱八字推算命运数字
 */

interface TiebanResult {
  /** 铁板神数主数（核心命运数字） */
  mainNumber: number;
  /** 四柱信息 */
  bazi: {
    year: string;  // 年柱天干地支
    month: string; // 月柱天干地支
    day: string;   // 日柱天干地支
    hour: string;  // 时柱天干地支
  };
  /** 命宫 */
  mingGong: string;
  /** 身宫 */
  shenGong: string;
  /** 幸运数字 */
  luckyNumbers: number[];
  /** 命运等级 */
  fortuneLevel: string;
  /** 命运特征描述 */
  characteristics: string;
  /** 一生命运概述 */
  lifetime: string;
  /** 六亲缘分 */
  liuqin: Record<string, string>;
  /** 事业财运 */
  careerFortune: string;
  /** 婚姻感情 */
  loveFortune: string;
  /** 流年运势 */
  yearlyFortune: string;
}

/**
 * 天干地支对照表
 */
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 五行对照表
 */
const WUXING = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
  子: '水', 丑: '土',
  寅: '木', 卯: '木',
  辰: '土', 巳: '火',
  午: '火', 未: '土',
  申: '金', 酉: '金',
  戌: '土', 亥: '水',
};

/**
 * 计算天干地支
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @param hour 小时
 */
export function calculateTieban(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: string
): TiebanResult {
  // 计算年柱天干地支
  const yearGanIndex = (year - 4) % 10;
  const yearZhiIndex = (year - 4) % 12;
  const yearGan = TIANGAN[yearGanIndex < 0 ? yearGanIndex + 10 : yearGanIndex];
  const yearZhi = DIZHI[yearZhiIndex < 0 ? yearZhiIndex + 12 : yearZhiIndex];

  // 计算月柱天干地支（需要根据年干确定月干）
  const monthGanIndex = (yearGanIndex * 2 + month + 1) % 10;
  const monthGan = TIANGAN[monthGanIndex];
  const monthZhi = DIZHI[(month - 1) % 12];

  // 计算日柱（简化版：使用日期计算）
  const dayGanIndex = (day + 3) % 10;
  const dayZhiIndex = (day + 1) % 12;
  const dayGan = TIANGAN[dayGanIndex];
  const dayZhi = DIZHI[dayZhiIndex];

  // 计算时柱
  const hourZhiIndex = Math.floor(hour / 2) % 12;
  const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex + 1) % 10;
  const hourGan = TIANGAN[hourGanIndex];
  const hourZhi = DIZHI[hourZhiIndex];

  // 计算铁板神数主数（基于日柱数字）
  const mainNumber = ((day + year + month) % 9) + 1;
  
  // 计算幸运数字
  const luckyNumbers = [
    ((day + year) % 9) + 1,
    ((day + month) % 9) + 1,
    ((mainNumber * 2) % 9) + 1,
    ((dayGanIndex + hourZhiIndex) % 9) + 1,
  ];

  // 判断命运等级
  const fortuneLevel = mainNumber <= 3 ? '上上' : 
                       mainNumber <= 5 ? '上吉' : 
                       mainNumber <= 7 ? '中吉' : 
                       mainNumber <= 8 ? '吉' : '平';

  // 计算命宫和身宫
  const mingGongZhi = DIZHI[(month * 2 + day) % 12];
  const shenGongZhi = DIZHI[(hour * 2 + day) % 12];

  // 生成命运特征描述
  const wuxing = WUXING[dayGan as keyof typeof WUXING];
  const characteristics = generateCharacteristics(mainNumber, wuxing, gender);

  // 生成六亲缘分
  const liuqin = {
    father: generateLiuqinRelationship(yearGan, 'father'),
    mother: generateLiuqinRelationship(yearZhi, 'mother'),
    spouse: generateLiuqinRelationship(dayGan, 'spouse'),
    sibling: generateLiuqinRelationship(monthGan, 'sibling'),
  };

  // 生成各运势描述
  const careerFortune = generateCareerFortune(mainNumber, wuxing);
  const loveFortune = generateLoveFortune(mainNumber, dayGan);
  const yearlyFortune = generateYearlyFortune(mainNumber, yearZhi);

  return {
    mainNumber,
    bazi: {
      year: `${yearGan}${yearZhi}`,
      month: `${monthGan}${monthZhi}`,
      day: `${dayGan}${dayZhi}`,
      hour: `${hourGan}${hourZhi}`,
    },
    mingGong: mingGongZhi,
    shenGong: shenGongZhi,
    luckyNumbers: [...new Set(luckyNumbers)].slice(0, 4),
    fortuneLevel,
    characteristics,
    lifetime: generateLifetimeFortune(mainNumber, wuxing),
    liuqin,
    careerFortune,
    loveFortune,
    yearlyFortune,
  };
}

/**
 * 生成命运特征描述
 */
function generateCharacteristics(mainNumber: number, wuxing: string, gender: string): string {
  const genderText = gender === 'male' ? '男命' : '女命';
  
  const characteristics: Record<number, string> = {
    1: `${genderText}主一生独立自主，意志坚定，具领导之才，善于开拓创新。`,
    2: `${genderText}主性情温柔，才华内敛，擅长协调沟通，人际关系和谐。`,
    3: `${genderText}主聪明伶俐，反应敏捷，善于表达，社交能力强。`,
    4: `${genderText}主稳重踏实，勤劳刻苦，重视家庭责任心强。`,
    5: `${genderText}主心胸开阔，包容力强，财运亨通，贵人扶持。`,
    6: `${genderText}主艺术气质，才华出众，感情细腻，追求完美。`,
    7: `${genderText}主刚毅果断，行动力强，善于理财，事业有成。`,
    8: `${genderText}主仁慈厚道，乐于助人，福泽深厚，晚景吉祥。`,
    9: `${genderText}主智慧超群，分析力强，适合学术研究或专业技术。`,
  };

  return characteristics[mainNumber] || `${genderText}命运平稳，五行属${wuxing}，需顺势而为。`;
}

/**
 * 生成六亲缘分描述
 */
function generateLiuqinRelationship(ganshi: string, type: string): string {
  const relations: Record<string, Record<string, string>> = {
    father: {
      甲: '父亲性格刚强有力，助力明显',
      乙: '父亲性情温和，默默支持',
      丙: '父亲事业心强，光耀门楣',
      丁: '父亲体贴顾家，关怀备至',
      戊: '父亲稳重可靠，家业兴旺',
      己: '父亲勤俭持家，生活安稳',
      庚: '父亲果断坚毅，白手起家',
      辛: '父亲品味高雅，教养良好',
      壬: '父亲智慧通达，见识广博',
      癸: '父亲柔情似水，默默奉献',
    },
    mother: {
      子: '母亲聪慧灵秀，教养有方',
      丑: '母亲勤俭持家，默默付出',
      寅: '母亲积极进取，鼓励支持',
      卯: '母亲温柔体贴，关怀备至',
      辰: '母亲包容大度，家和万事兴',
      巳: '母亲热情开朗，善于交际',
      午: '母亲事业心强，独立自主',
      未: '母亲善解人意，协调能力强',
      申: '母亲精明能干，处事果断',
      酉: '母亲品味高雅，生活精致',
      戌: '母亲踏实稳重，务实可靠',
      亥: '母亲智慧通达，启发心智',
    },
    spouse: {
      甲: '配偶独立自主，责任心强',
      乙: '配偶温柔体贴，关怀备至',
      丙: '配偶热情开朗，活力四射',
      丁: '配偶细腻温柔，感情专一',
      戊: '配偶稳重踏实，值得信赖',
      己: '配偶勤俭持家，生活安稳',
      庚: '配偶刚毅果断，行动力强',
      辛: '配偶品味高雅，追求完美',
      壬: '配偶智慧通达，见多识广',
      癸: '配偶柔情似水，包容理解',
    },
    sibling: {
      甲: '兄弟姐妹独立自主，竞争互助',
      乙: '兄弟姐妹温柔友善，相处和睦',
      丙: '兄弟姐妹热情洋溢，气氛活跃',
      丁: '兄弟姐妹体贴关怀，互相扶持',
      戊: '兄弟姐妹稳重可靠，可以信赖',
      己: '兄弟姐妹勤俭持家，共同致富',
      庚: '兄弟姐妹刚毅果断，各自创业',
      辛: '兄弟姐妹品味高雅，共同进步',
      壬: '兄弟姐妹智慧通达，格局开阔',
      癸: '兄弟姐妹柔情似水，互相理解',
    },
  };

  return relations[type]?.[ganshi] || `${type === 'father' ? '父亲' : type === 'mother' ? '母亲' : type === 'spouse' ? '配偶' : '兄弟姐妹'}缘分深厚`;
}

/**
 * 生成事业财运描述
 */
function generateCareerFortune(mainNumber: number, wuxing: string): string {
  const careers: Record<number, string> = {
    1: '适合自主创业或担任领导岗位，事业发展迅速，财运逐步上升。',
    2: '适合协调管理类工作或服务行业，人际关系带来财富。',
    3: '适合销售、公关、演艺等领域，财运起伏较大但总收入可观。',
    4: '适合稳定型职业或技术岗位，财运平稳积累。',
    5: '适合投资理财或商业经营，财运亨通，贵人相助。',
    6: '适合艺术创作、设计等领域，财运与才华同步提升。',
    7: '适合金融、法律、工程等专业领域，财运稳步增长。',
    8: '适合慈善、教育、宗教等领域，福报带来财富。',
    9: '适合学术研究、专业技术领域，财运细水长流。',
  };

  return careers[mainNumber] || `五行属${wuxing}，事业发展需顺应时势，财运平稳。`;
}

/**
 * 生成婚姻感情描述
 */
function generateLoveFortune(mainNumber: number, dayGan: string): string {
  const love: Record<number, string> = {
    1: '感情上独立自主，不依赖他人，晚婚倾向，婚后感情稳定。',
    2: '感情细腻温柔，桃花运佳，早婚者居多，需注意第三者介入。',
    3: '感情经历丰富，追求者众多，需慎重选择，避免感情纠纷。',
    4: '感情保守传统，重视家庭，早婚者婚姻稳定，晚婚者缘分较迟。',
    5: '感情开放包容，人缘极佳，财运佳，感情顺利。',
    6: '感情要求完美，理想主义倾向较强，晚婚倾向，婚后幸福。',
    7: '感情果断坚决，不拖泥带水，晚婚倾向，婚后各忙事业。',
    8: '感情缘分深厚，配偶条件较好，婚后生活富足。',
    9: '感情理智冷静，注重精神层面契合，晚婚倾向，灵魂伴侣。',
  };

  return love[mainNumber] || `日主为${dayGan}，感情缘分需根据流年判断。`;
}

/**
 * 生成流年运势描述
 */
function generateYearlyFortune(mainNumber: number, yearZhi: string): string {
  return `今年流年地支为${yearZhi}，主数${mainNumber}的运势将在今年得到体现。流年与命格相合者诸事顺遂，与命格相冲者需谨慎行事。`;
}

/**
 * 生成一生命运概述
 */
function generateLifetimeFortune(mainNumber: number, wuxing: string): string {
  const lifetimes: Record<number, string> = {
    1: `一生命运起伏较大，少年历经磨练，中年事业有成，晚年福寿双全。`,
    2: `一生命运平稳，感情丰富，人际关系良好，晚年子孙满堂。`,
    3: `一生命运动荡但精彩，才华横溢，早年奔波，中年收获，晚年安宁。`,
    4: `一生命运踏实稳定，勤劳致富，家庭观念强，晚年生活富足。`,
    5: `一生命运顺畅，贵人扶持，财运亨通，但需注意健康。`,
    6: `一生命运艺术气息浓厚，才华出众，感情丰富，需注意调整心态。`,
    7: `一生命运刚毅果断，财运与事业并进，需注意人际关系。`,
    8: `一生命运福泽深厚，积善得报，晚年儿孙孝顺，生活幸福。`,
    9: `一生命运智慧通达，学识渊博，适合学术或专业技术领域发展。`,
  };

  return lifetimes[mainNumber] || `五行属${wuxing}，一生命运需根据流年大运综合判断。`;
}