import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase, Heart, Coins, Sparkles, Settings2,
  Layers, CircleDot, Sunset, Star,
  GitCompareArrows, CheckCircle2, AlertTriangle,
  Download, Bookmark, Share2, CalendarRange,
  Wrench, Compass, ChevronRight,
} from 'lucide-react';
import { useAuthedHistory } from '@/hooks/useAuthedHistory';
import { buildRealReportContent, fmtDateTime } from '@/services/insights';
import { DemoBanner, EmptyInsights } from '@/components/InsightsShared';

/* ============================================
   浅色主题变量覆盖（内联，不依赖全局 dark 主题）
   ============================================ */
const LIGHT: Record<string, string> = {
  '--color-bg': '#0a0e1a',
  '--color-bg-elevated': '#111827',
  '--color-bg-inset': '#0d1220',
  '--color-text': '#e8ecf4',
  '--color-text-secondary': '#a0aac0',
  '--color-text-tertiary': '#6b7590',
  '--color-text-inverse': '#111827',
  '--color-border': '#1e2740',
  '--color-border-light': '#161e35',
  '--color-primary': '#004baa',
  '--color-primary-light': '#1a6fd4',
  '--color-primary-lighter': '#4a90d9',
  '--color-primary-dark': '#003580',
  '--color-primary-darker': '#002060',
  '--color-primary-bg': 'rgba(0,75,170,0.06)',
  '--color-primary-bg-strong': 'rgba(0,75,170,0.12)',
  '--color-gold': '#c8a84e',
  '--color-gold-light': '#e8d48b',
  '--color-gold-dark': '#9a7b2e',
  '--state-success': '#1a8a5c',
  '--state-warning': '#c87a1a',
  '--shadow-sm': '0 1px 3px rgba(0,20,50,0.05)',
  '--shadow-md': '0 4px 12px rgba(0,20,50,0.05)',
  '--shadow-lg': '0 8px 24px rgba(0,20,50,0.05)',
};

type ReportTypeId = 'career' | 'love' | 'wealth' | 'yearly' | 'custom';

/* ---------- 数据定义 ---------- */

/** 报告类型卡片 */
const REPORT_TYPES: { id: ReportTypeId; name: string; Icon: typeof Briefcase; color: string; bg: string }[] = [
  { id: 'career', name: '事业运报告', Icon: Briefcase, color: '#004baa', bg: 'rgba(0,75,170,0.12)' },
  { id: 'love', name: '感情运报告', Icon: Heart, color: '#c43a3a', bg: 'rgba(196,58,58,0.08)' },
  { id: 'wealth', name: '财运报告', Icon: Coins, color: '#c8a84e', bg: 'rgba(200,168,78,0.1)' },
  { id: 'yearly', name: '年度综合', Icon: Sparkles, color: '#e8d48b', bg: 'rgba(255,255,255,0.15)' },
  { id: 'custom', name: '自定义主题', Icon: Settings2, color: '#6b7590', bg: '#0d1220' },
];

/** 各体系样式（内容按报告类型动态替换） */
const SYSTEM_STYLES = [
  {
    id: 'bazi',
    name: '八字分析',
    subtitle: '四柱命盘体系',
    Icon: CircleDot,
    borderColor: '#004baa',
    iconBg: 'rgba(0,75,170,0.12)',
    iconColor: '#004baa',
    scoreBadgeBg: 'rgba(0,75,170,0.12)',
    scoreBadgeColor: '#004baa',
    barColor: '#004baa',
    tagBg: 'rgba(0,75,170,0.06)',
    tagColor: '#004baa',
  },
  {
    id: 'tarot',
    name: '塔罗分析',
    subtitle: '大阿尔卡纳牌阵',
    Icon: Sunset,
    borderColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.08)',
    iconColor: '#7c3aed',
    scoreBadgeBg: 'rgba(124,58,237,0.08)',
    scoreBadgeColor: '#7c3aed',
    barColor: '#7c3aed',
    tagBg: 'rgba(124,58,237,0.06)',
    tagColor: '#7c3aed',
  },
  {
    id: 'constellation',
    name: '星座分析',
    subtitle: '太阳 + 行星推运',
    Icon: Star,
    borderColor: '#c8a84e',
    iconBg: 'rgba(200,168,78,0.1)',
    iconColor: '#c8a84e',
    scoreBadgeBg: 'rgba(200,168,78,0.1)',
    scoreBadgeColor: '#9a7b2e',
    barColor: '#c8a84e',
    tagBg: 'rgba(200,168,78,0.08)',
    tagColor: '#9a7b2e',
  },
] as const;

/** 时间线节点配色（按顺序循环） */
const TIMELINE_COLORS = [
  { dotColor: '#004baa', tagBg: 'rgba(0,75,170,0.06)', tagColor: '#004baa' },
  { dotColor: '#c8a84e', tagBg: 'rgba(200,168,78,0.1)', tagColor: '#9a7b2e' },
  { dotColor: '#1a8a5c', tagBg: 'rgba(26,138,92,0.08)', tagColor: '#1a8a5c' },
] as const;

interface SystemContent { score: number; content: string; tags: string[]; name?: string; subtitle?: string }
interface ReportContent {
  score: number;
  headline: string;
  summary: string;
  dimensions: { label: string; value: number }[];
  systems: SystemContent[];
  consensus: { title: string; desc: string }[];
  divergences: { title: string; desc: string }[];
  timeline: { date: string; tagLabel: string; title: string; desc: string }[];
  advice: string[];
}

