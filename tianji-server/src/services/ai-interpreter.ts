/**
 * AI 解读服务 — Prompt 模板与知识库
 * 用于调用 LLM 生成个性化运势解读
 */

// ============================================================
// Prompt 模板
// ============================================================

/** 八字排盘 AI 解读 Prompt */
export const BAZI_PROMPT = (params: {
  yearPillar: string; monthPillar: string; dayPillar: string; hourPillar: string;
  dayMaster: string; wuxingCount: Record<string, number>;
  gender: 'male' | 'female';
}) => `你是"天机"AI运势系统的专业命理师。请基于以下八字排盘结果，生成一份个性化的运势解读。

## 排盘数据
- 四柱八字：年柱 ${params.yearPillar}、月柱 ${params.monthPillar}、日柱 ${params.dayPillar}、时柱 ${params.hourPillar}
- 日主：${params.dayMaster}
- 性别：${params.gender === 'male' ? '男' : '女'}
- 五行分布：金${params.wuxingCount['金'] || 0} 木${params.wuxingCount['木'] || 0} 水${params.wuxingCount['水'] || 0} 火${params.wuxingCount['火'] || 0} 土${params.wuxingCount['土'] || 0}

## 输出要求
请按以下结构输出（每个部分 2-3 句话）：

### 1. 性格特征
基于日主五行和十神关系分析。

### 2. 事业方向
基于日主强弱和喜用神分析适合的行业和发展方向。

### 3. 感情婚姻
基于日柱和夫妻宫分析感情运势。

### 4. 财运分析
基于财星的有无和旺衰分析。

### 5. 健康提醒
基于五行缺失或过旺分析需要注意的健康方面。

### 6. 近期提醒
基于当前大运流年分析近期需要注意的事项。

注意：
- 语言风格专业但不晦涩，面向普通用户
- 避免宿命论，强调后天努力的重要性
- 不做具体的投资/医疗建议
- 以客观中立的语气，不过度夸大吉凶`;

/** 塔罗牌 AI 解读 Prompt */
export const TAROT_PROMPT = (params: {
  spread: string; question: string;
  cards: Array<{ name: string; position: string; isReversed: boolean }>;
}) => `你是"天机"AI运势系统的塔罗牌解读师。请基于以下牌阵结果进行解读。

## 占卜信息
- 牌阵类型：${params.spread}
- 占卜问题：${params.question}
- 抽出的牌：
${params.cards.map(c => `- ${c.position}：${c.name}（${c.isReversed ? '逆位' : '正位'}）`).join('\n')}

## 输出要求

### 1. 牌面解读
逐一解读每张牌的含义及其在${params.spread}牌阵中的位置意义。

### 2. 牌面联动
分析牌与牌之间的关联和故事线。

### 3. 综合启示
综合所有牌面信息，给出针对"${params.question}"的启示和建议。

注意：
- 避免绝对化的预测（如"一定会"），使用"可能""倾向于"等表述
- 强调塔罗牌是能量指引而非命运判决
- 建议要具体可执行
- 保持温暖而专业的语调`;

/** 星座运势 AI 解读 Prompt */
export const ZODIAC_PROMPT = (params: {
  sign: string; dateRange: string; timeRange: string;
  scores: { love: number; career: number; finance: number; health: number };
}) => `你是"天机"AI运势系统的星座分析师。请基于以下星座信息生成运势解读。

## 星座数据
- 星座：${params.sign}（${params.dateRange}）
- 查询范围：${params.timeRange}
- 维度评分：爱情${params.scores.love} 事业${params.scores.career} 财运${params.scores.finance} 健康${params.scores.health}（满分 5 分）

## 输出要求

### 1. 综合运势
一句话概括${params.timeRange}的整体运势。

### 2. 爱情运势
基于评分分析感情方面的走向。

### 3. 事业运势
分析工作和学业方面的趋势。

### 4. 财运
分析正财和偏财运。

### 5. 健康运势
基于评分给出健康方面的提醒。

### 6. 幸运建议
推荐幸运颜色、幸运数字、幸运方位。

### 7. AI 建议
给出${params.timeRange}内的具体行动建议。

注意：保持轻松愉快的语调，适合星座运势的受众。`;

