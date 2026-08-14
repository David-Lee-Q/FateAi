import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Moon, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

/** 月相数据 */
const MOON_PHASES: Record<string, { icon: string; name: string; color: string }> = {
  'new': { icon: '🌑', name: '新月', color: '#1a1a2e' },
  'waxing-crescent': { icon: '🌒', name: '眉月', color: '#1e2a4a' },
  'first-quarter': { icon: '🌓', name: '上弦月', color: '#1a2a50' },
  'waxing-gibbous': { icon: '🌔', name: '盈凸月', color: '#1e2e55' },
  'full': { icon: '🌕', name: '满月', color: '#0f1f40' },
  'waning-gibbous': { icon: '🌖', name: '亏凸月', color: '#1a2845' },
  'last-quarter': { icon: '🌗', name: '下弦月', color: '#15203d' },
  'waning-crescent': { icon: '🌘', name: '残月', color: '#121a30' },
};

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
          <button onClick={() => navigate('/moonphase')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回月相
          </button>
        </div>
      </div>
    );
  }

  const data = (result.data || {}) as Record<string, unknown>;
  const phaseKey = (data.phase as string) || 'full';
  const phaseData = MOON_PHASES[phaseKey] || MOON_PHASES['full'];
  const question = (data.question as string) || '月相占卜';

  // 分类运势
  const energies = (data.energies as Array<{ category: string; content: string; icon: string }>) || [
    { category: '爱情', content: '月光明亮，情感能量充沛。单身的你有机会遇到心动的邂逅，已有伴侣的则适合深度沟通。', icon: '💕' },
    { category: '事业', content: '月光照耀，适合开展新计划或进行商业谈判。月相能量增强决策直觉。', icon: '💼' },
    { category: '财运', content: '财务运势稳定，适合进行投资理财规划。但需谨慎大额支出。', icon: '💰' },
    { category: '健康', content: '身心状态良好，适合进行冥想、瑜伽等放松活动，提升内在能量。', icon: '🌿' },
  ];

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
            {phaseData.name} · {(data.meaning as string) || '月相解读'}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            你的问题：{question}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(200,168,78,0.15)', color: 'var(--color-gold)' }}>
            <Sparkles size={16} />
            <span className="text-sm font-medium">{(data.energy as string) || '圆满能量'}</span>
          </div>
        </section>

        {/* 月相解释 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>🌙</span>月相含义
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {(data.phaseDesc as string) || '月相占卜综合月亮周期与你的问题，为你提供深层的宇宙能量指引。'}
          </p>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: 'var(--color-gold-light)' }}>{children}</strong>,
              }}
            >
              {(data.content as string) || result.interpretation || ''}
            </ReactMarkdown>
          </div>
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
        {data.aiAnalysis && (
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
                  {data.aiAnalysis as string}
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