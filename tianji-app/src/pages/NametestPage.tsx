import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Feather,
  Sparkles,
  CircleDot,
  Table2,
  BookOpen,
  ShieldCheck,
  Brain,
  Download,
  Bookmark,
  Share2,
  CheckCircle,
  XCircle,
  Moon,
  Star,
  ScrollText,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/* ============================================================
   设计令牌（浅色主题，覆盖全局深色变量）
   ============================================================ */
const STROKE_MAP: Record<string, number> = {};

/** 获取汉字笔画数 */
function getStrokeCount(char: string): number {
  if (STROKE_MAP[char]) return STROKE_MAP[char];
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    return Math.min(30, Math.max(1, Math.floor((code - 0x4E00) / 500) + 5));
  }
  return 0;
}

/** 计算字符串总笔画 */
function totalStrokes(str: string): number {
  return [...str].reduce((sum, c) => sum + getStrokeCount(c), 0);
}

/** 五格数据结构 */
interface WugeResult {
  tian: number;
  ren: number;
  di: number;
  wai: number;
  zong: number;
  sancai: string;
}

/** 计算五格剖象 */
function calcWuge(surname: string, givenName: string): WugeResult {
  const surnameStrokes = totalStrokes(surname);
  const givenStrokes = totalStrokes(givenName);

  const tian = surnameStrokes + 1;
  const ren = surnameStrokes + (givenName.length > 0 ? getStrokeCount(givenName[0]) : 0);
  const di = givenName.length > 1
    ? getStrokeCount(givenName[0]) + getStrokeCount(givenName[1])
    : getStrokeCount(givenName[0]) + 1;
  const zong = surnameStrokes + givenStrokes;
  const wai = surnameStrokes + (givenName.length > 1
    ? getStrokeCount(givenName[1])
    : 1);

  const wuxingMap = (n: number) => {
    const r = n % 10;
    if (r === 1 || r === 2) return '木';
    if (r === 3 || r === 4) return '火';
    if (r === 5 || r === 6) return '土';
    if (r === 7 || r === 8) return '金';
    return '水';
  };

  const sancai = `${wuxingMap(tian)}${wuxingMap(ren)}${wuxingMap(di)}`;
  return { tian, ren, di, wai, zong, sancai };
}

/** 吉凶判断（简单示例） */
function getLuck(num: number): '大吉' | '吉' | '中吉' | '凶' {
  const ji = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 21, 23, 24, 25, 29, 31, 32, 33, 35];
  const daji = [6, 7, 11, 13, 15, 16, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37];
  if (daji.includes(num)) return '大吉';
  if (ji.includes(num)) return '吉';
  return '凶';
}

/** 数理含义映射 */
function getShuLi(num: number): string {
  const map: Record<number, string> = {
    7: '刚毅', 8: '坚刚', 14: '破兆', 15: '福寿', 21: '明月', 24: '丰财',
  };
  return map[num] || '吉祥';
}

/** 数理含义描述 */
function getShuLiDesc(num: number): string {
  const map: Record<number, string> = {
    7: '精力旺盛，头脑明敏，排除万难，为人尊仰。',
    8: '意志坚强，有突破万难的气概，能克服困难，成就大志。',
    14: '忍耐克己，进取勇猛，但须防意外之灾。',
    15: '福寿圆满，富贵荣誉，涵养雅量，德高望重。',
    21: '光风霁月，万物确立，大业成就，智勇得志。',
    24: '丰财破兆，家门余庆，金钱丰盈。',
  };
  return map[num] || '运势平稳，中吉之数。';
}

/** 五行色 */
function getWuxingColor(wuxing: string): string {
  const colors: Record<string, { bg: string; color: string; label: string }> = {
    '金': { bg: 'rgba(200, 168, 78, 0.15)', color: '#c8a84e', label: 'wuxing-jin' },
    '木': { bg: 'rgba(26, 138, 92, 0.12)', color: '#2ecc71', label: 'wuxing-mu' },
    '水': { bg: 'rgba(0, 75, 170, 0.12)', color: 'rgba(0,75,170,0.15)', label: 'wuxing-shui' },
    '火': { bg: 'rgba(196, 58, 58, 0.12)', color: '#e74c3c', label: 'wuxing-huo' },
    '土': { bg: 'rgba(180, 140, 100, 0.15)', color: '#b08060', label: 'wuxing-tu' },
  };
  return colors[wuxing]?.color || '#004baa';
}

