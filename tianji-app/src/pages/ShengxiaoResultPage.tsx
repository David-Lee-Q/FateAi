import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { fetchFortuneResult } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐲', snake: '🐍',
  horse: '🐴', goat: '🐏', monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐖',
};

/** 吉凶颜色 */
const FORTUNE_COLORS = {
  ji: { bg: '#1a8a5c', text: '#1a8a5c', shadow: 'rgba(26,138,92,0.4)' },
  zhong: { bg: '#c87a1a', text: '#c87a1a', shadow: 'rgba(200,122,26,0.4)' },
  xiong: { bg: '#c43a3a', text: '#c43a3a', shadow: 'rgba(196,58,58,0.4)' },
};

/** 生肖运势结果页 */
export default function ShengxiaoResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const data = await fetchFortuneResult(id);
        setResult(data.data);
      } catch (err) {
        setError('获取结果失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <PageLoading />;
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
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

  const divData = (result.data || {}) as Record<string, unknown>;

  return (
    <div style={{ background: '#0a0e1a', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(30,39,64,0.6)' }}>
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
              <span style={{ fontSize: 48 }}>{ZODIAC_EMOJI[divData.zodiac as string] || '🐴'}</span>
            </div>

            {/* 信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>
                  {divData.zodiac as string}年运势
                </h1>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(200,168,78,0.15)', color: '#c8a84e' }}
                >
                  {divData.year as string}年
                </span>
              </div>
              <p className="text-sm" style={{ color: '#7a8599' }}>
                <Calendar size={14} className="inline mr-1" />
                流年太岁分析 · 十二维度解读
              </p>
            </div>
          </div>
        </div>

        {/* 综合评分 */}
        {divData.aiscore && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 综合运势评分
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(divData.dimensions as any[])?.map((dim: any) => (
                <div key={dim.key} className="text-center">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}
                  >
                    {dim.score}
                  </div>
                  <div className="text-sm font-medium mb-2" style={{ color: '#e8ecf4' }}>{dim.label}</div>
                  {/* 进度条 */}
                  <div style={{ width: '100%', height: 4, background: 'rgba(30,39,64,0.8)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${dim.score}%`,
                        height: '100%',
                        background: dim.gradient || 'linear-gradient(90deg, #004baa, #c8a84e)',
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#7a8599', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dim.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 每月运势 */}
        {(divData.monthlyFortune as any[]) && (divData.monthlyFortune as any[]).length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 每月运势一览
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {(divData.monthlyFortune as any[]).map((m: { fortune: string; month: string; level: string; lunar: string }, i: number) => {
                const fc = FORTUNE_COLORS[m.fortune as keyof typeof FORTUNE_COLORS] || FORTUNE_COLORS.zhong;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 shrink-0"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: '#0a0e1a',
                      border: '1px solid rgba(30,39,64,0.6)',
                      minWidth: 72,
                    }}
                  >
                    <span className="text-xs" style={{ color: '#7a8599' }}>{m.month}</span>
                    <span className="font-medium text-sm" style={{ color: '#e8ecf4' }}>{m.lunar}</span>
                    <div
                      style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: fc.bg, boxShadow: `0 0 6px ${fc.shadow}`,
                      }}
                    />
                    <span className="text-xs" style={{ color: fc.text }}>
                      {m.fortune === 'ji' ? '吉' : m.fortune === 'zhong' ? '平' : '凶'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI 深度分析 */}
        {divData.aiAnalysis && (
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

            <div className="prose prose-invert max-w-none" style={{ color: '#a0aac0' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{divData.aiAnalysis as string}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 开运建议 */}
        {(divData.suggestions as any[]) && (divData.suggestions as any[]).length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: '#111827', border: '1px solid rgba(30,39,64,0.8)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 开运指南
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(divData.suggestions as any[]).map((s: any, i: number) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: '#0a0e1a' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: '#004baa' }}>{s.title}</div>
                  <p className="text-sm" style={{ color: '#a0aac0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.desc}
                  </p>
                </div>
              ))}
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
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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