/** 周公解梦 AI 解读 Prompt */
export const DREAM_PROMPT = (params: {
  description: string; keywords: string[];
  mood?: string;
  elements: Array<{ name: string; symbol: string; fortune: string }>;
}) => `你是"天机"AI运势系统的解梦分析师。请基于以下梦境信息进行解读。

## 梦境信息
- 梦境描述：${params.description}
- 关键元素：${params.keywords.join('、')}
${params.mood ? `- 梦境情绪：${params.mood}` : ''}
- 元素分析：${params.elements.map(e => `${e.name}(${e.symbol})→${e.fortune}`).join('、')}

## 输出要求

### 1. 梦境分类
判断此梦境属于哪类（动物类/自然类/人物类/建筑类/其他）。

### 2. 吉凶判断
综合各元素的吉凶，给出整体吉凶判断。

### 3. 心理分析
从心理学角度分析此梦可能反映的潜意识活动。

### 4. 传统解读
基于周公解梦传统的解读。

### 5. 化解与建议
如有需要化解的方面，给出建议。

注意：
- 同时提供传统解梦和心理学两个视角
- 不制造焦虑，对噩梦给出安慰性建议
- 建议要具体可行`;

/** 综合运势报告 Prompt */
export const REPORT_PROMPT = (params: {
  topic: string; systems: string[];
  baziSummary?: string; tarotSummary?: string; zodiacSummary?: string;
}) => `你是"天机"AI运势系统的综合分析师。请整合多个占卜体系的结果，生成一份跨维度的运势报告。

## 报告主题
${params.topic}

## 各体系独立分析
${params.baziSummary ? `### 八字命理分析\n${params.baziSummary}\n` : ''}
${params.tarotSummary ? `### 塔罗牌分析\n${params.tarotSummary}\n` : ''}
${params.zodiacSummary ? `### 星座运势分析\n${params.zodiacSummary}\n` : ''}

## 输出要求

### 1. 报告概要
一句话总结当前运势态势。

### 2. 交叉验证
分析各体系结论的共识点和分歧点。

### 3. 综合建议
权衡所有分析后给出最终行动建议，分为：
- 短期建议（1-2 周内）
- 中期规划（1-3 个月）
- 长期方向（半年以上）

### 4. 关键时间节点
标注近期需要注意的重要时间点。

注意：分歧点要如实说明，不要强行统一。建议要具体可执行。`;

/** 通用追问 Prompt */
export const FOLLOW_UP_PROMPT = (params: {
  system: string; previousResult: string; question: string;
}) => `你是"天机"AI运势系统的专业分析师。用户在使用${params.system}后提出了追问。

## 之前的解读
${params.previousResult}

## 用户追问
${params.question}

