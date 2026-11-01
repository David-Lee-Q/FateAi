import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 九宫飞星宫位组件 */
function FlyingStarCell({ star, name, direction, isCenter = false }: {
  star: string;
  name: string;
  direction: string;
  isCenter?: boolean;
}) {
  const starColors: Record<string, { bg: string; text: string }> = {
    '一白': { bg: 'rgba(251,146,60,0.1)', text: '#fb923c' },
    '二黑': { bg: 'rgba(200,168,78,0.15)', text: '#c8a84e' },
    '三碧': { bg: 'rgba(251,146,60,0.1)', text: '#fb923c' },
    '四绿': { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
    '五黄': { bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
    '六白': { bg: 'rgba(168,85,247,0.1)', text: '#a855f7' },
    '七赤': { bg: 'rgba(96,165,250,0.1)', text: '#60a5fa' },
    '八白': { bg: 'rgba(96,165,250,0.1)', text: '#60a5fa' },
    '九紫': { bg: 'rgba(34,197,94,0.1)', text: '#4ade80' },
  };
  const colors = starColors[star] || { bg: 'rgba(139,146,168,0.1)', text: '#8b95a8' };

  return (
    <div
      className="text-center p-3 rounded-lg"
      style={{
        background: colors.bg,
        border: isCenter ? '2px solid var(--color-gold)' : `1px solid ${colors.text}33`,
        position: 'relative',
      }}
    >
      {isCenter && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px]" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
          中宫
        </span>
      )}
      <span className="text-xs" style={{ color: colors.text }}>{direction}</span>
      <div className="text-lg font-bold" style={{ color: colors.text }}>{star}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{name}</div>
    </div>
  );
}

/** 风水诊断卡片组件 */
function FengshuiDiagnosisCard({ type, title, content }: {
  type: '吉位' | '需注意' | '建议';
  title: string;
  content: string;
}) {
  const typeConfig = {
    '吉位': { icon: '✅', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    '需注意': { icon: '⚠️', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
    '建议': { icon: '💡', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  };
  const config = typeConfig[type];

  return (
    <div className="p-4 rounded-lg" style={{ background: config.bg, border: `1px solid ${config.border}` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{config.icon}</span>
        <span className="text-sm font-medium" style={{ color: config.text }}>{type}：{title}</span>
      </div>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content}</p>
    </div>
  );
}

/** 风水堪舆结果页 */
export default function FengshuiResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>分析中...</p>
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
          <button onClick={() => navigate('/fengshui')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回风水
          </button>
        </div>
      </div>
    );
  }

  // 解析九宫飞星数据
  const details = (data.details && typeof data.details === 'object' ? data.details : {}) as Record<string, unknown>;
  const summary = (typeof data.summary === 'string' && data.summary) || '';
  const direction = (typeof details.direction === 'string' && details.direction) || '坐北朝南';
  const buildingType = (typeof details.buildingType === 'string' && details.buildingType) || '';
  const wuXing = (typeof details.wuXing === 'string' && details.wuXing) || '';
  const favorableAreas = (Array.isArray(details.favorableAreas) ? details.favorableAreas : []) as string[];
  const unfavorableAreas = (Array.isArray(details.unfavorableAreas) ? details.unfavorableAreas : []) as string[];
  const layoutAdvice = (Array.isArray(details.layoutAdvice) ? details.layoutAdvice : []) as string[];

  const flyingStars = {
    '东南': { star: '五黄', name: '廉贞星' },
    '正南': { star: '九紫', name: '右弼星' },
    '西南': { star: '一白', name: '贪狼星' },
    '正东': { star: '三碧', name: '禄存星' },
    '中宫': { star: '二黑', name: '巨门星' },
    '正西': { star: '七赤', name: '破军星' },
    '东北': { star: '八白', name: '左辅星' },
    '正北': { star: '六白', name: '武曲星' },
    '西北': { star: '四绿', name: '文昌星' },
  };

  // 由真实排盘数据构建诊断建议
  const diagnoses: { type: '吉位' | '需注意' | '建议'; title: string; content: string }[] = [];
  for (const area of favorableAreas) diagnoses.push({ type: '吉位', title: area, content: `${area}为吉利方位，主财运事业顺遂，宜布置财位。` });
  for (const area of unfavorableAreas) diagnoses.push({ type: '需注意', title: area, content: `${area}为不利方位，宜保持整洁并放置化解之物。` });
  for (const advice of layoutAdvice) diagnoses.push({ type: '建议', title: '布局建议', content: advice });

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky z-40 w-full" style={{ top: 'var(--navbar-height)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/fengshui')} className="nav-back-btn inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span>风水堪舆</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>分析结果</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 风水风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(0,75,170,0.1) 100%)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff' }}>
                <Home size={14} />风水堪舆
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold">
                {direction} · {buildingType || '旺宅格局'}
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {summary || '环境方位综合分析'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                五行属{wuXing || '—'}
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                坐{direction}向
              </span>
            </div>
          </div>
        </section>

        {/* 九宫飞星 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
            </svg>
            九宫飞星
          </h2>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <FlyingStarCell direction="东南" star={flyingStars['东南']?.star || '五黄'} name={flyingStars['东南']?.name || '廉贞星'} />
            <FlyingStarCell direction="正南" star={flyingStars['正南']?.star || '九紫'} name={flyingStars['正南']?.name || '右弼星'} />
            <FlyingStarCell direction="西南" star={flyingStars['西南']?.star || '一白'} name={flyingStars['西南']?.name || '贪狼星'} />
            <FlyingStarCell direction="正东" star={flyingStars['正东']?.star || '三碧'} name={flyingStars['正东']?.name || '禄存星'} />
            <FlyingStarCell direction="中宫" star={flyingStars['中宫']?.star || '二黑'} name={flyingStars['中宫']?.name || '巨门星'} isCenter />
            <FlyingStarCell direction="正西" star={flyingStars['正西']?.star || '七赤'} name={flyingStars['正西']?.name || '破军星'} />
            <FlyingStarCell direction="东北" star={flyingStars['东北']?.star || '八白'} name={flyingStars['东北']?.name || '左辅星'} />
            <FlyingStarCell direction="正北" star={flyingStars['正北']?.star || '六白'} name={flyingStars['正北']?.name || '武曲星'} />
            <FlyingStarCell direction="西北" star={flyingStars['西北']?.star || '四绿'} name={flyingStars['西北']?.name || '文昌星'} />
          </div>
        </section>

        {/* 风水诊断 */}
        {diagnoses.length > 0 && (
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold mb-6">风水诊断</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {diagnoses.map((item, idx: number) => (
              <FengshuiDiagnosisCard
                key={idx}
                type={item.type}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
        </section>
        )}

        {/* AI 深度解读 */}
        {interpretation && (
        <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }}></div>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold" style={{ color: '#fff' }}>AI 深度解读</h2>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
            </div>
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: '#6ee7b7' }}>{children}</strong>,
                }}
              >
                {interpretation}
              </ReactMarkdown>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 flex items-center px-4 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder="继续追问风水..."
                  className="bg-transparent outline-none text-sm flex-1"
                  style={{ color: '#fff' }}
                />
              </div>
              <button className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>
        )}

      </div>

      {/* 底部工具栏 */}
      <div className="result-toolbar fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors"
            style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="tool-btn flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/fengshui')} className="tool-btn flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}