/**
 * 排盘事实构建器
 * 将各体系真实排盘结果序列化为「事实清单」，注入 AI Prompt，
 * 使模型只能基于程序算出的事实解读，降低幻觉与臆断。
 */

type AnyRecord = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const rec = (v: unknown): AnyRecord => (v && typeof v === 'object' && !Array.isArray(v) ? (v as AnyRecord) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function line(label: string, value: string): string {
  return value ? `- ${label}：${value}` : '';
}

/** 八字 */
function baziFacts(d: AnyRecord): string[] {
  const wx = rec(d.wuxingCount);
  const wxText = Object.entries(wx)
    .filter(([, v]) => num(v) !== null)
    .map(([k, v]) => `${k}${String(v)}`)
    .join(' ');
  return [
    line('四柱', [str(d.yearPillar), str(d.monthPillar), str(d.dayPillar), str(d.hourPillar)].filter(Boolean).join(' ')),
    line('日主', str(d.dayMaster)),
    line('五行分布', wxText),
    line('真太阳时', str(d.trueSolar)),
    line('纳音', str(d.nayin) || str(rec(d.nayin).day)),
  ];
}

/** 紫微斗数 */
function ziweiFacts(d: AnyRecord): string[] {
  const palaces = arr(d.twelvePalaces).map((p) => rec(p));
  const palaceText = palaces
    .slice(0, 12)
    .map((p) => `${str(p.palace)}(${str(p.heavenlyStem)}${str(p.earthlyBranch)})${str(p.mainStar)}`)
    .join('；');
  const siHua = rec(d.siHua);
  const horoscope = rec(d.horoscope);
  const decadal = rec(horoscope.decadal);
  const yearly = rec(horoscope.yearly);
  return [
    line('五行局', str(d.wuXingJu)),
    line('命主/身主', `${str(d.soul)} / ${str(d.body)}`),
    line('命宫主星', str(rec(d.mingGong).mainStar)),
    line('十二宫', palaceText),
    line('生年四化', ['化禄', '化权', '化科', '化忌'].map((k) => `${k}${str(siHua[k])}`).filter((x) => !x.endsWith('化')).join(' ')),
    line('当前大限', decadal.heavenlyStem ? `${str(decadal.heavenlyStem)}${str(decadal.earthlyBranch)}（${(arr(decadal.range) as number[]).join('-')}岁）` : ''),
    line('流年', yearly.heavenlyStem ? `${str(yearly.heavenlyStem)}${str(yearly.earthlyBranch)}` : ''),
  ];
}

/** 六爻 */
function liuyaoFacts(d: AnyRecord): string[] {
  const gua = rec(d.originalGua);
  const changed = rec(d.changedGua);
  const cast = rec(d.castInfo);
  const lines = arr(d.sixLines).map((l) => rec(l));
  const lineText = lines
    .map(
      (l) =>
        `${num(l.position)}${str(l.yinYang)}${str(l.shiYing)} ${str(l.liuShen)}${str(l.liuQin)}${str(l.ganZhi)}`
        + `${l.isMoving ? `→${str(l.changedLiuQin)}${str(l.changedGanZhi)}` : ''}`
        + `${l.isKong ? ' 空' : ''}`
    )
    .join('；');
  return [
    line('本卦', `${str(gua.name)}（${str(gua.palace)}${str(gua.palaceElement)}）`),
    line('变卦', str(changed.name)),
    line('四柱', [cast.yearPillar, cast.monthPillar, cast.dayPillar].map(str).filter(Boolean).join(' ')),
    line('月建/日辰', `${str(cast.monthBuild)} / ${str(cast.dayChen)}`),
    line('旬空', str(cast.xunKong)),
    line('世应', `${str(rec(d.shiYing).shi)} / ${str(rec(d.shiYing).ying)}`),
    line('用神', str(d.yongShen)),
    line('六爻', lineText),
  ];
}

/** 梅花易数 */
function meihuaFacts(d: AnyRecord): string[] {
  const tiYong = rec(d.tiYong);
  return [
    line('起卦', `${str(d.method)}｜${str(d.methodDetail)}`),
    line('本卦', `${str(rec(d.mainGua).name)}（${str(rec(d.mainGua).meaning)}）`),
    line('互卦', `${str(rec(d.huGua).name)}（${str(rec(d.huGua).meaning)}）`),
    line('变卦', `${str(rec(d.bianGua).name)}（${str(rec(d.bianGua).meaning)}）`),
    line('动爻', str(d.dongYaoDesc)),
    line('体用', `体${str(tiYong.ti)} 用${str(tiYong.yong)}，${str(tiYong.relation)}（${str(tiYong.lucky)}）`),
  ];
}

/** 奇门遁甲 */
function qimenFacts(d: AnyRecord): string[] {
  const palaces = arr(d.palaces).map((p) => rec(p));
  const palaceText = palaces
    .filter((p) => num(p.number) !== 5)
    .map(
      (p) =>
        `${num(p.number)}宫 地${str(p.earthStem)}/天${arr(p.heavenStems).join('')} `
        + `${arr(p.stars).join('')} ${str(p.door)} ${str(p.deity)}${p.isVoid ? ' 空' : ''}`
    )
    .join('；');
  const leaders = rec(d.leaders);
  return [
    line('局', `${str(d.solarTerm)} ${str(d.dun)}${str(d.yuan)}${num(d.ju) ?? ''}局`),
    line('四柱', Object.values(rec(d.fourPillars)).map(str).join(' ')),
    line('旬首/旬空', `${str(d.xunHead)}（遁${str(d.hiddenStem)}）/ ${arr(d.voidBranches).join('')}`),
    line('值符值使', `${str(leaders.star)}（星）/ ${str(leaders.door)}（门）`),
    line('九宫', palaceText),
  ];
}

/** 大六壬 */
function daliurenFacts(d: AnyRecord): string[] {
  const time = rec(d.time);
  const ke = rec(d.ke);
  const chuan = rec(d.chuan);
  const shen = rec(d.shen);
  const chuanText = arr(chuan.detail)
    .map((c) => {
      const item = rec(c);
      return `${str(item.gan)}${str(item.zhi)}(${str(item.liuqin)}·${str(item.jiang)}${item.kong ? '·空' : ''})`;
    })
    .join(' → ');
  return [
    line('四柱', str(time.fourPillars)),
    line('月将', `${str(time.yuejiang)}（${str(time.yuejiangName)}，${str(time.zhongqi)}后）`),
    line('四课', arr(ke.detail).map(str).join('；')),
    line('课体', str(chuan.zongmen)),
    line('三传', chuanText),
    line('贵人', `${str(shen.guiZhi)}（临${str(shen.guiEarth)}，天将${str(shen.direction)}）`),
  ];
}

/** 塔罗 */
function tarotFacts(d: AnyRecord): string[] {
  const cards = arr(d.cards).map((c) => rec(c));
  return [
    line('牌阵', str(d.spread)),
    line('问题', str(d.question)),
    ...cards.map((c, i) =>
      line(`第${i + 1}张`, `${str(c.name)}${c.isReversed === true || String(c.isReversed).toLowerCase() === 'true' ? '（逆位）' : '（正位）'}：${str(c.meaning) || str(c.uprightMeaning)}`)
    ),
  ];
}

/** 星座 */
function zodiacFacts(d: AnyRecord): string[] {
  const sign = rec(d.sign);
  const love = rec(d.love);
  const career = rec(d.career);
  const wealth = rec(d.wealth);
  const health = rec(d.health);
  return [
    line('星座', `${str(sign.name)}${sign.dateRange ? `（${str(sign.dateRange)}）` : ''}`),
    line('综合', num(d.overallScore) !== null ? `${num(d.overallScore)}分` : ''),
    line('爱情/事业', `${num(love.score) ?? '-'} / ${num(career.score) ?? '-'}`),
    line('财运/健康', `${num(wealth.score) ?? '-'} / ${num(health.score) ?? '-'}`),
    line('幸运', `${str(d.luckyColor)} · ${String(num(d.luckyNumber) ?? '')}`),
  ];
}

/** 生肖 */
function shengxiaoFacts(d: AnyRecord): string[] {
  const scores = rec(d.scores);
  const relation = rec(d.relation);
  return [
    line('生肖', `${str(d.animal)}（${str(d.animalZhi)}）`),
    line('流年', `${str(d.yearPillar)}｜月建 ${str(d.monthPillar)}｜日辰 ${str(d.dayPillar)}`),
    line('关系', relation.kind ? `与${str(relation.target)}${str(relation.kind)}（${num(relation.score)}分）` : ''),
    line('五行关系', str(d.elementRelation)),
    line('五维', Object.entries(scores).map(([k, v]) => `${k}${String(v)}`).join(' ')),
    line('本命年', str(d.benMingNian)),
  ];
}

/** 月相 */
function moonphaseFacts(d: AnyRecord): string[] {
  return [
    line('月相', `${str(d.moonPhase)}（${str(d.illumination)}）`),
    line('月龄', num(d.moonAge) !== null ? `${num(d.moonAge)}天` : ''),
    line('相位', num(d.phaseAngle) !== null ? `${num(d.phaseAngle)}°（${d.waxing ? '渐盈' : '渐亏'}）` : ''),
    line('朔日', str(d.newMoonAt)),
  ];
}

/** 黄历 */
function almanacFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('公历/农历', `${str(src.solarDate)} / ${str(src.lunarDate)}`),
    line('干支', str(src.ganzhi)),
    line('宜', arr(src.yi).join(' ')),
    line('忌', arr(src.ji).join(' ')),
    line('冲煞', str(src.chong) || str(src.chongsha)),
  ];
}

