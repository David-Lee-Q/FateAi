/**
 * 2026 丙午马年 12 生肖运势数据
 *
 * 数据来源说明：
 * - 太岁关系（值/冲/害/破/刑/合）与四维运势：综合 2026 丙午马年年度运势公开资料
 *   （龙德宫/远传生活提案、联合报副刊雨扬居士、SBS 中文风水师、96iching 等多源交叉验证）
 * - 开运信息（颜色/数字/方位/贵人）：按传统五行、河图数理、天乙贵人星推演
 * - 月度吉凶：按「月建地支与生肖地支」的刑冲合害关系 + 五行生克推算
 */

export type DimKey = 'career' | 'love' | 'wealth' | 'health';
export type MonthFortune = 'ji' | 'zhong' | 'xiong';

export interface ZodiacDimension {
  score: number;
  desc: string;
}

export interface ZodiacFortune {
  /** 生肖对应地支序号（0=子 ... 11=亥） */
  branch: number;
  /** 综合运势评分（0-100） */
  overall: number;
  /** 太岁关系标签（key 对应 TAISUI_TAG_STYLES） */
  tags: { key: string; label: string }[];
  /** 太岁关系概述 */
  taisuiDesc: string;
  /** 太岁关系详述 */
  taisuiDetail: string;
  /** 四维运势 */
  dims: Record<DimKey, ZodiacDimension>;
  /** 幸运颜色 */
  luckyColors: { name: string; hex: string }[];
  /** 幸运数字 */
  luckyNumbers: [number, number];
  /** 幸运方位 */
  luckyDirection: string;
  /** 贵人方向 */
  nobleDirection: string;
  /** AI 深度分析段落 */
  aiAnalysis: { lead: string; text: string }[];
  /** 年度关键词 */
  keywords: string;
}

