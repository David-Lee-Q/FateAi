/**
 * 大六壬服务
 * 中国古代三式之首，以月将加时推算吉凶
 */

interface DaliurenResult {
  /** 起课时间信息 */
  time: {
    year: number;
    month: number;
    day: number;
    hour: number;
    shichen: string;  // 当前时辰
    yuejiang: string; // 月将
  };
  /** 四课（从近到远） */
  ke: {
    ke1: string;  // 第一课（日干所寄+日支）
    ke2: string;  // 第二课（日干所寄+天盘）
    ke3: string;  // 第三课（日支所寄+日支）
    ke4: string;  // 第四课（日支所寄+天盘）
  };
  /** 三传（事情发展三个阶段） */
  chuan: {
    chuan1: string; // 初传
    chuan2: string; // 中传
    chuan3: string; // 末传
    chuan1Desc: string;
    chuan2Desc: string;
    chuan3Desc: string;
  };
  /** 贵神（十二神将） */
  shen: {
    shen1: string;
    shen2: string;
    shen3: string;
    shen4: string;
  };
  /** 六亲关系 */
  liuqin: string[];
  /** 天盘地盘 */
  tianpan: Record<string, string>;
  dipan: Record<string, string>;
  /** 吉凶判断 */
  judgments: {
    overall: string;       // 总体判断
    goodAspects: string[]; // 吉的方面
    badAspects: string[];  // 需要注意的方面
    fortune: string;       // 运势等级
  };
  /** 详细解读 */
  interpretation: string;
}

/**
 * 时辰对应地支
 */
const SHICHEN_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 月将对应地支（正月建寅，月将在亥）
 */
const YUEJIANG_ZHI = ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'];

/**
 * 贵神排列顺序
 */
const GUISHEN_ORDER = ['贵', '蛇', '龙', '空', '虎', '常', '玄', '阴', '蛇', '贵', '后', '玄'];

/**
 * 十二天将对应地支
 */
const TIANJIANG = {
  子: '贵神',
  丑: '腾蛇',
  寅: '青龙',
  卯: '六合',
  辰: '勾陈',
  巳: '朱雀',
  午: '白虎',
  未: '玄武',
  申: '太阴',
  酉: '太常',
  戌: '天空',
  亥: '贵人',
};

/**
 * 大六壬九宗门
 */
const JIU_ZONGMEN = [
  '元首课',  // 三上克下
  '重审课',  // 三下克上
  '知一课',  // 一下克上，余上克下
  '涉害课',  // 上下皆有克
  '遥克课',  // 课无克，先取遥克
  '昴星课',  // 课无克，取日干或日支上神
  '别责课',  // 阳日取干上神，阴日取支上神
  '八专课',  // 干支同宫
  '伏吟课',  // 天地盘相同
  '返吟课',  // 天地盘相冲
];

/**
 * 计算大六壬
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @param hour 小时
 * @param gender 性别（备用）
 */
