import { useState } from 'react';
import {
  Calendar, Heart, Plane, Briefcase, Home, FileSignature, Building2,
  Hammer, Scissors, Warehouse, Landmark, HardHat, Anchor, Pill,
  Sun, Moon, Star, ShieldCheck, Zap,
  AlertTriangle, XCircle, CloudRain, Ban,
  Clock, Compass, Brain, Sparkles,
  AlertCircle, CalendarDays, LayoutGrid, Info, Check, X, ScrollText,
} from 'lucide-react';

/* ===== 常量数据 ===== */
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/** 宜忌图标映射 */
const YI_ICON_MAP: Record<string, React.ReactNode> = {
  '嫁娶': <Heart size={14} />, '出行': <Plane size={14} />, '开业': <Briefcase size={14} />,
  '搬家': <Home size={14} />, '签约': <FileSignature size={14} />, '交易': <Building2 size={14} />,
  '动土': <Hammer size={14} />, '裁衣': <Scissors size={14} />,
  '祭祀': <Star size={14} />, '祈福': <Sparkles size={14} />,
  '入宅': <Home size={14} />, '开市': <Briefcase size={14} />,
  '修造': <Hammer size={14} />, '纳采': <Heart size={14} />, '订盟': <FileSignature size={14} />,
};
const JI_ICON_MAP: Record<string, React.ReactNode> = {
  '开仓': <Warehouse size={14} />, '安葬': <Landmark size={14} />, '修造': <HardHat size={14} />,
  '入水': <Anchor size={14} />, '合药': <Pill size={14} />,
  '破土': <Hammer size={14} />, '行丧': <X size={14} />,
  '造桥': <Building2 size={14} />, '掘井': <Anchor size={14} />,
};

/** 吉神图标映射 */
const GOOD_GOD_ICON_MAP: Record<string, React.ReactNode> = {
  '天德': <Sun size={14} />, '月德': <Moon size={14} />, '天恩': <Star size={14} />,
  '福星': <Sparkles size={14} />, '天喜': <Heart size={14} />, '天贵': <Crown size={14} />,
  '驿马': <Zap size={14} />, '天医': <ShieldCheck size={14} />, '天瑞': <ShieldCheck size={14} />,
  '月瑞': <Moon size={14} />,
};
/** 凶神图标映射 */
const BAD_GOD_ICON_MAP: Record<string, React.ReactNode> = {
  '五虚': <AlertTriangle size={14} />, '朱雀': <XCircle size={14} />,
  '天狗': <CloudRain size={14} />, '劫煞': <Ban size={14} />,
  '天煞': <XCircle size={14} />, '地煞': <AlertTriangle size={14} />, '月破': <Ban size={14} />,
};

/** 伪随机函数，根据日期种子生成可复现的随机数 */
function seededRandom(seed: number, offset: number) {
  return ((seed + offset) * 9301 + 49297) % 233280;
}