export const ZODIAC_FORTUNES: Record<string, ZodiacFortune> = {
  rat: {
    branch: 0,
    overall: 58,
    tags: [{ key: 'chong', label: '冲太岁' }],
    taisuiDesc: '2026 年子午相冲，属鼠者逢冲太岁之年。运势起伏大、变动多，宜沉住气、稳字当头，大事忌冒进。',
    taisuiDetail:
      '冲太岁：子午相冲，流年运势动荡，事业、居住地、人际关系均易出现重大变化。变化本身不分好坏，关键在于准备充分。可佩戴太岁护身符或至庙宇安奉太岁以化解。',
    dims: {
      career: { score: 55, desc: '易有岗位调动、跳槽或创业机会，但过程波折，需做足周全准备再行动。' },
      love: { score: 52, desc: '情侣夫妻易生争执，需加强沟通。单身者桃花多属短暂缘分，慎防烂桃花。' },
      wealth: { score: 58, desc: '财运起伏大，不宜高风险投资，谨防意外破财。稳健储蓄为上策。' },
      health: { score: 48, desc: '注意心血管与泌尿系统问题，避免过度劳累，规律作息。' },
    },
    luckyColors: [
      { name: '宝蓝', hex: '#1565c0' },
      { name: '深海蓝', hex: '#0d47a1' },
    ],
    luckyNumbers: [1, 6],
    luckyDirection: '正北',
    nobleDirection: '正东',
    aiAnalysis: [
      {
        lead: '子午冲太岁',
        text: '，2026 年是属鼠者变动最大的一年。事业、居住地、人际关系都可能面临重大调整，挑战与机遇并存。变化本身不分好坏，关键在于沉住气、稳扎稳打。上半年宜为每一步做足准备，下半年气运渐稳，可再图进取。',
      },
      {
        lead: '财运方面',
        text: '，流年天干丙火为正财、地支午火为偏财，财星双显、机遇丰盈，但冲太岁亦带来动荡。切忌高风险投资与担保借贷，谨防意外破财，全年以稳健储蓄为上策。',
      },
      {
        lead: '感情与健康',
        text: '，情侣夫妻易因压力生争执，需多沟通包容；单身者桃花多为短暂缘分，不宜急于认定。健康上留意心血管与泌尿系统，避免过度劳累，规律作息是根本。',
      },
    ],
    keywords: '变动 · 沉稳 · 谨慎',
  },
  ox: {
    branch: 1,
    overall: 56,
    tags: [{ key: 'hai', label: '害太岁' }],
    taisuiDesc: '2026 年丑午相害，属牛者逢害太岁之年。主小人暗害、人际疏离，宜低调行事、谨言慎行，稳扎稳打静观其变。',
    taisuiDetail:
      '害太岁：丑午相害，主小人暗害、人际关系疏离。行事需低调，谨言慎行，切忌口无遮拦授人以柄。重要事项务必留下书面记录，功劳归属说得清楚。',
    dims: {
      career: { score: 56, desc: '团队合作易生嫌隙，功劳可能被夺。宜低调行事，谨言慎行。' },
      love: { score: 54, desc: '易因误会或外人挑拨产生矛盾，信任是基石，多些包容理解。' },
      wealth: { score: 62, desc: '正财稳定，偏财不佳。避免担保或借贷，谨防陷入金钱纠纷。' },
      health: { score: 55, desc: '注意肠胃消化系统及皮肤问题，饮食宜清淡规律。' },
    },
    luckyColors: [
      { name: '土金', hex: '#c8a84e' },
      { name: '浅金', hex: '#e8d48b' },
    ],
    luckyNumbers: [5, 10],
    luckyDirection: '东北偏北',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '丑午相害',
        text: '，2026 年属牛者逢害太岁，主小人暗害、人际疏离。行事宜低调，谨言慎行，切忌口无遮拦授人以柄。团队合作易生嫌隙，功劳归属最好留痕，稳扎稳打、静观其变是全年策略。',
      },
      {
        lead: '财运方面',
        text: '，正财稳定，靠踏实工作而来；偏财不佳。避免为人担保或借贷，易陷入金钱纠纷。变动中求财有机会也有风险，宜储蓄以备不时之需。',
      },
      {
        lead: '感情与健康',
        text: '，易因误会或外人挑拨与伴侣生矛盾，信任是基石，多些包容理解。健康上留意肠胃消化系统与皮肤问题，饮食清淡、作息规律。',
      },
    ],
    keywords: '低调 · 稳扎 · 防小人',
  },
  tiger: {
    branch: 2,
    overall: 88,
    tags: [{ key: 'he', label: '三合贵人' }],
    taisuiDesc: '2026 年寅午半合三合，属虎者得太岁相助，为三合贵人之年。运势强劲、贵人运旺，宜把握时机顺势而上。',
    taisuiDetail:
      '三合贵人：寅午戌三合，寅午半合，得太岁直接相助。贵人运特旺，上级与伙伴鼎力支持，合作顺遂，宜主动出击、顺势而上，把握难得的发展机遇。',
    dims: {
      career: { score: 88, desc: '有新的发展机遇，合作专案得上级或伙伴鼎力支持，宜主动争取。' },
      love: { score: 84, desc: '人气旺盛，单身者脱单机会大；已婚者感情甜蜜，家庭和睦。' },
      wealth: { score: 85, desc: '财源广进，尤其利于从事火、电、能源、文创等行业者。' },
      health: { score: 78, desc: '精力充沛，但需防应酬过多导致肝火旺盛，适时休整。' },
    },
    luckyColors: [
      { name: '翠绿', hex: '#2e7d32' },
      { name: '玉绿', hex: '#43a047' },
    ],
    luckyNumbers: [3, 8],
    luckyDirection: '东北',
    nobleDirection: '北偏西北',
    aiAnalysis: [
      {
        lead: '寅午三合贵人',
        text: '，2026 年属虎者得太岁相助，运势强劲。有新的发展机遇，合作专案得上级或伙伴鼎力支持，是属虎者把握时机、顺势而上、扩大事业版图的难得一年。',
      },
      {
        lead: '财运方面',
        text: '，财源广进，尤其利于从事火、电、能源、文创等行业者。人气旺盛、贵人频现，利跳槽涨薪、拓展业务与正当投资，可大胆把握。',
      },
      {
        lead: '感情与健康',
        text: '，单身者脱单机会大，已婚者感情甜蜜。健康上精力充沛，但需防应酬过多导致肝火旺盛，注意把握休息节奏，避免透支。',
      },
    ],
    keywords: '把握时机 · 贵人 · 进取',
  },
  rabbit: {
    branch: 3,
    overall: 66,
    tags: [
      { key: 'po', label: '破太岁' },
      { key: 'he', label: '天喜桃花' },
    ],
    taisuiDesc: '2026 年午为属兔者天喜桃花星，又与太岁相破。人缘佳、桃花旺，但宜多停看听，避免精力分散。',
    taisuiDetail:
      '破太岁：午与兔气相破，主小破损、小干扰，财务与人脉易有小额损耗。同时天喜桃花临门，人缘佳、桃花旺。行事宜多停看听，先做最重要的事。',
    dims: {
      career: { score: 65, desc: '凭良好人际关系可推动工作，但需避免陷入无关紧要的琐事。' },
      love: { score: 80, desc: '桃花运旺盛，单身者易结识异性；已婚者需把握分寸，防止烂桃花。' },
      wealth: { score: 66, desc: '以正财为主，可通过人脉获得资源，但不宜为人作保。' },
      health: { score: 64, desc: '总体平稳，注意用眼过度与睡眠质量，多亲近自然。' },
    },
    luckyColors: [
      { name: '翠绿', hex: '#2e7d32' },
      { name: '青绿', hex: '#66bb6a' },
    ],
    luckyNumbers: [3, 8],
    luckyDirection: '正东',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '天喜桃花临门',
        text: '，2026 年午为属兔者的天喜桃花星，人缘运佳、桃花旺盛。但兔又破太岁，木火相生、精力易分散，行事宜多停看听，先做最重要的事，避免陷入无关紧要的琐事。',
      },
      {
        lead: '财运方面',
        text: '，以正财为主，可凭人脉获得资源与合作机会。但不宜为人作保，也避免投机。靠口碑与专业稳定进账，是属兔者最稳妥的路径。',
      },
      {
        lead: '感情与健康',
        text: '，单身者脱单机会大，已婚者需把握分寸、防止烂桃花。健康总体平稳，注意用眼过度与睡眠质量，规律休息。',
      },
    ],
    keywords: '停看听 · 桃花 · 聚焦',
  },
  dragon: {
    branch: 4,
    overall: 76,
    tags: [{ key: 'liu', label: '稳中有升' }],
    taisuiDesc: '2026 年属龙者运势稳中有升，才华有展现舞台。惟火土焦躁，宜戒骄戒躁、注重细节。',
    taisuiDetail:
      '稳中有升：不直接犯太岁，创意与想法能得到认可，才华有展现的舞台。惟天狗星入命宫，出入留意交通安全，防小血光之虞，行事稳健为上。',
    dims: {
      career: { score: 78, desc: '创意想法获认可，执行时需注重细节，避免与同事发生口角。' },
      love: { score: 72, desc: '表现自我魅力能吸引异性，但不宜过于强势，以柔克刚。' },
      wealth: { score: 74, desc: '劳有所得，专业技能带来稳定收益。可小额投资学习，忌大额豪赌。' },
      health: { score: 68, desc: '注意上火燥热之症，多补充水分，规律作息，防小血光。' },
    },
    luckyColors: [
      { name: '土金', hex: '#c8a84e' },
      { name: '浅金', hex: '#e8d48b' },
    ],
    luckyNumbers: [5, 10],
    luckyDirection: '东南',
    nobleDirection: '正东',
    aiAnalysis: [
      {
        lead: '才华崭露',
        text: '，2026 年属龙者运势稳中有升，创意与想法能得到认可。惟火土之气焦躁，执行需注重细节、戒骄戒躁，避免与同事发生口角。过去所有付出开始累积收获，稳健推进即可。',
      },
      {
        lead: '财运方面',
        text: '，劳有所得，专业技能带来稳定收益。可进行小额投资与学习，但不宜大额高风险投资。天狗星入命宫，出行留意交通安全，防小血光。',
      },
      {
        lead: '感情与健康',
        text: '，自我魅力吸引异性，但不宜过于强势，以柔克刚。健康上注意上火燥热，多补充水分、规律作息，减少熬夜。',
      },
    ],
    keywords: '崭露才华 · 戒躁 · 稳健',
  },
  snake: {
    branch: 5,
    overall: 90,
    tags: [{ key: 'liu', label: '官印相生' }],
    taisuiDesc: '2026 年丙火为蛇之禄神、午火为帝旺，属蛇者官印相生、名利双收。运势达年度顶峰，宜积极把握。',
    taisuiDetail:
      '官印相生：丙火为禄神、午火为帝旺，主晋升掌权、名利双收。为 2026 年 12 生肖中运势最强之一，宜积极把握晋升与扩张机会，忌坐等观望。',
    dims: {
      career: { score: 92, desc: '有晋升、掌权之象，权力地位提升，务必积极把握。' },
      love: { score: 82, desc: '运势高涨带动个人魅力，感情生活丰富多彩，社交活跃。' },
      wealth: { score: 88, desc: '正偏财皆旺，收入显著增加，但开销也大，需做好财务规划。' },
      health: { score: 70, desc: '精力消耗过大，需注意心脏负荷，避免熬夜透支。' },
    },
    luckyColors: [
      { name: '朱红', hex: '#c43a3a' },
      { name: '紫', hex: '#8a50a0' },
    ],
    luckyNumbers: [2, 7],
    luckyDirection: '东南偏南',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '官印相生',
        text: '，丙火为蛇之禄神、午火为帝旺，2026 年是属蛇者运势的顶峰之年。事业有晋升、掌权之象，名利双收，为 12 生肖中表现最强之一，务必积极把握，切勿坐等。',
      },
      {
        lead: '财运方面',
        text: '，正偏财皆旺，收入显著增加，跳槽加薪、潜力股兑现的机会都有。但开销也相应增大（投资、置产、出行），务必做好财务规划，别让财富只过手不留存。',
      },
      {
        lead: '感情与健康',
        text: '，运势高涨带动个人魅力，感情生活丰富多彩。主要提醒是精力消耗过大，注意心脏负荷，避免熬夜透支，定期体检。',
      },
    ],
    keywords: '名利双收 · 晋升 · 规划',
  },
  horse: {
    branch: 6,
    overall: 62,
    tags: [
      { key: 'zhi', label: '值太岁' },
      { key: 'xing', label: '刑太岁' },
    ],
    taisuiDesc: '2026 年午马属相值太岁，又逢午午自刑之刑太岁。本命年是转折能量强烈的年份，稳字当头最重要。',
    taisuiDetail:
      '值太岁兼刑太岁：本命年又逢午午自刑，转折能量特别强，运势两极分化、事件密集。重要决策宜延后三天再定，可安奉太岁或佩戴太岁护身符化解，低调行事。',
    dims: {
      career: { score: 66, desc: '是开启新专案或转型的好时机，但决策需深思熟虑，忌盲目自信。' },
      love: { score: 56, desc: '情绪起伏大，易与伴侣争执，需多包容理解，避免仓促决定。' },
      wealth: { score: 62, desc: '大进大出，变动中求财，有机会也有风险，宜储蓄以备不时之需。' },
      health: { score: 52, desc: '重中之重：注意心血管与意外红伤，避免疲劳驾驶与冲动行为。' },
    },
    luckyColors: [
      { name: '红', hex: '#c43a3a' },
      { name: '紫', hex: '#8a50a0' },
    ],
    luckyNumbers: [2, 7],
    luckyDirection: '正南',
    nobleDirection: '北偏西北',
    aiAnalysis: [
      {
        lead: '午马值太岁',
        text: '，2026 年是属马者的本命年，又逢午午自刑，运势两极分化、转折能量特别强。上半年宜守不宜攻，下半年贵人显现、运势回升。重要决策延后三天再定，避免因急躁而冒进。',
      },
      {
        lead: '财运方面',
        text: '，呈「大进大出」的形态。收入机会确实存在，但支出也明显增加。变动中求财要留有余地，避免高杠杆与情绪性投资，做好风险管控与资金分流。',
      },
      {
        lead: '感情与健康',
        text: '，情绪起伏易把压力带进关系，需多包容理解，不做仓促决定。健康是今年重中之重：留意心血管问题与意外红伤，避免疲劳驾驶，安排定期体检。',
      },
    ],
    keywords: '谨慎 · 转折 · 突破',
  },
  goat: {
    branch: 7,
    overall: 85,
    tags: [{ key: 'he', label: '六合贵人' }],
    taisuiDesc: '2026 年午未六合，属羊者享六合贵人之运。贵人运极佳，合作与人脉可带来巨大成功。',
    taisuiDetail:
      '六合贵人：午未六合，贵人运极佳，能通过合作与人脉获得成功。利合作、签约、团队建设；六合利姻缘，是谈婚论嫁的好时机。',
    dims: {
      career: { score: 86, desc: '利合作、签约、团队建设，以往难题在他人帮助下迎刃而解。' },
      love: { score: 90, desc: '六合利姻缘，感情和谐甜蜜，是谈婚论嫁的好时机。' },
      wealth: { score: 84, desc: '合作生财，联合投资与共同经营尤其有利，收益共享。' },
      health: { score: 82, desc: '运势顺畅，身心愉快，注意饮食均衡即可。' },
    },
    luckyColors: [
      { name: '土金', hex: '#c8a84e' },
      { name: '米色', hex: '#d9c9a3' },
    ],
    luckyNumbers: [5, 10],
    luckyDirection: '西南偏西',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '午未六合贵人',
        text: '，2026 年属羊者贵人运极佳，能通过合作与人脉获得成功。利合作、签约、团队建设，以往的难题在他人帮助下迎刃而解。是组建团队、拓展伙伴关系的最佳时机。',
      },
      {
        lead: '财运方面',
        text: '，合作生财，联合投资与共同经营尤其有利。与对人合伙、共享收益，比单打独斗更高效。财务上宜在合作框架内明确权责与分配。',
      },
      {
        lead: '感情与健康',
        text: '，六合利姻缘，感情和谐甜蜜，是谈婚论嫁的好时机。健康运势顺畅，身心愉快，注意饮食均衡即可享受全年好运。',
      },
    ],
    keywords: '合作 · 贵人 · 姻缘',
  },
  monkey: {
    branch: 8,
    overall: 68,
    tags: [{ key: 'liu', label: '驿马星旺' }],
    taisuiDesc: '2026 年丙火为猴之七杀、午火为正官，驿马星亦旺。事业压力大，亦是提升能力的好时机，动中取财。',
    taisuiDetail:
      '驿马星旺：丙火七杀、午火正官，任务繁重、竞争激烈；驿马星动，动中取财。是能力提升的好时机，需付出加倍努力才能脱颖而出。',
    dims: {
      career: { score: 74, desc: '任务繁重，竞争激烈，需付出加倍努力才能脱颖而出。' },
      love: { score: 58, desc: '男性桃花运较弱；女性易遇到有挑战性的缘分，慎防竞争。' },
      wealth: { score: 66, desc: '辛苦得财，不宜投机。专注主业可获得稳定回报。' },
      health: { score: 60, desc: '压力导致精神紧张，需学会放松，留意呼吸系统问题。' },
    },
    luckyColors: [
      { name: '银白', hex: '#cfd8dc' },
      { name: '金', hex: '#c8a84e' },
    ],
    luckyNumbers: [4, 9],
    luckyDirection: '西南偏南',
    nobleDirection: '正东',
    aiAnalysis: [
      {
        lead: '驿马星旺',
        text: '，2026 年丙火为属猴者的七杀、午火为正官，事业压力巨大，任务繁重、竞争激烈。但压力亦是提升能力的好时机，动中取财，付出加倍努力方能脱颖而出。',
      },
      {
        lead: '财运方面',
        text: '，辛苦得财，不宜投机。专注主业可获得稳定回报；从事接案或经营自媒体者，专业能力能兑现成额外收入，留意破财风险即可。',
      },
      {
        lead: '感情与健康',
        text: '，男性桃花运较弱，女性易遇到有挑战性的缘分，留意强劲的竞争者。压力导致精神紧张，学会放松，留意呼吸系统。',
      },
    ],
    keywords: '动中取财 · 辛苦 · 能力',
  },
  rooster: {
    branch: 9,
    overall: 68,
    tags: [
      { key: 'po', label: '破太岁' },
      { key: 'he', label: '红鸾桃花' },
    ],
    taisuiDesc: '2026 年酉午相破，属鸡者破太岁，主破坏破損；同时红鸾星动、桃花大旺。宜维稳关系、防破損、反复检查文书。',
    taisuiDetail:
      '破太岁：酉午相破，主「破坏」「破損」，进行中的专案易出现意外干扰，人际关系与财务需维稳。同时红鸾星动，桃花与人缘双旺。',
    dims: {
      career: { score: 76, desc: '进行中的专案易出现意外干扰，客户关系与合同文书需反复检查。' },
      love: { score: 88, desc: '红鸾星动，桃花冠军之年，人缘倍增；利销售、教育等接触人的行业。' },
      wealth: { score: 74, desc: '太阴星属财星，事业与财运同步向上；宜低调，避免锋芒太露。' },
      health: { score: 62, desc: '留意割伤、擦伤等轻微意外，出行驾驶小心。' },
    },
    luckyColors: [
      { name: '金', hex: '#c8a84e' },
      { name: '银白', hex: '#cfd8dc' },
    ],
    luckyNumbers: [4, 9],
    luckyDirection: '正西',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '酉午破太岁',
        text: '，2026 年属鸡者破太岁，主「破坏」「破損」。进行中的专案易出现意外干扰，客户关系、合同文书需反复检查。同时红鸾星动、桃花大旺，防破損与旺人缘并行。',
      },
      {
        lead: '财运方面',
        text: '，太阴星属财星，事业与财运同步向上，销售、教育、社工、客户服务等大量接触人的行业尤其有利。气势强盛，但避免锋芒太露，以免招致嫉妒阻挠。',
      },
      {
        lead: '感情与健康',
        text: '，桃花为 12 生肖之冠，红鸾星动、异性缘强烈，人缘倍增。健康上留意割伤、擦伤等轻微意外，出行驾驶小心。',
      },
    ],
    keywords: '桃花 · 防損 · 低调',
  },
  dog: {
    branch: 10,
    overall: 60,
    tags: [{ key: 'jing', label: '官符谨慎' }],
    taisuiDesc: '2026 年属狗者命宫遇蜚廉、官符星，是非与无端牵连易起。做好本份、不插手他人之事，反能迎来地位提升。',
    taisuiDetail:
      '官符星：蜚廉、官符同临命宫，易遇是非、官非、言语干扰。虽有晋升权责的机会，但需分清自身与他人界限，「闲事莫理」是减少麻烦的关键。',
    dims: {
      career: { score: 70, desc: '有机会提升权责，但需分清界限、不插手他人之事，反能晋升。' },
      love: { score: 56, desc: '桃花平平；有伴者留意外来第三者的口舌干扰，非感情介入。' },
      wealth: { score: 64, desc: '财运平稳无大起伏，专注独立工作与进修，稳步积累。' },
      health: { score: 72, desc: '整体平稳，留意小病小痛，保持常规保养即可。' },
    },
    luckyColors: [
      { name: '土金', hex: '#c8a84e' },
      { name: '棕金', hex: '#a08050' },
    ],
    luckyNumbers: [5, 10],
    luckyDirection: '西北偏西',
    nobleDirection: '北偏西北',
    aiAnalysis: [
      {
        lead: '官符星动',
        text: '，2026 年属狗者命宫同有蜚廉、官符星，易遇是非、官非、无端被牵连与言语干扰。虽有晋升权责的机会，但需分清自身与他人界限，「闲事莫理」是减少麻烦的关键。',
      },
      {
        lead: '财运方面',
        text: '，财运平稳无大起伏。属狗者今年专注力与思考力强，适合独立工作、进修、学习与科研，做好本份反而是地位提升之路。',
      },
      {
        lead: '感情与健康',
        text: '，桃花平平，有伴者需留意外来第三者的口舌干扰——是闲言碎语，并非感情介入。健康整体平稳，留意小病小痛即可。',
      },
    ],
    keywords: '闲事莫理 · 进修 · 守稳',
  },
  pig: {
    branch: 11,
    overall: 70,
    tags: [{ key: 'he', label: '月德贵人' }],
    taisuiDesc: '2026 年属猪者命宫月德星照，为去年冲太岁后的修复之年。小确幸增多、无形贵人相伴，宜休养生息蓄势待发。',
    taisuiDetail:
      '月德贵人：月德星照命宫，心存善念便有好运相随，属无形贵人力量。时常遇小确幸；惟劫财星同在，需防朋友拖累与借贷破财。',
    dims: {
      career: { score: 68, desc: '平稳不进不退，适合休养生息、蓄势待发，贵人偶有助力。' },
      love: { score: 66, desc: '稳定关系维持现状，单身者新恋情机会不多，重在经营。' },
      wealth: { score: 62, desc: '防朋友拖累与借贷破财，劫财星作祟，金钱往来需谨慎。' },
      health: { score: 66, desc: '易感疲倦无力，需注意气血运行，多休息、规律调养。' },
    },
    luckyColors: [
      { name: '宝蓝', hex: '#1565c0' },
      { name: '湖蓝', hex: '#4a90d9' },
    ],
    luckyNumbers: [1, 6],
    luckyDirection: '北偏西北',
    nobleDirection: '正北',
    aiAnalysis: [
      {
        lead: '月德贵人',
        text: '，2026 年属猪者去年冲太岁、变动较多，今年运势明显回稳，是修复之年。命宫月德星照，心存善念便有好运相随——危机前突然有直觉避开、或贵人伸手相助，都是常态。',
      },
      {
        lead: '财运方面',
        text: '，平稳不进不退，适合休养生息、蓄势待发。但命宫同有劫财星，需防被朋友拖累、借贷破财，金钱往来务必谨慎，亲兄弟明算账。',
      },
      {
        lead: '感情与健康',
        text: '，稳定关系维持现状，单身者新恋情机会不多。死符星易生疲倦无力感，注意气血运行，多休息、规律调养身体。',
      },
    ],
    keywords: '修复 · 小确幸 · 蓄势',
  },
};