/** 各报告类型的完整内容 */
const REPORT_CONTENT: Record<Exclude<ReportTypeId, 'custom'>, ReportContent> = {
  yearly: {
    score: 87,
    headline: '事业运势整体向好，下半年有望迎来重大突破',
    summary: '综合八字、塔罗、星座三大体系的交叉分析，您的 2026 年下半年事业运势呈现上升趋势，贵人运增强，适合推进重要项目。',
    dimensions: [
      { label: '事业运', value: 92 },
      { label: '感情运', value: 78 },
      { label: '财运', value: 85 },
      { label: '健康运', value: 88 },
    ],
    systems: [
      { score: 90, content: '壬水日主生于午月，甲辰流年偏印坐库，事业宫有贵人星入命。下半年食伤泄秀有力，利于创作与表达，九月之后印星化权，升迁机会显著。', tags: ['事业上升', '贵人运强'] },
      { score: 85, content: '当前牌阵显示"战车"正位出现于事业位置，暗示通过意志力和行动可以获得成功。力量牌逆位提醒需注意情绪管理，避免冲动决策。', tags: ['行动力强', '需控情绪'] },
      { score: 83, content: '木星于今年下半年进入您的事业宫，带来扩张与机遇。土星在合伙宫的行运要求您在合作关系中更加谨慎，适合巩固现有资源。', tags: ['木星护佑', '贵人显现'] },
    ],
    consensus: [
      { title: '下半年事业运势明显上升', desc: '八字、塔罗、星座三大体系均指向 9 月后事业机遇增多，贵人运增强。' },
      { title: '需要控制情绪与冲动', desc: '塔罗力量逆位与八字火旺之象互相印证，提醒保持冷静。' },
      { title: '学习与自我提升是关键', desc: '八字偏印坐库与木星行运均指向技能深造、考取证书的有利时机。' },
    ],
    divergences: [
      { title: '感情运判断存在分歧', desc: '八字显示感情宫稳定，但塔罗圣杯二逆位暗示需注意沟通问题。建议关注伴侣间的深层对话。' },
      { title: '投资时机看法不同', desc: '星座认为八月后适合投资布局，八字则建议保守观望至十月。综合建议：小规模试水，不急于重仓。' },
    ],
    timeline: [
      { date: '2026 年 7 月', tagLabel: '蓄能期', title: '技能提升与资源整合', desc: '适合报名培训课程、考取证书。同时梳理人脉资源，为九月机遇期做好铺垫。' },
      { date: '2026 年 8 月', tagLabel: '活跃期', title: '社交拓展与感情升温', desc: '社交活动频繁，适合拓展人脉圈。单身者桃花运势上升，已有伴侣者建议安排一次深度旅行。' },
      { date: '2026 年 9 月', tagLabel: '爆发期', title: '事业突破的关键窗口', desc: '贵人运与机遇运同时达到高峰，适合启动重大项目、提出晋升申请或开展新的合作。把握这一关键节点。' },
    ],
    advice: [
      '基于三大体系的综合分析，我们建议您在 2026 年下半年采取"稳中求进"的整体策略。事业方面，九月是一个关键节点，届时贵人运和机遇运同时达到高峰，建议在此之前做好充分准备——包括技能提升、人脉拓展和项目规划。上半年适合打基础、蓄势待发，不宜冒进。',
      '感情方面，尽管各体系对感情运的判断略有分歧，但核心建议一致：加强与伴侣的沟通，避免因工作繁忙而忽视情感维护。单身者可在八月社交活动增多时主动出击。财务方面，建议保持稳健的理财策略，十月后可适当增加投资比例。',
      '健康方面，注意夏季高温期间的水分补充和作息规律。年底事业忙碌期需警惕过劳，建议提前安排体检并保持适度运动。整体而言，下半年是您运势的上升期，把握机遇的同时保持理性判断，将能获得最大收益。',
    ],
  },
  career: {
    score: 92,
    headline: '事业运强势上升，九月将迎来关键晋升窗口',
    summary: '八字食伤泄秀、贵人星入事业宫；塔罗"战车"正位指向果断推进；星座木星过境事业宫。三大体系同向：事业是下半年主线，九月为关键节点。',
    dimensions: [
      { label: '事业运', value: 92 },
      { label: '感情运', value: 74 },
      { label: '财运', value: 83 },
      { label: '健康运', value: 80 },
    ],
    systems: [
      { score: 91, content: '流年甲辰偏印坐库，事业宫贵人星入命，九月后印星化权，晋升或调任负责的机会明显增加。建议主动汇报工作成果，承担核心项目，让能力被看见。', tags: ['晋升窗口', '贵人加持'] },
      { score: 86, content: '"战车"正位出现在事业位，代表目标明确、执行果断就能突破当前瓶颈；"星星"正位落在结果位，说明此次努力将带来长期声誉。注意"宝剑三"逆位：团队内部摩擦可能影响判断，勿以情绪做决定。', tags: ['果断执行', '长期声誉'] },
      { score: 88, content: '木星下半年进入事业宫，扩张能量强；十月太阳刑月亮，与上级沟通需谨慎，重要预期先书面确认。适合启动新业务、接受新职位或争取核心资源。', tags: ['木星护佑', '向上管理'] },
    ],
    consensus: [
      { title: '九月是事业机会高峰', desc: '三大体系均指向 9 月事业机遇运达到峰值，适合提出晋升申请或启动重大项目。' },
      { title: '技能与证书是杠杆', desc: '八字印星、塔罗"星星"牌与木星行运均指向：技能深造与资质认证能带来额外机会。' },
      { title: '警惕人际摩擦', desc: '团队内部摩擦是共同的提示点，建议重要沟通书面化、留痕化。' },
    ],
    divergences: [
      { title: '跳槽时机看法不同', desc: '八字建议稳守等晋升，塔罗暗示外部机会值得考虑。综合建议：先争取内部晋升，十一月未果再启动外部机会。' },
    ],
    timeline: [
      { date: '2026 年 7 月', tagLabel: '蓄能期', title: '技能升级与成果整理', desc: '承担一个可见度的核心项目，整理简历与技能树，与目标岗位建立联系。' },
      { date: '2026 年 8 月', tagLabel: '活跃期', title: '人脉拓展与信息收集', desc: '参加行业活动、拓展职业人脉，收集外部机会信息，保持选择权。' },
      { date: '2026 年 9 月', tagLabel: '突破期', title: '提出晋升申请', desc: '贵人运高峰，是提交晋升申请或接受新角色的最佳窗口，果断行动。' },
    ],
    advice: [
      '从事业维度看，您 2026 年下半年处于"进攻年"：七月打基础、承担可见度项目；八月扩人脉、收集信息；九月抓住晋升窗口。建议提前准备一份成果清单与数据支撑，贵人运会把它放大。',
      '风险提示：一是向上管理，重要决策前与直属上级书面确认预期；二是留有余地，若十一月考虑外部机会，需保持与现团队的专业关系。',
      '行动清单：1) 七月承担一个有可见度的核心项目；2) 八月完成一项证书或技能深造；3) 九月上旬正式提交晋升申请或新角色申请；4) 准备两个备选机会并保持联系。',
    ],
  },
  love: {
    score: 81,
    headline: '感情运平稳向好，八月桃花运上升利于关系深化',
    summary: '八字配偶宫稳、桃花星八月动；塔罗"圣杯二"正位指向深度情感联结；星座金星过境恋爱宫。单身者遇对人概率上升，有伴者建议安排一次深度相处。',
    dimensions: [
      { label: '感情运', value: 86 },
      { label: '事业运', value: 82 },
      { label: '财运', value: 80 },
      { label: '健康运', value: 84 },
    ],
    systems: [
      { score: 84, content: '配偶宫贵人星坐库，八月桃花星动：单身者易经朋友或工作场合结识有缘人；已有伴侣者注意九月"第三方"干扰的象，主动沟通、公开关系状态。', tags: ['桃花上升', '沟通为先'] },
      { score: 82, content: '"圣杯二"正位是感情牌阵的核心牌，代表真诚的双向情感联结；"权杖皇后"提示关系中保持独立与热情。"宝剑四"逆位提醒：别让沉默积累成情绪疲惫。', tags: ['深度共鸣', '保持独立'] },
      { score: 83, content: '金星八月中旬起进入恋爱宫，魅力与吸引力显著提升；九月下旬水逆期容易因沟通产生误会，重要对话建议留到水逆结束后再谈。', tags: ['金星眷顾', '水逆谨慎'] },
    ],
    consensus: [
      { title: '八月是桃花高峰期', desc: '三大体系均指向 8 月桃花与亲密运势上升，适合主动社交与约会安排。' },
      { title: '沟通是核心变量', desc: '无论单身还是有伴，下半年感情的关键都在沟通深度，沉默是最大风险。' },
      { title: '保持独立的自我', desc: '三大体系一致：好的关系是两个完整的人的协作，不因关系失去自我。' },
    ],
    divergences: [
      { title: '确定关系的节奏不同', desc: '八字建议慢观察至新年后再定，塔罗提示缘到即主动确认。综合建议：八月先深化了解，十月初再明确关系。' },
    ],
    timeline: [
      { date: '2026 年 7 月', tagLabel: '预热期', title: '自我整理与社交开放', desc: '整理生活节奏与形象管理，接受社交邀约，为桃花运留出入口。' },
      { date: '2026 年 8 月', tagLabel: '活跃期', title: '主动连接与关系升温', desc: '桃花运峰值，单身者适合主动出击；有伴者安排一次深度旅行或体验活动。' },
      { date: '2026 年 9 月', tagLabel: '沉淀期', title: '沟通与确认关系', desc: '九月下旬水逆有沟通风险，重要话题延后或书面表达；十月初适合确认关系。' },
    ],
    advice: [
      '从感情维度看，下半年主题是"深化"：七月整理自己，八月主动连接，九月沉淀关系。无论单身或有伴，都建议把"高质量相处时间"排在日程里，而不是等空闲。',
      '风险提示：九月下旬水逆是全年的感情高风险窗口，容易因未说出口的话和误读的消息产生误会。重要对话放到十月中旬之后。',
      '行动清单：1) 七月接受至少三次社交邀约；2) 八月安排一次深度体验活动（旅行/工作坊/烹饪课）；3) 九月每周做一次关系复盘对话；4) 十月初明确关系或关系目标。',
    ],
  },
  wealth: {
    score: 85,
    headline: '财运稳中向好，十月后可适度加大财富布局',
    summary: '八字财星入库、正财收入稳；塔罗"星币一"正位指向四季度新财机；星座木星能量延伸至财帛宫。建议前段保守、十月后分批加码。',
    dimensions: [
      { label: '财运', value: 88 },
      { label: '事业运', value: 84 },
      { label: '感情运', value: 72 },
      { label: '健康运', value: 82 },
    ],
    systems: [
      { score: 87, content: '下半年财星入库，正财收入稳固；十月食伤生财，副业与投资回报值得关注。注意九月"借贷"之象：不轻易大额出借，也不因人情担保。', tags: ['财星入库', '借贷谨慎'] },
      { score: 84, content: '"星币一"正位出现在财富位，代表四季度有一个新的投资机会萌芽；"星币十"提示长期稳健型资产（固收、指数基金）优于短期追涨杀跌。', tags: ['新机萌芽', '长期资产'] },
      { score: 83, content: '木星财帛宫过境在十月达到峰值，现金流明显改善；七月火星进入消耗宫，冲动消费与非计划性大额支出增加，建议提前设定月度预算。', tags: ['十月现金流', '冲动消费'] },
    ],
    consensus: [
      { title: '十月是进财窗口', desc: '三大体系均指向 10 月后财运改善，适合分批加大投资布局。' },
      { title: '正财稳、偏财谨慎', desc: '薪资收入稳固，投资回报有波动，配置上以"稳"为主。' },
      { title: '控制前期冲动消费', desc: '七月有消耗宫压力与冲动消费风险，建议设预算并严格执行。' },
    ],
    divergences: [
      { title: '激进投资看法不同', desc: '塔罗提示有新机会值得尝试，八字建议稳中再进。综合建议：试水仓位控制在总资产 10% 以内。' },
    ],
    timeline: [
      { date: '2026 年 7 月', tagLabel: '保守期', title: '预算与开销管控', desc: '设定月度预算，梳理账目与收支，不做大额出借与新领域重仓投入。' },
      { date: '2026 年 8 月', tagLabel: '观察期', title: '研究标的与机会', desc: '研究投资标的、建立候选清单，跟踪"星币一"对应的机会信号，不急于入场。' },
      { date: '2026 年 9-10 月', tagLabel: '进财期', title: '分批布局', desc: '十月中旬起分批加仓，首批仓位不超过总资产的 10%，稳健为主。' },
    ],
    advice: [
      '从财富维度看，下半年节奏是"先守后攻"：七月控开销、管预算；八月做研究、建清单；十月进攻、分批布局。您的财运属于稳中有升型，关键在于十月窗口打开时仓位已准备好。',
      '风险提示：1) 九月注意人情借贷，大额出借建议婉拒；2) 不追短期热点，长期稳健资产为主；3) 新机会（塔罗"星币一"）值得跟踪，但试水仓位控制在 10% 以内。',
      '行动清单：1) 七月设定月度预算并执行；2) 八月完成投资标的研究与候选清单；3) 九月不借贷、不担保；4) 十月中旬起分批布局，首批不超过 10%。',
    ],
  },
};

