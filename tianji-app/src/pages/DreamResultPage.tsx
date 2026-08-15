import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Brain, Sparkles, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 梦境元素解读卡片组件 */
function DreamElementCard({ element, meaning, luck }: { element: string; meaning: string; luck: '吉' | '凶' | '中吉' | '中凶' }) {
  const luckColors: Record<string, { bg: string; text: string }> = {
    '吉': { bg: 'rgba(26,138,92,0.1)', text: '#1a8a5c' },
    '中吉': { bg: 'rgba(26,138,92,0.12)', text: '#1a8a5c' },
    '凶': { bg: 'rgba(196,58,58,0.1)', text: '#c43a3a' },
    '中凶': { bg: 'rgba(196,58,58,0.12)', text: '#c43a3a' },
  };
  const colors = luckColors[luck] || luckColors['中吉'];

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(149,117,205,0.15)' }}>
        🌙
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{element}</span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: colors.bg, color: colors.text }}
          >
            {luck}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{meaning}</p>
      </div>
    </div>
  );
}

/** 周公解梦结果页 */
export default function DreamResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>解梦中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={retry} className="mr-2 px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            重试
          </button>
          <button onClick={() => navigate('/dream')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回解梦
          </button>
        </div>
      </div>
    );
  }

  // 解析结果内容
  const dreamContent = (typeof data.overallInterpretation === 'string' && data.overallInterpretation) || interpretation || '';
  const dreamTitle = (Array.isArray(data.keywords) ? (data.keywords as string[]).join('、') : '') || '梦境解读';
  const dreamElements = (Array.isArray(data.entries) ? data.entries : []) as { keyword?: string; symbol?: string; fortune?: string; interpretation?: string }[];
  const luckLevel = dreamElements.find((e) => e.fortune)?.fortune || '';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/dream')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>民俗趣味</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>周公解梦</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 梦幻风格 */}
        <section className="mb-8 p-6 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(149,117,205,0.1) 0%, rgba(0,75,170,0.1) 100%)', border: '1px solid rgba(149,117,205,0.2)' }}>
          <div className="absolute top-4 right-4 text-6xl opacity-20">🌙</div>
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #9575cd)', color: '#fff' }}>
                <Moon size={14} />周公解梦
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                梦境解析：{dreamTitle}
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                基于《周公解梦》与 AI 心理学分析
              </p>
            </div>
            {luckLevel && (
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #1a8a5c 0%, #2ecc71 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(26,138,92,0.3)' }}>
                {luckLevel}
              </div>
            </div>
            )}
          </div>
        </section>

        {/* 梦境元素解读 */}
        {dreamElements.length > 0 && (
          <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <span>✨</span>元素解读
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {dreamElements.slice(0, 6).map((item, idx: number) => (
                <DreamElementCard
                  key={idx}
                  element={item.keyword || '梦境元素'}
                  meaning={item.interpretation || '象征变化与智慧'}
                  luck={(item.fortune === '吉' || item.fortune === '凶' || item.fortune === '中吉' || item.fortune === '中凶' ? item.fortune : '中吉') as '吉' | '凶' | '中吉' | '中凶'}
                />
              ))}
            </div>
          </section>
        )}

        {/* 心理暗示 */}
        {dreamContent && (
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>🧠</span>心理暗示
          </h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-primary-lighter)' }}>{children}</strong>,
              }}
            >
              {dreamContent}
            </ReactMarkdown>
          </div>
        </section>
        )}

        {/* AI 深度分析 */}
        {interpretation && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.03) 0%, rgba(149,117,205,0.05) 100%)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ padding: 1, background: 'linear-gradient(135deg, var(--color-primary-lighter), #9575cd)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', borderRadius: 'var(--radius-xl)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #7e57c2 100%)' }}>
                  <Brain size={16} style={{ color: '#fff' }} />
                </div>
                <h2 className="text-lg font-bold">AI 深度分析</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: '#6ee7b7' }}>{children}</strong>,
                  }}
                >
                  {interpretation}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Sparkles size={18} style={{ color: 'var(--color-gold)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续深入解析梦境..."
              />
            </div>
            <button className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
              <Send size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* 底部工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors"
            style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/dream')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}