/* ============================
   月度吉凶推算（月建地支 vs 生肖地支）
   ============================ */

/** 地支名称（0=子 ... 11=亥） */
export const BRANCH_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 地支五行 */
const BRANCH_ELEMENT: Record<number, string> = {
  0: '水', 1: '土', 2: '木', 3: '木', 4: '土', 5: '火',
  6: '火', 7: '土', 8: '金', 9: '金', 10: '土', 11: '水',
};

/** 2026 农历各月对应的月建地支（正月=寅 ... 腊月=丑） */
export const MONTH_META = [
  { month: '1月', lunar: '正月', branch: 2 },
  { month: '2月', lunar: '二月', branch: 3 },
  { month: '3月', lunar: '三月', branch: 4 },
  { month: '4月', lunar: '四月', branch: 5 },
  { month: '5月', lunar: '五月', branch: 6 },
  { month: '6月', lunar: '六月', branch: 7 },
  { month: '7月', lunar: '七月', branch: 8 },
  { month: '8月', lunar: '八月', branch: 9 },
  { month: '9月', lunar: '九月', branch: 10 },
  { month: '10月', lunar: '十月', branch: 11 },
  { month: '11月', lunar: '冬月', branch: 0 },
  { month: '12月', lunar: '腊月', branch: 1 },
];