/** 自定义主题选项 */
const CUSTOM_TOPICS = ['健康养生', '学业考试', '出行旅行', '搬迁择日', '创业决策', '婚姻大事'] as const;
type CustomTopic = (typeof CUSTOM_TOPICS)[number];

/** 自定义主题的核心内容（体系分析/共识/分歧/时间线使用主题模板生成） */
const CUSTOM_TOPIC_DATA: Record<CustomTopic, {
  score: number; headline: string; summary: string;
  dimensions: { label: string; value: number }[];
  systems: SystemContent[];
  advice: string[];
}> = {
  '健康养生': {
    score: 84,
    headline: '健康运整体平稳，夏季注意作息与运动节奏',
    summary: '三大体系交叉提示：下半年身体底子不错，但夏季高温与秋冬换季是两个风险窗口，建议以规律作息和适度运动为主。',
    dimensions: [
      { label: '健康运', value: 88 },
      { label: '精力值', value: 82 },
      { label: '恢复力', value: 85 },
      { label: '免疫运', value: 80 },
    ],
    systems: [
      { score: 85, content: '从八字看健康养生：下半年水木之气渐旺，体质趋于平衡。注意夏季火旺耗气，午后小憩与充足饮水是关键；十月后金气收敛，适合开始规律性锻炼。', tags: ['体质趋衡', '秋冬进补'] },
      { score: 82, content: '塔罗健康牌阵："节制"正位代表身体自我调节能力良好；"宝剑八"逆位提示长期熬夜与久坐是主要隐患，建议每周保留两天完全休息。', tags: ['调节力好', '戒熬夜'] },
      { score: 83, content: '星座健康推运：天王星三月过境影响神经系统，夏季注意睡眠质量；十月太阳进入健康宫，是体检与启动健身计划的好时机。', tags: ['睡眠管理', '十月体检'] },
    ],
    advice: [
      '健康维度的核心策略是"稳"：规律作息优先于任何补品。七月到八月是高温消耗期，控制午睡质量与饮水；九月换季注意呼吸道防护。',
      '行动清单：1) 七月起固定 23:00 前入睡；2) 八月每周三次中等强度运动；3) 九月换季前备齐常用药物；4) 十月安排一次全面体检。',
    ],
  },
  '学业考试': {
    score: 86,
    headline: '学业运走高，九月至十一月是高效复习与应试窗口',
    summary: '三大体系均指向下半年学习能力增强、专注力提升，九月后考试运进入高峰，适合安排重要考试与认证节点。',
    dimensions: [
      { label: '学业运', value: 88 },
      { label: '专注力', value: 85 },
      { label: '记忆运', value: 83 },
      { label: '临场运', value: 82 },
    ],
    systems: [
      { score: 88, content: '从八字看学业考试：印星主文书与记忆，下半年印星得力，理解力与记忆力同步增强。九月后官印相生，考试运进入全年高峰，重要考试宜安排在此窗口。', tags: ['印星得力', '考试高峰'] },
      { score: 84, content: '塔罗学业牌阵："书呆子"（隐士）正位代表深度钻研有效；"星辰"正位落在结果位，坚持既定复习计划者将看到回报。注意"宝剑六"：换环境复习可能反而分散注意力。', tags: ['深度钻研', '坚持计划'] },
      { score: 85, content: '星座学业推运：土星九月进入学习宫，纪律性显著增强，适合啃硬骨头科目；十一月水星顺行加速，是冲刺与模拟考的理想时段。', tags: ['纪律增强', '十一月冲刺'] },
    ],
    advice: [
      '学业维度的策略是"以计划对抗波动"：七月定计划、八月建体系、九月进状态、十一月冲刺。把重要考试节点放在九月至十一月之间。',
      '行动清单：1) 七月确定考试目标与倒排计划；2) 八月搭建知识体系与错题本；3) 九月开始全真模拟；4) 十一月考前一周减量保状态。',
    ],
  },
  '出行旅行': {
    score: 83,
    headline: '出行运顺畅，八月中旬至十月是出游黄金期',
    summary: '三大体系均提示下半年远行运佳，八月起交通与住宿运顺畅，但九月下旬水逆期建议避免改签与赶机。',
    dimensions: [
      { label: '出行运', value: 85 },
      { label: '交通运', value: 82 },
      { label: '旅途财', value: 78 },
      { label: '同路缘', value: 84 },
    ],
    systems: [
      { score: 84, content: '从八字看出行旅行：下半年驿马星动，远行有意外收获之象。八月起出行顺利，九月后贵人随行的概率高，结伴出行体验更佳。', tags: ['驿马星动', '结伴更佳'] },
      { score: 80, content: '塔罗出行牌阵："世界"正位代表旅程圆满顺利；"月亮"逆位提醒夜间行程与异地驾驶需格外谨慎，重要转机尽量选白天。', tags: ['旅程圆满', '夜间谨慎'] },
      { score: 84, content: '星座出行推运：八月水星行运利于行程沟通与预订；九月下旬水逆期避免改签、赶早班机，保险类文件提前核对。', tags: ['八月宜订', '水逆避改签'] },
    ],
    advice: [
      '出行维度的策略是"早订从容"：七月完成目的地调研与预订，八月出发体验最佳；避开九月下旬水逆窗口安排关键航程。',
      '行动清单：1) 七月完成行程规划与预订；2) 八月中旬出发首选；3) 九月下旬不安排改签与赶机；4) 十月假期适合深度游。',
    ],
  },
  '搬迁择日': {
    score: 80,
    headline: '搬迁运平稳，十月中旬后择日入住更为吉利',
    summary: '三大体系综合提示：下半年搬迁可行，但七月动土有耗象，建议八月完成准备，十月中旬后择吉日入住。',
    dimensions: [
      { label: '搬迁运', value: 82 },
      { label: '安居运', value: 80 },
      { label: '家宅财', value: 78 },
      { label: '人际缘', value: 81 },
    ],
    systems: [
      { score: 81, content: '从八字看搬迁择日：下半年家宅宫平稳，十月后财星入库，入住新居利于财气聚集。搬迁当日宜选阳气充沛的上午，忌阴雨。', tags: ['十月后吉', '上午搬迁'] },
      { score: 78, content: '塔罗搬迁牌阵："房屋"（星币十家庭位）正位代表新居安稳；"高塔"逆位是明确信号——不要仓促搬迁，留出两周以上的准备缓冲。', tags: ['新居安稳', '忌仓促'] },
      { score: 80, content: '星座搬迁推运：土星九月过境提示物业交割与合同细节需逐项确认；十月后木星能量进入家宅位，入住后的家运持续向好。', tags: ['合同细核', '十月入住'] },
    ],
    advice: [
      '搬迁维度的策略是"准备在前、择日在后"：七月谈妥合同，八月完成修缮与收纳，十月中旬后选吉日搬家入住，给流程留足缓冲。',
      '行动清单：1) 七月确认合同与物业交割清单；2) 八月完成修缮与物品整理；3) 十月中旬后择吉日搬迁；4) 入住首日做一次家宅通风与整理仪式。',
    ],
  },
  '创业决策': {
    score: 79,
    headline: '创业窗口开启但宜控制规模，十月后小步快跑',
    summary: '三大体系均提示下半年创业有机遇，但共识是控制初始规模与现金消耗，十月后市场窗口打开再逐步加码。',
    dimensions: [
      { label: '创业运', value: 82 },
      { label: '资金运', value: 76 },
      { label: '合伙缘', value: 79 },
      { label: '机遇运', value: 84 },
    ],
    systems: [
      { score: 80, content: '从八字看创业决策：下半年食伤生财格局渐成，创意变现的通道打开。注意财星入库偏慢，现金流规划要按 18 个月准备，勿按乐观预期排预算。', tags: ['变现通道开', '现金流留余'] },
      { score: 77, content: '塔罗创业牌阵："愚人"正位支持新开始，但"星币二"提醒资源有限下的平衡术——先做最小可行产品验证，再谈扩张。', tags: ['支持新开始', '先验证后扩张'] },
      { score: 81, content: '星座创业推运：木星四季度过境事业宫，融资与合作谈判的运势在十月后明显增强；七月火相位密集，合同条款务必请专业人士审核。', tags: ['十月融资佳', '合同请审核'] },
    ],
    advice: [
      '创业维度的策略是"小步快跑"：七月完成商业计划与最小团队，八月做市场验证，十月后窗口打开再融资扩张。初始规模控制在"失败可承受"的范围内。',
      '行动清单：1) 七月完成商业计划与法律架构；2) 八月 MVP 上线验证需求；3) 九月梳理合伙协议与股权；4) 十月启动融资，首批资金只覆盖 12 个月。',
    ],
  },
  '婚姻大事': {
    score: 85,
    headline: '婚缘运佳，九月后是确定关系与谈婚论嫁的吉时',
    summary: '三大体系交叉验证：下半年婚姻宫能量增强，九月后确定关系、订婚或登记运势俱佳，沟通与家庭沟通是顺利的关键。',
    dimensions: [
      { label: '婚缘运', value: 88 },
      { label: '沟通运', value: 84 },
      { label: '家庭缘', value: 82 },
      { label: '财务共识', value: 80 },
    ],
    systems: [
      { score: 86, content: '从八字看婚姻大事：下半年红鸾星动，配偶宫得贵人相助，九月后婚姻宫能量达到峰值，订婚、登记或举办婚礼均宜。婚前宜共同完成一次财务规划。', tags: ['红鸾星动', '九月后吉'] },
      { score: 84, content: '塔罗婚姻牌阵："圣杯二"与"皇后"组合出现，代表双向奔赴、门当户对的良缘之象；"宝剑七"逆位提醒：婚前坦诚沟通财务与家庭期望，避免婚后摩擦。', tags: ['双向奔赴', '婚前坦诚'] },
      { score: 85, content: '星座婚姻推运：金星十月中旬进入婚姻宫，家庭氛围与亲友支持度提升；水逆期（九月下旬）不宜交换订婚信物，宜留到十月。', tags: ['十月宜订婚', '信物避水逆'] },
    ],
    advice: [
      '婚姻维度的策略是"先共识、后仪式"：七月到八月完成关系确认与双方家庭的初步沟通，九月谈婚论嫁，十月落实仪式与法律登记。',
      '行动清单：1) 七月确认关系并坦诚沟通核心期望；2) 八月双方家庭初次会面；3) 九月谈婚论嫁、商定框架；4) 十月完成订婚/登记，仪式从简求诚。',
    ],
  },
};

