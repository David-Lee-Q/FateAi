/**
 * AI 解读服务 — Prompt 模板与知识库
 * 用于调用 LLM 生成个性化运势解读
 */

import { ALL_TEMPLATES, SystemTemplates } from './mock-templates';
import { fillTemplate } from './template-filler';
import { selectKnowledgeChunks } from './knowledge.loader';
import { buildFacts, buildRetrievalQuery } from './fact-builder';

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

/** 占星骰子 AI 解读 Prompt */
export const ASTRODICE_PROMPT = (params: {
  planet: string; sign: string; house: string;
  question?: string;
}) => `你是"天机"AI运势系统的占星骰子解读师。请基于以下骰子组合进行解读。

## 骰子信息
- 行星骰：${params.planet}
- 星座骰：${params.sign}
- 宫位骰：${params.house}
${params.question ? `- 占卜问题：${params.question}` : ''}

## 输出要求

### 1. 行星骰解读
解析${params.planet}在占星学中的核心含义及其作为本次占卜主导能量的意义。

### 2. 星座骰解读
解析${params.sign}如何影响${params.planet}的表达方式，星座特质带来的独特视角。

### 3. 宫位骰解读
分析${params.house}所代表的生活领域，以及行星与星座能量将如何在该领域展开。

### 4. 综合解读
整合三骰信息，揭示行星行经星座落入宫位的完整图景。分析当前能量态势和时机。

### 5. 骰子建议
基于骰面组合，给出2-3条具体可行的行动建议。

注意：
- 使用占星学的专业术语但做通俗解释
- 骰子是象征而非算命，强调能量指引
- 建议要具体可执行
- 保持神秘而温暖的语调`;

/** 月相占卜 AI 解读 Prompt */
export const MOONPHASE_PROMPT = (params: {
  currentPhase: string; birthPhase?: string;
  moonAge?: number; illumination?: number;
}) => `你是"天机"AI运势系统的月相分析师。请基于以下月相信息进行解读。

## 月相信息
- 当前月相：${params.currentPhase}
${params.birthPhase ? `- 出生月相：${params.birthPhase}` : ''}
${params.moonAge !== undefined ? `- 月龄：${String(params.moonAge)}天` : ''}
${params.illumination !== undefined ? `- 月面亮度：${String(params.illumination)}%` : ''}

## 输出要求

### 1. 月相解读
描述${params.currentPhase}的天文特征和象征意义，分析当前所处的月亮能量阶段。

### 2. 情绪指引
基于月相分析当前的情绪状态和内在感受，给出情绪管理的建议。

### 3. 行动时机
指出当前月相阶段适宜进行哪些活动，哪些活动宜暂缓。标注关键的时机窗口。

### 4. 灵性指引
从灵性与能量层面给出指导，包括适合的仪式、冥想方向和能量调频建议。

### 5. 具体建议
结合以上分析，给出3-4条在当前月相周期内可以实践的具体行动建议。

注意：
- 语言应柔和、富有诗意但不过于空灵
- 将天文学事实与人文关怀相结合
- 建议要接地气、可操作
- 强调顺应自然节律而非对抗`;

/** 符文石 AI 解读 Prompt */
export const RUNE_PROMPT = (params: {
  runes: Array<{ name: string; position: string; meaning: string; isReversed: boolean }>;
  spread: string; question?: string;
}) => `你是"天机"AI运势系统的卢恩符文解读师。请基于以下符文组合进行解读。

## 符文信息
- 符文阵型：${params.spread}
${params.question ? `- 占卜问题：${params.question}` : ''}
- 符文排列：
${params.runes.map(r => `- ${r.position}：${r.name}（${r.meaning}，${r.isReversed ? '逆位' : '正位'}）`).join('\n')}

## 输出要求

### 1. 符文解析
逐一解读每个符文的古老含义及其在${params.spread}中的位置意义。

### 2. 正位含义
分析正位符文传递的积极能量和机遇信号。

### 3. 逆位含义
分析逆位符文所提示的挑战、阻滞或内在功课。

### 4. 神谕启示
将符文与北欧神话背景结合，揭示深层的神谕信息。

### 5. 实践指导
将符文的智慧转化为日常生活中可执行的具体建议。

注意：
- 融入北欧神话背景但不生硬
- 符文没有"好"与"坏"，只有能量的不同面向
- 逆位符文强调的是内在功课而非厄运
- 建议要神秘而实用，有仪式感但可落地`;

/** 姓名测试 AI 解读 Prompt */
export const NAMETEST_PROMPT = (params: {
  fullName: string; surname: string; givenName: string;
  strokes: { tian: number; ren: number; di: number; wai: number; zong: number };
  wuxing: { tian: string; ren: string; di: string; wai: string; zong: string };
  sancai: string; score: number;
}) => `你是"天机"AI运势系统的命名分析师。请基于以下姓名信息进行解读。

## 姓名信息
- 姓氏：${params.surname}
- 名字：${params.givenName}
- 全名：${params.fullName}
- 笔画：天格${String(params.strokes.tian)} 人格${String(params.strokes.ren)} 地格${String(params.strokes.di)} 外格${String(params.strokes.wai)} 总格${String(params.strokes.zong)}
- 五行：天格${params.wuxing.tian} 人格${params.wuxing.ren} 地格${params.wuxing.di} 外格${params.wuxing.wai} 总格${params.wuxing.zong}
- 三才：${params.sancai}
- 评分：${String(params.score)}分

## 输出要求

### 1. 五格数理
逐一分析天格、人格、地格、外格、总格的数理含义及其吉凶属性。

### 2. 三才配置
分析三才配置的五行生克关系，评估对整体运势的基础性影响。

### 3. 五行分析
分析名字中各字的五行属性及其与命主的匹配度，指出五行流转的优劣。

### 4. 吉凶评分
综合评估姓名得分，说明得分高低的命理依据，客观分析优势与不足。

### 5. 优化建议
针对姓名中的薄弱环节，给出具体可操作的优化建议（如改字、加字、调整用字方向等）。

注意：
- 客观公正，不过度夸大吉凶
- 评分低时不制造焦虑，强调后天努力的重要性
- 建议要具体，给出可选字的方向和五行属性
- 强调姓名是辅助而非决定因素`;

/** 每日黄历 AI 解读 Prompt */
export const ALMANAC_PROMPT = (params: {
  date: string; ganzhi: string; jianchu: string;
  yi: string[]; ji: string[];
  auspiciousHours: string[]; shensha: string[];
  clash: string; directions: { caishen: string; xishen: string; fushen: string };
}) => `你是"天机"AI运势系统的黄历分析师。请基于以下黄历信息生成今日宜忌解读。

## 黄历信息
- 日期：${params.date}
- 干支：${params.ganzhi}
- 值日神：${params.jianchu}
- 宜：${params.yi.join('、')}
- 忌：${params.ji.join('、')}
- 吉时：${params.auspiciousHours.join('、')}
- 神煞：${params.shensha.join('、')}
- 冲煞：${params.clash}
- 财神：${params.directions.caishen} 喜神：${params.directions.xishen} 福神：${params.directions.fushen}

## 输出要求

### 1. 今日宜忌
解读今日宜忌的内在逻辑，结合干支和建除十二神分析今日的整体能量基调。

### 2. 吉时吉方
分析最佳行动时间和方位，标注需要把握的黄金窗口。

### 3. 冲煞提醒
解读今日冲煞信息，给出需要注意和避让的事项。

### 4. 神煞分布
解读值日神煞对各个生活领域的吉凶影响。

### 5. 生活指南
结合以上信息，给出今日的具体行动建议和注意事项。

注意：
- 语言风格接近通俗黄历解读，接地气
- 宜忌分析要有理有据，不凭空臆断
- 提供实用的生活建议
- 不过度渲染迷信色彩，强调理性参考`;

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

