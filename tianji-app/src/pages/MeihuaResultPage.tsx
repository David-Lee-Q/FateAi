import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Flower2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 卦象卡片组件 */
function GuaCard({ name, meaning, type }: { name: string; meaning: string; type: '上卦' | '下卦' | '变卦' }) {
  const colors = type === '上卦' ? { bg: 'rgba(0,75,170,0.1)', border: 'rgba(0,75,170,0.2)', text: 'var(--color-primary)' }
    : type === '下卦' ? { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: '#10b981' }
    : { bg: 'rgba(200,168,78,0.1)', border: 'rgba(200,168,78,0.2)', text: 'var(--color-gold)' };

  return (
    <div className="p-4 rounded-lg text-center" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <span className="text-xs block mb-2" style={{ color: colors.text }}>{type}</span>
      <span className="text-2xl font-bold block mb-1" style={{ fontFamily: "'Noto Serif SC', serif", color: 'var(--color-text)' }}>{name}</span>
      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{meaning}</span>
    </div>
  );
}

/** 梅花易数结果页 */
export default function MeihuaResultPage() {
  const navigate = useNavigate();
  const { result, details, interpretation, question, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>梅花起卦中...</p>
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
          <button onClick={() => navigate('/meihua')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回梅花
          </button>
        </div>
      </div>
    );
  }

  // 解析卦象数据（真实排盘）
  const gua = (key: string) => {
    const g = details[key] && typeof details[key] === 'object' ? details[key] as { name?: string; symbol?: string } : {};
    return { name: g.name || '', symbol: g.symbol || '' };
  };
  const upperGua = gua('upperGua');
  const lowerGua = gua('lowerGua');
  const mainGua = gua('mainGua');
  const huGua = gua('huGua');
  const guaName = mainGua.name || '卦象';
  const questionText = question || '梅花易数占卜';
  const method = typeof details.method === 'string' ? details.method : '';
  const tiYong = (details.tiYong && typeof details.tiYong === 'object')
    ? (details.tiYong as { ti?: string; yong?: string })
    : {};

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/meihua')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>梅花易数</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 梅花风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(0,75,170,0.06) 100%)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff' }}>
              <Flower2 size={16} />梅花易数
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {guaName}
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{questionText} · {method || '起卦法'}
          </p>
        </section>

        {/* 卦象展示 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>🌸</span>本卦卦象
          </h2>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <GuaCard name={upperGua.name || '上卦'} meaning={upperGua.symbol || '上卦卦象'} type="上卦" />
            <div className="flex items-center justify-center">
              <span className="text-4xl" style={{ color: 'var(--color-gold)' }}>＋</span>
            </div>
            <GuaCard name={lowerGua.name || '下卦'} meaning={lowerGua.symbol || '下卦卦象'} type="下卦" />
          </div>
          {(huGua.name || tiYong.ti) && (
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>互卦与体用</h3>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <GuaCard name={huGua.name || '互卦'} meaning={huGua.symbol || ''} type="变卦" />
                <div className="flex items-center justify-center flex-col gap-1">
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>体用</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{tiYong.ti || '—'}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>vs</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{tiYong.yong || '—'}</span>
                </div>
                <GuaCard name={mainGua.name || '本卦'} meaning={mainGua.symbol || ''} type="下卦" />
              </div>
            </div>
          )}
        </section>

        {/* 卦义解读 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>📖</span>卦义解读
          </h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: '#6ee7b7' }}>{children}</strong>,
              }}
            >
              {interpretation || '卦象已排定，可尝试追问获取更详细解读。'}
            </ReactMarkdown>
          </div>
        </section>

        {/* AI 深度解读 */}
        {interpretation && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(0,75,170,0.04))', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                  <Sparkles size={16} style={{ color: '#fff' }} />
                </div>
                <h2 className="text-lg font-bold">AI 深度解读</h2>
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
            <Flower2 size={18} style={{ color: '#10b981' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续询问梅花卦象..."
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
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors" style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/meihua')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}