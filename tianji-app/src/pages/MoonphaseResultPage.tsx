import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Moon, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 月相运势卡片组件 */
function MoonEnergyCard({ category, content, icon }: { category: string; content: string; icon: string }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{category}</span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{content}</p>
    </div>
  );
}

/** 月相占卜结果页 */
export default function MoonphaseResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>月相解读中...</p>
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
          <button onClick={() => navigate('/moonphase')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回月相
          </button>
        </div>
      </div>
    );
  }

  const details = (data.details && typeof data.details === 'object' ? data.details : {}) as Record<string, unknown>;
  const phaseName = (typeof details.moonPhase === 'string' && details.moonPhase) || '满月';
  const phaseEmoji = (typeof details.moonEmoji === 'string' && details.moonEmoji) || '🌕';
  const illumination = (typeof details.illumination === 'string' && details.illumination) || '';
  const traits = (Array.isArray(details.traits) ? details.traits : []) as string[];
  const emotionalPattern = (typeof details.emotionalPattern === 'string' && details.emotionalPattern) || '';
  const advice = (typeof details.advice === 'string' && details.advice) || '';
  const questionText = question || '月相占卜';

  const phaseData = { icon: phaseEmoji, name: phaseName, color: '#0f1f40' };
  const phaseDesc = (traits.length > 0 ? `出生月相为${phaseName}，性格特质：${traits.join('、')}。` : '') + (emotionalPattern ? ` ${emotionalPattern}` : '');

  // 能量指引由真实排盘数据构建
  const energies: { category: string; content: string; icon: string }[] = [];
  for (const t of traits.slice(0, 4)) energies.push({ category: '性格特质', content: t, icon: '✨' });
  if (advice) energies.push({ category: '月相指引', content: advice, icon: '🌙' });

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/moonphase')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>西方占卜</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>月相占卜</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 月相风格 */}
        <section className="mb-8 p-6 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.1) 0%, rgba(200,168,78,0.08) 100%)', border: '1px solid rgba(0,75,170,0.15)' }}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #0f1f40, #1a2a50)', color: 'var(--color-gold)', border: '1px solid rgba(200,168,78,0.3)' }}>
            <Moon size={16} />月相能量
          </span>
          <div className="mt-6 mb-4">
            <span style={{ fontSize: 80, lineHeight: 1 }}>{phaseData.icon}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {phaseData.name} · 月相解读{illumination ? `（${illumination}）` : ''}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            你的问题：{questionText}
          </p>
          {advice && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(200,168,78,0.15)', color: 'var(--color-gold)' }}>
            <Sparkles size={16} />
            <span className="text-sm font-medium">{advice}</span>
          </div>
          )}
        </section>

        {/* 月相解释 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>🌙</span>月相含义
          </h2>
          {phaseDesc && (
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {phaseDesc}
          </p>
          )}
          {interpretation && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-gold-light)' }}>{children}</strong>,
              }}
            >
              {interpretation}
            </ReactMarkdown>
          </div>
          )}
        </section>

        {/* 分类能量指引 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>✨</span>能量指引
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {energies.map((item, idx) => (
              <MoonEnergyCard
                key={idx}
                category={item.category}
                content={item.content}
                icon={item.icon}
              />
            ))}
          </div>
        </section>

        {/* AI 深度解读 */}
        {interpretation && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(15,31,64,0.8) 0%, rgba(30,42,80,0.8) 100%)', border: '1px solid rgba(200,168,78,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.2) 0%, transparent 70%)' }}></div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,168,78,0.2)' }}>
                  <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-gold-light)' }}>AI 深度解读</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: '#fbbf24' }}>{children}</strong>,
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
            <Moon size={18} style={{ color: 'var(--color-primary)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续询问月相指引..."
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
          <button onClick={() => navigate('/moonphase')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}