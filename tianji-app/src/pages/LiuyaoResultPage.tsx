import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Coins, Sparkles, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

/** 卦爻卡片组件 */
function GuaYaoCard({ yao, type, description }: { yao: string; type: string; description: string }) {
  const isYang = yao.includes('---');
  const isOldYao = yao.includes('x') || yao.includes('o');
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg"
      style={{
        background: isOldYao ? 'rgba(200,168,78,0.1)' : 'var(--color-bg-inset)',
        border: `1px solid ${isOldYao ? 'rgba(200,168,78,0.3)' : 'var(--color-border-light)'}`,
      }}
    >
      <div className="text-2xl font-mono" style={{ fontFamily: 'monospace', color: isYang ? '#4ade80' : '#f87171' }}>
        {yao}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{type}</span>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      </div>
      {isOldYao && (
        <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(200,168,78,0.2)', color: 'var(--color-gold)' }}>
          动
        </span>
      )}
    </div>
  );
}

/** 六爻结果页 */
export default function LiuyaoResultPage() {
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
          <p style={{ color: 'var(--color-text-light)' }}>六爻推演中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={() => navigate('/liuyao')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回六爻
          </button>
        </div>
      </div>
    );
  }

  // 解析卦象数据
  const data = result.data || {};
  const guaName = data.guaName || data.name || '卦象';
  const question = data.question || '六爻占卜';

  // 六爻列表
  const yaoList = data.yaoList || [
    { yao: '---', type: '初九', description: '潜龙勿用，阳在地下，未可施为' },
    { yao: '---', type: '九二', description: '见龙在田，利见大人，崭露头角' },
    { yao: 'x', type: '六三', description: '君子终日乾乾，夕惕若厉，谨言慎行' },
    { yao: '---', type: '九四', description: '或跃在渊，进退有度，伺机而动' },
    { yao: 'o', type: '九五', description: '飞龙在天，大展宏图，功成名就' },
    { yao: '---', type: '上九', description: '亢龙有悔，知进退存亡，不失其正' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/liuyao')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>六爻占卜</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 六爻风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(200,168,78,0.08) 0%, rgba(0,75,170,0.06) 100%)', border: '1px solid rgba(200,168,78,0.15)' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))', color: '#0a0e1a' }}>
              <Coins size={16} />六爻占卜
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {guaName}
          </h1>
          <p className="text-sm text-center mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{question}
          </p>
          {data.fortune && (
            <div className="flex justify-center">
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #1a8a5c 0%, #10b981 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
                {data.fortune}
              </div>
            </div>
          )}
        </section>

        {/* 卦象展示 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <BookOpen size={18} style={{ color: 'var(--color-gold)' }} />卦象详解
          </h2>
          <div className="space-y-3">
            {yaoList.slice(0, 6).map((yao: any, idx: number) => (
              <GuaYaoCard
                key={idx}
                yao={typeof yao === 'string' ? yao : yao.yao}
                type={typeof yao === 'string' ? `第${idx + 1}爻` : yao.type || `第${idx + 1}爻`}
                description={typeof yao === 'string' ? '爻象解读' : yao.description || '爻象解读'}
              />
            ))}
          </div>
        </section>

        {/* 卦辞解读 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>📜</span>卦辞
          </h2>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-gold-light)' }}>{children}</strong>,
              }}
            >
              {data.content || data.guaCi || result.interpretation || ''}
            </ReactMarkdown>
          </div>
        </section>

        {/* 动变分析 */}
        {data.bianGua && (
          <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <span>🔄</span>动变分析
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{data.bianGua}</p>
          </section>
        )}

        {/* AI 深度解读 */}
        {data.aiAnalysis && (
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
                  {data.aiAnalysis}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Coins size={18} style={{ color: 'var(--color-gold)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续询问六爻解读..."
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
          <button onClick={() => navigate('/liuyao')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}