/** 解梦 */
function dreamFacts(d: AnyRecord): string[] {
  const entries = arr(d.entries).map((e) => rec(e));
  return [
    line('关键词', arr(d.keywords).join('、')),
    ...entries.map((e) => line(str(e.keyword), `${str(e.symbol)}｜${str(e.fortune)}｜${str(e.interpretation)}`)),
  ];
}

/** 求签 */
function drawlotFacts(d: AnyRecord): string[] {
  return [
    line('签号/等级', `第${String(num(d.lotNumber) ?? '')}签 ${str(d.level)}`),
    line('签诗', str(d.poem)),
    line('解签', str(d.interpretation)),
    line('建议', str(d.advice)),
  ];
}

/** 符文 */
function runeFacts(d: AnyRecord): string[] {
  const runes = arr(d.runes).map((r) => rec(r));
  return [
    line('牌阵', str(d.spread)),
    ...runes.map((r) => line(str(r.position) || '符文', `${str(r.name)}（${str(r.nameEn)}）：${str(r.meaning)}`)),
  ];
}

/** 姓名 */
function nametestFacts(d: AnyRecord): string[] {
  const wuge = rec(d.wuGe);
  const g = (k: string) => num(rec(wuge[k]).number) ?? '-';
  return [
    line('姓名', str(d.fullName)),
    line('笔画', `姓${num(d.surnameStrokes) ?? '-'} 名${num(d.givenNameStrokes) ?? '-'} 总${num(d.totalStrokes) ?? '-'}`),
    line('五格', `天${g('tianGe')} 人${g('renGe')} 地${g('diGe')} 外${g('waiGe')} 总${g('zongGe')}`),
    line('三才', str(d.sanCai)),
    line('未收录字', arr(d.unresolvedChars).join('、')),
  ];
}