/** 求签解签 AI 解读 Prompt */
export const DRAWLOT_PROMPT = (params: {
  lotNumber: string; lotLevel: string; poem: string;
  theme?: string; deity?: string;
}) => `你是"天机"AI运势系统的灵签解签师。请基于以下签文信息进行解读。

## 签文信息
- 签号：${params.lotNumber}
- 签等：${params.lotLevel}
- 签诗：${params.poem}
${params.theme ? `- 所求事项：${params.theme}` : ''}
${params.deity ? `- 所属神明：${params.deity}` : ''}

## 输出要求

### 1. 签文宣读
吟诵并初步解读签诗的字面含义。

### 2. 典故溯源
讲述此签对应的典故背景及其寓意。

### 3. 吉凶判断
综合签文信息给出整体吉凶判断。

### 4. 事业指引
结合签文智慧给出事业方面的建议。

### 5. 综合建议
给出 2-3 条具体可执行的行动建议。

注意：
- 语言庄重但不晦涩，保持对传统文化的尊重
- 不做过度的鬼神之说，强调签文是智慧指引而非宿命判决
- 建议要具体可执行`;

/** 手相算命 AI 解读 Prompt */
export const PALM_PROMPT = (params: {
  handShape?: string; lifeLine?: string; headLine?: string;
  heartLine?: string; fateLine?: string; features?: string[];
}) => `你是"天机"AI运势系统的手相分析师。请基于以下手相信息进行解读。

## 手相信息
${params.handShape ? `- 手型：${params.handShape}` : ''}
${params.lifeLine ? `- 生命线：${params.lifeLine}` : ''}
${params.headLine ? `- 智慧线：${params.headLine}` : ''}
${params.heartLine ? `- 感情线：${params.heartLine}` : ''}
${params.fateLine ? `- 命运线：${params.fateLine}` : ''}
${params.features ? `- 手相特征：${params.features.join('、')}` : ''}

## 输出要求

### 1. 手型分析
基于手型判断基本性格和体质倾向。

### 2. 三大主线
逐一分析生命线、智慧线、感情线的含义。

### 3. 辅线与特殊标记
解读命运线及其他辅助纹路的信息。

### 4. 运势趋势
综合分析手相信息推断近期运势走向。

### 5. 建议指导
给出基于手相分析的生活和事业建议。

注意：
- 强调手相会随心态和行为改变而变化
- 避免绝对的吉凶论断，强调后天努力的重要性
- 建议实用且积极向上`;

/** 铁板神数 AI 解读 Prompt */
export const TIEBAN_PROMPT = (params: {
  numbers: string; elements?: Record<string, string>;
  gender?: string; birthInfo?: string;
}) => `你是"天机"AI运势系统的铁板神数分析师。请基于以下神数信息进行解读。

## 神数信息
- 铁板数：${params.numbers}
${params.gender ? `- 性别：${params.gender === 'male' ? '男' : '女'}` : ''}
${params.birthInfo ? `- 出生信息：${params.birthInfo}` : ''}
${params.elements ? `- 四柱信息：${JSON.stringify(params.elements)}` : ''}

## 输出要求

### 1. 铁板数理
解析铁板数的数理含义和命理定位。

### 2. 命途总论
基于神数推演一生运势的基本走势。

### 3. 六亲缘分
分析父母、夫妻、子女等六亲缘分。

### 4. 财运解析
分析财运走向和财富积累建议。

### 5. 趋吉避凶
给出针对性的趋吉避凶建议。

注意：
- 保持对铁板神数这一古老算法的尊重
- 避免过于量化的预测，强调趋势而非定数
- 建议包含可操作的具体行动指导`;

/** 大六壬 AI 解读 Prompt */
export const DALIUREN_PROMPT = (params: {
  lessonType: string;
  fourLessons: Array<{ position: string; value: string }>;
  threeTransmissions: Array<{ position: string; value: string }>;
  shenJiang: Array<{ name: string; position: string }>;
}) => `你是"天机"AI运势系统的大六壬分析师。请基于以下课盘信息进行解读。

## 课盘信息
- 课式：${params.lessonType}
- 四课：
${params.fourLessons.map(l => `  - ${l.position}：${l.value}`).join('\n')}
- 三传：
${params.threeTransmissions.map(t => `  - ${t.position}：${t.value}`).join('\n')}
- 神将：
${params.shenJiang.map(s => `  - ${s.name}在${s.position}位`).join('\n')}

## 输出要求

### 1. 四课分析
分析四课的生克关系和基本格局。

### 2. 三传解读
解读初传、中传、末传的发展逻辑。

### 3. 神将分析
分析各神将的作用和相互影响。

### 4. 吉凶判断
综合课体、课传、神将给出整体判断。

### 5. 行动建议
基于课盘信息给出具体行动指引。

注意：
- 使用专业但不晦涩的壬学术语
- 强调课盘反映的是时空能量而非绝对定数
- 建议需结合具体时空条件给出`;

/** 综合报告 AI 解读 Prompt */
export const COMPREHENSIVE_REPORT_PROMPT = (params: {
  topic: string; systems: Array<{ name: string; summary: string }>;
  baziSummary?: string; tarotSummary?: string; zodiacSummary?: string;
  ziweiSummary?: string; palmSummary?: string; tiebanSummary?: string;
}) => `你是"天机"AI运势系统的综合分析师。请整合多个占卜体系的结果，生成一份跨维度的运势报告。

## 报告主题
${params.topic}

## 各体系独立分析
${params.systems.map(s => `### ${s.name}分析\n${s.summary}\n`).join('\n')}

## 输出要求

### 1. 报告概要
一句话总结当前运势态势。

### 2. 各体系分析
逐一梳理每个体系的核心结论。

### 3. 交叉验证
分析各体系结论的共识点和分歧点。

### 4. 综合建议
给出短期、中期、长期的行动建议。

### 5. 关键时间节点
标注近期需要注意的重要时间点。

注意：
- 分歧点如实说明，不强行统一
- 建议分短期（1-2周）、中期（1-3个月）、长期（半年以上）
- 结尾给出总字数 500-800 字的量级指引`;

/** 多维对比 AI 解读 Prompt */
export const COMPARE_PROMPT = (params: {
  dimensions: Array<{ name: string; score: number; level: string }>;
  systems?: string[];
  subjectA?: string; subjectB?: string;
}) => `你是"天机"AI运势系统的多维对比分析师。请基于以下对比数据进行解读。

## 对比信息
${params.subjectA && params.subjectB ? `- 对比对象：${params.subjectA} vs ${params.subjectB}` : ''}
${params.systems ? `- 使用体系：${params.systems.join('、')}` : ''}
- 维度评分：
${params.dimensions.map(d => `  - ${d.name}：${d.score}分（${d.level}）`).join('\n')}

## 输出要求

### 1. 综合匹配度
基于各维度评分给出整体匹配度评估。

### 2. 维度分析
逐一分析各维度的得分含义。

### 3. 优势互补
分析双方的互补领域。

### 4. 潜在风险
指出需要关注的分歧和风险点。

### 5. 合作建议
给出具体的合作或相处建议。

注意：
- 客观中立，不偏袒任何一方
- 差异点要如实说明，同时强调互补的可能性
- 建议需具体且兼顾双方利益`;

/** 六爻 AI 解读 Prompt */
export const LIUYAO_PROMPT = (params: {
  hexagram: { name: string; judgment: string };
  lines: Array<{ position: string; meaning: string; isChanging: boolean }>;
  shiYao: string; yingYao: string;
  sixRelations: Record<string, string>;
}) => `你是"天机"AI运势系统的六爻卦象分析师。请基于以下卦象信息进行专业解读。

## 卦象数据
- 主卦：${params.hexagram.name}（${params.hexagram.judgment}）
- 世爻位置：${params.shiYao}
- 应爻位置：${params.yingYao}
- 六爻详情：
${params.lines.map(l => `- ${l.position}：${l.meaning}（${l.isChanging ? '动爻' : '静爻'}）`).join('\n')}

## 输出要求

### 1. 卦象解读
分析主卦的整体含义及其对占问事项的启示。

### 2. 爻辞分析
逐一解读关键爻位（尤其是动爻）的深层含义。

### 3. 世应关系
分析世爻与应爻之间的生克关系及其对占问事项的影响。

### 4. 应期判断
结合月建日辰分析事情发展的关键时间节点。

### 5. 行动建议
综合卦象信息给出具体可执行的行动指引。