export function calculateDaliuren(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: string
): DaliurenResult {
  // 计算时辰地支
  const hourZhiIndex = Math.floor(hour / 2) % 12;
  const hourZhi = SHICHEN_ZHI[hourZhiIndex];

  // 计算月将（正月建寅，月将亥）
  const yuejiangIndex = (month + 9) % 12; // 正月月将为亥(9)，故 +9 取余
  const yuejiang = YUEJIANG_ZHI[(month - 1) % 12];

  // 计算日干天支
  const dayGanIndex = (day % 10 + 9) % 10; // 简化计算
  const dayZhiIndex = (day % 12 + 10) % 12; // 简化计算
  const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const dayGan = TIANGAN[dayGanIndex];
  const dayZhi = SHICHEN_ZHI[dayZhiIndex];

  // 日干所寄地支（甲寄寅、乙寄辰等）
  const dayGanZhiMap: Record<string, string> = {
    甲: '寅', 乙: '辰', 丙: '巳', 丁: '未', 戊: '巳',
    己: '未', 庚: '申', 辛: '酉', 壬: '亥', 癸: '丑',
  };
  const dayGanZhi = dayGanZhiMap[dayGan];

  // 日支所寄地支（子寄于本宫，丑寄于癸等）
  const dayZhiZhiMap: Record<string, string> = {
    子: '子', 丑: '亥', 寅: '亥', 卯: '子',
    辰: '丑', 巳: '寅', 午: '卯', 未: '辰',
    申: '巳', 酉: '午', 戌: '未', 亥: '申',
  };
  const dayZhiZhi = dayZhiZhiMap[dayZhi];

  // 计算四课
  const ke1 = `${dayGanZhi}${dayZhi}`;
  const ke2 = `${dayGanZhi}${yuejiang}`;
  const ke3 = `${dayZhiZhi}${dayZhi}`;
  const ke4 = `${dayZhiZhi}${yuejiang}`;

  // 计算贵神排列
  // 贵神起法：子在亥，丑在子，寅在丑...（顺时针）
  const guiStartIndex = hourZhiIndex;
  const shen1 = GUISHEN_ORDER[(guiStartIndex + 9) % 12];  // 子上贵人
  const shen2 = GUISHEN_ORDER[(guiStartIndex + 10) % 12];
  const shen3 = GUISHEN_ORDER[(guiStartIndex + 8) % 12];
  const shen4 = GUISHEN_ORDER[(guiStartIndex + 7) % 12];

  // 计算三传（简化版：基于四课关系）
  const { chuan, zongmen } = calculateThreeChuan(ke1, ke2, ke3, ke4, dayGan);

  // 计算地盘
  const dipan: Record<string, string> = {
    巽: '辰', 离: '午', 坤: '未', 兑: '酉',
    乾: '戌', 坎: '子', 艮: '丑', 震: '卯',
  };

  // 计算天盘（地盘+月将）
  const tianpan = calculateTianPan(dipan, yuejiang);

  // 吉凶判断
  const judgments = analyzeJudgments(zongmen, chuan, shen1);

  // 生成解读
  const interpretation = generateInterpretation(year, month, day, zongmen, chuan, shen1);

  return {
    time: {
      year,
      month,
      day,
      hour,
      shichen: `${hourZhi}时`,
      yuejiang,
    },
    ke: {
      ke1,
      ke2,
      ke3,
      ke4,
    },
    chuan: {
      chuan1: chuan[0],
      chuan2: chuan[1],
      chuan3: chuan[2],
      chuan1Desc: describeChuanElement(chuan[0]),
      chuan2Desc: describeChuanElement(chuan[1]),
      chuan3Desc: describeChuanElement(chuan[2]),
    },
    shen: {
      shen1,
      shen2,
      shen3,
      shen4,
    },
    liuqin: generateLiuqin(chuan),
    tianpan,
    dipan,
    judgments,
    interpretation,
  };
}

/**
 * 计算三传
 */
function calculateThreeChuan(
  ke1: string,
  ke2: string,
  ke3: string,
  ke4: string,
  dayGan: string
): { chuan: string[]; zongmen: string } {
  // 简化三传计算：基于日干和四课关系
  // 实际六壬三传计算非常复杂，这里用简化逻辑
  
  const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const ganIndex = TIANGAN.indexOf(dayGan);
  
  // 根据日干确定三传
  const chuanGans = [
    TIANGAN[(ganIndex + 2) % 10],
    TIANGAN[(ganIndex + 4) % 10],
    TIANGAN[(ganIndex + 7) % 10],
  ];
  
  const chuanZhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const chuanZhiIndex = (ganIndex + 3) % 12;
  
  const chuan = [
    `${chuanGans[0]}${chuanZhis[chuanZhiIndex]}`,
    `${chuanGans[1]}${chuanZhis[(chuanZhiIndex + 4) % 12]}`,
    `${chuanGans[2]}${chuanZhis[(chuanZhiIndex + 7) % 12]}`,
  ];

  // 判断九宗门
  let zongmen = '元首课';
  if (ganIndex < 5) {
    zongmen = Math.random() > 0.5 ? '重审课' : '知一课';
  } else {
    zongmen = Math.random() > 0.5 ? '涉害课' : '遥克课';
  }

  return { chuan, zongmen };
}

/**
 * 计算天盘
 */
function calculateTianPan(
  dipan: Record<string, string>,
  yuejiang: string
): Record<string, string> {
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const yuejiangIndex = zhiOrder.indexOf(yuejiang);
  
  const tianpan: Record<string, string> = {};
  for (const [position, zhi] of Object.entries(dipan)) {
    const zhiIndex = zhiOrder.indexOf(zhi);
    const tianZhiIndex = (zhiIndex + yuejiangIndex) % 12;
    tianpan[position] = zhiOrder[tianZhiIndex];
  }
  
  return tianpan;
}

/**
 * 描述三传元素
 */
function describeChuanElement(chuan: string): string {
  const gan = chuan[0];
  const zhi = chuan[1];
  
  const wuxing = {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
    己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
  }[gan] || '土';
  
  const descriptions: Record<string, string> = {
    木: '代表生发、成长，有开创进取之意',
    火: '代表明快、上升，有积极主动之意',
    土: '代表稳定、承载，有务实踏实之意',
    金: '代表锐利、决断，有刚毅果断之意',
    水: '代表流动、智慧，有灵活变通之意',
  };
  
  return `${chuan}（五行属${wuxing}）：${descriptions[wuxing] || '需结合具体情况判断'}`;
}