/** 数字能量 */
function numerologyFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('生命灵数', String(num(src.lifePath) ?? str(src.lifePath))),
    line('天赋数', String(num(src.expression) ?? str(src.expression))),
    line('灵魂数', String(num(src.soul) ?? str(src.soul))),
  ];
}

/** 风水 */
function fengshuiFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('方位/类型', `${str(src.direction)} / ${str(src.buildingType)}`),
    line('局势', str(src.overall)),
    line('建议', arr(src.suggestions).join(' ')),
  ];
}

/** 占星骰子 */
function astrodiceFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('行星', str(src.planet)),
    line('星座', str(src.sign)),
    line('宫位', str(src.house)),
    line('组合解读', str(src.interpretation)),
  ];
}

/** 手相 */
function palmFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('识别来源', str(src.mode) === 'ai' ? 'AI 视觉识别' : '模板降级'),
    line('手型', str(src.handShape)),
    line('主线', arr(src.lines).map((l) => (typeof l === 'string' ? l : str(rec(l).name))).join('、')),
    line('掌丘', str(src.mounts)),
  ];
}

/** 铁板神数 */
function tiebanFacts(d: AnyRecord): string[] {
  const details = rec(d.details);
  const src = Object.keys(details).length > 0 ? details : d;
  return [
    line('四柱', [str(src.yearPillar), str(src.monthPillar), str(src.dayPillar), str(src.hourPillar)].filter(Boolean).join(' ')),
    line('命数', str(src.lifeNumber) || str(src.destinyNumber)),
    line('条文', str(src.text) || str(src.poem)),
  ];
}

