import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Hash, Sparkles, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

/** 四柱信息卡片 */
function BaziCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{label}</div>
      <div className="text-base font-semibold" style={{ color: '#a78bfa' }}>{value}</div>
    </div>
  );
}

/** 数字结果显示卡片 */
function NumberResultCard({ number, label, meaning }: { number: string; label: string; meaning: string }) {
  return (
    <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
      <div className="text-3xl font-bold mb-2" style={{ color: '#7c3aed', fontFamily: 'var(--font-display)' }}>{number}</div>
      <div className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>{label}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{meaning}</div>
    </div>
  );
}

/** 铁板神数结果页 */
export default function TiebanResultPage() {
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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>铁板神数推演中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={() => navigate('/tieban')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: '#7c3aed', color: '#fff' }}>
            返回铁板神数
          </button>
        </div>
      </div>
    );
  }

  const data = (result.data || {}) as Record<string, unknown>;
  const question = (data.question as string) || '铁板神数测算';
  const details = (data.details as Record<string, unknown>) || {};
  const aiContent = result.interpretation || (data.aiAnalysis as string) || (data.aiInterpretation as string) || (data.suggestion as string) || '';

  // 获取四柱信息
  const baziInfo = details.bazi || {
    year: '甲',
    month: '子',
    day: '丑',
    hour: '寅',
  };

  // 获取铁板神数特有信息
  const tiebanInfo = details.tieban || {
    mainNumber: details.mainNumber || '8',
    luckyNumbers: ['3', '6', '9'],
    fortuneLevel: '上吉',
    description: '命主运势极佳，财运亨通',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/tieban')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>铁板神数</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 铁板神数风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(168,85,247,0.06) 100%)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}>
              <Hash size={16} />铁板神数
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {tiebanInfo.mainNumber} 数
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{question}
          </p>
          {data.fortune && (
            <div className="flex justify-center mt-4">
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                {data.fortune as string}
              </div>
            </div>
          )}
        </section>

        {/* 四柱基础信息 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>📊</span>四柱基础
          </h2>
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            <BaziCard label="年柱" value={baziInfo.year} />
            <BaziCard label="月柱" value={baziInfo.month} />
            <BaziCard label="日柱" value={baziInfo.day} />
            <BaziCard label="时柱" value={baziInfo.hour} />
          </div>
        </section>

        {/* 核心数字结果 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Star size={18} style={{ color: '#7c3aed' }} />命运数字
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberResultCard
              number={tiebanInfo.mainNumber}
              label="主数"
              meaning="代表命运核心特征"
            />
            {tiebanInfo.luckyNumbers?.map((num: string, idx: number) => (
              <NumberResultCard
                key={idx}
                number={num}
                label={`幸运数${idx + 1}`}
                meaning="有助于运势的数字"
              />
            ))}
          </div>
        </section>

        {/* 吉凶判断 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>⚡</span>吉凶判断
          </h2>
          <div className="space-y-3">
            {data.patterns || [
              { type: '吉', title: '数字大吉', content: '主数运势旺盛，财运事业皆有助力。' },
              { type: '吉', title: '幸运相助', content: '幸运数字与命格相合，多有贵人相助。' },
              { type: '注意', title: '注意时节', content: '注意流年变化，适时调整策略。' },
            ].map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-lg"
                style={{
                  background: item.type === '吉' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${item.type === '吉' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: item.type === '吉' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: item.type === '吉' ? '#10b981' : '#fbbf24' }}>{item.type}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.title}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI 深度解读 */}
        {(aiContent || data.suggestion) && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(168,85,247,0.04))', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
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
                    strong: ({ children }) => <strong style={{ color: '#c4b5fd' }}>{children}</strong>,
                  }}
                >
                  {aiContent || (data.suggestion as string) || ''}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Hash size={18} style={{ color: '#7c3aed' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }} placeholder="继续询问命运数字..." />
            </div>
            <button className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: '#7c3aed', color: '#fff' }}>
              <Send size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* 底部工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors" style={{ color: isBookmarked ? '#7c3aed' : 'var(--color-text-secondary)' }}>
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/tieban')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}