/** 自定义主题：生成完整报告内容（体系外内容使用主题模板） */
function buildCustomContent(topic: CustomTopic): ReportContent {
  const base = CUSTOM_TOPIC_DATA[topic];
  return {
    score: base.score,
    headline: base.headline,
    summary: base.summary,
    dimensions: base.dimensions,
    systems: base.systems,
    consensus: [
      { title: `${topic}在下半年整体向好`, desc: `三大体系对「${topic}」的判断方向一致：下半年条件优于上半年，关键窗口集中在九月之后。` },
      { title: '提前准备比临场发挥更重要', desc: `围绕「${topic}」，三大体系均提示：提前规划与准备带来的收益，远高于临时应变。` },
    ],
    divergences: [
      { title: `「${topic}」的推进节奏存在分歧`, desc: `八字建议按月份窗口稳步推进，塔罗提示缘至可加速。综合建议：以八字时间窗为主，遇到明确机会时提前半步行动。` },
    ],
    timeline: [
      { date: '2026 年 7 月', tagLabel: '规划期', title: `制定${topic}计划`, desc: `围绕「${topic}」确定目标、列出资源清单，与相关方对齐预期。` },
      { date: '2026 年 8 月', tagLabel: '筹备期', title: `落实${topic}准备`, desc: `完成「${topic}」所需的资金、时间与人际准备，排除关键障碍。` },
      { date: '2026 年 9-10 月', tagLabel: '执行期', title: `把握${topic}窗口`, desc: `九月后运势窗口打开，按既定计划执行「${topic}」的关键动作，果断不犹豫。` },
    ],
    advice: base.advice,
  };
}

