import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Feather, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

/** 五格卡片组件 */
function WugeCard({ name, score, meaning }: { name: string; score: number; meaning: string }) {
  const scoreColor = score >= 90 ? '#10b981' : score >= 70 ? '#3b82f6' : score >= 50 ? '#fbbf24' : '#f87171';
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</span>
        <span className="text-lg font-bold" style={{ color: scoreColor }}>{score}</span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{meaning}</p>
    </div>
  );
}

/** 姓名测试结果页 */
export default function NametestResultPage() {
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
          <p style={{ color: 'var(--color-text-light)' }}>姓名分析中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={() => navigate('/nametest')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回姓名测试
          </button>
        </div>
      </div>
    );
  }

  const data = (result.data || {}) as Record<string, unknown>;
  const fullName = (data.name as string) || `${data.surname || ''}${data.givenName || ''}`.trim() || '姓名';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/nametest')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>民俗趣味</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>姓名测试</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 姓名测试风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.08) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(0,75,170,0.15)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: '#fff' }}>
              <Feather size={16} />姓名测试
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {fullName}
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {(data.sancai as string) || '天格/地格/人格三才配置'}
          </p>
          {data.score && (
            <div className="flex justify-center mt-4">
              <div className="px-6 py-3 rounded-full text-center" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(0,75,170,0.2)' }}>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary-lighter)' }}>{data.score as number}</span>
                <span className="text-sm ml-1" style={{ color: 'var(--color-text-secondary)' }}>分</span>
              </div>
            </div>
          )}
        </section>

        {/* 五格剖象 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>📊</span>五格剖象
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <WugeCard name="天格" score={(data.tianGe as number) || 85} meaning={(data.tianMeaning as string) || '祖先留下的运势影响'} />
            <WugeCard name="人格" score={(data.renGe as number) || 78} meaning={(data.renMeaning as string) || '主性格、事业、财运'} />
            <WugeCard name="地格" score={(data.diGe as number) || 82} meaning={(data.diMeaning as string) || '影响早年运势'} />
            <WugeCard name="外格" score={(data.waiGe as number) || 70} meaning={(data.waiMeaning as string) || '社交能力和人缘'} />
            <WugeCard name="总格" score={(data.zongGe as number) || 88} meaning={(data.zongMeaning as string) || '一生总运势'} />
            <WugeCard name="三才" score={(data.sancaiScore as number) || 80} meaning={(data.sancaiMeaning as string) || '天地人三才配置'} />
          </div>
        </section>

        {/* 五行分析 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>🌀</span>五行分析
          </h2>
          <div className="flex items-center justify-center gap-6 mb-4">
            {['金', '木', '水', '火', '土'].map((element) => (
              <div key={element} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-1"
                  style={{
                    background: (data.wuxing as string) === element ? 'rgba(200,168,78,0.2)' : 'var(--color-bg-inset)',
                    border: (data.wuxing as string) === element ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                    color: (data.wuxing as string) === element ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                  }}
                >
                  {element}
                </div>
                {(data.wuxing as string) === element && <span className="text-xs" style={{ color: 'var(--color-gold)' }}>主</span>}
              </div>
            ))}
          </div>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {(data.wuxing as string) || '金'}属性姓名，五行平衡有利于运势发展
          </p>
        </section>

        {/* 姓名解读 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>📝</span>姓名解读
          </h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-primary-lighter)' }}>{children}</strong>,
              }}
            >
              {(data.content as string) || result.interpretation || (data.analysis as string) || ''}
            </ReactMarkdown>
          </div>
        </section>

        {/* AI 深度解读 */}
        {data.aiAnalysis && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.06), rgba(139,92,246,0.04))', border: '1px solid rgba(0,75,170,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)' }}>
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
                    strong: ({ children }) => <strong style={{ color: '#a78bfa' }}>{children}</strong>,
                  }}
                >
                  {data.aiAnalysis as string}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Feather size={18} style={{ color: 'var(--color-primary)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }} placeholder="继续询问姓名解读..." />
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
          <button onClick={() => navigate('/nametest')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}