/**
 * 生成六亲关系
 */
function generateLiuqin(chuan: string[]): string[] {
  return [
    `初传${chuan[0]}代表事情的起因和动机`,
    `中传${chuan[1]}代表事情的发展过程`,
    `末传${chuan[2]}代表事情的结果和归宿`,
  ];
}

/**
 * 分析吉凶判断
 */
function analyzeJudgments(zongmen: string, chuan: string[], shen1: string): DaliurenResult['judgments'] {
  // 吉神列表
  const luckyShen = ['贵人', '青龙', '六合', '太阴', '太常'];
  const unluckyShen = ['白虎', '玄武', '腾蛇', '勾陈'];
  
  const goodAspects: string[] = [];
  const badAspects: string[] = [];

  // 贵神吉凶
  if (luckyShen.includes(shen1)) {
    goodAspects.push(`贵神为${shen1}，主吉利，有贵人相助`);
  } else if (unluckyShen.includes(shen1)) {
    badAspects.push(`贵神为${shen1}，需要谨慎行事`);
  }

  // 九宗门吉凶
  const zongmenFortune: Record<string, { good: string[]; bad: string[] }> = {
    元首课: { good: ['主事顺遂，一上临下'], bad: [] },
    重审课: { good: ['深思熟虑，谨慎行事'], bad: ['事多波折，需要耐心'] },
    知一课: { good: ['事在眼前，择善而行'], bad: ['选择困难，需当机立断'] },
    涉害课: { good: ['情况复杂，需要智慧'], bad: ['吉凶相半，谨慎为上'] },
    遥克课: { good: ['事有外应，信息灵通'], bad: ['远而不实，需近取'] },
    昴星课: { good: ['刚决果断，速战速决'], bad: ['动静皆宜，不宜拖延'] },
    别责课: { good: ['专一坚定，不为外动'], bad: ['格局较弱，需借外力'] },
    八专课: { good: ['专注一事，易有成就'], bad: ['格局特殊，需特殊对待'] },
    伏吟课: { good: ['静待时机，蓄势待发'], bad: ['时机未到，不宜妄动'] },
    返吟课: { good: ['变动活跃，机会较多'], bad: ['动荡不安，需稳住心神'] },
  };

  const fortune = zongmenFortune[zongmen] || { good: [], bad: [] };
  goodAspects.push(...fortune.good);
  badAspects.push(...fortune.bad);

  // 判断运势等级
  let overallFortune = '平';
  if (goodAspects.length > badAspects.length + 1) {
    overallFortune = '上吉';
  } else if (goodAspects.length > badAspects.length) {
    overallFortune = '吉';
  } else if (badAspects.length > goodAspects.length + 1) {
    overallFortune = '凶';
  }

  const overall = `${zongmen}，${overallFortune}。${goodAspects.length > 0 ? '吉利之处：' + goodAspects.join('；') + '。' : ''}${badAspects.length > 0 ? '需要注意：' + badAspects.join('；') + '。' : ''}`;

  return {
    overall,
    goodAspects,
    badAspects,
    fortune: overallFortune,
  };
}

/**
 * 生成详细解读
 */
function generateInterpretation(
  year: number,
  month: number,
  day: number,
  zongmen: string,
  chuan: string[],
  shen1: string
): string {
  // 简化解读生成
  let interpretation = `占事时间：${year}年${month}月${day}日。\n\n`;
  interpretation += `课象分析：\n`;
  interpretation += `1. 本课为${zongmen}，是六壬课中较为常见的课象。\n`;
  interpretation += `2. 贵神为${shen1}，在六壬课象中具有重要意义。\n`;
  interpretation += `3. 三传走势：${chuan.join(' → ')}，显示事情发展的三个阶段。\n\n`;
  interpretation += `判断建议：\n`;
  
  // 根据九宗门给出建议
  const suggestions: Record<string, string> = {
    元首课: '事情发展较为顺遂，宜积极行动，把握时机。',
    重审课: '需要深思熟虑，权衡利弊后再做决定。',
    知一课: '选择明确，当机立断，不可犹豫不决。',
    涉害课: '情况较为复杂，需要多角度分析问题。',
    遥克课: '有外部信息介入，注意收集准确情报。',
    昴星课: '宜快不宜慢，当速战速决。',
    别责课: '宜专注一事，不宜分散精力。',
    八专课: '有独特格局，需以特殊方式应对。',
    伏吟课: '时机未到，宜静待时机，积蓄力量。',
    返吟课: '变动较大，宜顺应变化，灵活应对。',
  };
  
  interpretation += suggestions[zongmen] || '请结合具体问题综合判断。';
  
  return interpretation;
}