import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ScrollText, Sparkles, Lightbulb, MessageCircle, RefreshCw, Bookmark, Share2 } from 'lucide-react';
import { useFortuneResult } from '@/hooks/useFortuneResult';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** 加载占位组件 */
function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
        <p style={{ color: 'var(--color-text-light)' }}>加载中...</p>
      </div>
    </div>
  );
}

/** 签诗等级颜色 */
const LOT_LEVEL_STYLES: Record<string, { bg: string; text: string; stars: number }> = {
  '上上签': { bg: 'linear-gradient(135deg, #c8a84e, #9a7b2e)', text: '#fff', stars: 5 },
  '上签': { bg: 'linear-gradient(135deg, #004baa, #003580)', text: '#fff', stars: 4 },
  '中上签': { bg: 'rgba(200,122,26,0.15)', text: '#c87a1a', stars: 3.5 },
  '中签': { bg: 'rgba(160,170,192,0.15)', text: '#a0aac0', stars: 3 },
  '中下签': { bg: 'rgba(200,122,26,0.1)', text: '#c87a1a', stars: 2.5 },
  '下签': { bg: 'rgba(196,58,58,0.15)', text: '#c43a3a', stars: 2 },
  '下下签': { bg: 'linear-gradient(135deg, #c43a3a, #a02a2a)', text: '#fff', stars: 1 },
};

/** 求签结果页 */
export default function DrawlotResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, loading, error, retry } = useFortuneResult();
  const [question, setQuestion] = useState('');

  if (loading) return <PageLoading />;
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={retry} className="px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
              重试
            </button>
            <button onClick={() => navigate('/drawlot')} className="px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
              返回重新求签
            </button>
          </div>
        </div>
      </div>
    );
  }

  const details = (data.details && typeof data.details === 'object' ? data.details : {}) as Record<string, unknown>;
  const lotNumber = String(details.lotNumber ?? '');
  const lotLevel = String(details.level ?? '中签');
  const poem = (typeof details.poem === 'string' && details.poem) || '';
  const interpretationText = interpretation || (typeof details.interpretation === 'string' ? details.interpretation : '');
  const advice = (typeof details.advice === 'string' && details.advice) || '';
  const levelStyle = LOT_LEVEL_STYLES[lotLevel] || LOT_LEVEL_STYLES['中签'];

  return (
    <div style={{ background: '#0a0e1a', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,168,78,0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: 1280 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: '#a0aac0' }}>
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
            <span style={{ color: 'rgba(200,168,78,0.3)' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>签诗抽签</span>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 720 }}>
        {/* 签首卡片 */}
        <div
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{
            background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)',
            border: '1px solid rgba(200,168,78,0.15)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.08) 0%, transparent 70%)' }} />
          </div>

          <div className="relative text-center p-8">
            {/* 签号 + 等级 */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
                第{lotNumber}签
              </span>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-sm font-semibold" style={{ background: levelStyle.bg, color: levelStyle.text }}>
                {lotLevel}
              </span>
            </div>

            {/* 签名 */}
            <h1 className="text-xl font-semibold mb-2" style={{ color: '#e8ecf4' }}>观音灵签</h1>
            <p className="text-sm" style={{ color: '#7a8599' }}>观音菩萨灵应 · 求签解签</p>

            {/* 星星评分 */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4L8 11.4l-3.6 1.9.7-4L2.2 6.2l4-.6L8 2z"
                    fill={i < Math.floor(levelStyle.stars) ? 'var(--color-gold)' : 'rgba(200,168,78,0.2)'}
                  />
                </svg>
              ))}
              <span className="text-xs ml-2" style={{ color: '#7a8599' }}>{levelStyle.stars}星</span>
            </div>
          </div>
        </div>

        {/* 签诗原文 */}
        {poem && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}>
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#a0aac0' }}>
              <ScrollText size={16} />
              签诗原文
            </h2>
            <div className="text-center" style={{ fontFamily: "'Noto Serif SC', serif", lineHeight: 2.2, letterSpacing: '0.08em', fontSize: '1.1rem', color: '#e8ecf4' }}>
              {poem.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 白话解意 */}
        {interpretationText && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#a0aac0' }}>
              <BookOpen size={16} />
              白话解意
            </h2>
            <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.8 }}>{interpretationText}</p>
          </div>
        )}

        {/* 化解建议 */}
        {advice && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}>
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#a0aac0' }}>
              <Lightbulb size={16} style={{ color: 'var(--color-gold)' }} />
              求签指引与建议
            </h2>
            <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.8 }}>{advice}</p>
          </div>
        )}

        {/* AI 深度解读 */}
        {interpretation && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.03), rgba(200,168,78,0.05))', border: '1px solid rgba(200,168,78,0.1)' }}
          >
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#a0aac0' }}>
              <Sparkles size={16} style={{ color: 'var(--color-gold)' }} />
              AI 深度解读
            </h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 追问 */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
            <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
            追问 AI
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="对签诗有更多疑问？"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#0a0e1a', border: '1px solid rgba(30,39,64,0.8)', color: '#e8ecf4' }}
            />
            <button className="px-6 py-3 rounded-xl text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#0a0e1a' }}>
              追问
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)', color: '#a0aac0' }}>
            <Bookmark size={16} />
            保存签诗
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium" style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)', color: '#a0aac0' }}>
            <Share2 size={16} />
            分享好友
          </button>
          <button
            onClick={() => navigate('/drawlot')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
          >
            <RefreshCw size={16} />
            重新求签
          </button>
        </div>
      </main>
    </div>
  );
}