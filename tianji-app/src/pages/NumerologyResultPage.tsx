import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Hash, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

/** 数字能量解读卡片 */
function NumberCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: 'var(--color-gold)' }}>{number}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{title}</span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
    </div>
  );
}

/** 数字能量结果页 */
export default function NumerologyResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadResult = async () => {
      setLoading(true);
      try {
        const data = await fetchFortuneResult(id);
        setResult(data.data || data);
      } catch (err) {
        setError('获取结果失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>数字分析中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={() => navigate('/numerology')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回数字能量
          </button>
        </div>
      </div>
    );
  }

  const mainNumber = result.number || result.mainNumber || result.lifePath || '1';
  const analysisType = result.type || result.analysisType || '生命灵数';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/numerology')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>西方占卜</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>数字能量</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 数字能量风格 */}
        <section className="mb-8 p-6 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.08) 0%, rgba(200,168,78,0.06) 100%)', border: '1px solid rgba(0,75,170,0.15)' }}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))', color: '#fff' }}>
            <Hash size={16} />数字能量
          </span>
          <div className="my-6">
            <span className="text-7xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif", color: 'var(--color-gold)', textShadow: '0 0 40px rgba(200,168,78,0.3)' }}>{mainNumber}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {result.numberMeaning || result.title || `生命灵数 ${mainNumber}`}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            分析类型：{analysisType}
          </p>
        </section>

        {/* 核心数字解读 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>🔢</span>核心数字解读
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <NumberCard number={mainNumber} title={result.numberTitle || '生命灵数'} description={result.numberDesc || '代表你的人生旅程和核心使命'} />
            <NumberCard number={result.destiny || '9'} title={result.destinyTitle || '命运数字'} description={result.destinyDesc || '预示你的人生目标和最终归宿'} />
          </div>
        </section>

        {/* 性格特质 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>✨</span>性格特质
          </h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-primary-lighter)' }}>{children}</strong>,
              }}
            >
              {result.content || result.personality || result.interpretation || ''}
            </ReactMarkdown>
          </div>
        </section>

        {/* 爱情/事业分析 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold mb-4">详细分析</h2>
          <div className="space-y-4">
            {result.love && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#ec4899' }}>💕 爱情运势</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{result.love}</p>
              </div>
            )}
            {result.career && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(0,75,170,0.08)', border: '1px solid rgba(0,75,170,0.2)' }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-primary)' }}>💼 事业方向</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{result.career}</p>
              </div>
            )}
          </div>
        </section>

        {/* AI 深度解读 */}
        {result.aiAnalysis && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.06), rgba(200,168,78,0.04))', border: '1px solid rgba(0,75,170,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))' }}>
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
                    strong: ({ children }) => <strong style={{ color: 'var(--color-gold-light)' }}>{children}</strong>,
                  }}
                >
                  {result.aiAnalysis}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Hash size={18} style={{ color: 'var(--color-primary)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }} placeholder="继续询问数字能量..." />
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
          <button onClick={() => navigate('/numerology')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}