/** 六冲（对称） */
const CHONG: Record<number, number> = { 0: 6, 6: 0, 1: 7, 7: 1, 2: 8, 8: 2, 3: 9, 9: 3, 4: 10, 10: 4, 5: 11, 11: 5 };

/** 六害（对称） */
const HAI: Record<number, number> = { 0: 7, 7: 0, 1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3, 8: 11, 11: 8, 9: 10, 10: 9 };

/** 六破（配对） */
const PO_PAIRS: [number, number][] = [
  [0, 9], [1, 3], [2, 10], [5, 7], [8, 4], [11, 3],
];

/** 三刑（寅巳申 无恩之刑） */
const XING_PAIRS: [number, number][] = [
  [2, 5], [5, 8], [2, 8],
];

/** 六合（配对；午马同时与卯、酉六合，故用数组） */
const LIUHE_PAIRS: [number, number][] = [
  [0, 1], [2, 7], [3, 6], [5, 8], [6, 9], [10, 11],
];

/** 三合局 */
const SANHE_GROUPS: number[][] = [
  [8, 0, 4],  // 申子辰
  [2, 6, 10], // 寅午戌
  [5, 9, 1],  // 巳酉丑
  [11, 3, 7], // 亥卯未
];

/** 五行相生 */
const GENERATE: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };

/** 五行相克（a 克 b） */
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

export interface MonthlyResult {
  fortune: MonthFortune;
  reason: string;
}

/**
 * 按「月建地支与生肖地支」的刑冲合害关系 + 五行生克，
 * 推算该生肖在 2026 年某农历月的吉凶。
 */
export function getMonthlyFortune(animalBranch: number, monthBranch: number): MonthlyResult {
  if (monthBranch === animalBranch) {
    return { fortune: 'zhong', reason: '本月为生肖本命月，变动易起，谨言慎行、保持节奏。' };
  }
  if (CHONG[animalBranch] === monthBranch) {
    return { fortune: 'xiong', reason: `月建${BRANCH_NAMES[monthBranch]}与生肖相冲，变动易起，大事宜缓、以守为先。` };
  }
  if (HAI[animalBranch] === monthBranch) {
    return { fortune: 'xiong', reason: '月建与生肖相害，小人暗处作祟，留意文书合同与口舌是非。' };
  }
  if (XING_PAIRS.some((p) => (p[0] === animalBranch && p[1] === monthBranch) || (p[0] === monthBranch && p[1] === animalBranch))) {
    return { fortune: 'xiong', reason: '月建与生肖相刑，是非口舌易起，情绪管理为上，避免争执升级。' };
  }
  if (PO_PAIRS.some((p) => (p[0] === animalBranch && p[1] === monthBranch) || (p[0] === monthBranch && p[1] === animalBranch))) {
    return { fortune: 'zhong', reason: '月建与生肖相破，小破小耗易生，财务细节需仔细核对。' };
  }
  if (LIUHE_PAIRS.some((p) => (p[0] === animalBranch && p[1] === monthBranch) || (p[0] === monthBranch && p[1] === animalBranch))) {
    return { fortune: 'ji', reason: `月建${BRANCH_NAMES[monthBranch]}与生肖六合，贵人相助，办事顺畅，利推进重要事项。` };
  }
  if (SANHE_GROUPS.some((g) => g.includes(animalBranch) && g.includes(monthBranch))) {
    return { fortune: 'ji', reason: '月建与生肖三合局，贵人运旺，可主动出击、拓展合作。' };
  }
  const a = BRANCH_ELEMENT[animalBranch];
  const b = BRANCH_ELEMENT[monthBranch];
  if (b === a) {
    return { fortune: 'zhong', reason: '月建五行与生肖比和，气运平稳，按部就班即可。' };
  }
  if (GENERATE[b] === a) {
    return { fortune: 'ji', reason: '月建五行生助生肖五行，得月气滋养，运势渐旺、宜进取。' };
  }
  if (KE[b] === a) {
    return { fortune: 'zhong', reason: '月建五行克制生肖五行，压力稍增，宜稳不宜冲，谋定后动。' };
  }
  if (KE[a] === b) {
    return { fortune: 'ji', reason: '生肖五行克月建五行，财星当旺，利求财与执行，正当进取。' };
  }
  return { fortune: 'zhong', reason: '月建与生肖气运平和，宜专注积累，不宜强求。' };
}

/** 当前所处农历月索引（2026-08-22 处于农历七月=申月，索引 6） */
export const CURRENT_MONTH_INDEX = 6;

/** 当前农历月的公历区间 */
export const CURRENT_MONTH_RANGE = '2026.08.13 - 2026.09.10';

/** 本月建议文案（按吉凶） */
export const MONTH_ADVICE: Record<MonthFortune, string> = {
  ji: '本月运势上佳、贵人相伴，宜推进事业、合作与重要决定。惟好运勿骄，细节仍需谨慎。',
  zhong: '本月运势平稳，按部就班即可。宜布局、进修与整理规划，重大事务可先观察再行动。',
  xiong: '本月运势偏低，大事宜缓。谨防破财与口舌是非，以守为攻，待月末气运转好后逐步推进。',
};