/** 根据日期生成模拟黄历数据 */
function generateAlmanacData(dateStr: string) {
  const date = new Date(dateStr);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const yearIndex = (date.getFullYear() - 4) % 60;
  const gan = TIANGAN[yearIndex % 10];
  const zhi = DIZHI[yearIndex % 12];
  const animal = SHENGXIAO[yearIndex % 12];

  const seed = dayOfYear * 137;
  const r = (offset: number) => seededRandom(seed, offset);

  /* 宜忌 */
  const YI_OPTIONS = ['嫁娶', '出行', '开业', '搬家', '签约', '交易', '动土', '裁衣', '祭祀', '祈福', '入宅', '开市', '修造', '纳采', '订盟'];
  const JI_OPTIONS = ['开仓', '安葬', '修造', '入水', '合药', '破土', '行丧', '造桥', '掘井'];
  const yiCount = 5 + (r(1) % 4);
  const jiCount = 3 + (r(2) % 3);
  const yi = Array.from({ length: yiCount }, (_, i) => YI_OPTIONS[r(10 + i) % YI_OPTIONS.length]);
  const ji = Array.from({ length: jiCount }, (_, i) => JI_OPTIONS[r(20 + i) % JI_OPTIONS.length]);

  /* 冲煞 */
  const chongAnimal = SHENGXIAO[(yearIndex + 6) % 12];
  const shaDirections = ['正东', '正南', '正西', '正北', '东南', '东北', '西南', '西北'];
  const shaDirection = shaDirections[r(30) % 8];

  /* 吉神凶神 */
  const goodGodPool = ['天德', '月德', '天恩', '福星', '天喜', '天贵', '驿马', '天医', '天瑞', '月瑞'];
  const badGodPool = ['五虚', '朱雀', '天狗', '劫煞', '天煞', '地煞', '月破'];
  const goodGods = [
    goodGodPool[r(40) % goodGodPool.length],
    goodGodPool[r(41) % goodGodPool.length],
    goodGodPool[r(42) % goodGodPool.length],
    goodGodPool[r(43) % goodGodPool.length],
    goodGodPool[r(44) % goodGodPool.length],
  ];
  const badGods = [
    badGodPool[r(50) % badGodPool.length],
    badGodPool[r(51) % badGodPool.length],
    badGodPool[r(52) % badGodPool.length],
    badGodPool[r(53) % badGodPool.length],
  ];

  /* 十二时辰 */
  const hours = DIZHI.map((zh, idx) => {
    const statusVal = r(60 + idx) % 3;
    return {
      name: `${zh}时`,
      time: `${String(idx * 2).padStart(2, '0')}:00-${String((idx + 1) * 2 === 24 ? 0 : (idx + 1) * 2).padStart(2, '0')}:00`,
      status: (statusVal === 0 ? '吉' : statusVal === 2 ? '凶' : '平') as '吉' | '凶' | '平',
    };
  });

  /* 农历 */
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const lunarDays = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
  ];
  const lunarMonth = lunarMonths[r(90) % 12];
  const lunarDay = lunarDays[dayOfYear % 30];
  const stars = ['壁宿', '奎宿', '娄宿', '胃宿', '昴宿', '毕宿', '觜宿', '参宿', '井宿', '鬼宿', '柳宿', '星宿'];
  const star = stars[dayOfYear % 12];

  const jieqiList = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
  const jieqi = jieqiList[Math.floor(dayOfYear / 15) % 24];

  return {
    date,
    ganZhi: `${gan}${zhi}`,
    ganZhiFull: `${TIANGAN[(date.getFullYear() - 4) % 10]}${DIZHI[(date.getFullYear() - 4) % 12]}月 ${gan}${zhi}日`,
    animal,
    lunar: `${lunarMonth}${lunarDay}`,
    star,
    jieqi,
    yi: [...new Set(yi)],
    ji: [...new Set(ji)],
    chong: `冲${chongAnimal}`,
    chongAnimal,
    sha: `煞${shaDirection}`,
    shaDirection,
    goodGods: [...new Set(goodGods)],
    badGods: [...new Set(badGods)],
    hours,
  };
}

/** Section 标题组件 */
function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: 36, height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-bg)',
          color: 'var(--color-primary)',
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Crown 图标（lucide-react 无 Crown，用 SVG 替代） */
function Crown(props: { size?: number }) {
  const sz = props.size || 14;
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M3 20h18" />
    </svg>
  );
}