注意：语言风格专业但不晦涩，避免宿命论，强调卦象是能量参考而非命运判决。`;

/** 梅花易数 AI 解读 Prompt */
export const MEIHUA_PROMPT = (params: {
  mainGua: { upper: string; lower: string; name: string };
  tiGua: string; yongGua: string; tiYong: string;
  huGua: { upper: string; lower: string };
  bianGua: { upper: string; lower: string; name: string };
  changingLine: number;
  phenomenon?: string;
}) => `你是"天机"AI运势系统的梅花易数分析师。请基于以下卦象信息进行专业解读。

## 卦象数据
- 主卦：${params.mainGua.upper}上${params.mainGua.lower}下，${params.mainGua.name}
- 体卦：${params.tiGua}，用卦：${params.yongGua}，体用关系：${params.tiYong}
- 互卦：${params.huGua.upper}上${params.huGua.lower}下
- 变卦：${params.bianGua.upper}上${params.bianGua.lower}下，${params.bianGua.name}
- 动爻：第${params.changingLine}爻
${params.phenomenon ? `- 起卦外应：${params.phenomenon}` : ''}

## 输出要求

### 1. 卦象构成
分析主卦、互卦、变卦三层卦象的结构与含义。

### 2. 体用生克
深入分析体卦与用卦之间的五行生克关系及吉凶判断。

### 3. 变卦分析
解读动爻变化带来的趋势转变与最终走向。

### 4. 吉凶判断
综合三卦信息给出整体吉凶评估。

### 5. 实践指导
给出具体的时间、方位与行动策略建议。

注意：梅花易数贵在灵活变通，避免教条化的论断。强调心物感应的智慧。`;

/** 奇门遁甲 AI 解读 Prompt */
export const QIMEN_PROMPT = (params: {
  yangDun: boolean; juNum: number;
  palaceInfo: Array<{ palace: string; star: string; gate: string; deity: string; stem: string }>;
  zhiFuPalace: string; currentSeason: string;
  question?: string;
}) => `你是"天机"AI运势系统的奇门遁甲分析师。请基于以下局盘信息进行专业解读。

## 局盘数据
- 遁局：${params.yangDun ? '阳遁' : '阴遁'}${params.juNum}局
- 当前节令：${params.currentSeason}
- 值符宫位：${params.zhiFuPalace}
- 各宫分布：
${params.palaceInfo.map(p => `- ${p.palace}：天盘${p.star}、${p.gate}、${p.deity}、${p.stem}`).join('\n')}
${params.question ? `- 占问事项：${params.question}` : ''}

## 输出要求

### 1. 格局分析
分析整体局盘的吉凶格局与核心特征。

### 2. 宫位解读
逐一分析关键宫位的星门神仪组合。

### 3. 方位指引
指出吉方与凶方，给出方位选择的建议。

### 4. 时令吉凶
结合当前节令分析天时对局盘的影响。

### 5. 行动建议
综合四盘信息给出具体的时间与方位行动指南。

注意：奇门遁甲是时空选择之学，强调趋吉避凶的方法论，避免宿命论断。`;

/** 风水罗盘 AI 解读 Prompt */
export const FENGSHUI_PROMPT = (params: {
  flyingStars: Array<{ palace: string; direction: string; star: string; element: string; status: string }>;
  doorDirection: string; masterBedroom: string; kitchen: string;
  period: string; externalFeatures?: string;
}) => `你是"天机"AI运势系统的风水分析师。请基于以下玄空飞星数据进行分析。

## 宅运数据
- 元运：${params.period}
- 大门朝向：${params.doorDirection}
- 主卧位置：${params.masterBedroom}
- 厨房位置：${params.kitchen}
${params.externalFeatures ? `- 外部环境：${params.externalFeatures}` : ''}
- 飞星分布：
${params.flyingStars.map(s => `- ${s.palace}（${s.direction}）：${s.star}，属${s.element}，${s.status}`).join('\n')}

## 输出要求

### 1. 方位吉凶
基于飞星分布分析各宫位的吉凶情况。

### 2. 五行旺衰
分析各方位五行属性的旺衰及其对居住者的影响。

### 3. 气场分析
结合内部格局与外部环境分析整体气场流通性。

### 4. 调整方案
给出具体的风水调理与化煞增吉方案。

### 5. 注意事项
指出日常维护中需要关注的关键点。

注意：风水调理建议应实用可操作，避免夸张，强调人与环境的和谐共生。`;

/** 数字能量 AI 解读 Prompt */
export const NUMEROLOGY_PROMPT = (params: {
  birthDate: string;
  coreNumbers: { lifePath: number; expression: number; soulUrge: number; personality: number };
  peaks: number[]; challenges: number[];
  currentCycle: { year: number; number: number; theme: string };
}) => `你是"天机"AI运势系统的数字能量分析师。请基于以下生命数字信息进行解读。

## 数字数据
- 出生日期：${params.birthDate}
- 核心数字：生命道路${params.coreNumbers.lifePath}、表现数字${params.coreNumbers.expression}、灵魂渴望${params.coreNumbers.soulUrge}、人格数字${params.coreNumbers.personality}
- 人生高峰：${params.peaks.join('、')}
- 生命挑战：${params.challenges.join('、')}
- 当前周期：个人年${params.currentCycle.number}（${params.currentCycle.theme}）

## 输出要求

### 1. 核心数字
解读各核心数字的含义及其在整体数字图中的角色。

### 2. 性格解读
基于数字能量分析性格特质与天赋潜能。

### 3. 人生路径
结合高峰数字与挑战数字分析人生发展阶段。

### 4. 周期运势
基于当前个人年数字分析近期运势主题。

### 5. 提升建议
给出基于数字能量的个人成长与关系建议。