请基于之前的解读结果，针对用户的追问给出补充分析。保持与之前解读一致的风格和立场，但可以补充新的视角。回答简洁，2-3 段即可。`;


// ============================================================
// 知识库常量
// ============================================================

/** 十神含义知识库 */
export const SHI_SHEN_KNOWLEDGE = {
  '正官': { keyword: '自律、权威', positive: '责任心强、有领导力', negative: '压力较大、过于拘谨' },
  '偏官': { keyword: '魄力、冒险', positive: '执行力强、敢于突破', negative: '冲动、容易冲突' },
  '正印': { keyword: '学业、贵人', positive: '聪明好学、有贵人相助', negative: '依赖性强、优柔寡断' },
  '偏印': { keyword: '才华、偏门', positive: '思维独特、多才多艺', negative: '想法多变、缺乏坚持' },
  '比肩': { keyword: '竞争、独立', positive: '独立自主、意志坚定', negative: '固执、不易合作' },
  '劫财': { keyword: '争夺、社交', positive: '人缘好、行动力强', negative: '财务波动、易有纠纷' },
  '食神': { keyword: '享受、才华', positive: '生活品味高、才华横溢', negative: '懒散、贪图享乐' },
  '伤官': { keyword: '创意、叛逆', positive: '创造力强、思维敏捷', negative: '口无遮拦、叛逆不安' },
  '正财': { keyword: '稳定、务实', positive: '财运稳定、勤劳务实', negative: '过于保守、缺乏魄力' },
  '偏财': { keyword: '投资、社交', positive: '善于理财、社交能力强', negative: '投机冒险、不稳定' },
} as const;

/** 五行生克关系 */
export const WU_XING_RELATIONS = {
  '生': { '木→火': '木生火', '火→土': '火生土', '土→金': '土生金', '金→水': '金生水', '水→木': '水生木' },
  '克': { '木→土': '木克土', '土→水': '土克水', '水→火': '水克火', '火→金': '火克金', '金→木': '金克木' },
} as const;

/** 大阿卡纳牌含义（22张） */
export const MAJOR_ARCANA = [
  { id: 0, name: '愚者', nameEn: 'The Fool', keyword: '新开始、冒险、纯真' },
  { id: 1, name: '魔术师', nameEn: 'The Magician', keyword: '创造力、意志力、技能' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess', keyword: '直觉、神秘、内在智慧' },
  { id: 3, name: '皇后', nameEn: 'The Empress', keyword: '丰收、母性、创造力' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', keyword: '权威、秩序、领导力' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', keyword: '传统、指引、信仰' },
  { id: 6, name: '恋人', nameEn: 'The Lovers', keyword: '爱情、选择、和谐' },
  { id: 7, name: '战车', nameEn: 'The Chariot', keyword: '胜利、意志、前进' },
  { id: 8, name: '力量', nameEn: 'Strength', keyword: '勇气、耐心、内在力量' },
  { id: 9, name: '隐者', nameEn: 'The Hermit', keyword: '独处、反思、智慧' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune', keyword: '转折、循环、命运' },
  { id: 11, name: '正义', nameEn: 'Justice', keyword: '公正、真相、因果' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man', keyword: '牺牲、新视角、等待' },
  { id: 13, name: '死神', nameEn: 'Death', keyword: '结束、转变、重生' },
  { id: 14, name: '节制', nameEn: 'Temperance', keyword: '平衡、调和、耐心' },
  { id: 15, name: '恶魔', nameEn: 'The Devil', keyword: '束缚、欲望、物质' },
  { id: 16, name: '高塔', nameEn: 'The Tower', keyword: '突变、崩塌、觉醒' },
  { id: 17, name: '星星', nameEn: 'The Star', keyword: '希望、灵感、平静' },
  { id: 18, name: '月亮', nameEn: 'The Moon', keyword: '幻觉、恐惧、潜意识' },
  { id: 19, name: '太阳', nameEn: 'The Sun', keyword: '成功、快乐、光明' },
  { id: 20, name: '审判', nameEn: 'Judgement', keyword: '觉醒、重生、审视' },
  { id: 21, name: '世界', nameEn: 'The World', keyword: '完成、圆满、整合' },
] as const;

/** 星座基本信息 */
export const ZODIAC_INFO = [
  { name: '白羊座', symbol: '♈', dateRange: '3.21-4.19', element: '火', ruler: '火星', trait: '热情、冲动、勇敢' },
  { name: '金牛座', symbol: '♉', dateRange: '4.20-5.20', element: '土', ruler: '金星', trait: '稳重、务实、固执' },
  { name: '双子座', symbol: '♊', dateRange: '5.21-6.21', element: '风', ruler: '水星', trait: '灵活、好奇、多变' },
  { name: '巨蟹座', symbol: '♋', dateRange: '6.22-7.22', element: '水', ruler: '月亮', trait: '敏感、体贴、保护' },
  { name: '狮子座', symbol: '♌', dateRange: '7.23-8.22', element: '火', ruler: '太阳', trait: '自信、慷慨、骄傲' },
  { name: '处女座', symbol: '♍', dateRange: '8.23-9.22', element: '土', ruler: '水星', trait: '细致、分析、完美' },
  { name: '天秤座', symbol: '♎', dateRange: '9.23-10.23', element: '风', ruler: '金星', trait: '和谐、优雅、犹豫' },
  { name: '天蝎座', symbol: '♏', dateRange: '10.24-11.22', element: '水', ruler: '冥王星', trait: '深沉、执着、洞察' },
  { name: '射手座', symbol: '♐', dateRange: '11.23-12.21', element: '火', ruler: '木星', trait: '乐观、自由、冒险' },
  { name: '摩羯座', symbol: '♑', dateRange: '12.22-1.19', element: '土', ruler: '土星', trait: '勤奋、务实、野心' },
  { name: '水瓶座', symbol: '♒', dateRange: '1.20-2.18', element: '风', ruler: '天王星', trait: '独立、创新、叛逆' },
  { name: '双鱼座', symbol: '♓', dateRange: '2.19-3.20', element: '水', ruler: '海王星', trait: '浪漫、敏感、直觉' },
] as const;


// ============================================================
// AI 服务调用函数
// ============================================================

/**
 * 通用占卜解读入口
 * 根据 system 类型构建 prompt，调用 LLM 生成自然语言解读
 * @param system 占卜系统标识
 * @param data 占卜服务返回的结构化数据
 * @param inputParams 用户原始输入参数
 * @returns AI 生成的解读文本
 */
export async function interpretFortune(
  system: string,
  data: Record<string, unknown>,
  inputParams: Record<string, unknown>
): Promise<string> {
  // 系统名称映射
  const systemNames: Record<string, string> = {
    bazi: '八字排盘', tarot: '塔罗牌', zodiac: '星座运势', dream: '周公解梦',
    ziwei: '紫微斗数', liuyao: '六爻卦象', meihua: '梅花易数', qimen: '奇门遁甲',
    fengshui: '风水罗盘', numerology: '数字能量', astrodice: '占星骰子',
    moonphase: '月相占卜', rune: '符文占卜', nametest: '姓名测试',
    shengxiao: '生肖运势', almanac: '每日黄历', drawlot: '求签解签',
    report: '综合报告', compare: '多维对比',
  };

  const name = systemNames[system] || system;

  // 构建通用 prompt：将结构化数据序列化为可读文本
  const dataText = JSON.stringify(data, null, 2);
  const paramsText = JSON.stringify(inputParams, null, 2);

  const prompt = `请为以下${name}结果生成一份专业、温暖的运势解读。\n\n` +
    `## 用户输入\n${paramsText}\n\n` +
    `## 占卜结果数据\n${dataText}\n\n` +
    `## 输出要求\n` +
    `1. 用简洁自然的语言解读结果，避免堆砌术语\n` +
    `2. 分 3-4 个维度分析（如事业、感情、财运、健康等，根据占卜类型调整）\n` +
    `3. 每个维度 2-3 句话\n` +
    `4. 最后给出一条实用建议\n` +
    `5. 总字数 200-400 字`;

  return callAI(prompt);
}

