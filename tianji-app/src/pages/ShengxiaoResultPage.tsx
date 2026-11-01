import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 加载占位组件 */
function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--color-text-light)' }}>加载中...</p>
      </div>
    </div>
  );
}

/** 十二生肖 emoji 映射 */
const ZODIAC_EMOJI: Record<string, string> = {
  鼠: '🐀', 牛: '🐂', 虎: '🐅', 兔: '🐇', 龙: '🐲', 蛇: '🐍',
  马: '🐴', 羊: '🐏', 猴: '🐒', 鸡: '🐓', 狗: '🐕', 猪: '🐖',
};

/** 生肖运势结果页 */
export default function ShengxiaoResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [followUpText, setFollowUpText] = useState('');

  if (loading) return <PageLoading />;
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
          <button
            onClick={retry}
            className="mt-4 mr-2 px-6 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
          >
            重试
          </button>
          <button
            onClick={() => navigate('/shengxiao')}
            className="mt-4 px-6 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
          >
            返回重新测试
          </button>
        </div>
      </div>
    );
  }

  const divData = (data || {}) as Record<string, unknown>;
  const details = (divData.details && typeof divData.details === 'object' ? divData.details : {}) as Record<string, unknown>;
  const aiText = interpretation;
  const animal = (typeof details.animal === 'string' && details.animal) || '鼠';
  const year = (typeof divData.year === 'string' && divData.year) || String(new Date().getFullYear());
  const benMingNian = (typeof details.benMingNian === 'string' && details.benMingNian) || '';
  const scores = (details.scores && typeof details.scores === 'object') ? (details.scores as Record<string, number>) : {};
  const luckyItems = (details.luckyItems && typeof details.luckyItems === 'object') ? (details.luckyItems as Record<string, string>) : {};
  const advice = (typeof details.advice === 'string' && details.advice) || '';
  const summary = (typeof divData.summary === 'string' && divData.summary) || '';

  const scoreItems: { key: string; label: string; score: number }[] = [
    { key: 'career', label: '事业', score: scores.career || 0 },
    { key: 'wealth', label: '财运', score: scores.wealth || 0 },
    { key: 'love', label: '感情', score: scores.love || 0 },
    { key: 'health', label: '健康', score: scores.health || 0 },
  ].filter((s) => s.score > 0);
  const overallScore = scores.overall || 0;

  return (
    <div style={{ background: '#0a0e1a', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky z-40" style={{ top: 'var(--navbar-height)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: 1280 }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: '#a0aac0' }}
            >
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
            <span style={{ color: 'rgba(30,39,64,0.8)' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>生肖运势</span>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
        {/* 生肖头部卡片 */}
        <div
          className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #1a1f35 100%)',
            border: '1px solid rgba(200,168,78,0.15)',
          }}
        >
          {/* 背景光晕 */}
          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.08) 0%, transparent 70%)' }}
          />

          <div className="relative flex items-center gap-6">
            {/* 生肖图标 */}
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(200,168,78,0.1)', border: '1px solid rgba(200,168,78,0.2)' }}
            >
              <span style={{ fontSize: 48 }}>{ZODIAC_EMOJI[animal] || '🐴'}</span>
            </div>

            {/* 信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>
                  {animal}年运势
                </h1>
                {overallScore > 0 && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(200,168,78,0.15)', color: '#c8a84e' }}
                  >
                    综合 {overallScore} 分
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: '#7a8599' }}>
                <Calendar size={14} className="inline mr-1" />
                流年太岁分析 · {year}年
              </p>
              {benMingNian && (
                <p className="text-xs mt-2" style={{ color: '#e0a14e' }}>{benMingNian}</p>
              )}
            </div>
          </div>
        </div>

        {/* 综合评分 */}
        {scoreItems.length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 综合运势评分
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {scoreItems.map((dim) => (
                <div key={dim.key} className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}
                  >
                    {dim.score}
                  </div>
                  <div className="text-sm font-medium mb-2" style={{ color: '#e8ecf4' }}>{dim.label}</div>
                  <div style={{ width: '100%', height: 4, background: 'rgba(30,39,64,0.8)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${dim.score}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #004baa, #c8a84e)',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 综合概述 */}
        {(summary || advice) && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 年度概述
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#a0aac0' }}>{summary || advice}</p>
            {advice && (
              <p className="text-sm leading-relaxed mt-3" style={{ color: '#a0aac0' }}>{advice}</p>
            )}
          </div>
        )}

        {/* 幸运信息 */}
        {Object.keys(luckyItems).length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 开运信息
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {luckyItems.color && <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}><div className="text-xs font-medium mb-2" style={{ color: '#004baa' }}>幸运色</div><p className="text-sm" style={{ color: '#a0aac0' }}>{luckyItems.color}</p></div>}
              {luckyItems.number && <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}><div className="text-xs font-medium mb-2" style={{ color: '#004baa' }}>幸运数字</div><p className="text-sm" style={{ color: '#a0aac0' }}>{luckyItems.number}</p></div>}
              {luckyItems.direction && <div className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}><div className="text-xs font-medium mb-2" style={{ color: '#004baa' }}>幸运方位</div><p className="text-sm" style={{ color: '#a0aac0' }}>{luckyItems.direction}</p></div>}
            </div>
          </div>
        )}

        {/* AI 深度分析 */}
        {aiText && (
          <div
            className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,75,170,0.03), rgba(200,168,78,0.05))',
              border: '1px solid rgba(200,168,78,0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #004baa, #003580)' }}
              >
                <Sparkles size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#e8ecf4' }}>AI 深度运势分析</h3>
                <p className="text-xs" style={{ color: '#7a8599' }}>基于传统命理与现代 AI 算法综合推演</p>
              </div>
            </div>

            {question && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(0,75,170,0.1)', border: '1px solid rgba(0,75,170,0.15)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#a0ccf0' }}>您的问题</p>
                <p className="text-sm" style={{ color: '#e8ecf4' }}>{question}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none" style={{ color: '#a0aac0' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiText}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 追问 AI */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
            <MessageCircle size={20} style={{ color: '#004baa' }} />
            追问 AI
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder="对运势有更多疑问？向 AI 提问..."
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#0a0e1a', border: '1px solid rgba(30,39,64,0.8)', color: '#e8ecf4' }}
            />
            <button
              className="px-6 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#004baa', color: '#0a0e1a' }}
            >
              追问
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}