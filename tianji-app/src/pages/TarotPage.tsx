import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Loader2, ChevronRight, Send, Bookmark, Share2 } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';

/** 牌阵配置 */
interface SpreadOption {
  id: string;
  name: string;
  desc: string;
  count: number;
  positions: string[];
  recommended?: boolean;
  /** SVG 图标路径 */
  iconPath: string;
}

/** 可选牌阵列表 — 对齐设计稿 6 种牌阵 */
const SPREAD_OPTIONS: SpreadOption[] = [
  {
    id: 'single',
    name: '单张牌',
    desc: '每日指引 — 抽一张牌获得今天的灵感与方向',
    count: 1,
    positions: ['指引'],
    iconPath: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm4 5h8m-8 4h8m-4 4h0',
  },
  {
    id: 'three',
    name: '时间之流',
    desc: '过去-现在-未来，洞察事物发展的脉络与趋势',
    count: 3,
    positions: ['过去', '现在', '未来'],
    recommended: true,
    iconPath: 'M12 2v20m-5-5a3 3 0 100-6 3 3 0 000 6zm10-4a3 3 0 100-6 3 3 0 000 6zm-5 5a3 3 0 100-6 3 3 0 000 6z',
  },
  {
    id: 'four',
    name: '四元素牌阵',
    desc: '火水风土四元素全面分析，了解内在与外在的平衡',
    count: 4,
    positions: ['火', '水', '风', '土'],
    iconPath: 'M12 3l3 7h7l-5.5 4 2 7L12 17l-6.5 4 2-7L2 10h7z',
  },
  {
    id: 'celtic',
    name: '凯尔特十字',
    desc: '经典十牌阵，全方位深度解读复杂的人生课题',
    count: 10,
    positions: [
      '现状', '挑战', '根基', '过去', '目标',
      '未来', '自我', '环境', '希望', '结果',
    ],
    iconPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 10v20M2 12h20m10-10v20',
  },
  {
    id: 'relationship',
    name: '关系牌阵',
    desc: '深入分析两人关系的动态、挑战与未来发展',
    count: 7,
    positions: ['你', '对方', '关系现状', '挑战', '过去', '未来', '建议'],
    iconPath: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z',
  },
  {
    id: 'hexagram',
    name: '六芒星牌阵',
    desc: '六芒星六方位解读，探索决定命运的多个维度',
    count: 6,
    positions: ['物质', '情感', '心智', '灵性', '行动', '直觉'],
    iconPath: 'M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z',
  },
];

/** 快捷问题标签 */
const QUICK_TAGS = ['爱情', '事业', '健康', '财运'];

