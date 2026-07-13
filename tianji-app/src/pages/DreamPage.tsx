import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Loader2,
  X,
  Brain,
  Send,
  Bookmark,
  Share2,
  ScrollText,
  PenTool,
  Star,
} from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';

/** 热门梦境关键词 */
const HOT_KEYWORDS = [
  '蛇', '水', '飞行', '掉落', '牙齿', '考试', '迟到', '迷路',
  '房子', '火', '死亡', '怀孕', '雨', '猫', '狗', '龙',
];

/** 情绪选项 */
const EMOTION_OPTIONS = ['噩梦', '惊恐', '平静', '困惑', '喜悦'];

/** 输入模式 Tab */
type InputMode = 'free' | 'keyword' | 'emotion';

/** 星星闪烁动画 keyframes（注入到 style 标签） */
const starTwinkleStyle = `
@keyframes dream-star-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes dream-moon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes dream-particle-float {
  0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
  50% { opacity: 1; transform: translateY(-30px) scale(1); }
}
`;

/** 推荐工具数据 */
const RECOMMEND_TOOLS = [
  { icon: ScrollText, label: '签诗抽签', desc: '随机抽取灵签，获取签诗指引', path: '/drawlot' },
  { icon: PenTool, label: '姓名测算', desc: '解析姓名笔画五行与命理', path: '/nametest' },
  { icon: Star, label: '生肖运势', desc: '查看今日生肖运势与宜忌', path: '/shengxiao' },
];

/** 星星粒子位置数据 */
const PARTICLES = [
  { left: '8%', top: '15%', delay: '0s' },
  { left: '18%', top: '35%', delay: '1.5s' },
  { left: '30%', top: '10%', delay: '3s' },
  { left: '45%', top: '25%', delay: '0.8s' },
  { left: '55%', top: '50%', delay: '2s' },
  { left: '68%', top: '12%', delay: '4s' },
  { left: '78%', top: '40%', delay: '1.2s' },
  { left: '88%', top: '20%', delay: '2.5s' },
  { left: '92%', top: '55%', delay: '3.5s' },
  { left: '12%', top: '60%', delay: '5s' },
];

/** SVG 星星位置数据 */
const STARS = [
  { cx: 80, cy: 40, r: 1.5, fill: '#d0c0e8', delay: '0s' },
  { cx: 200, cy: 80, r: 1, fill: '#d0c0e8', delay: '0.5s' },
  { cx: 350, cy: 30, r: 1.2, fill: '#e0d0f0', delay: '1s' },
  { cx: 500, cy: 90, r: 0.8, fill: '#c8b8d8', delay: '1.5s' },
  { cx: 620, cy: 50, r: 1.5, fill: '#e0d0f0', delay: '0.3s' },
  { cx: 750, cy: 100, r: 1, fill: '#d0c0e8', delay: '2s' },
  { cx: 900, cy: 35, r: 1.3, fill: '#e8e0f0', delay: '0.8s' },
  { cx: 1050, cy: 70, r: 0.8, fill: '#c8b8d8', delay: '1.2s' },
  { cx: 1180, cy: 45, r: 1.5, fill: '#d0c0e8', delay: '1.8s' },
  { cx: 150, cy: 150, r: 1, fill: '#e0d0f0', delay: '2.5s' },
  { cx: 420, cy: 180, r: 0.8, fill: '#c8b8d8', delay: '0.7s' },
  { cx: 680, cy: 160, r: 1.2, fill: '#d0c0e8', delay: '1.3s' },
  { cx: 950, cy: 200, r: 1, fill: '#e8e0f0', delay: '0.4s' },
  { cx: 1100, cy: 170, r: 0.8, fill: '#c8b8d8', delay: '2.2s' },
];