const BUILDERS: Record<string, (d: AnyRecord) => string[]> = {
  bazi: baziFacts,
  ziwei: ziweiFacts,
  liuyao: liuyaoFacts,
  meihua: meihuaFacts,
  qimen: qimenFacts,
  daliuren: daliurenFacts,
  tarot: tarotFacts,
  zodiac: zodiacFacts,
  shengxiao: shengxiaoFacts,
  moonphase: moonphaseFacts,
  almanac: almanacFacts,
  dream: dreamFacts,
  drawlot: drawlotFacts,
  rune: runeFacts,
  nametest: nametestFacts,
  numerology: numerologyFacts,
  fengshui: fengshuiFacts,
  astrodice: astrodiceFacts,
  palm: palmFacts,
  tieban: tiebanFacts,
};

/** 各体系的检索关键词（补齐事实中的关键术语，提升知识库命中） */
const RETRIEVAL_HINTS: Record<string, (d: AnyRecord) => string> = {
  bazi: (d) => [str(d.dayMaster), '十神', '旺衰', '用神', '大运'].join(' '),
  ziwei: (d) => [str(rec(d.mingGong).mainStar), '四化', '大限', '格局', '宫位'].join(' '),
  liuyao: (d) => [str(rec(d.originalGua).name), str(d.yongShen), '世应', '六亲', '动爻', '旬空'].join(' '),
  meihua: (d) => [str(rec(d.mainGua).name), '体用', '生克', '互卦', '变卦'].join(' '),
  qimen: (d) => [str(d.solarTerm), '值符值使', '八门', '九星', '八神', '用神'].join(' '),
  daliuren: (d) => [str(rec(d.chuan).zongmen), '三传', '四课', '天将', '课体'].join(' '),
  tarot: (d) => arr(d.cards).map((c) => str(rec(c).name)).join(' ') + ' 牌阵 正位 逆位',
  zodiac: (d) => [str(rec(d.sign).name), '星座 运势 元素 守护星'].join(' '),
  shengxiao: (d) => [str(d.animal), '生肖 流年 刑冲合害 犯太岁'].join(' '),
  moonphase: () => '月相 渐盈 渐亏 能量',
  almanac: () => '黄历 宜忌 冲煞 建除十二神',
  dream: (d) => arr(d.keywords).map(str).join(' ') + ' 梦境 象征',
  drawlot: () => '签诗 解签 吉凶 应期',
  rune: () => '符文 北欧 牌阵',
  nametest: () => '五格 三才 数理 起名',
  numerology: () => '生命灵数 天赋数 数字能量',
  fengshui: () => '风水 方位 玄空 八宅',
  astrodice: () => '占星骰子 行星 星座 宫位',
  palm: () => '手相 掌纹 掌丘 手型',
  tieban: () => '铁板神数 条文 四柱',
};

/**
 * 构建该体系的结构化事实清单
 * @param system 体系标识
 * @param data 排盘结果
 */
export function buildFacts(system: string, data: AnyRecord): string {
  const builder = BUILDERS[system];
  if (!builder) return '';
  const details = rec(data.details);
  const source = Object.keys(details).length > 0 ? details : data;
  const lines = builder(source).filter(Boolean);
  return lines.length > 0 ? lines.join('\n') : '';
}

/** 构建检索关键词（用户问题 + 体系事实关键词） */
export function buildRetrievalQuery(
  system: string,
  data: AnyRecord,
  question = ''
): string {
  const hint = RETRIEVAL_HINTS[system];
  const details = rec(data.details);
  const source = Object.keys(details).length > 0 ? details : data;
  const hintText = hint ? hint(source) : '';
  return `${question} ${hintText}`.trim();
}