/* ===== 主页面组件 ===== */
export default function AlmanacPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'pick' | 'range'>('today');

  /* 获取今日日期字符串 */
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const data = generateAlmanacData(todayStr);
  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  /* 日期选择 Tab 配置 */
  const tabs = [
    { key: 'today' as const, label: '今日' },
    { key: 'pick' as const, label: '选择日期' },
    { key: 'range' as const, label: '日期范围' },
  ];

  /* AI 推荐条目 */
  const aiRecommendations = [
    {
      icon: <Briefcase size={16} />,
      title: '适合签约合作',
      desc: `今日${data.goodGods.slice(0, 2).join('、')}吉星高照，签约合作事项运势极佳，可选择在上午巳时或下午申时进行。`,
      color: 'var(--color-text)',
    },
    {
      icon: <Plane size={16} />,
      title: '远行出行有利',
      desc: `驿马星动，出行方位宜避开${data.shaDirection}。推荐向西北或正南方向出行，逢吉时辰效果更佳。`,
      color: 'var(--color-text)',
    },
    {
      icon: <Heart size={16} />,
      title: '婚嫁喜事适宜',
      desc: '天恩吉星护佑，嫁娶为今日大吉之选。建议选择午时之后的申时举行仪式，避开午时凶时。',
      color: 'var(--color-text)',
    },
    {
      icon: <AlertCircle size={16} style={{ color: 'var(--state-error)' }} />,
      title: '避免修造动工',
      desc: '虽然黄历宜动土，但今日五虚、劫煞并见，大型修造工程建议另择吉日，小范围修整无碍。',
      color: 'var(--state-error)',
    },
  ];

  /* 相关推荐 */
  const relatedItems = [
    { icon: <CalendarDays size={24} />, name: '运势日历', desc: '日历视图纵览每日运势，宜忌变化一目了然，助您提前规划。' },
    { icon: <ScrollText size={24} />, name: '签诗抽签', desc: 'AI智能抽签，融合传统签诗智慧，为您指点迷津、解答疑惑。' },
    { icon: <Star size={24} />, name: '生肖运势', desc: '十二生肖专属运势详解，涵盖事业、财运、感情、健康多维分析。' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* ==================== 1. 标题区域 ==================== */}
      <section className="pt-20 pb-6 md:pt-24 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '0.02em',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            黄历宜忌
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: 520,
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            传统黄历通胜，择吉避凶
          </p>
        </div>
      </section>

      {/* ==================== 2. 日期选择 Tab ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tab 组 */}
            <div
              className="inline-flex gap-1"
              style={{
                background: 'var(--color-bg-inset)',
                borderRadius: 'var(--radius-lg)',
                padding: 4,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: 'var(--space-2) var(--space-5)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.key ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap',
                    boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* 当前日期信息 */}
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              <Calendar size={16} />
              <span>{formattedDate} 农历{data.lunar}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. 农历信息区 ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
              {[
                { label: '农历日期', value: data.lunar, highlight: true },
                { label: '干支纪日', value: data.ganZhiFull, highlight: false },
                { label: '节气', value: data.jieqi, highlight: false },
                { label: '今日生肖', value: data.animal, highlight: false },
                { label: '值日星宿', value: data.star, highlight: false, hideMobile: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center gap-2 ${item.hideMobile ? 'hidden sm:flex' : ''}`}
                >
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-base font-semibold whitespace-nowrap"
                    style={{ color: item.highlight ? 'var(--color-gold-dark)' : 'var(--color-text)' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. 宜忌主区域（两列对比） ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左列：今日宜 */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 138, 92, 0.08), rgba(26, 138, 92, 0.03))',
                border: '1px solid rgba(26, 138, 92, 0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(26, 138, 92, 0.15)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--state-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--state-success)', fontFamily: 'var(--font-body)' }}>
                    今日宜
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    适合进行的活动事项
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.yi.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-lg text-sm transition-transform hover:-translate-y-px"
                    style={{
                      padding: 'var(--space-3) var(--space-5)',
                      background: 'rgba(26, 138, 92, 0.12)',
                      color: 'var(--state-success)',
                      border: '1px solid rgba(26, 138, 92, 0.2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {YI_ICON_MAP[item] || <Check size={14} />}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 右列：今日忌 */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(196, 58, 58, 0.08), rgba(196, 58, 58, 0.03))',
                border: '1px solid rgba(196, 58, 58, 0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(196, 58, 58, 0.15)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--state-error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--state-error)', fontFamily: 'var(--font-body)' }}>
                    今日忌
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    应避免进行的活动事项
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.ji.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-lg text-sm transition-transform hover:-translate-y-px"
                    style={{
                      padding: 'var(--space-3) var(--space-5)',
                      background: 'rgba(196, 58, 58, 0.12)',
                      color: 'var(--state-error)',
                      border: '1px solid rgba(196, 58, 58, 0.2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {JI_ICON_MAP[item] || <X size={14} />}
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. 吉神凶神列表 ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <SectionHeading icon={<Sparkles size={18} />} title="吉神凶神" />

          {/* 吉神宜趋 */}
          <div className="mb-4">
            <span className="text-sm font-medium block mb-3" style={{ color: 'var(--color-gold-dark)' }}>
              吉神宜趋
            </span>
            <div className="flex flex-wrap gap-2">
              {data.goodGods.map((god, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-full text-sm"
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    background: 'rgba(200, 168, 78, 0.12)',
                    color: 'var(--color-gold-dark)',
                    border: '1px solid rgba(200, 168, 78, 0.25)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {GOOD_GOD_ICON_MAP[god] || <Star size={14} />}
                  {god}
                </span>
              ))}
            </div>
          </div>

          {/* 凶神宜忌 */}
          <div>
            <span className="text-sm font-medium block mb-3" style={{ color: 'var(--state-error)' }}>
              凶神宜忌
            </span>
            <div className="flex flex-wrap gap-2">
              {data.badGods.map((god, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-full text-sm"
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    background: 'rgba(196, 58, 58, 0.08)',
                    color: 'var(--state-error)',
                    border: '1px solid rgba(196, 58, 58, 0.15)',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {BAD_GOD_ICON_MAP[god] || <AlertTriangle size={14} />}
                  {god}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. 十二时辰吉凶表 ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <SectionHeading icon={<Clock size={18} />} title="十二时辰吉凶" />
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollSnapType: 'x mandatory' }}>
            {data.hours.map((h) => {
              const isLucky = h.status === '吉';
              const isBad = h.status === '凶';
              return (
                <div
                  key={h.name}
                  className="flex-shrink-0 rounded-lg p-4 text-center transition-all hover:-translate-y-0.5 cursor-default"
                  style={{
                    width: 100,
                    scrollSnapAlign: 'start',
                    background: 'var(--color-bg-elevated)',
                    border: `1px solid ${isLucky ? 'rgba(26, 138, 92, 0.3)' : isBad ? 'rgba(196, 58, 58, 0.3)' : 'var(--color-border)'}`,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <div
                    className="text-sm font-semibold whitespace-nowrap mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                  >
                    {h.name}
                  </div>
                  <div className="text-xs whitespace-nowrap mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    {h.time}
                  </div>
                  <span
                    className="inline-block rounded-full text-xs font-medium whitespace-nowrap"
                    style={{
                      padding: '2px var(--space-3)',
                      background: isLucky
                        ? 'rgba(26, 138, 92, 0.15)'
                        : isBad
                          ? 'rgba(196, 58, 58, 0.15)'
                          : 'rgba(139, 146, 168, 0.15)',
                      color: isLucky
                        ? 'var(--state-success)'
                        : isBad
                          ? 'var(--state-error)'
                          : 'var(--color-text-tertiary)',
                    }}
                  >
                    {h.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 7. 冲煞方位 ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <SectionHeading icon={<Compass size={18} />} title="冲煞方位" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 冲 */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="inline-flex items-center justify-center rounded-full font-bold"
                  style={{
                    width: 56, height: 56,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xl)',
                  }}
                >
                  冲
                </div>
                <div className="text-left">
                  <div className="font-semibold" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                    {data.chong}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    属{data.chongAnimal}者今日运势多变
                  </div>
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                <Info size={12} className="inline-block align-middle mr-1" />
                {data.ganZhi}日，与{data.chongAnimal}相冲，故冲{data.chongAnimal}
              </div>
            </div>

            {/* 煞 */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  className="inline-flex items-center justify-center rounded-full font-bold"
                  style={{
                    width: 56, height: 56,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xl)',
                  }}
                >
                  煞
                </div>
                <div className="text-left">
                  <div className="font-semibold" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                    {data.sha}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    今日煞方在{data.shaDirection}
                  </div>
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                <Info size={12} className="inline-block align-middle mr-1" />
                大事不宜{data.shaDirection}行，宜避{data.shaDirection}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. AI 个性化推荐 ==================== */}
      <section className="pb-6 md:pb-8" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.12), rgba(200, 168, 78, 0.08))',
                color: 'var(--color-primary)',
              }}
            >
              <Brain size={18} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
              }}
            >
              AI 个性化推荐
            </h2>
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.06), rgba(200, 168, 78, 0.04))',
              border: '1px solid rgba(0, 75, 170, 0.15)',
            }}
          >
            {/* AI 标识 */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))' }}
              >
                <Sparkles size={14} style={{ color: '#fff' }} />
              </div>
              <div>
                <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-body)' }}>
                  天机 AI 分析
                </span>
                <span className="text-xs ml-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  基于今日黄历为您生成
                </span>
              </div>
            </div>

            {/* 推荐条目列表 */}
            {aiRecommendations.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3"
                style={{
                  padding: 'var(--space-3) 0',
                  borderBottom: idx < aiRecommendations.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-md"
                  style={{
                    width: 32, height: 32,
                    background: 'rgba(0, 75, 170, 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <span className="font-medium text-sm" style={{ color: item.color, fontFamily: 'var(--font-body)' }}>
                    {item.title}
                  </span>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 9. 相关推荐 ==================== */}
      <section className="pb-12 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <SectionHeading icon={<LayoutGrid size={18} />} title="相关推荐" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className="block rounded-2xl p-6 transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-light)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary-lighter)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)';
                }}
              >
                <div
                  className="flex items-center justify-center mb-4"
                  style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-primary-bg)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-semibold mb-2 truncate"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                >
                  {item.name}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