/** 周公解梦页面 */
export default function DreamPage() {
  const navigate = useNavigate();
  const { loading, error, query } = useFortune('dream');

  // 表单状态
  const [dreamText, setDreamText] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('free');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // 追问输入框
  const [followUpText, setFollowUpText] = useState('');

  // 收藏状态
  const [isBookmarked, setIsBookmarked] = useState(false);

  /** 切换关键词选择状态 */
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  /** 将关键词追加到梦境描述文本 */
  const addKeywordToText = (keyword: string) => {
    if (dreamText.includes(keyword)) return;
    setDreamText((prev) => (prev ? `${prev}，${keyword}` : keyword));
  };

  /** 清除所有已选关键词 */
  const clearKeywords = () => {
    setSelectedKeywords([]);
  };

  /** 移除单个已选关键词 */
  const removeKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  /** 表单提交处理 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dreamText.trim() && selectedKeywords.length === 0) return;

    const result = await query({
      description: dreamText,
      keywords: selectedKeywords,
    });

    if (result) {
      navigate(`/result/dream/${result.id}`);
    }
  };

  // 是否可提交
  const canSubmit = dreamText.trim().length > 0 || selectedKeywords.length > 0;

  /** 浅色主题色值（覆盖全局深色主题） */
  const lightBg = '#0a0e1a';
  const lightBgElevated = '#111827';
  const lightBgInset = '#0d1220';
  const lightText = '#e8ecf4';
  const lightTextSecondary = '#a0aac0';
  const lightTextTertiary = '#6b7590';
  const lightBorder = '#1e2740';
  const lightBorderLight = '#161e35';
  const primaryBg = 'rgba(0, 75, 170, 0.06)';
  const primaryBgStrong = 'rgba(0, 75, 170, 0.12)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';
  const primaryLighter = 'var(--color-primary-lighter)';
  const successColor = '#1a8a5c';

  return (
    <>
      {/* 注入梦幻动画样式 */}
      <style dangerouslySetInnerHTML={{ __html: starTwinkleStyle }} />

      <div className="min-h-screen" style={{ color: lightText }}>
        {/* ====== 页面标题区：深蓝+淡紫+月光银 ====== */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0e2e 0%, #1a1640 50%, #1e1a3a 100%)' }}>
          {/* 星空粒子背景 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {PARTICLES.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: p.left,
                  top: p.top,
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'rgba(180, 160, 220, 0.6)',
                  animation: `dream-particle-float 8s ease-in-out infinite`,
                  animationDelay: p.delay,
                }}
              />
            ))}
          </div>

          {/* 星星装饰 SVG */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute w-full h-full" viewBox="0 0 1280 360" preserveAspectRatio="xMidYMid slice">
              {STARS.map((s, i) => (
                <circle
                  key={i}
                  cx={s.cx}
                  cy={s.cy}
                  r={s.r}
                  fill={s.fill}
                  style={{
                    animation: 'dream-star-twinkle 3s ease-in-out infinite',
                    animationDelay: s.delay,
                  }}
                />
              ))}
            </svg>
          </div>

          {/* 月亮装饰 */}
          <div
            className="absolute top-8 right-8 sm:top-12 sm:right-16 lg:right-24 opacity-60"
            style={{ animation: 'dream-moon-float 6s ease-in-out infinite' }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e8e0f0 0%, #c8b8d8 100%)',
                boxShadow: '0 0 40px rgba(180, 160, 220, 0.4), 0 0 80px rgba(150, 130, 200, 0.2), inset -12px -6px 20px rgba(100, 80, 140, 0.25)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', width: 22, height: 22, borderRadius: '50%', background: 'rgba(160, 140, 200, 0.2)', top: 18, left: 14 }} />
              <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'rgba(160, 140, 200, 0.15)', bottom: 20, right: 16 }} />
            </div>
          </div>

          <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 'var(--max-width)' }}>
            {/* 标题行 */}
            <div className="flex items-start gap-6 sm:gap-8">
              <div className="flex-1 min-w-0">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
                  style={{
                    color: '#f0eaff',
                    fontFamily: "'Noto Serif SC', serif",
                    textWrap: 'balance',
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word',
                  }}
                >
                  周公解梦
                </h1>
                <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'rgba(208, 192, 232, 0.8)', lineHeight: 'var(--leading-relaxed)' }}>
                  AI 智能梦境解读，揭示你潜意识中的吉凶预兆
                </p>
              </div>
              {/* 月亮小图标 */}
              <div
                className="hidden sm:block flex-shrink-0"
                style={{ animation: 'dream-moon-float 6s ease-in-out infinite' }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ddd4ec 0%, #bfb0d0 100%)',
                    boxShadow: '0 0 24px rgba(180, 160, 220, 0.35), 0 0 48px rgba(150, 130, 200, 0.15), inset -8px -4px 12px rgba(100, 80, 140, 0.2)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ====== 梦境描述输入区 ====== */}
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 'var(--max-width)' }}>
            <div
              style={{
                background: '#111827',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
              }}
            >
              <div className="p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* 输入模式 Tab */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {([
                      { mode: 'free' as InputMode, label: '自由描述' },
                      { mode: 'keyword' as InputMode, label: '关键词输入' },
                      { mode: 'emotion' as InputMode, label: '情绪标签' },
                    ]).map(({ mode, label }) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setInputMode(mode)}
                        className="transition-all whitespace-nowrap"
                        style={{
                          padding: '8px 16px',
                          fontSize: 'var(--text-sm)',
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          border: inputMode === mode ? '1px solid var(--color-primary)' : '1px solid transparent',
                          background: inputMode === mode ? 'var(--color-primary)' : 'transparent',
                          color: inputMode === mode ? 'var(--color-text-inverse)' : lightTextSecondary,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* 主输入框（自由描述模式） */}
                  {inputMode === 'free' && (
                    <textarea
                      value={dreamText}
                      onChange={(e) => setDreamText(e.target.value)}
                      rows={5}
                      className="w-full rounded-xl p-4 sm:p-5 text-base resize-none outline-none transition-shadow"
                      style={{
                        background: '#0d1220',
                        border: '1.5px solid var(--color-border)',
                        color: lightText,
                        lineHeight: 'var(--leading-relaxed)',
                        fontFamily: 'var(--font-body)',
                      }}
                      placeholder="描述你的梦境，越详细越好。例如：梦见自己在一座很高的桥上，下面是平静的河水..."
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,75,170,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = lightBorder;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  )}

                  {/* 关键词输入区域 */}
                  {inputMode === 'keyword' && (
                    <>
                      {/* 自由描述输入框仍然保留在上方（始终可见） */}
                      <textarea
                        value={dreamText}
                        onChange={(e) => setDreamText(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl p-4 sm:p-5 text-base resize-none outline-none transition-shadow"
                        style={{
                          background: '#0d1220',
                          border: '1.5px solid var(--color-border)',
                          color: lightText,
                          lineHeight: 'var(--leading-relaxed)',
                          fontFamily: 'var(--font-body)',
                        }}
                        placeholder="描述你的梦境，越详细越好。例如：梦见自己在一座很高的桥上，下面是平静的河水..."
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,75,170,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = lightBorder;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <div className="p-4 rounded-xl" style={{ background: '#0d1220', border: '1.5px dashed var(--color-border-light)' }}>
                        <p className="text-sm mb-3" style={{ color: lightTextTertiary }}>输入关键词后按回车添加：</p>
                        <div className="flex flex-wrap gap-2">
                          {/* 已选关键词 */}
                          {selectedKeywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="inline-flex items-center gap-1"
                              style={{
                                padding: '6px 16px',
                                fontSize: 'var(--text-sm)',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--color-primary-lighter)',
                                background: primaryBg,
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {keyword}
                              <button type="button" onClick={() => removeKeyword(keyword)} className="ml-1">
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 情绪标签区域 */}
                  {inputMode === 'emotion' && (
                    <>
                      <textarea
                        value={dreamText}
                        onChange={(e) => setDreamText(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl p-4 sm:p-5 text-base resize-none outline-none transition-shadow"
                        style={{
                          background: '#0d1220',
                          border: '1.5px solid var(--color-border)',
                          color: lightText,
                          lineHeight: 'var(--leading-relaxed)',
                          fontFamily: 'var(--font-body)',
                        }}
                        placeholder="描述你的梦境，越详细越好。例如：梦见自己在一座很高的桥上，下面是平静的河水..."
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,75,170,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = lightBorder;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <div>
                        <p className="text-sm mb-3" style={{ color: lightTextTertiary }}>选择你醒来后的主要情绪：</p>
                        <div className="flex flex-wrap gap-2">
                          {EMOTION_OPTIONS.map((emotion) => {
                            const isSelected = selectedEmotion === emotion;
                            return (
                              <button
                                key={emotion}
                                type="button"
                                onClick={() => setSelectedEmotion(isSelected ? null : emotion)}
                                className="transition-all whitespace-nowrap"
                                style={{
                                  padding: '6px 14px',
                                  fontSize: 'var(--text-sm)',
                                  borderRadius: 'var(--radius-full)',
                                  border: isSelected ? '1px solid #9575cd' : '1px solid var(--color-border)',
                                  background: isSelected ? 'rgba(149, 117, 205, 0.12)' : '#111827',
                                  color: isSelected ? '#673ab7' : lightTextSecondary,
                                  cursor: 'pointer',
                                }}
                              >
                                {emotion}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 错误提示 */}
                  {error && (
                    <div
                      className="rounded-lg px-4 py-3 text-sm"
                      style={{ backgroundColor: 'rgba(196, 58, 58, 0.1)', color: 'var(--state-error)' }}
                    >
                      {error}
                    </div>
                  )}

                  {/* 提交按钮 */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !canSubmit}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        background: 'var(--color-primary)',
                        color: 'var(--color-text-inverse)',
                        boxShadow: '0 4px 12px rgba(0,75,170,0.25)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary-light)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,75,170,0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,75,170,0.25)';
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          解梦中...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          解梦
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ====== 常见梦境标签云 ====== */}
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" style={{ maxWidth: 'var(--max-width)' }}>
            <h2
              className="text-lg sm:text-xl font-semibold mb-5"
              style={{ fontFamily: "'Noto Serif SC', serif", color: lightText }}
            >
              常见梦境
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {HOT_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => {
                    setInputMode('free');
                    addKeywordToText(keyword);
                  }}
                  className="transition-all whitespace-nowrap"
                  style={{
                    padding: '6px 16px',
                    fontSize: 'var(--text-sm)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: '#111827',
                    color: lightTextSecondary,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                    e.currentTarget.style.background = primaryBg;
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = lightBorder;
                    e.currentTarget.style.background = '#111827';
                    e.currentTarget.style.color = lightTextSecondary;
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ====== 解梦结果展示（Mockup 静态演示） ====== */}
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 'var(--max-width)' }}>
            {/* 结果卡片 */}
            <div
              style={{
                background: '#111827',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6, 1.5rem)',
              }}
            >
              {/* 卡片头部：标题 + 吉凶徽章 */}
              <div className="flex items-center gap-4 sm:gap-5 p-5 sm:p-8 pb-0 sm:pb-0">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #1a8a5c 0%, #2ecc71 100%)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(26, 138, 92, 0.3)',
                  }}
                >
                  中吉
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-xl sm:text-2xl font-semibold truncate"
                    style={{ fontFamily: "'Noto Serif SC', serif", color: lightText }}
                  >
                    梦境分析：蛇
                  </h2>
                  <p className="text-sm mt-1 truncate" style={{ color: lightTextTertiary }}>
                    基于《周公解梦》与 AI 心理学分析
                  </p>
                </div>
              </div>

              {/* 各元素解读表格 */}
              <div className="p-5 sm:p-8">
                <h3 className="text-base font-semibold mb-4" style={{ color: lightText }}>元素解读</h3>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
                  <table className="w-full text-sm" style={{ minWidth: 320 }}>
                    <thead>
                      <tr style={{ background: '#0d1220' }}>
                        <th className="text-left px-4 py-3 font-medium whitespace-nowrap" style={{ color: lightTextSecondary }}>元素</th>
                        <th className="text-left px-4 py-3 font-medium whitespace-nowrap" style={{ color: lightTextSecondary }}>象征</th>
                        <th className="text-left px-4 py-3 font-medium whitespace-nowrap" style={{ color: lightTextSecondary }}>吉凶</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderTop: '1px solid var(--color-border-light)' }}>
                        <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: lightText }}>蛇</td>
                        <td className="px-4 py-3" style={{ color: lightTextSecondary }}>变化、智慧</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(26,138,92,0.1)', color: successColor }}
                          >
                            中吉
                          </span>
                        </td>
                      </tr>
                      <tr style={{ borderTop: '1px solid var(--color-border-light)' }}>
                        <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: lightText }}>水</td>
                        <td className="px-4 py-3" style={{ color: lightTextSecondary }}>财富、情感</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(26,138,92,0.12)', color: successColor }}
                          >
                            吉
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 心理暗示 */}
              <div className="px-5 sm:px-8 pb-5 sm:pb-8">
                <h3 className="text-base font-semibold mb-3" style={{ color: lightText }}>心理暗示</h3>
                <p className="text-sm leading-relaxed" style={{ color: lightTextSecondary }}>
                  梦见蛇通常象征着潜意识中的变革力量。蛇的蜕皮过程代表着新生与转变，暗示你正面临人生中的重要转折点。水中出现的蛇更加积极的意象，水象征着情感的流动，两者结合预示着情感层面的成熟与智慧的增长。
                </p>
              </div>

              {/* 化解建议 */}
              <div className="px-5 sm:px-8 pb-5 sm:pb-8">
                <h3 className="text-base font-semibold mb-3" style={{ color: lightText }}>化解建议</h3>
                <p className="text-sm leading-relaxed" style={{ color: lightTextSecondary }}>
                  近期可多关注自身直觉，在重要决策前静心思考。建议佩戴翡翠或绿松石饰品以增强气场，保持规律作息，适当进行冥想或瑜伽来平衡身心能量。
                </p>
              </div>
            </div>

            {/* AI 深度分析区：渐变边框卡片 */}
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.03) 0%, rgba(149, 117, 205, 0.05) 100%)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                marginBottom: 'var(--space-6, 1.5rem)',
                padding: 'var(--space-5, 1.25rem)',
              }}
              className="sm:p-8"
            >
              {/* 渐变边框伪元素用内部 div 模拟 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'var(--radius-xl)',
                  padding: 1,
                  background: 'linear-gradient(135deg, var(--color-primary-lighter), #9575cd)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                }}
              />
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #7e57c2 100%)' }}
                >
                  <Brain size={16} style={{ color: 'white' }} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: lightText }}>AI 深度分析</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: lightTextSecondary }}>
                综合梦境解析心理学（Dreamwork Theory）与荣格原型分析，此梦境中的蛇与水的意象组合具有深层意义。在荣格心理学中，蛇是"阴影"（Shadow）的典型象征，代表被压抑的潜意识内容。而水则是集体无意识最常见的容器符号。
              </p>
              <p className="text-sm leading-relaxed mt-3" style={{ color: lightTextSecondary }}>
                从情感图式（Emotional Schema）的角度分析，"蛇在水中"的平静场景暗示你当前对人生变革的态度是接纳的、而非抗拒的。这与你的情绪标签"平静"高度吻合。建议在接下来的两周内关注新旧交替的机遇，避免因过度谨慎而错失良机。
              </p>
            </div>

            {/* 追问 + 收藏 + 分享 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none transition-shadow"
                  style={{
                    background: '#111827',
                    border: '1.5px solid var(--color-border)',
                    color: lightText,
                  }}
                  placeholder="追问 AI：继续深入解析..."
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,75,170,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = lightBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* 追问按钮 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    boxShadow: '0 2px 8px rgba(0,75,170,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                  }}
                >
                  <Send size={16} />
                  追问
                </button>
                {/* 收藏按钮 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: '#0d1220',
                    color: isBookmarked ? 'var(--color-primary)' : lightTextSecondary,
                    border: '1.5px solid var(--color-border)',
                  }}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isBookmarked) {
                      e.currentTarget.style.borderColor = lightBorder;
                      e.currentTarget.style.color = lightTextSecondary;
                    }
                  }}
                >
                  <Bookmark size={16} />
                  收藏
                </button>
                {/* 分享按钮 */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: '#0d1220',
                    color: lightTextSecondary,
                    border: '1.5px solid var(--color-border)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = lightBorder;
                    e.currentTarget.style.color = lightTextSecondary;
                  }}
                >
                  <Share2 size={16} />
                  分享
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ====== 底部推荐工具 ====== */}
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: 'var(--max-width)' }}>
            <h2
              className="text-lg sm:text-xl font-semibold mb-6 text-center"
              style={{ fontFamily: "'Noto Serif SC', serif", color: lightText }}
            >
              推荐工具
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {RECOMMEND_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="flex flex-col items-center gap-3 p-6 sm:p-6 transition-all text-center"
                    style={{
                      background: '#111827',
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--color-border-light)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-light)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${primaryBgStrong}, rgba(149,117,205,0.1))` }}
                    >
                      <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 className="text-base font-semibold truncate" style={{ color: lightText }}>
                      {tool.label}
                    </h3>
                    <p className="text-xs line-clamp-2" style={{ color: lightTextTertiary }}>
                      {tool.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