/** 塔罗牌占卜页面 */
export default function TarotPage() {
  const navigate = useNavigate();
  const { loading, error, query } = useFortune('tarot');

  // 表单状态
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadOption | null>(null);
  const [revealing, setRevealing] = useState(false);

  /** 选择牌阵 */
  const handleSelectSpread = (spread: SpreadOption) => {
    setSelectedSpread(spread);
    setRevealing(false);
  };

  /** 表单提交处理 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSpread) return;

    // 触发翻牌动画
    setRevealing(true);

    const animDuration = Math.min(selectedSpread.count * 200 + 800, 3000);
    setTimeout(async () => {
      const result = await query({
        question: question || undefined,
        spread: selectedSpread.id,
        count: selectedSpread.count,
      });

      if (result) {
        navigate(`/result/${result.id}`);
      }
      setRevealing(false);
    }, animDuration);
  };

  return (
    <div className="min-h-screen" style={{ color: 'var(--color-text)' }}>
      {/* ====== 页面标题区（渐变深蓝背景 + 星星装饰） ====== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        {/* SVG 星星背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full" viewBox="0 0 1280 320" preserveAspectRatio="xMidYMid slice">
            <circle cx="80" cy="40" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0s' }} />
            <circle cx="200" cy="80" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0.5s' }} />
            <circle cx="350" cy="30" r="1.2" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '1s' }} />
            <circle cx="500" cy="90" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '1.5s' }} />
            <circle cx="620" cy="50" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0.3s' }} />
            <circle cx="750" cy="100" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '2s' }} />
            <circle cx="900" cy="35" r="1.3" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0.8s' }} />
            <circle cx="1050" cy="70" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '1.2s' }} />
            <circle cx="1180" cy="45" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '1.8s' }} />
            <circle cx="150" cy="150" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '2.5s' }} />
            <circle cx="420" cy="180" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0.7s' }} />
            <circle cx="680" cy="160" r="1.2" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '1.3s' }} />
            <circle cx="950" cy="200" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '0.4s' }} />
            <circle cx="1100" cy="170" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite', animationDelay: '2.2s' }} />
          </svg>
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
            <Link to="/" className="transition-colors hover:text-white">首页</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="transition-colors hover:text-white" style={{ cursor: 'pointer' }}>西方占卜</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ color: 'var(--color-gold-light)' }}>塔罗牌占卜</span>
          </nav>

          {/* 居中标题 */}
          <div className="text-center">
            {/* 金色标签 */}
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
                <path d="M8 1l2.1 4.3 4.9.7-3.5 3.4.8 4.6L8 11.8 3.7 14l.8-4.6L1 6l4.9-.7z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>神秘占卜</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{
                color: 'var(--color-text-inverse)',
                fontFamily: 'var(--font-display)',
                textWrap: 'balance',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              塔罗牌占卜
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              78 张塔罗牌的古老智慧，AI 帮你解读命运的启示
            </p>
          </div>
        </div>
      </section>

      {/* ====== 牌阵选择区 ====== */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择牌阵
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>根据你的问题深度，选择合适的牌阵</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPREAD_OPTIONS.map((spread) => {
              const isActive = selectedSpread?.id === spread.id;
              return (
                <button
                  key={spread.id}
                  type="button"
                  onClick={() => handleSelectSpread(spread)}
                  className="relative text-left rounded-xl p-6 transition-all cursor-pointer"
                  style={{
                    border: isActive ? '2px solid var(--color-gold)' : '2px solid var(--color-border)',
                    background: 'var(--color-bg-elevated)',
                    boxShadow: isActive ? '0 0 0 1px var(--color-gold), 0 8px 24px rgba(200, 168, 78, 0.15)' : 'none',
                  }}
                >
                  {/* 推荐标签 */}
                  {spread.recommended && (
                    <span
                      className="absolute top-0 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-b-sm"
                      style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: 'var(--color-text-inverse)' }}
                    >
                      推荐
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: isActive ? 'rgba(200, 168, 78, 0.1)' : 'var(--color-primary-bg-strong)',
                        color: isActive ? 'var(--color-gold)' : 'var(--color-primary)',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={spread.iconPath} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{spread.name}</h3>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-tertiary)' }}>{spread.desc}</p>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                        style={{
                          background: isActive ? 'rgba(200, 168, 78, 0.1)' : 'var(--color-primary-bg-strong)',
                          color: isActive ? 'var(--color-gold-dark)' : 'var(--color-primary)',
                        }}
                      >
                        {spread.count} 张牌
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== 问题输入区 ====== */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              心中默念你的问题
            </h2>
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}
            >
              <form onSubmit={handleSubmit}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="我的感情发展会怎样？"
                  className="w-full resize-none rounded-xl p-4 text-base outline-none transition-colors"
                  style={{
                    background: 'var(--color-bg-inset)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                />
                {/* 快捷问题标签 */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>快捷问题：</span>
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuestion(tag)}
                      className="quick-tag"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* 错误提示 */}
                {error && (
                  <div
                    className="rounded-lg px-4 py-3 text-sm mt-4"
                    style={{ backgroundColor: 'rgba(196, 58, 58, 0.1)', color: 'var(--color-error)' }}
                  >
                    {error}
                  </div>
                )}

                {/* 提交按钮 */}
                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    disabled={loading || !selectedSpread || revealing}
                    className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading || revealing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        解读中...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        开始占卜
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
