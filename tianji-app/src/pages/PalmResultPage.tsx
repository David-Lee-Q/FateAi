import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Hand, Wind, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 五行掌型数据 */
const PALM_TYPES = [
  { name: '金型手', color: 'rgba(200,168,78,0.15)', iconColor: 'var(--color-gold)' },
  { name: '木型手', color: 'rgba(34,197,94,0.12)', iconColor: '#22c55e' },
  { name: '水型手', color: 'rgba(56,189,248,0.12)', iconColor: '#38bdf8' },
  { name: '火型手', color: 'rgba(251,146,60,0.12)', iconColor: '#fb923c' },
  { name: '土型手', color: 'rgba(168,85,247,0.12)', iconColor: '#a855f7' },
];

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

/** 手相结果页 */
export default function PalmResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [followUpText, setFollowUpText] = useState('');

  if (loading) return <PageLoading />;
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={retry} className="mt-4 mr-2 px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            重试
          </button>
          <button onClick={() => navigate('/palm')} className="mt-4 px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            返回重新分析
          </button>
        </div>
      </div>
    );
  }

  const divData = (data || {}) as Record<string, unknown>;
  const details = (divData.details && typeof divData.details === 'object' ? divData.details : {}) as Record<string, unknown>;
  const aiText = interpretation;
  const summary = (typeof divData.summary === 'string' && divData.summary) || '';
  const lines = (details.lines && typeof details.lines === 'object') ? (details.lines as Record<string, { name?: string; interpretation?: string }>) : {};

  // 查找掌型样式
  const currentPalmType = PALM_TYPES.find(p => p.name === (details.palmType as string)) || PALM_TYPES[0];

  const lifeLine = lines.life?.interpretation || '';
  const loveLine = lines.heart?.interpretation || '';
  const wisdomLine = lines.mind?.interpretation || '';
  const genderText = (typeof details.gender === 'string' && details.gender) || '';
  const palmTypeDesc = (typeof details.palmTypeDesc === 'string' && details.palmTypeDesc) || '';
  const isAI = details.mode === 'ai';

  return (
    <div style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0e1a 100%)', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,168,78,0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: 1280 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
            <span style={{ color: 'rgba(200,168,78,0.3)' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>手相算命</span>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
        {/* 解读来源标识 */}
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={isAI
            ? { background: 'rgba(0,75,170,0.12)', border: '1px solid rgba(0,75,170,0.35)', color: '#8ab4e8' }
            : { background: 'rgba(200,168,78,0.08)', border: '1px solid rgba(200,168,78,0.3)', color: '#c8a84e' }}
        >
          {isAI
            ? '本次解读由 AI 视觉模型基于您上传的手掌照片真实识别生成。'
            : 'AI 视觉识别暂不可用，当前为模板模拟结果，仅供参考；上传照片后配置 AI 服务即可获取真实识别。'}
        </div>
        {/* 手掌分析头部 */}
        <div
          className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(26,10,46,0.8), rgba(17,24,39,0.9))', border: '1px solid rgba(200,168,78,0.15)' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.06) 0%, transparent 70%)' }} />
          </div>

          <div className="relative flex items-center gap-6">
            {/* 手掌图标 */}
            <div className="hidden sm:flex items-center justify-center shrink-0" style={{ width: 80, height: 80 }}>
              <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
                <path d="M32 8C32 8 28 16 28 24C28 32 32 36 32 36" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 12C20 12 14 20 14 28C14 36 18 42 18 42" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M44 12C44 12 50 20 50 28C50 36 46 42 46 42" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 28C32 28 24 32 20 40C16 48 16 56 32 56C48 56 48 48 44 40C40 32 32 28 32 28Z" fill="rgba(200,168,78,0.15)" stroke="var(--color-gold)" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-gold-light)', fontFamily: "'Noto Serif SC', serif" }}>
                  手相分析报告
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: currentPalmType.color, color: currentPalmType.iconColor }}>
                  {currentPalmType.name}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {genderText ? `${genderText} · 掌型分析 · 三大主线解读` : '掌型分析 · 三大主线解读'}
              </p>
            </div>
          </div>
        </div>

        {/* 综合概述 */}
        {summary && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <Wind size={20} style={{ color: currentPalmType.iconColor }} />
              综合概述
            </h2>
            <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.8 }}>{summary}</p>
          </div>
        )}

        {/* 掌型分析 */}
        {palmTypeDesc && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <Hand size={20} style={{ color: currentPalmType.iconColor }} />
              掌型特征分析
            </h2>
            <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.8 }}>{palmTypeDesc}</p>
          </div>
        )}

        {/* 三大主线 */}
        {(lifeLine || loveLine || wisdomLine) && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <Activity size={20} style={{ color: 'var(--color-gold)' }} />
              三大主线解读
            </h2>
            <div className="space-y-4">
              {lifeLine && (
                <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#c43a3a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#e8ecf4' }}>生命线</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7a8599', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {lifeLine}
                  </p>
                </div>
              )}
              {loveLine && (
                <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#e88a8a' }} />
                    <span className="text-sm font-semibold" style={{ color: '#e8ecf4' }}>感情线</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7a8599', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {loveLine}
                  </p>
                </div>
              )}
              {wisdomLine && (
                <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#004baa' }} />
                    <span className="text-sm font-semibold" style={{ color: '#e8ecf4' }}>智慧线</span>
                  </div>
                  <p className="text-xs" style={{ color: '#7a8599', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {wisdomLine}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI 深度分析 */}
        {aiText && (
          <div
            className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.05), rgba(200,168,78,0.03))', border: '1px solid rgba(200,168,78,0.1)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}>
                <Sparkles size={20} style={{ color: '#0a0e1a' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#e8ecf4' }}>AI 深度分析</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>基于掌纹特征的综合解读</p>
              </div>
            </div>
            {question && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(0,75,170,0.1)', border: '1px solid rgba(0,75,170,0.15)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#a0ccf0' }}>您的问题</p>
                <p className="text-sm" style={{ color: '#e8ecf4' }}>{question}</p>
              </div>
            )}
            <div className="prose prose-invert max-w-none" style={{ color: '#a0aac0', lineHeight: 1.8 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiText}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 追问 + 重新分析 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
              追问 AI
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="想了解更多手相知识？"
                className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#0a0e1a', border: '1px solid rgba(30,39,64,0.8)', color: '#e8ecf4' }}
              />
              <button className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                追问
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <RefreshCw size={18} style={{ color: 'var(--color-gold)' }} />
              再次分析
            </h3>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>上传新的手掌照片获得新的分析</p>
            <button
              onClick={() => navigate('/palm')}
              className="w-full py-2.5 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
            >
              重新分析
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}