注意：数字能量是自我认知的工具，强调发挥天赋优势同时觉察数字阴影面。`;

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
  // 排盘事实（程序计算，模型不得改写）+ BM25 检索的知识库片段
  const facts = buildFacts(system, data);
  const question = typeof inputParams.question === 'string' ? inputParams.question : '';
  const retrievalQuery = buildRetrievalQuery(system, data, question);
  const knowledgeCtx = selectKnowledgeChunks(system, retrievalQuery);
  const withKnowledge = (prompt: string): Promise<string> => {
    const blocks: string[] = [];
    if (facts) {
      blocks.push(
        `以下是程序已算定的排盘事实（不得修改、不得自行推算新的事实，只能据此解读；`
        + `若某项事实缺失就明确说明无法判断）：\n\n`
        + `===== 排盘事实 =====\n${facts}\n===== 事实结束 =====`
      );
    }
    if (knowledgeCtx) {
      blocks.push(
        `以下是从本系统知识库中检索出的专业知识，请作为解读依据，不要直接复述文档内容：\n\n`
        + `===== 知识库资料 =====\n${knowledgeCtx}\n===== 知识库结束 =====`
      );
    }
    if (blocks.length === 0) return callAI(prompt, system);
    return callAI(`${blocks.join('\n\n')}\n\n${prompt}`, system);
  };

  if (system === 'bazi') {
    const baziData = data as {
      yearPillar: { gan: string; zhi: string };
      monthPillar: { gan: string; zhi: string };
      dayPillar: { gan: string; zhi: string };
      hourPillar: { gan: string; zhi: string };
      wuXingCount: Record<string, number>;
    };
    const yearPillar = `${baziData.yearPillar.gan}${baziData.yearPillar.zhi}`;
    const monthPillar = `${baziData.monthPillar.gan}${baziData.monthPillar.zhi}`;
    const dayPillar = `${baziData.dayPillar.gan}${baziData.dayPillar.zhi}`;
    const hourPillar = `${baziData.hourPillar.gan}${baziData.hourPillar.zhi}`;
    const dayMaster = baziData.dayPillar.gan;
    const gender = (inputParams.gender as string) === 'female' ? 'female' : 'male';
    const prompt = BAZI_PROMPT({
      yearPillar, monthPillar, dayPillar, hourPillar,
      dayMaster,
      wuxingCount: baziData.wuXingCount,
      gender,
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'dream') {
    const dreamData = data as {
      keywords: string[];
      entries: Array<{ keyword: string; symbol: string; fortune: string }>;
    };
    const input = inputParams as {
      description?: string;
      keywords?: string[];
      mood?: string;
    };
    const description = input.description || dreamData.keywords.join('、');
    const keywords = dreamData.keywords || input.keywords || [];
    const elements = dreamData.entries || [];
    const prompt = DREAM_PROMPT({
      description,
      keywords,
      mood: input.mood,
      elements: elements.map((e: { keyword: string; symbol: string; fortune: string }) => ({
        name: e.keyword,
        symbol: e.symbol,
        fortune: e.fortune,
      })),
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'tarot') {
    const tarotData = data as {
      spread: string;
      question: string;
      cards: Array<{ name: string; position: string; isReversed: boolean }>;
    };
    const prompt = TAROT_PROMPT({
      spread: tarotData.spread,
      question: tarotData.question || (inputParams.question as string) || '当前运势',
      cards: (tarotData.cards || []).map(c => ({
        name: c.name, position: c.position, isReversed: c.isReversed,
      })),
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'zodiac') {
    const zodiacData = data as {
      sign: string;
      dateRange: string;
      timeRange: string;
      scores: { love: number; career: number; finance: number; health: number };
    };
    const prompt = ZODIAC_PROMPT({
      sign: zodiacData.sign || (inputParams.sign as string) || '未知',
      dateRange: zodiacData.dateRange || (inputParams.dateRange as string) || '',
      timeRange: zodiacData.timeRange || (inputParams.timeRange as string) || '本周',
      scores: zodiacData.scores || { love: 4, career: 4, finance: 3, health: 4 },
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'astrodice') {
    const ad = data as { planet: string; sign: string; house: string; question?: string };
    const prompt = ASTRODICE_PROMPT({
      planet: ad.planet || (inputParams.planet as string) || '太阳',
      sign: ad.sign || (inputParams.sign as string) || '未知',
      house: ad.house || (inputParams.house as string) || '未知',
      question: ad.question || (inputParams.question as string),
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'moonphase') {
    const mp = data as { currentPhase: string; birthPhase?: string; moonAge?: number; illumination?: number };
    const prompt = MOONPHASE_PROMPT({
      currentPhase: mp.currentPhase || (inputParams.currentPhase as string) || '新月',
      birthPhase: mp.birthPhase || (inputParams.birthPhase as string),
      moonAge: mp.moonAge ?? (inputParams.moonAge as number),
      illumination: mp.illumination ?? (inputParams.illumination as number),
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'rune') {
    const rd = data as {
      spread: string;
      question?: string;
      runes: Array<{ name: string; position: string; meaning: string; isReversed: boolean }>;
    };
    const prompt = RUNE_PROMPT({
      spread: rd.spread || '三符文阵',
      question: rd.question || (inputParams.question as string),
      runes: (rd.runes || []).map(r => ({
        name: r.name, position: r.position, meaning: r.meaning, isReversed: r.isReversed,
      })),
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'nametest') {
    const nt = data as {
      fullName: string; surname: string; givenName: string;
      strokes: { tian: number; ren: number; di: number; wai: number; zong: number };
      wuxing: { tian: string; ren: string; di: string; wai: string; zong: string };
      sancai: string; score: number;
    };
    const prompt = NAMETEST_PROMPT({
      fullName: nt.fullName || (inputParams.fullName as string) || '',
      surname: nt.surname || (inputParams.surname as string) || '',
      givenName: nt.givenName || (inputParams.givenName as string) || '',
      strokes: nt.strokes || { tian: 0, ren: 0, di: 0, wai: 0, zong: 0 },
      wuxing: nt.wuxing || { tian: '', ren: '', di: '', wai: '', zong: '' },
      sancai: nt.sancai || '',
      score: nt.score || 0,
    });
    return withKnowledge(String(prompt));
  }

  if (system === 'almanac') {
    const al = data as {
      date: string; ganzhi: string; jianchu: string;
      yi: string[]; ji: string[];
      auspiciousHours: string[]; shensha: string[];
      clash: string; directions: { caishen: string; xishen: string; fushen: string };
    };
    const prompt = ALMANAC_PROMPT({
      date: al.date || (inputParams.date as string) || '今日',
      ganzhi: al.ganzhi || (inputParams.ganzhi as string) || '',
      jianchu: al.jianchu || (inputParams.jianchu as string) || '',
      yi: al.yi || (inputParams.yi as string[]) || [],
      ji: al.ji || (inputParams.ji as string[]) || [],
      auspiciousHours: al.auspiciousHours || (inputParams.auspiciousHours as string[]) || [],
      shensha: al.shensha || (inputParams.shensha as string[]) || [],
      clash: al.clash || (inputParams.clash as string) || '',
      directions: al.directions || (inputParams.directions as { caishen: string; xishen: string; fushen: string }) || { caishen: '', xishen: '', fushen: '' },
    });
    return withKnowledge(String(prompt));
  }

  // 系统名称映射
  const systemNames: Record<string, string> = {
    tarot: '塔罗牌', zodiac: '星座运势', dream: '周公解梦',
    ziwei: '紫微斗数', liuyao: '六爻卦象', meihua: '梅花易数', qimen: '奇门遁甲',
    fengshui: '风水罗盘', numerology: '数字能量', astrodice: '占星骰子',
    moonphase: '月相占卜', rune: '符文占卜', nametest: '姓名测试',
    shengxiao: '生肖运势', almanac: '每日黄历', drawlot: '求签解签',
    report: '综合报告', compare: '多维对比',
    palm: '手相算命', tieban: '铁板神数', daliuren: '大六壬',
  };

  // 各系统的分析维度指引
  const systemDirections: Record<string, string[]> = {
    ziwei: ['命宫总览', '事业官禄', '财运分析', '感情姻缘', '近期提醒'],
    liuyao: ['卦象解读', '爻辞分析', '世应关系', '应期判断', '行动建议'],
    meihua: ['卦象构成', '体用生克', '变卦分析', '吉凶判断', '实践指导'],
    qimen: ['格局分析', '宫位解读', '方位指引', '时令吉凶', '行动建议'],
    fengshui: ['方位吉凶', '五行旺衰', '气场分析', '调整方案', '注意事项'],
    numerology: ['核心数字', '性格解读', '人生路径', '周期运势', '提升建议'],
    astrodice: ['骰子解读', '行星影响', '宫位分析', '星座指引', '行动建议'],
    moonphase: ['月相意义', '情绪影响', '行动时机', '能量周期', '具体建议'],
    rune: ['符文解读', '正位含义', '逆位含义', '神谕启示', '行动指导'],
    nametest: ['姓名五格', '三才配置', '五行评分', '名字影响', '改名建议'],
    shengxiao: ['生肖概况', '事业运势', '财运分析', '感情运势', '健康提醒'],
    almanac: ['今日宜忌', '吉时吉方', '冲煞提醒', '祭祀宜忌', '出行建议'],
    drawlot: ['签文解读', '典故溯源', '吉凶判断', '事业指引', '综合建议'],
    palm: ['手型分析', '掌纹解读', '运势趋势', '性格特征', '建议指导'],
    tieban: ['铁板神数', '命盘解读', '流年运势', '六亲缘分', '趋吉避凶'],
    daliuren: ['四课分析', '三传解读', '神将分析', '吉凶判断', '行动建议'],
  };

  const name = systemNames[system] || system;

  // 构建更具体的方向指引
  const directions = systemDirections[system] || [
    '综合解读', '运气趋势', '关键提醒', '行动建议',
  ];

  const dataText = JSON.stringify(data, null, 2);
  const paramsText = JSON.stringify(inputParams, null, 2);

  const prompt = `请为以下${name}结果生成一份专业、温暖的运势解读。\n\n` +
    `## 用户输入\n${paramsText}\n\n` +
    `## 占卜结果数据\n${dataText}\n\n` +
    `## 输出要求\n` +
    `请按以下结构输出，每个部分 2-4 句话：\n\n` +
    directions.map((d: string, i: number) => `### ${i + 1}. ${d}`).join('\n') + `\n\n` +
    `注意：\n` +
    `- 语言风格专业但不晦涩，适合普通用户阅读\n` +
    `- 避免宿命论和绝对化的预测\n` +
    `- 每个维度都要有具体的分析，而不是空洞的套话\n` +
    `- 结尾给出 1-2 条实用建议\n` +
    `- 总字数 300-500 字`;

  return withKnowledge(prompt);
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
    palm: '手相算命', tieban: '铁板神数', daliuren: '大六壬',
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