/**
 * AI 追问解读
 * 基于之前的解读结果，针对用户的追问生成补充分析
 * @param system 占卜系统标识
 * @param previousResult 之前的解读结果文本
 * @param question 用户的追问问题
 * @returns AI 生成的追问回答
 */
export async function followUpInterpret(
  system: string,
  previousResult: string,
  question: string
): Promise<string> {
  // 系统名称映射
  const systemNames: Record<string, string> = {
    bazi: '八字排盘', tarot: '塔罗牌', zodiac: '星座运势', dream: '周公解梦',
    ziwei: '紫微斗数', liuyao: '六爻卦象', meihua: '梅花易数', qimen: '奇门遁甲',
    fengshui: '风水罗盘', numerology: '数字能量', astrodice: '占星骰子',
    moonphase: '月相占卜', rune: '符文占卜', nametest: '姓名测试',
    shengxiao: '生肖运势', almanac: '每日黄历', drawlot: '求签解签',
    report: '综合报告', compare: '多维对比',
  };

  const name = systemNames[system] || system;

  // 使用 FOLLOW_UP_PROMPT 构建追问 prompt
  const prompt = FOLLOW_UP_PROMPT({
    system: name,
    previousResult,
    question,
  });

  return callAI(prompt);
}

// ============================================================
// AI 服务调用函数
// ============================================================

/**
 * 调用 LLM 生成解读
 * @param prompt 构建好的 prompt
 * @returns AI 生成的解读文本
 */