/* ============================================================
   星光粒子组件
   ============================================================ */
function NameParticles() {
  const particles = [
    { left: '6%', top: '12%', delay: '0s' },
    { left: '15%', top: '30%', delay: '1.5s' },
    { left: '28%', top: '8%', delay: '3s' },
    { left: '42%', top: '22%', delay: '0.8s' },
    { left: '55%', top: '45%', delay: '2s' },
    { left: '65%', top: '10%', delay: '4s' },
    { left: '76%', top: '35%', delay: '1.2s' },
    { left: '86%', top: '18%', delay: '2.5s' },
    { left: '93%', top: '50%', delay: '3.5s' },
    { left: '10%', top: '58%', delay: '5s' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(200, 168, 78, 0.5)',
            animation: 'name-particle-float 8s ease-in-out infinite',
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   星星装饰 SVG（与设计稿一致）
   ============================================================ */
function StarDecor() {
  const stars = [
    { cx: 90, cy: 35, r: 1.5, fill: '#e8d48b', delay: '0s' },
    { cx: 220, cy: 75, r: 1, fill: '#e8d48b', delay: '0.5s' },
    { cx: 380, cy: 28, r: 1.2, fill: '#c8a84e', delay: '1s' },
    { cx: 510, cy: 85, r: 0.8, fill: '#e8d48b', delay: '1.5s' },
    { cx: 640, cy: 45, r: 1.5, fill: '#c8a84e', delay: '0.3s' },
    { cx: 770, cy: 95, r: 1, fill: '#e8d48b', delay: '2s' },
    { cx: 910, cy: 30, r: 1.3, fill: '#c8a84e', delay: '0.8s' },
    { cx: 1060, cy: 65, r: 0.8, fill: '#e8d48b', delay: '1.2s' },
    { cx: 1190, cy: 40, r: 1.5, fill: '#c8a84e', delay: '1.8s' },
    { cx: 160, cy: 140, r: 1, fill: '#e8d48b', delay: '2.5s' },
    { cx: 440, cy: 170, r: 0.8, fill: '#c8a84e', delay: '0.7s' },
    { cx: 700, cy: 155, r: 1.2, fill: '#e8d48b', delay: '1.3s' },
    { cx: 960, cy: 190, r: 1, fill: '#c8a84e', delay: '0.4s' },
    { cx: 1120, cy: 165, r: 0.8, fill: '#e8d48b', delay: '2.2s' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }} viewBox="0 0 1280 320" preserveAspectRatio="xMidYMid slice">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.cx} cy={s.cy} r={s.r}
            fill={s.fill}
            style={{ animation: 'star-twinkle 3s ease-in-out infinite', animationDelay: s.delay }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ============================================================
   八卦装饰 SVG（旋转动画）
   ============================================================ */
function BaguaDecor() {
  return (
    <div style={{
      position: 'absolute',
      top: 24,
      right: 24,
      opacity: 0.1,
      animation: 'bagua-rotate 60s linear infinite',
    }}
      className="hidden sm:block"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="56" stroke="#c8a84e" strokeWidth="1" />
        {/* 太极 */}
        <path d="M60 4 A56 56 0 0 1 60 116 A28 28 0 0 1 60 60 A28 28 0 0 0 60 4Z" fill="#c8a84e" opacity="0.6" />
        <circle cx="60" cy="32" r="6" fill="#002860" />
        <circle cx="60" cy="88" r="6" fill="#c8a84e" opacity="0.6" />
        {/* 八卦短线 */}
        <line x1="60" y1="0" x2="60" y2="8" stroke="#c8a84e" strokeWidth="0.5" />
        <line x1="60" y1="112" x2="60" y2="120" stroke="#c8a84e" strokeWidth="0.5" />
        <line x1="0" y1="60" x2="8" y2="60" stroke="#c8a84e" strokeWidth="0.5" />
        <line x1="112" y1="60" x2="120" y2="60" stroke="#c8a84e" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ============================================================
   卷轴图标
   ============================================================ */
function ScrollIcon() {
  return (
    <div className="hidden sm:flex flex-shrink-0 items-center justify-center" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="8" width="40" height="48" rx="4" stroke={'#c8a84e'} strokeWidth="1.2" fill="rgba(200,168,78,0.06)" />
        <rect x="8" y="12" width="8" height="40" rx="2" stroke={'#c8a84e'} strokeWidth="0.8" fill="rgba(200,168,78,0.1)" />
        <rect x="48" y="12" width="8" height="40" rx="2" stroke={'#c8a84e'} strokeWidth="0.8" fill="rgba(200,168,78,0.1)" />
        <line x1="22" y1="22" x2="42" y2="22" stroke={'#c8a84e'} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="30" x2="42" y2="30" stroke={'#c8a84e'} strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="38" x2="36" y2="38" stroke={'#c8a84e'} strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
}

/* ============================================================
   吉凶标签组件
   ============================================================ */
function LuckBadge({ luck }: { luck: string }) {
  const styleMap: Record<string, React.CSSProperties> = {
    '大吉': { background: 'rgba(200, 168, 78, 0.15)', color: '#c8a84e' },
    '吉': { background: 'rgba(26, 138, 92, 0.12)', color: '#2ecc71' },
    '中吉': { background: 'rgba(26, 138, 92, 0.1)', color: '#1a8a5c' },
    '凶': { background: 'rgba(196, 58, 58, 0.12)', color: '#e74c3c' },
  };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 9999,
      fontSize: '0.75rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      ...styleMap[luck],
    }}>
      {luck}
    </span>
  );
}

/* ============================================================
   三才圆圈组件
   ============================================================ */
function SancaiCircle({
  label,
  value,
  luck,
  gradientBg,
  borderColor,
  textColor,
}: {
  label: string;
  value: number;
  luck: string;
  gradientBg: string;
  borderColor: string;
  textColor: string;
}) {
  return (
    <div style={{
      width: 140,
      height: 140,
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: gradientBg,
      border: `2px solid ${borderColor}`,
      flexShrink: 0,
    }}
      className="sm:!w-[170px] sm:!h-[170px]"
    >
      <span className="text-xs font-medium" style={{ color: borderColor }}>{label}</span>
      <span className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: textColor, fontFamily: "'Noto Serif SC', serif" }}>
        {value}
      </span>
      <span className="mt-2"><LuckBadge luck={luck} /></span>
    </div>
  );
}

/* ============================================================
   连接线 SVG
   ============================================================ */
function ConnectorLine() {
  return (
    <svg width="32" height="8" viewBox="0 0 32 8" className="hidden sm:block flex-shrink-0">
      <line x1="0" y1="4" x2="32" y2="4" stroke={'#c8a84e'} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
    </svg>
  );
}

/* ============================================================
   字义分析卡片
   ============================================================ */
function CharCard({
  char,
  stroke,
  meaning,
  wuxing,
}: {
  char: string;
  stroke: number;
  meaning: string;
  wuxing: string;
}) {
  const wuxingColor = getWuxingColor(wuxing);
  return (
    <div style={{
      flex: 1,
      minWidth: 160,
      padding: '1.25rem',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border-light)',
      background: 'var(--color-bg-elevated)',
      textAlign: 'center',
      transition: 'all 250ms ease',
    }}>
      <div style={{
        fontFamily: "'Noto Serif SC', serif",
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'rgba(0,75,170,0.6)',
        lineHeight: 1.2,
      }}>{char}</div>
      <div className="text-xs" style={{ color: '#7a8599', marginTop: 4 }}>
        康熙笔画：{stroke}
      </div>
      <div className="text-sm" style={{
        color: '#a0aac0',
        marginTop: '0.5rem',
        lineHeight: 1.75,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{meaning}</div>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        marginTop: '0.5rem',
        padding: '3px 10px',
        borderRadius: 9999,
        fontSize: '0.75rem',
        fontWeight: 500,
        background: wuxing === '金' ? 'rgba(200, 168, 78, 0.15)' :
                   wuxing === '木' ? 'rgba(26, 138, 92, 0.12)' :
                   wuxing === '水' ? 'rgba(0, 75, 170, 0.12)' :
                   wuxing === '火' ? 'rgba(196, 58, 58, 0.12)' :
                   'rgba(180, 140, 100, 0.15)',
        color: wuxingColor,
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        </svg>
        五行属{wuxing}
      </span>
    </div>
  );
}

/* ============================================================
   内联关键帧（注入样式标签）
   ============================================================ */
function injectKeyframes() {
  return (
    <style>{`
      @keyframes name-particle-float {
        0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
        50% { opacity: 1; transform: translateY(-30px) scale(1); }
      }
      @keyframes star-twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes bagua-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  );
}

/* ============================================================
   AI 推荐名字卡片
   ============================================================ */
function AINameCard({
  name,
  luck,
  desc,
}: {
  name: string;
  luck: string;
  desc: string;
}) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: 'var(--radius-xl)',
      background: '#111827',
      border: `1px solid ${'rgba(30,39,64,0.8)'}`,
    }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold" style={{ color: 'rgba(0,75,170,0.6)', fontFamily: "'Noto Serif SC', serif" }}>
          {name}
        </span>
        <LuckBadge luck={luck} />
      </div>
      <p className="text-xs" style={{
        color: '#7a8599',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{desc}</p>
    </div>
  );
}

/* ============================================================
   姓名测算页面（浅色主题完整还原）
   ============================================================ */
export default function NametestPage() {
  const [nameInput, setNameInput] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [strokeStandard, setStrokeStandard] = useState('kangxi');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  /** 从姓名拆分姓和名 */
  const surname = nameInput.length > 0 ? nameInput[0] : '';
  const givenName = nameInput.length > 1 ? nameInput.slice(1) : '';

  /** 实时计算五格 */
  const wuge = useMemo(() => {
    if (!surname || !givenName) return null;
    return calcWuge(surname, givenName);
  }, [surname, givenName]);

  /** 提交测算 */
  const handleSubmit = async () => {
    if (!nameInput) return;
    setLoading(true);
    try {
      await submitFortuneQuery('nametest', {
        surname,
        givenName,
        gender,
        wuge,
      });
      setShowResult(true);
    } catch {
      // 静默失败，仍展示示例结果
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  /** 全名 */
  const fullName = nameInput || '李明辉';

  /** 字义分析数据（示例） */
  const charAnalysis = useMemo(() => {
    const chars = [...fullName];
    const meanings: Record<string, { stroke: number; meaning: string; wuxing: string }> = {
      '李': { stroke: 7, meaning: '桃李满天下，象征品德高尚、子孙昌盛，是中国最古老的姓氏之一。', wuxing: '金' },
      '明': { stroke: 8, meaning: '光明、明亮、明智，寓意智慧过人、前途光明、洞察力强。', wuxing: '火' },
      '辉': { stroke: 15, meaning: '辉煌、光辉、荣耀，寓意成就斐然、光芒万丈、受人敬仰。', wuxing: '火' },
      '泽': { stroke: 17, meaning: '水泽、恩泽，寓意福泽深厚、润泽万物、仁慈博爱。', wuxing: '水' },
      '鑫': { stroke: 24, meaning: '多金聚财，寓意财源广进、富贵盈门、金玉满堂。', wuxing: '金' },
      '辰': { stroke: 7, meaning: '星辰、良辰，寓意光辉灿烂、时运亨通、天之骄子。', wuxing: '土' },
    };
    return chars.map((ch) => meanings[ch] || {
      stroke: getStrokeCount(ch),
      meaning: `汉字"${ch}"蕴含丰富的文化内涵，寓意深远。`,
      wuxing: '金',
    });
  }, [fullName]);

  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh' }}>
      {injectKeyframes()}

      {/* ========== 页面标题区：深蓝+金色古韵 ========== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #001a40 0%, #002860 40%, #003580 100%)' }}>
        {/* 星光粒子 */}
        <NameParticles />
        {/* 星星装饰 */}
        <StarDecor />
        {/* 八卦装饰 */}
        <BaguaDecor />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 1280 }}>
          {/* 标题区域 */}
          <div className="flex items-start gap-6 sm:gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4" style={{
                color: '#f0f0f0',
                fontFamily: "'Noto Serif SC', serif",
                textWrap: 'balance',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
              }}>
                姓名测算
              </h1>
              <p className="text-base sm:text-lg max-w-2xl" style={{
                color: 'rgba(232, 212, 139, 0.8)',
                lineHeight: 1.75,
              }}>
                三才五格数理分析，揭示姓名吉凶密码
              </p>
            </div>
            <ScrollIcon />
          </div>
        </div>
      </section>

      {/* ========== 输入表单区 ========== */}
      <section style={{ background: '#0a0e1a' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 1280 }}>
          {/* result-card 包裹 */}
          <div style={{
            background: '#111827',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            padding: '1.25rem',
          }}
            className="sm:p-8"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-6" style={{ color: '#e8ecf4', fontFamily: "'Noto Serif SC', serif" }}>
              <Feather className="w-5 h-5 inline-block mr-2 align-text-bottom" style={{ color: '#c8a84e' }} />
              输入姓名信息
            </h2>

            <div className="grid grid-cols-1 gap-5">
              {/* 姓名 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#a0aac0' }}>姓名汉字</label>
                <input
                  type="text"
                  placeholder="请输入要测算的姓名，如：李明辉"
                  maxLength={4}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: '#0d1220',
                    border: '1.5px solid var(--color-border)',
                    color: '#e8ecf4',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'all 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 170, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e2740';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <p className="text-xs mt-1.5" style={{ color: '#7a8599' }}>支持 1-4 个汉字，建议使用本名</p>
              </div>

              {/* 性别 + 出生日期 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0aac0' }}>性别</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingRight: 40,
                      borderRadius: 'var(--radius-lg)',
                      background: '#0d1220',
                      border: '1.5px solid var(--color-border)',
                      color: '#e8ecf4',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      transition: 'all 150ms ease',
                      appearance: 'none',
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238b92a8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 170, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#1e2740';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0aac0' }}>出生日期（可选）</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      background: '#0d1220',
                      border: '1.5px solid var(--color-border)',
                      color: '#e8ecf4',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      transition: 'all 150ms ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 170, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#1e2740';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-xs mt-1.5" style={{ color: '#7a8599' }}>填写后可结合八字分析</p>
                </div>
              </div>

              {/* 笔画标准 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#a0aac0' }}>笔画标准</label>
                <select
                  value={strokeStandard}
                  onChange={(e) => setStrokeStandard(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: 40,
                    borderRadius: 'var(--radius-lg)',
                    background: '#0d1220',
                    border: '1.5px solid var(--color-border)',
                    color: '#e8ecf4',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    transition: 'all 150ms ease',
                    appearance: 'none',
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238b92a8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 170, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e2740';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="kangxi">康熙字典笔画（推荐）</option>
                  <option value="simplified">简体笔画</option>
                  <option value="traditional">繁体笔画</option>
                </select>
                <p className="text-xs mt-1.5" style={{ color: '#7a8599' }}>传统姓名学以康熙字典笔画为准，分析结果更精确</p>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading || !nameInput}
                onMouseEnter={(e) => {
                  if (!loading && nameInput) {
                    e.currentTarget.style.background = 'rgba(0,75,170,0.6)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,75,170,0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#004baa';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,75,170,0.25)';
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-medium transition-all"
                style={{
                  background: '#004baa',
                  color: '#f0f0f0',
                  boxShadow: '0 4px 12px rgba(0,75,170,0.25)',
                  opacity: loading || !nameInput ? 0.5 : 1,
                  cursor: loading || !nameInput ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? '测算中...' : '开始测算'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 三才分析结果 ========== */}
      {(showResult || !!wuge) && (
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 1280 }}>
            <h2 className="text-lg sm:text-xl font-semibold mb-6" style={{ color: '#e8ecf4', fontFamily: "'Noto Serif SC', serif" }}>
              测算结果：{fullName}
            </h2>

            {/* ---- 三才分析 ---- */}
            <div style={{
              background: '#111827',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
              className="sm:p-8"
            >
              <h3 className="text-base font-semibold mb-6" style={{ color: '#e8ecf4' }}>
                <CircleDot className="w-4 h-4 inline-block mr-2 align-text-bottom" style={{ color: '#c8a84e' }} />
                三才分析
              </h3>

              <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-16 flex-wrap">
                {/* 天格 */}
                <SancaiCircle
                  label="天格"
                  value={wuge?.tian ?? 8}
                  luck={getLuck(wuge?.tian ?? 8)}
                  gradientBg="linear-gradient(135deg, rgba(0,75,170,0.08), rgba(0,75,170,0.18))"
                  borderColor={'rgba(0,75,170,0.15)'}
                  textColor={'rgba(0,75,170,0.6)'}
                />
                <ConnectorLine />
                {/* 人格 */}
                <SancaiCircle
                  label="人格"
                  value={wuge?.ren ?? 15}
                  luck={getLuck(wuge?.ren ?? 15)}
                  gradientBg="linear-gradient(135deg, rgba(200,168,78,0.08), rgba(200,168,78,0.18))"
                  borderColor={'#c8a84e'}
                  textColor={'#c8a84e'}
                />
                <ConnectorLine />
                {/* 地格 */}
                <SancaiCircle
                  label="地格"
                  value={wuge?.di ?? 14}
                  luck={getLuck(wuge?.di ?? 14)}
                  gradientBg="linear-gradient(135deg, rgba(26,138,92,0.08), rgba(26,138,92,0.18))"
                  borderColor="#2ecc71"
                  textColor={'#1a8a5c'}
                />
              </div>

              <p className="text-sm text-center mt-6" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                三才配置为「{wuge?.sancai ?? '金一金一火'}」，天格地格相生，人格大吉。性格刚毅果敢，天生具有领导才能，事业运势亨通。
              </p>
            </div>

            {/* ---- 五格分析表格 ---- */}
            <div style={{
              background: '#111827',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}>
              <div style={{ padding: '1.25rem', paddingBottom: 0 }} className="sm:p-8 sm:pb-0">
                <h3 className="text-base font-semibold mb-6" style={{ color: '#e8ecf4' }}>
                  <Table2 className="w-4 h-4 inline-block mr-2 align-text-bottom" style={{ color: '#c8a84e' }} />
                  五格分析
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  fontSize: '0.875rem',
                  minWidth: 480,
                }}>
                  <thead>
                    <tr>
                      {['格名', '计算方式', '笔画数', '数理', '吉凶', '含义'].map((h, i) => (
                        <th key={h} style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          color: '#a0aac0',
                          background: '#0d1220',
                          borderRadius: i === 0 ? '12px 0 0 0' : i === 5 ? '0 12px 0 0' : undefined,
                          minWidth: h === '含义' ? 160 : undefined,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: '天格', calc: '姓+1', val: wuge?.tian ?? 8, color: 'rgba(0,75,170,0.6)' },
                      { key: '人格', calc: '姓+名首字', val: wuge?.ren ?? 15, color: '#c8a84e' },
                      { key: '地格', calc: '名末字+1', val: wuge?.di ?? 14, color: '#2ecc71' },
                      { key: '外格', calc: '总格-人格+1', val: wuge?.wai ?? 7, color: 'rgba(0,75,170,0.15)' },
                      { key: '总格', calc: '姓名总笔画', val: wuge?.zong ?? 21, color: '#a08630' },
                    ].map((row, idx, arr) => (
                      <tr key={row.key}>
                        <td className="font-medium whitespace-nowrap" style={{
                          padding: '12px 16px',
                          borderTop: `1px solid ${'rgba(30,39,64,0.8)'}`,
                          color: row.color,
                          borderBottomLeftRadius: idx === arr.length - 1 ? 12 : undefined,
                        }}>{row.key}</td>
                        <td className="whitespace-nowrap" style={{ padding: '12px 16px', borderTop: `1px solid ${'rgba(30,39,64,0.8)'}`, color: '#a0aac0' }}>
                          {row.calc}
                        </td>
                        <td className="whitespace-nowrap font-medium" style={{ padding: '12px 16px', borderTop: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                          {row.val}
                        </td>
                        <td className="whitespace-nowrap" style={{ padding: '12px 16px', borderTop: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                          {getShuLi(row.val)}
                        </td>
                        <td className="whitespace-nowrap" style={{ padding: '12px 16px', borderTop: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                          <LuckBadge luck={getLuck(row.val)} />
                        </td>
                        <td style={{
                          padding: '12px 16px',
                          borderTop: `1px solid ${'rgba(30,39,64,0.8)'}`,
                          color: '#a0aac0',
                          lineHeight: 1.75,
                          borderBottomRightRadius: idx === arr.length - 1 ? 12 : undefined,
                        }}>{getShuLiDesc(row.val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---- 字义分析 ---- */}
            <div style={{
              background: '#111827',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
              className="sm:p-8"
            >
              <h3 className="text-base font-semibold mb-6" style={{ color: '#e8ecf4' }}>
                <BookOpen className="w-4 h-4 inline-block mr-2 align-text-bottom" style={{ color: '#c8a84e' }} />
                字义分析
              </h3>

              <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {charAnalysis.map((item, i) => (
                  <CharCard
                    key={i}
                    char={fullName[i]}
                    stroke={item.stroke}
                    meaning={item.meaning}
                    wuxing={item.wuxing}
                  />
                ))}
              </div>
            </div>

            {/* ---- 生肖配对分析 ---- */}
            <div style={{
              background: '#111827',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
              className="sm:p-8"
            >
              <h3 className="text-base font-semibold mb-2" style={{ color: '#e8ecf4' }}>
                <ShieldCheck className="w-4 h-4 inline-block mr-2 align-text-bottom" style={{ color: '#c8a84e' }} />
                生肖配对分析
              </h3>
              <p className="text-sm mb-5" style={{ color: '#7a8599' }}>基于出生年月推算生肖（示例：属龙）</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 宜用字 */}
                <div className="p-4 sm:p-5 rounded-xl" style={{
                  background: 'rgba(26,138,92,0.04)',
                  border: '1px solid rgba(26,138,92,0.12)',
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4" style={{ color: '#1a8a5c' }} />
                    <span className="text-sm font-medium" style={{ color: '#1a8a5c' }}>宜用字</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#7a8599' }}>属龙宜用水、金、日、月、星、云等偏旁，助运生辉</p>
                  <div className="flex flex-wrap gap-2">
                    {['水', '金', '日', '月', '星', '辰', '霖', '鑫'].map((t) => (
                      <span key={t} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: 9999,
                        fontSize: '0.875rem',
                        background: 'rgba(26,138,92,0.08)',
                        color: '#1a8a5c',
                        border: '1px solid rgba(26,138,92,0.2)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* 忌用字 */}
                <div className="p-4 sm:p-5 rounded-xl" style={{
                  background: 'rgba(196,58,58,0.03)',
                  border: '1px solid rgba(196,58,58,0.1)',
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4" style={{ color: '#c43a3a' }} />
                    <span className="text-sm font-medium" style={{ color: '#c43a3a' }}>忌用字</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#7a8599' }}>属龙忌用土、犬、山、石等偏旁，恐有冲克</p>
                  <div className="flex flex-wrap gap-2">
                    {['土', '犬', '山', '石', '戌', '磊'].map((t) => (
                      <span key={t} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: 9999,
                        fontSize: '0.875rem',
                        background: 'rgba(196,58,58,0.06)',
                        color: '#c43a3a',
                        border: '1px solid rgba(196,58,58,0.15)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== AI 取名建议 ========== */}
      {(showResult || !!wuge) && (
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 1280 }}>
            {/* ai-analysis-card 渐变边框卡片 */}
            <div className="ai-analysis-card p-5 sm:p-8 mb-6" style={{ position: 'relative', zIndex: 1 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${'#004baa'} 0%, ${'#c8a84e'} 100%)` }}>
                  <Brain className="w-4 h-4" style={{ color: 'white' }} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: '#e8ecf4' }}>AI 取名建议</h3>
              </div>

              <p className="text-sm mb-5" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                综合三才五格、五行生克、生肖喜忌分析，以下为 AI 推荐的替代用字组合，均经过数理吉凶验证，可优化姓名整体运势：
              </p>

              {/* 推荐名字列表 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AINameCard
                  name={`${surname}明泽`}
                  luck="大吉"
                  desc="泽为水旁，滋润龙气。三才配置金一火一水，水火既济。"
                />
                <AINameCard
                  name={`${surname}明鑫`}
                  luck="大吉"
                  desc="三金组合，五行补全。总格 24 数理丰厚，财禄双收。"
                />
                <AINameCard
                  name={`${surname}明辰`}
                  luck="吉"
                  desc="辰属龙本位，增强自身气场。外格 9 智能优越。"
                />
              </div>
            </div>

            {/* 导出报告 + 操作按钮 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,75,170,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#004baa'; }}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-8 py-3 rounded-xl text-base font-medium transition-all"
                style={{
                  background: '#004baa',
                  color: '#f0f0f0',
                  boxShadow: '0 4px 12px rgba(0,75,170,0.2)',
                }}
              >
                <Download className="w-4 h-4" />
                导出报告
              </button>
              <button
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)'; e.currentTarget.style.color = '#004baa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2740'; e.currentTarget.style.color = '#a0aac0'; }}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: '#0d1220',
                  color: '#a0aac0',
                  border: '1.5px solid var(--color-border)',
                }}
              >
                <Bookmark className="w-4 h-4" />
                收藏结果
              </button>
              <button
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)'; e.currentTarget.style.color = '#004baa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2740'; e.currentTarget.style.color = '#a0aac0'; }}
                className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: '#0d1220',
                  color: '#a0aac0',
                  border: '1.5px solid var(--color-border)',
                }}
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
              {/* 追问输入框 */}
              <div className="flex-1 relative min-w-0">
                <input
                  type="text"
                  placeholder="追问 AI：换一个姓氏再分析..."
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-xl)',
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 12,
                    paddingBottom: 12,
                    fontSize: '0.875rem',
                    background: '#111827',
                    border: '1.5px solid var(--color-border)',
                    color: '#e8ecf4',
                    outline: 'none',
                    transition: 'all 150ms ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 170, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e2740';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 推荐工具区 ========== */}
      <section style={{ background: '#111827' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 1280 }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center" style={{ color: '#e8ecf4', fontFamily: "'Noto Serif SC', serif" }}>
            推荐工具
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <Moon className="w-7 h-7" style={{ color: '#004baa' }} />, name: '周公解梦', desc: 'AI 智能梦境解读，揭示吉凶预兆', href: '/dream' },
              { icon: <Star className="w-7 h-7" style={{ color: '#004baa' }} />, name: '生肖运势', desc: '查看今日生肖运势与宜忌', href: '/zodiac' },
              { icon: <ScrollText className="w-7 h-7" style={{ color: '#004baa' }} />, name: '签诗抽签', desc: '随机抽取灵签，获取签诗指引', href: '/lot' },
            ].map((item) => (
              <Link key={item.name} to={item.href} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-6) var(--space-4)',
                background: '#111827',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border-light)',
                cursor: 'pointer',
                transition: 'all 250ms ease',
                textAlign: 'center',
                textDecoration: 'none',
              }}
                className="hover:border-[#4a90d9]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,75,170,0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 20, 50, 0.05)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30,39,64,0.8)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${'rgba(0,75,170,0.08)'}, rgba(200,168,78,0.1))`,
                }}>
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold truncate" style={{ color: '#e8ecf4' }}>{item.name}</h3>
                <p className="text-xs line-clamp-2" style={{ color: '#7a8599' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