/** 个性化建议页自定义提问 Prompt */
export const ADVICE_PROMPT = (question: string): string => `你正处于"个性化建议"板块，用户对综合运势提出了以下提问。请基于中国传统命理（八字、紫微、生肖流年）与西方占卜（塔罗、星象）多体系视角综合分析，给出具体可执行的建议。

用户提问：${question}

要求：
- 用中文回答，控制在 300 字以内
- 结构：先直接回应问题核心，再给出 2-3 条具体行动建议
- 避免宿命论，强调后天努力与行动的价值
- 不做具体投资/医疗/法律建议
- 若信息不足以精确判断，先说明可补充的信息，再给出通用参考框架`;

/**
 * 个性化建议页：AI 跨体系综合解答
 * @param question 用户提问
 * @param context 可选的额外背景（如用户资料、近期关注点）
 */
export async function askAiAdvice(question: string, context?: string): Promise<string> {
  const prompt = context
    ? `背景信息：${context}\n\n${ADVICE_PROMPT(question)}`
    : ADVICE_PROMPT(question);
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
export async function callAI(prompt: string, system?: string): Promise<string> {
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
    return generateMockInterpretation(prompt, system);
  }
}

/**
 * 调用视觉模型（图片 + 文本）。成功返回模型文本，不可用或失败返回 null
 */
export async function callAIWithImage(prompt: string, imageUrl: string): Promise<string | null> {
  const apiKey = process.env.AI_API_KEY;
  const apiBase = process.env.AI_API_BASE || 'https://api.openai.com/v1';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey || apiKey === 'your_api_key_here') {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: '你是资深手相师，擅长根据手掌照片分析掌纹与手型，输出客观专业的解读。' },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`视觉模型调用失败: ${response.status}，将降级为模拟解读`);
      return null;
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.warn('视觉模型调用异常，将降级为模拟解读:', error);
    return null;
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 占位符 → 盘面事实标签（尽量用真实数据替换） */
/** 仅保留语义严格对应的映射；语义不匹配的占位符走通用替换，避免错误填值 */
const PLACEHOLDER_FACT_LABEL: Record<string, string> = {
  fourLessons: '四课',
  guaJudgment: '课体',
  guaName: '本卦',
  shiYing: '世应',
  yongShen: '用神',
  juShu: '局',
  jiuGong: '九宫',
  zhiFu: '值符值使',
};

/** 清理模板中未被填充的占位符（优先用盘面事实替换，避免 {xxx} 泄漏） */
function sweepPlaceholders(text: string, facts = ''): string {
  const factMap: Record<string, string> = {};
  for (const line of facts.split('\n')) {
    const m = line.match(/^-\s*([^：]+)：(.*)$/);
    if (m) factMap[m[1].trim()] = m[2].trim();
  }
  return text
    .replace(/\{([A-Za-z0-9_]+)\}/g, (_all, key: string) => {
      const label = PLACEHOLDER_FACT_LABEL[key];
      return (label && factMap[label]) || '盘面所示';
    })
    .replace(/（\s*）/g, '')
    .replace(/，\s*，/g, '，')
    .replace(/。\s*。/g, '。');
}

function buildFromTemplate(sys: SystemTemplates, section: string, facts = ''): string {
  const intro = fillTemplate(pick(sys.intro), section);
  const sections = sys.sections.map(s => {
    return fillTemplate(s.heading, section) + '\n\n' + fillTemplate(pick(s.variants), section) + '\n';
  }).join('\n');
  const outro = fillTemplate(pick(sys.outro), section);
  return sweepPlaceholders(intro + '\n\n' + sections + '\n' + fillTemplate(outro, section), facts);
}

/**
 * 模拟解读生成（无 API Key 或异常时的降级方案）
 * 根据不同占卜体系返回有针对性的模拟文本（每条 >= 100 字）
 */
/**
 * 从注入文本中提取「排盘事实」区块，作为无 AI Key 时的解读依据
 */
function extractFactsBlock(text: string): string {
  const start = text.indexOf('===== 排盘事实 =====');
  const end = text.indexOf('===== 事实结束 =====');
  if (start === -1 || end === -1 || end <= start) return '';
  return text.slice(start + '===== 排盘事实 ====='.length, end).trim();
}

/** system → 模板键（与 ALL_TEMPLATES 对应） */
const SYSTEM_TEMPLATE_KEY: Record<string, keyof typeof ALL_TEMPLATES> = {
  bazi: 'bazi', tarot: 'tarot', zodiac: 'zodiac', ziwei: 'ziwei', shengxiao: 'shengxiao',
  dream: 'dream', drawlot: 'drawlot', palm: 'palm', tieban: 'tieban', daliuren: 'daliuren',
  liuyao: 'liuyao', meihua: 'meihua', qimen: 'qimen', fengshui: 'fengshui',
  numerology: 'numerology', astrodice: 'astrodice', moonphase: 'moonphase', rune: 'rune',
  nametest: 'nametest', almanac: 'almanac', report: 'report', compare: 'compare',
};

function generateMockInterpretation(prompt: string, system?: string): string {
  const facts = extractFactsBlock(prompt);
  // 优先按体系精确选模板，避免关键词误判（如六爻命中"八字"模板）
  const tplKey = system ? SYSTEM_TEMPLATE_KEY[system] : undefined;
  const body = tplKey && ALL_TEMPLATES[tplKey]
    ? buildFromTemplate(ALL_TEMPLATES[tplKey], tplKey, facts)
    : buildMockByKeyword(prompt);
  if (facts) {
    return `## 盘面事实\n${facts}\n\n## 解读\n${body}`;
  }
  return body;
}