/** 推荐工具（可点击跳转） */
const RECOMMENDED_TOOLS: { name: string; desc: string; path: string; Icon: typeof Compass; color: string; bg: string }[] = [
  { name: '八字排盘', desc: '详细四柱命盘', path: '/bazi', Icon: Compass, color: '#004baa', bg: 'rgba(0,75,170,0.08)' },
  { name: '塔罗牌阵', desc: '凯尔特十字牌阵', path: '/tarot', Icon: Sunset, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { name: '星座星盘', desc: '个人本命星盘', path: '/zodiac', Icon: Star, color: '#c8a84e', bg: 'rgba(200,168,78,0.1)' },
  { name: '运势日历', desc: '每日运势提醒', path: '/calendar', Icon: CalendarRange, color: '#1a8a5c', bg: 'rgba(26,138,92,0.08)' },
];

/** 收藏持久化 */
const FAV_KEY = 'tianji_report_favorites';
interface FavoriteItem { id: string; name: string; addedAt: number }

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const arr: FavoriteItem[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavorites(list: FavoriteItem[]): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch {
    // 忽略存储错误
  }
}

const VALID_TYPES: ReportTypeId[] = REPORT_TYPES.map((t) => t.id);

/* ============================================
   综合报告结果展示页
   ============================================ */
export default function ReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, records, isDemo, isLoading, isEmpty } = useAuthedHistory();

  const urlType = searchParams.get('type');
  const [activeType, setActiveType] = useState<ReportTypeId>(
    urlType && VALID_TYPES.includes(urlType as ReportTypeId) ? (urlType as ReportTypeId) : 'yearly'
  );
  const [customTopic, setCustomTopic] = useState<CustomTopic>(CUSTOM_TOPICS[0]);
  const [toast, setToast] = useState('');
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

  const activeTypeName = REPORT_TYPES.find((t) => t.id === activeType)?.name || '综合报告';
  const content: ReportContent = !user
    ? (activeType === 'custom' ? buildCustomContent(customTopic) : REPORT_CONTENT[activeType])
    : records && records.length > 0
      ? buildRealReportContent(records, activeType, customTopic)
      : REPORT_CONTENT.yearly;

  /** 概要区元信息（真实模式下动态生成） */
  const meta = (() => {
    if (isDemo) return { period: '2026.07 — 2026.12', systems: '八字、塔罗、星座', generatedAt: '2026-07-11 10:30' };
    if (!records || records.length === 0) return { period: '—', systems: '—', generatedAt: fmtDateTime(new Date()) };
    const first = records[0].date;
    const last = records[records.length - 1].date;
    const p = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    const sysCount = new Map<string, number>();
    for (const r of records) sysCount.set(r.systemName, (sysCount.get(r.systemName) ?? 0) + 1);
    const topNames = Array.from(sysCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);
    return {
      period: `${p(first)} — ${p(last)}`,
      systems: topNames.join('、'),
      generatedAt: fmtDateTime(new Date()),
    };
  })();

  const favId = activeType === 'custom' ? `report-custom-${customTopic}` : `report-${activeType}`;
  const favName = activeType === 'custom' ? `${activeTypeName} · ${customTopic}` : activeTypeName;
  const isFav = favorites.some((f) => f.id === favId);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2500);
  };

  const handleTab = (id: ReportTypeId) => {
    setActiveType(id);
    navigate(`/report${id === 'yearly' ? '' : `?type=${id}`}`, { replace: true });
  };

  /** 收藏 / 取消收藏（持久化到 localStorage） */
  const handleFavorite = () => {
    let next: FavoriteItem[];
    if (isFav) {
      next = favorites.filter((f) => f.id !== favId);
      showToast('已取消收藏');
    } else {
      next = [{ id: favId, name: favName, addedAt: Date.now() }, ...favorites];
      showToast('已收藏，可在浏览器书签中快速访问');
    }
    setFavorites(next);
    saveFavorites(next);
  };

  /** 导出 PDF：调用浏览器打印（在打印对话框选择"另存为 PDF"） */
  const handleExportPdf = () => {
    window.print();
  };

  /** 分享：优先系统分享，其次复制链接 */
  const handleShare = async () => {
    const url = window.location.href;
    const title = `天机 · ${favName}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // 用户取消或分享不可用，继续走复制链接
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制，可粘贴分享');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('链接已复制，可粘贴分享');
      } catch {
        showToast('复制失败，请手动复制地址栏链接');
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div style={LIGHT as React.CSSProperties}>
      {/* 打印样式：仅打印报告主体，白底黑字 */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden !important; }
          #report-print-area, #report-print-area * { visibility: visible !important; }
          #report-print-area { position: absolute !important; left: 0; top: 0; width: 100% !important; }
          .print-reset, .print-reset * {
            background: #fff !important;
            color: #1f2937 !important;
            border-color: #d1d5db !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          @page { margin: 12mm; }
        }
      `}</style>

      {/* ========== Banner：深蓝渐变 + 标题 ========== */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
          padding: '3rem 0 2.5rem',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              fontFamily: "'Noto Serif SC', serif",
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            综合报告
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            当前报告：{favName} · 跨体系运势分析，多维度解读命运密码
            {isDemo ? ' · 演示数据，请登录体验' : ''}
          </p>
        </div>
      </section>

      {/* ========== 演示数据横幅（仅未登录态） ========== */}
      {isDemo && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.25rem 1.5rem 0' }}>
          <DemoBanner />
        </div>
      )}

      {/* ========== 页面主体 ========== */}
      <div
        id="report-print-area"
        className="print-reset"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '1.5rem 1.5rem 6rem',
        }}
      >
        {/* ========== 报告类型选择 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '1rem',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="no-scrollbar"
          >
            {REPORT_TYPES.map((t) => {
              const isActive = activeType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTab(t.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1.25rem 1.25rem',
                    borderRadius: 12,
                    minWidth: 140,
                    cursor: 'pointer',
                    border: isActive ? 'none' : '1px solid var(--color-border-light)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
                      : 'var(--color-bg-elevated)',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive ? 'rgba(255,255,255,0.15)' : t.bg,
                    }}
                  >
                    <t.Icon
                      size={20}
                      style={{ color: isActive ? '#e8d48b' : t.color }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      whiteSpace: 'nowrap',
                      color: isActive ? '#fff' : 'var(--color-text)',
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 自定义主题选择 */}
          {activeType === 'custom' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
              {CUSTOM_TOPICS.map((topic) => {
                const active = customTopic === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => setCustomTopic(topic)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: active ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                      color: active ? '#fff' : 'var(--color-text-secondary)',
                      border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border-light)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ========== 加载中 ========== */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '96px 24px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            <CalendarRange size={20} className="animate-spin" style={{ color: 'var(--color-gold)' }} />
            正在基于你的真实查询记录生成报告…
          </div>
        )}

        {/* ========== 空态（登录但无分析记录） ========== */}
        {isEmpty && <EmptyInsights />}

        {!isEmpty && (
        <>
        {/* ========== 报告概要区（大号评分 + 总述 + 子维度） ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* 用户信息概览行 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            <span>报告类型：{favName}</span>
            <span>|</span>
            <span>分析周期：{meta.period}</span>
            <span>|</span>
            <span>涵盖体系：{meta.systems}</span>
            <span>|</span>
            <span>生成时间：{meta.generatedAt}</span>
          </div>

          {/* 评分 + 总述 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 8vw, 5rem)',
                  color: '#c8a84e',
                  lineHeight: 1,
                }}
              >
                {content.score}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, color: '#e8d48b' }}>/100</span>
            </div>
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                {content.headline}
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {content.summary}
              </p>
            </div>
          </div>

          {/* 分隔线 */}
          <div
            style={{
              height: 1,
              margin: '1.5rem 0',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />

          {/* 子维度指标 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {content.dimensions.map((d) => (
              <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                  {d.label}
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8d48b' }}>{d.value}</span>
                {/* 小型进度条 */}
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${d.value}%`,
                      height: '100%',
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #e8d48b, #c8a84e)',
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== 各体系独立分析 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
            各体系独立分析
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {SYSTEM_STYLES.map((s, idx) => {
              const sc = content.systems[idx];
              if (!sc) return null;
              return (
              <div
                key={s.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 12,
                  background: 'var(--color-bg-elevated)',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: `3px solid ${s.borderColor}`,
                }}
              >
                {/* 卡片头部：图标 + 名称 + 分数 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: s.iconBg,
                    }}
                  >
                    <s.Icon size={16} style={{ color: s.iconColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sc.name || s.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                      {sc.subtitle || s.subtitle}
                    </span>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      background: s.scoreBadgeBg,
                      color: s.scoreBadgeColor,
                    }}
                  >
                    {sc.score}分
                  </span>
                </div>

                {/* 评分进度条 */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--color-bg-inset)',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: `${sc.score}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: s.barColor,
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>

                {/* 分析文本 */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--color-text-secondary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                  }}
                >
                  {sc.content}
                </p>

                {/* 标签 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sc.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        background: s.tagBg,
                        color: s.tagColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
        </section>

        {/* ========== 交叉验证区 ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'var(--color-bg-elevated)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <GitCompareArrows size={20} style={{ color: 'var(--color-primary)' }} />
            交叉验证
          </h2>

          {/* 共识点 */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <CheckCircle2 size={16} style={{ color: '#1a8a5c', flexShrink: 0 }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>多体系共识</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {content.consensus.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: 'rgba(26,138,92,0.06)',
                    borderLeft: '3px solid #1a8a5c',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#1a8a5c',
                      color: '#fff',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--color-text-secondary)', minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.title}</span> — {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 分歧点 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} style={{ color: '#c87a1a', flexShrink: 0 }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>体系分歧</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {content.divergences.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: 'rgba(200,122,26,0.06)',
                    borderLeft: '3px solid #c87a1a',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#c87a1a',
                      color: '#fff',
                    }}
                  >
                    !
                  </span>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--color-text-secondary)', minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{d.title}</span> — {d.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== AI 综合建议 ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: '#e8d48b' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>AI 综合建议</h2>
          </div>
          <div
            style={{
              height: 1,
              marginBottom: '1.25rem',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {content.advice.map((p, i) => (
              <p key={i} style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ========== 近 3 个月关键节点 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <CalendarRange size={20} style={{ color: 'var(--color-primary)' }} />
            近 3 个月关键节点
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {content.timeline.map((item, idx) => {
              const color = TIMELINE_COLORS[idx % TIMELINE_COLORS.length];
              return (
              <div key={`${item.date}-${idx}`} style={{ display: 'flex', gap: '1rem' }}>
                {/* 左侧时间线 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: color.dotColor,
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: idx < content.timeline.length - 1 ? 'var(--color-border)' : 'transparent',
                    }}
                  />
                </div>
                {/* 右侧内容 */}
                <div style={{ paddingBottom: '1.5rem', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', color: color.tagColor }}>
                      {item.date}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        background: color.tagBg,
                        color: color.tagColor,
                      }}
                    >
                      {item.tagLabel}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: 4,
                      color: 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
            })}
          </div>
        </section>

        {/* ========== 推荐工具 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <Wrench size={20} style={{ color: 'var(--color-primary)' }} />
            推荐工具
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {RECOMMENDED_TOOLS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => navigate(tool.path)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 12,
                  background: 'var(--color-bg-elevated)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-light)'; }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: tool.bg,
                  }}
                >
                  <tool.Icon size={20} style={{ color: tool.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{tool.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{tool.desc}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </section>
        </>
        )}
      </div>

      {/* ========== 固定底部操作栏（空态下隐藏） ========== */}
      {!isEmpty && (
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'var(--color-bg-elevated)',
          borderTop: '1px solid var(--color-border-light)',
          boxShadow: '0 -2px 12px rgba(0,20,50,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            padding: '0.75rem 1.5rem',
          }}
        >
          {/* 导出 PDF */}
          <button
            onClick={handleExportPdf}
            title='打开打印对话框，选择"另存为 PDF"即可保存'
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.625rem 1.25rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Download size={16} />
            <span style={{ whiteSpace: 'nowrap' }}>导出 PDF</span>
          </button>
          {/* 收藏 */}
          <button
            onClick={handleFavorite}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '0.25rem 0.75rem',
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isFav ? '#c8a84e' : 'var(--color-text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <Bookmark size={20} fill={isFav ? '#c8a84e' : 'none'} />
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{isFav ? '已收藏' : '收藏'}</span>
          </button>
          {/* 分享 */}
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '0.25rem 0.75rem',
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <Share2 size={20} />
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>分享</span>
          </button>
        </div>
      </div>
      )}

      {/* ========== 操作提示 Toast ========== */}
      {toast && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            bottom: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '10px 20px',
            borderRadius: 999,
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontSize: '0.8125rem',
            boxShadow: 'var(--shadow-lg)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