export async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  const apiBase = process.env.AI_API_BASE || 'https://api.openai.com/v1';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey || apiKey === 'your_api_key_here') {
    // 无 API Key 时返回模拟解读
    return generateMockInterpretation(prompt);
  }

  try {
    // 使用 AbortController 实现 10 秒超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: '你是"天机"AI运势系统的专业分析师，擅长中国传统命理和西方占卜体系。回答风格专业但不晦涩，温暖而客观。' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    // 请求完成后清除超时定时器
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI API 调用失败: ${response.status}`);
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || '解读生成失败，请重试。';
  } catch (error) {
    // 超时或其他异常时降级到 mock 解读
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('AI API 调用超时（10秒），已切换为模拟解读');
    } else {
      console.error('AI 调用异常:', error);
    }
    return generateMockInterpretation(prompt);
  }
}

/**
 * 模拟解读生成（无 API Key 或异常时的降级方案）
 * 根据不同占卜体系返回有针对性的模拟文本（每条 >= 100 字）
 */
function generateMockInterpretation(prompt: string): string {
  if (prompt.includes('八字') || prompt.includes('排盘')) {
    return `【八字命盘综合解读】\n\n` +
      `基于您的八字排盘数据进行综合分析，日主五行格局显示您天生兼具理性思维与感性直觉。` +
      `从四柱天干地支的生克关系来看，您的命局中木气较旺，代表创造力与进取心突出，但需注意避免过于固执己见。\n\n` +
      `事业方向：近期官星得力，职场上有望获得晋升或承担更重要项目的机遇。建议主动展现领导才能，同时保持谦逊态度。` +
      `适合从事教育、咨询、管理类工作，能充分发挥您的人际沟通优势。\n\n` +
      `感情婚姻：日柱坐支显示夫妻宫稳定，感情关系总体和谐。单身者今年桃花运势渐旺，` +
      `有望通过工作社交圈认识志趣相投的伴侣。已婚者注意多关心配偶的情感需求。\n\n` +
      `财运分析：正财星旺盛，薪资收入有望增长。偏财方面需谨慎，` +
      `避免高风险投资和投机行为，稳健理财为宜。\n\n` +
      `健康提醒：五行中水气偏弱，注意肾脏和泌尿系统的保养。` +
      `建议保持规律作息，适当补充水分，避免熬夜过度劳累。`;
  }
  if (prompt.includes('塔罗')) {
    return `【塔罗牌阵综合解读】\n\n` +
      `从您抽到的塔罗牌阵来看，当前您正处于人生中一个关键的过渡阶段。` +
      `牌面中出现的意象暗示着旧有模式的瓦解与新能量的汇聚，这是一个充满转变与可能性的时期。\n\n` +
      `过去位置：过去的经历为您积累了丰富的内心资源。` +
      `那些看似困难的选择，实际上都在为您塑造更清晰的自我认知和更坚定的意志力。\n\n` +
      `现在位置：当前的能量场提醒您保持内心的平静与觉察。` +
      `面对复杂局面时，不必急于做出最终决定。可以先观察、感受，让直觉逐渐浮出水面。` +
      `冥想或写日记是不错的选择。\n\n` +
      `未来趋势：牌面预示着积极的发展方向。` +
      `在接下来的几周内，您可能会遇到一个令人振奋的新机会。` +
      `建议保持开放的心态，勇敢迎接变化。\n\n` +
      `综合建议：信任自己的直觉，同时兼顾理性分析。` +
      `塔罗牌是能量的指引，而非命运的判决。最终的选择权始终在您手中。`;
  }
  if (prompt.includes('星座')) {
    return `【星座运势综合分析】\n\n` +
      `当前星象配置对您的星座整体较为有利，多颗行星的和谐相位为您带来了丰富的机遇能量。\n\n` +
      `综合运势：整体运势呈上升趋势，适合把握时机推进重要计划。` +
      `木星的顺行位置为事业和学业领域注入了幸运能量，是展现能力和拓展视野的好时机。\n\n` +
      `爱情运势：金星与您的太阳星座形成有利相位，感情运势温和上升。` +
      `单身者社交圈有望扩大，有机会在朋友聚会或兴趣活动中遇到心仪对象。` +
      `已有伴侣者，适合安排一次浪漫约会，增进感情。\n\n` +
      `事业运势：水星位于有利位置，思维敏捷、表达流畅。` +
      `适合进行重要谈判、方案汇报和创意工作。团队合作氛围良好，注意倾听同事建议。\n\n` +
      `财运分析：正财运势稳定，可能有加薪或额外收入的机会。` +
      `偏财运中等，不宜进行大额投机。\n\n` +
      `健康提醒：注意作息规律，适度运动。幸运颜色：蓝色；幸运数字：7。`;
  }
  if (prompt.includes('梦')) {
    return `【周公解梦综合分析】\n\n` +
      `梦境分类：根据您描述的梦境元素，此梦属于综合类型，包含多层象征意义。\n\n` +
      `吉凶判断：综合各元素的吉凶属性，此梦总体偏吉。` +
      `梦中出现的意象暗示着潜在的好运和积极变化的临近，特别在人际关系和事业发展方面。\n\n` +
      `心理学分析：从心理学角度看，这个梦境反映了您近期的潜意识活动。` +
      `梦中反复出现的主题可能对应着您清醒时正在面对的某些抉择或情感波动。` +
      `建议关注梦境带给您的第一感受，那往往是最真实的内心声音。\n\n` +
      `传统解读：结合《周公解梦》古籍，梦中所见元素各有象征。` +
      `水主财、火主运、路主前程，综合来看是一个向好的征兆。\n\n` +
      `化解与建议：保持开放乐观的心态，顺应自然变化。` +
      `如果梦境带来不安感，可以尝试睡前冥想放松，避免过度刺激的影视内容。`;
  }
  if (prompt.includes('紫微') || prompt.includes('斗数')) {
    return `【紫微斗数综合解读】\n\n` +
      `基于您的紫微命盘，十二宫位的星曜分布呈现出独特的性格特征与运势走向。\n\n` +
      `命宫主星分析：命宫安星显示您天生具备领导气质和战略思维，` +
      `为人正直有担当，在团队中常处于核心地位。\n\n` +
      `事业宫：事业宫星曜配置良好，职场发展潜力较大。` +
      `中年时期有望达到事业高峰，适合从事管理或专业技术领域。\n\n` +
      `财运宫：财帛宫见吉星，正财运稳健。` +
      `建议注重积累，长期投资优于短期投机。\n\n` +
      `建议：把握命盘中显示的运势节奏，顺势而为。` +
      `紫微斗数提供的是人生格局的参考，而非定数。`;
  }
  if (prompt.includes('综合') || prompt.includes('报告')) {
    return `【综合运势分析报告】\n\n` +
      `本报告融合多个占卜体系的分析结果，为您提供全方位的运势解读。\n\n` +
      `一、性格特质：综合分析显示您具有敏锐的洞察力和坚韧的意志力。` +
      `善于在复杂环境中保持冷静，具备优秀的分析判断能力。\n\n` +
      `二、事业运势：近期事业运势呈上升趋势，适合主动出击、拓展人脉。` +
      `下半年有望获得重要突破，但需注意团队协作和沟通方式。\n\n` +
      `三、感情运势：感情方面需要更多耐心和理解。` +
      `单身者下半年有桃花运的可能，已有伴侣者注意经营感情中的细节。\n\n` +
      `四、财运分析：正财运稳定，偏财运需谨慎。` +
      `建议稳健投资，避免高风险投机行为，注重长期规划。\n\n` +
      `五、健康提醒：注意作息规律，避免过度劳累。` +
      `适当增加户外运动，关注消化系统健康。\n\n` +
      `六、近期关键时间节点：建议关注农历节气前后几天的能量变化，` +
      `适时调整计划和节奏。`;
  }
  return `【AI 运势解读】\n\n` +
    `基于当前提供的占卜数据和星象信息进行综合分析，整体运势平稳向好。` +
    `近期适合稳扎稳打，在重要决策前多方考量。命理分析反映的是趋势和可能性，` +
    `最终的结果取决于个人的选择和努力。\n\n` +
    `建议保持积极乐观的心态，顺应自然规律，在事业和生活中找到平衡。` +
    `如需更精准的个性化分析，建议提供更详细的出生信息以便深入解读。`;
}