function buildMockByKeyword(prompt: string): string {
  if (prompt.includes('八字') || prompt.includes('排盘')) {
    return buildFromTemplate(ALL_TEMPLATES.bazi, 'bazi');

  }
  if (prompt.includes('塔罗') || prompt.includes('Tarot')) {
    return buildFromTemplate(ALL_TEMPLATES.tarot, 'tarot');

  }
  if (prompt.includes('星座') || prompt.includes('Zodiac')) {
    return buildFromTemplate(ALL_TEMPLATES.zodiac, 'zodiac');

  }
  if (prompt.includes('紫微') || prompt.includes('斗数')) {
    return buildFromTemplate(ALL_TEMPLATES.ziwei, 'ziwei');

  }
  if (prompt.includes('生肖') || prompt.includes('属相')) {
    return buildFromTemplate(ALL_TEMPLATES.shengxiao, 'shengxiao');

  }
  if (prompt.includes('解梦') || prompt.includes('梦境')) {
    return buildFromTemplate(ALL_TEMPLATES.dream, 'dream');
  }
  if (prompt.includes('六爻') || prompt.includes('卦象')) {
    return pick([
      `### 卦象分析\n\n根据您摇得的六爻卦象，当前呈现的卦象揭示了事物发展的核心规律。世爻代表您自身所处的状态，应爻则反映外部环境或他人对您的影响。动爻所在往往是近期变化的关键点，旺相者能量充沛，衰弱者需要外来扶助。\n\n### 吉凶判断\n\n结合日月建的综合影响，本卦整体趋势向好。官鬼爻旺相则贵人运强劲，财爻得地则财运可期，子孙爻旺相则诸事平安。卦象显示当前是利于主动作为的时期。\n\n### 行动建议\n\n建议在动爻方向多加关注，顺势而为方能事半功倍。卦象所示只是当前时点的能量状态，事物仍在发展变化之中。保持灵活应变的心态是应对变化的最佳策略。`,
      `### 主卦解读\n\n您所摇得的卦象由上下两卦组成，主卦代表当前局面的本质特征。世应二爻的生克关系直接反映了您与所问事项的互动模式。动爻的出现预示着能量正在流动，变化已在酝酿之中。\n\n### 变化趋势\n\n之卦揭示了事物发展的方向。从主卦到之卦的演变路径，暗含着由静到动、由内到外的能量转换过程。地支的刑冲合害关系进一步细化了时间节点和关键事件。\n\n### 综合建议\n\n六爻预测强调天人感应，卦象是天地人三才在某一时刻的投影。建议在有利时机果断行动，在不利阶段蓄力待发。保持内心的平静与觉察，往往能在卦象之外发现转机。`,
      `### 爻象剖析\n\n六爻卦象中每一爻都承载着独特的信息。初爻为事情之始，上爻为终局之兆。您卦中的动爻位于关键位置，暗示着主动求变将带来积极效果。静爻虽不显山露水，却是整体格局的基石。\n\n### 时空维度\n\n结合起卦时间和节气因素，当前天时与卦象形成共振。日月建对爻位的影响不可忽视，特定的时间窗口将放大某些爻位的能量。把握天时、尽人事，是趋吉避凶的根本法则。\n\n### 实践指引\n\n卦象所揭示的是客观趋势，而选择权始终在您手中。在吉方行动、在吉时出击，顺应卦象的指引制定计划。六爻的智慧在于提醒我们：凡事预则立，有备无患。`,
    ]);
  }
  if (prompt.includes('梅花') || prompt.includes('易数')) {
    return pick([
      `### 卦象构成\n\n梅花易数通过时间、物象、声音等外应起卦，主卦展现事物本质，变卦显示演变动向，互卦揭示过程细节。体卦代表卦主自身，用卦代表所问之事，体用之间的生克关系是判断吉凶的核心依据。\n\n### 时空分析\n\n起卦时刻对应着特定的时空能量场。体用比和则万事顺遂、事半功倍；用生体则贵人相助、机遇自来；体生用则需付出努力、以诚动人。互卦中的信息补充了完整的事件图景。\n\n### 综合判断\n\n梅花易数贵在灵活变通，不拘一格。卦象所呈现的是天机的一缕投影，需配合当下的直觉感悟方能得其精髓。建议在行动前静心感受卦象传递的核心信息，顺势而为。`,
      `### 外应起卦\n\n梅花易数的独特之处在于以自然外应作为起卦依据。时间、方位、数字、声音皆可为卦，体现了天人合一的思想。体卦如树之根本，用卦如风雨阳光，两者相生则如沐春风，相克则需谨慎行事。\n\n### 生克关系\n\n五行生克是梅花易数的核心逻辑。体卦所在的卦宫决定了您的能量属性，用卦的生克关系则揭示了外部环境的友好度。生入者为吉，克出者为耗，比和者为稳。结合变卦分析，可预判事物的中长期走向。\n\n### 行动指导\n\n在体卦旺相的时空节点主动出击，在受克的阶段养精蓄锐。梅花易数强调心物感应，起卦时的第一直觉往往最为准确。建议将卦象解读与个人实际情况相结合，做出最适合当下的选择。`,
      `### 易数揭秘\n\n梅花易数源自邵雍先生的先天易学，以数理推演万物变化。主卦、互卦、变卦三者构成完整的信息链条。体用生克是解读的关键，但不可拘泥于公式化判断，灵机一动的直觉往往是最准确的指引。\n\n### 三层解读\n\n主卦揭示问题的核心矛盾，互卦展现中间过程的潜在变数，变卦则给出最终的演化方向。三层卦象层层递进，如同剥洋葱般逐渐深入事物本质。动静之间、阴阳转换，尽在卦爻变化之中。\n\n### 实践智慧\n\n梅花易数的精髓在于"观物取象"，将日常所见与易理融会贯通。建议在每次重要决策前静心一刻，感知当下的能量状态。卦象是天地之语，用心倾听方能得其真意。`,
    ]);
  }
  if (prompt.includes('奇门') || prompt.includes('遁甲')) {
    return pick([
      `### 格局分析\n\n基于您的奇门遁甲排盘，天盘九星运转、地盘六仪承载、人盘八门主事、八神值使各司其职，构成了完整的时空能量模型。值符所落宫位预示贵人扶持之力，开门临宫则事业有拓展之机。\n\n### 方位指引\n\n生门所在方位为吉利之方，适宜求财、谋事及重要决策。休门利修养生息，景门利文书宣传。伤门、杜门方位宜静不宜动，避免在此方向做重大布局。各宫位的星门神组合，决定了每个方向的具体吉凶属性。\n\n### 综合判断\n\n整体格局显示近期运势稳中有升，天时地利俱在。建议在上午阳气升发之时处理重要事务，下午宜稳扎稳打。奇门遁甲蕴含的是时空选择的智慧，把握天时、占据地利，方能人和事成。`,
      `### 四盘推演\n\n奇门遁甲以天、地、人、神四盘为核心分析框架。天盘九星主时运流转，地盘六仪定空间格局，人盘八门司人间万事，神盘八神掌吉凶福祸。四盘交叠互涉，呈现出立体的时空信息图。\n\n### 宫位解读\n\n值符所在的宫位是全局的核心枢纽，决定了整体运势的基调。太阴、六合、九天、九地各有职司，与八门九星的组合千变万化。当前局中吉门吉星得令之宫，宜优先考虑作为行动方向。\n\n### 择时建议\n\n奇门遁甲的核心价值在于择时择方。根据盘中显示的旺相之时与吉利之方，制定行动方案。吉时吉方重合之处，往往是最佳的切入点。天地之道在顺其自然，人之道在择善而从。`,
      `### 遁甲精要\n\n奇门遁甲被誉为"帝王之术"，其精髓在于通过时空模型模拟事物发展的最佳路径。天盘九星代表天时，地盘六仪代表地利，人盘八门代表人事。三才合一之处，即是天机所在。\n\n### 关键宫位\n\n生门主财运亨通，开门主事业通达，休门主修养恢复。伤门、死门、惊门所在方位宜避不宜趋。八神中的值符、太阴、九天等各有赋能，需结合具体事项选择相合的宫位。\n\n### 行动策略\n\n奇门的核心应用在于"趋避"二字——趋吉方、避凶位。结合当前局盘的旺衰分布，建议重点关注东南和西北两个方向的机遇。天时地利是成事的外因，个人的努力和智慧才是内因。`,
    ]);
  }
  if (prompt.includes('风水') || prompt.includes('罗盘')) {
    return pick([
      `### 理气分析\n\n依据玄空飞星理论，各宫位的山星与向星分布决定了气场的旺衰。当旺之星所在方位宜开门纳气、布置重要功能区域；退气之星所在方位宜静不宜动，可通过五行调理化解不利影响。\n\n### 峦头分析\n\n外部环境形势与内部格局布局同等重要。山管人丁水管财，阴阳平衡为家居风水之要义。门前明堂宜开阔纳吉，后方靠山宜稳固踏实。室内动线顺畅、光线充足，方能藏风聚气。\n\n### 调整建议\n\n风水调整需因地制宜，不可盲目照搬。核心原则是阴阳平衡、五行流通。简单的调整如摆放绿植、增加照明、调整家具布局，往往能带来意想不到的改善效果。`,
      `### 玄空飞星\n\n根据玄空风水理论，九星随时间流转，每年飞临不同方位。当运之星能量最强，宜催旺利用；失运之星需化解调和。结合宅命盘与流年飞星，可以精准定位各功能区域的最佳布局方案。\n\n### 宅命配合\n\n阳宅风水讲究宅命相配。坐向与命卦的配合程度直接影响居住者的运势走向。东四命宜居东四宅，西四命宜居西四宅，此为风水学的基本配伍法则。厨卫位置尤需讲究，水火之位不可轻忽。\n\n### 实操建议\n\n风水之道在顺势调理。不必大动干戈，从日常细节入手即可见效：保持门窗明亮通风，及时修复漏水破损，避免横梁压顶和尖角对冲。风水改善的是环境能量，好心态才是最好的风水。`,
      `### 形势理气\n\n风水之学分为形势与理气两派。形势派重山水格局之天然形胜，理气派重时间空间之数理推算。二者互补方能得其全貌。龙穴砂水向为峦头五要，九星飞布为理气精要。\n\n### 内外兼顾\n\n外局为大局，决定了宅运的基调；内局为细节，影响日常起居的质量。大门为纳气之口，主卧为养气之所，厨房为财库之基。三者在风水布局中权重最高，应优先调整优化。\n\n### 化煞增吉\n\n常见的风水问题如路冲、反光、尖角等，可通过屏风、植物、窗帘等方式巧妙化解。旺财旺丁之方位可通过水晶、鱼缸等助旺物增强能量。风水调理贵在适度，过犹不及。`,
    ]);
  }
  if (prompt.includes('数字') || prompt.includes('能量') || prompt.includes('命数')) {
    return pick([
      `### 天赋数字\n\n生命数字源于您的出生日期，主数字揭示了核心性格特质与天赋使命。数字1至9各有其独特的能量频率，结合您的数字组合分析天赋优势所在。辅助数字进一步揭示了您的隐藏潜能和需要开发的领域。\n\n### 人生课题\n\n生命道路数字代表了今生主要的成长方向。通过数字能量分析认识自我，了解天生擅长与需要提升的领域。每个数字都有其正面与负面的表现，关键在于如何将数字能量引向积极的方向。\n\n### 实践建议\n\n数字能量提供的是一种自我认知的框架。在人生重要抉择时可以参考数字指引，但最终决定权在自己手中。发挥数字赋予的优势特质，同时有意识地提升数字阴影面的觉察能力。`,
      `### 生命密码\n\n数字是人类最早也是最基本的符号系统。您的出生日期暗含了独特的数字密码，通过简单的计算即可揭示生命轨迹。核心数字、挑战数字、表现数字三者互补，构成完整的数字人格画像。\n\n### 能量特质\n\n每个数字对应特定的能量频率。奇数主动、偶数受纳，质数独立、合数协作。您的数字图谱中，出现频率最高的数字代表了最突出的天赋领域，缺失的数字则提示了需要借力的方向。\n\n### 成长之路\n\n数字的周期性变化与人生阶段紧密相关。每9年一个循环，每个循环有不同的主题和任务。了解当前所处的数字周期，有助于合理规划目标和调整策略。数字是路标，您才是行路的人。`,
      `### 数理探秘\n\n数字能量学说认为，万物皆有其数，数即道的体现。出生日期的数字组合蕴含了先天的能量蓝图。天赋数字展现优势、命运数字指示方向、灵魂数字揭示内在渴望——三者相互呼应。\n\n### 数字周期\n\n人生被划分为若干数字周期。当前您所处的周期决定了近期的主题和重心。在个人年数字为1的年份适合开创，在9的年份适合总结收尾。顺应数字节律往往能事半功倍。\n\n### 应用指南\n\n将数字能量融入日常生活：选择与自身数字共振的日期做重要决策，在有利的数字周期推进计划。但数字只是参考坐标，不应成为行动的束缚。理性判断与直觉感受同样重要。`,
    ]);
  }
  if (prompt.includes('月相')) {
    return buildFromTemplate(ALL_TEMPLATES.moonphase, 'moonphase');
  }
  if (prompt.includes('符文') || prompt.includes('rune')) {
    return buildFromTemplate(ALL_TEMPLATES.rune, 'rune');
  }
  if (prompt.includes('姓名')) {
    return buildFromTemplate(ALL_TEMPLATES.nametest, 'nametest');
  }
  if (prompt.includes('黄历') || prompt.includes('almanac')) {
    return buildFromTemplate(ALL_TEMPLATES.almanac, 'almanac');
  }
  if (prompt.includes('占星骰子') || prompt.includes('astrodice')) {
    return buildFromTemplate(ALL_TEMPLATES.astrodice, 'astrodice');
  }
  if (prompt.includes('签') || prompt.includes('求签') || prompt.includes('drawlot')) {
    return buildFromTemplate(ALL_TEMPLATES.drawlot, 'drawlot');
  }
  if (prompt.includes('手相') || prompt.includes('palm')) {
    return buildFromTemplate(ALL_TEMPLATES.palm, 'palm');
  }
  if (prompt.includes('铁板') || prompt.includes('tieban')) {
    return buildFromTemplate(ALL_TEMPLATES.tieban, 'tieban');
  }
  if (prompt.includes('六壬') || prompt.includes('daliuren')) {
    return buildFromTemplate(ALL_TEMPLATES.daliuren, 'daliuren');
  }
  if (prompt.includes('骰子')) {
    return pick([
      `### 骰子占卜\n\n骰子占卜是一种古老而直接的占卜方式。数字的点数与方位蕴含着天地间的随机智慧。骰子落下的一瞬，宇宙的能量通过最简单的数字符号传达给您。\n\n### 数字密码\n\n点数1至6各有其五行属性和吉凶含义。点数组合的奇偶、大小、单双等属性揭示着事物发展的不同面向。骰子占卜的独特之处在于其简洁直接——无需复杂的排盘，答案就在点数的排列之中。\n\n### 综合解读\n\n骰子虽小，却能映照大千世界。骰子所示并非定数，而是随机的可能性空间。将点数信息与所问之事相结合，往往能获得出人意料的清晰指引。`,
      `### 灵骰之术\n\n骰子占卜的起源可追溯至古代文明的博弈与祭祀活动。在随机性中蕴含的秩序，正是骰子占卜的魅力所在。每一粒骰子的六个面代表六种基础能量状态，多粒骰子的组合则呈现出丰富的信息维度。\n\n### 点数解析\n\n单数主动、偶数受纳，大数为阳、小数为阴。点数之和的五行归属决定了整体基调。特定的组合如三个相同点数往往预示着强烈而明确的信号，值得特别关注。\n\n### 应用之道\n\n骰子占卜适合快速解答具体的问题。心诚则灵，摇骰时保持专注，让问题清晰地呈现在心中。骰子落下后的第一印象往往最为重要，不要让理性过度解读掩盖了直觉的闪光。`,
      `### 骰语心声\n\n骰子是概率与直觉的奇妙交汇。摇骰的瞬间，千丝万缕的因缘在小小的骰子中凝聚成简明的数字。骰子占卜不追求复杂的理论体系，它以最朴素的方式诉说着宇宙的随机之美。\n\n### 组合解读\n\n两粒骰子的组合有36种可能，三粒则更多。每种组合都有其独特的象征意义。红色点数偏多者能量偏阳，黑色点数偏多者能量偏阴。阴阳平衡的组合往往对应最为稳定的发展态势。\n\n### 日常使用\n\n骰子占卜轻巧便捷，随时可用。在犹豫不决时摇一摇骰子，不是为了让它替你做决定，而是借随机之力打破思维的僵局。骰子是一面镜子，照出的是你内心早已有了答案的倾向。`,
    ]);
  }
  if (prompt.includes('对比')) {
    return pick([
      `### 对比分析\n\n将多个占卜系统的结果进行交叉对比，可以发现不同体系之间的共振点和互补面。八字从命理根基出发，紫微从星曜格局着眼，塔罗从牌面能量切入——每个体系都提供了一扇独特的观察窗口。\n\n### 共振点\n\n当多个系统指向相似的结论时，这个方向值得特别关注。一致性越高的领域，往往是近期最需要投入精力的方向。不同系统之间的分歧也不必担忧，那只是同一事物的不同侧面。\n\n### 综合运用\n\n对比的意义不在于选出哪个系统更"准"，而在于多维度地理解当下的处境。就像用多个镜头拍摄同一风景，每个镜头都捕捉到了独一无二的画面。综合运用，方能窥见全貌。`,
      `### 多维透视\n\n单一占卜体系如同一束单色光，只能照见事物的某一侧面。多个体系的对比则如同全光谱照明，让事物的全貌更加清晰。八字看命、塔罗看运、紫微看格，三者的互补性远大于替代性。\n\n### 交叉验证\n\n各体系之间的交叉验证是提升解读信度的有效方法。当八字与紫微在事业方面给出相似判断时，这一方向的确定性就大大增强。而当不同体系出现分歧时，往往暗示着该领域存在需要特别觉察的变数。\n\n### 整合建议\n\n对比分析的最终目的是形成可执行的行动策略。将各体系的优势信息整合起来，制定更加全面和周密的计划。多元的视角带来多元的选择，多元的选择带来更多的可能性。`,
      `### 体系对话\n\n占卜的各个体系如同不同的语言，都在描述着同样的宇宙法则。八字的五行生克、塔罗的牌面象征、星座的行星运行——它们用不同的词汇表达着相通的智慧。对比阅读就是学习用多种"语言"理解同一个世界。\n\n### 共识信号\n\n当两个或更多体系不约而同地发出相似信号时，这是一个值得高度重视的提示。这种"共识信号"往往比单一体系的强信号更为可靠。它就像天气预报中多个模型预测一致的结果，准确率更高。\n\n### 差异价值\n\n体系间的差异同样富有价值。差异提示着变数和可能性，是制定备选方案的依据。在共识中寻找方向，在差异中发现机遇——这是对比分析的核心方法论。`,
    ]);
  }
  if (prompt.includes('综合') || prompt.includes('报告')) {
    return pick([
      `### 一、性格特质\n\n综合分析显示您具有敏锐的洞察力和坚韧的意志力，善于在复杂环境中保持冷静，具备优秀的分析判断能力。多种占卜体系对您的描述有高度的一致性，说明这些特质是您最为稳定的核心特质。\n\n### 二、事业运势\n\n近期事业运势呈上升趋势，适合主动出击、拓展人脉。下半年有望获得重要突破，但需注意团队协作和沟通方式。多个体系都指向了相似的发展方向，信心和耐心同样重要。\n\n### 三、感情运势\n\n感情方面需要更多耐心和理解。单身者下半年有桃花运的可能，已有伴侣者注意经营感情中的细节。感情需要时间的浇灌，急不得也拖不得。\n\n### 四、财运分析\n\n正财运稳定，偏财运需谨慎。建议稳健投资，避免高风险投机行为，注重长期规划。财富的积累是马拉松而非短跑，保持节奏最为关键。\n\n### 五、健康提醒\n\n注意作息规律，避免过度劳累。适当增加户外运动，关注消化系统健康。身体是运势的载体，好的身体状态才能承载好的运势。`,
      `### 一、核心特质\n\n您是一位理性与感性并重的人，既有缜密的逻辑思维又有丰富的直觉感受。在压力面前能够保持冷静，在机遇面前能够果断出击。这是多体系综合分析得出的最为一致的结论。\n\n### 二、事业前景\n\n职场上正处于一个关键的爬升期。上半年重在积累和准备，下半年将迎来真正的展示舞台。多留意身边的机会信号，有时最好的机会并不在最显眼的地方。\n\n### 三、感情走向\n\n感情运势稳中有升。单身的朋友在社交场合中将有不错的缘分机会，而已有伴侣的朋友适合深化感情的经营。真诚永远是感情中最强大的武器。\n\n### 四、财务布局\n\n整体财务状况稳定，正财收入有望稳步增长。建议以守为主、以攻为辅。将资金分散配置，既有稳健储蓄又有适度投资，是最适合当下的财务策略。\n\n### 五、健康管理\n\n身体状态总体良好，但需关注因压力导致的亚健康问题。规律运动加上均衡饮食是最朴素但也最有效的健康法则。每天抽出半小时关爱自己的身体，回报将是长期的。`,
      `### 一、天赋分析\n\n命盘中显示您拥有出色的学习能力和适应能力。面对新环境和挑战时能够快速调整状态，这是您最大的竞争优势。同时，同理心强也是您在人际关系中的核心优势。\n\n### 二、职业方向\n\n未来一年是职业发展的窗口期。建议在专业领域深耕的同时，适度拓展横向技能。T型人才——既有广度又有深度——是当前市场最稀缺的人才类型。\n\n### 三、人际关系\n\n感情与人际方面需注意平衡。在照顾他人感受的同时，不要忽视自己的需求。健康的人际关系是双向的——付出与接收同样重要。\n\n### 四、资产配置\n\n财运趋势稳中向好。除了主业收入外，可以考虑开发一项副业或进修一项新技能作为收入的第二曲线。在任何情况下，保留足够的应急资金都是明智之举。\n\n### 五、身心调养\n\n在忙碌的日程中为健康留出空间。哪怕每天只有二十分钟的运动时间，也能产生显著的长期效益。心理健康同样重要——压力管理是当代人最需要学习的技能之一。`,
    ]);
  }
  return pick([
    `### AI 运势解读\n\n基于当前提供的占卜数据和星象信息进行综合分析，整体运势平稳向好。近期适合稳扎稳打，在重要决策前多方考量。命理分析反映的是趋势和可能性，最终的结果取决于个人的选择和努力。\n\n### 事业方面\n\n当前处于稳步发展阶段，建议把握机遇、积极进取，同时注意稳扎稳打、避免冒进。人际关系和谐，贵人运旺盛，多与正能量的人接触有助于提升整体运势。\n\n### 感情方面\n\n情感运势平稳，单身者有机会遇到志趣相投的对象，已有伴侣者感情稳固。建议多沟通、多理解，共同规划未来。\n\n### 财运方面\n\n正财运势稳定，可能有额外收入来源。偏财投资需谨慎，不宜大额投入。建议注重储蓄和长期规划。\n\n### 健康方面\n\n注意作息规律，保持适度运动。近期可能需要注意呼吸系统和脾胃健康。保持积极乐观的心态，身心健康才是最大的财富。\n\n### 温馨提示\n\n建议保持积极乐观的心态，顺应自然规律，在事业和生活中找到平衡。如需更精准的个性化分析，建议提供更详细的出生信息以便深入解读。`,
    `### 运势总览\n\n综合当前提供的各项数据，您的整体运势处于稳中向好的通道中。近期是适合规划、学习和积累的阶段。运势如潮汐有涨有落，在退潮时耕耘，在涨潮时收获。\n\n### 事业工作\n\n职场上即将迎来一个展现能力的机会窗口。提前做足准备，机会来临时才能从容应对。团队中的协作与沟通是这个阶段的关键词，单打独斗不如协力共进。\n\n### 情感天地\n\n情感世界需要用心经营。无论身处何种感情状态，真诚与尊重都是最坚实的基础。给彼此一些空间和时间，让感情自然生长，往往比刻意营造更加持久。\n\n### 财富管理\n\n钱财方面宜稳不宜急。制定清晰的收支计划，养成定期储蓄的习惯。投资理财方面，不懂的领域谨慎涉足，熟悉的领域适度深耕。\n\n### 身体调养\n\n健康是所有运势的基础。保证充足的睡眠、均衡的营养、适度的运动，这三项做好就已经赢了一半。同时关注心理健康，适时给自己放个假。\n\n### 寄语\n\n天机运势系统始终提醒您：运势是风向标，行动是航行的动力。愿您在自己的航程中，乘风破浪、抵达心中所向往的彼岸。`,
    `### 综合运势\n\n天机为您整合了多维度运势信息。整体来看，您正处于一个承前启后的关键时期。过往的积累正在转化为当下的底气，而当下的选择将为未来铺路。\n\n### 事业发展\n\n工作领域中蕴藏着不少机遇，关键在于是否有足够敏锐的觉察力去发现和把握。建议扩大社交圈，增加信息获取渠道。贵人的出现往往在最不经意的场合。\n\n### 情感生活\n\n感情运势温和向上。有伴者关系渐入佳境，适合讨论一些中长期的规划。单身者不必焦虑，最好的相遇往往发生在最放松的状态下。\n\n### 经济状况\n\n财务方面建议采取稳健保守的策略。收入稳定但大额支出需慎重考虑。有余力的情况下可以考虑为未来做一笔专项储蓄或投资。\n\n### 健康养护\n\n近期要多关注身体发出的信号。小毛病及时处理，大问题提前预防。作息、饮食、运动、心态——健康的四大支柱缺一不可。\n\n### 天机赠言\n\n每一个当下都是未来的起点。珍惜眼前、规划未来，让每一天都过得充实而有意义。天机愿一路相伴，见证您的成长与蜕变。`,
  ]);
}
