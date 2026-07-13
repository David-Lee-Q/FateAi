import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
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

/** 占星骰子结果页 */
export default function AstrodiceResultPage() {
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
        setResult(data);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-primary-darker)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
          <button
            onClick={() => navigate('/astrodice')}
            className="mt-4 px-6 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
          >
            返回重新测试
          </button>
        </div>
      </div>
    );
  }

  const { planet, zodiac, house, aiInterpretation, theme, guidance, question: originalQuestion } = result.data || result;

  return (
    <div style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(10,15,46,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,168,78,0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
            <span style={{ color: 'rgba(200,168,78,0.3)' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>占星骰子</span>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 三颗骰子展示 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
            骰子落定
          </h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>星座 / 行星 / 宫位</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {/* 星座骰 */}
            <div className="text-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(220,80,80,0.15)', color: '#f0a0a0' }}>星座骰</span>
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #c0392b 0%, #962d22 40%, #7a2519 100%)', boxShadow: '0 8px 32px rgba(150,45,34,0.4)', border: '2px solid rgba(255,200,180,0.2)' }}
              >
                <span style={{ fontSize: 48, lineHeight: 1 }}>&#x2648;</span>
                <span className="text-sm font-semibold mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>{zodiac || '白羊座'}</span>
              </div>
              <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>行动力与开创</p>
            </div>

            {/* 行星骰 */}
            <div className="text-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(74,144,217,0.15)', color: '#a0ccf0' }}>行星骰</span>
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #2e86c1 0%, #2471a3 40%, #1a5276 100%)', boxShadow: '0 8px 32px rgba(36,113,163,0.4)', border: '2px solid rgba(180,220,255,0.2)' }}
              >
                <span style={{ fontSize: 48, lineHeight: 1 }}>&#x2609;</span>
                <span className="text-sm font-semibold mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>{planet || '太阳'}</span>
              </div>
              <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>自我意志与光芒</p>
            </div>

            {/* 宫位骰 */}
            <div className="text-center">
              <span className="text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(46,139,87,0.15)', color: '#a0e0c0' }}>宫位骰</span>
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #27ae60 0%, #1e8449 40%, #196f3d 100%)', boxShadow: '0 8px 32px rgba(30,132,73,0.4)', border: '2px solid rgba(180,255,200,0.2)' }}
              >
                <span className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: '#fff' }}>
                  {house ? parseInt(house.replace(/[^0-9]/g, '')) || 1 : 1}
                </span>
                <span className="text-sm font-semibold mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>{house || '第一宫'}</span>
              </div>
              <p className="text-sm mt-3 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>命运领域</p>
            </div>
          </div>
        </div>

        {/* 组合分析 */}
        {theme && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(200,168,78,0.1)' }}
          >
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-gold-light)' }}>组合解读</h2>
            </div>
            <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              {planet}在{zodiac}进入{house}，{theme}
            </p>
          </div>
        )}

        {/* AI 解读 */}
        {aiInterpretation && (
          <div
            className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,75,170,0.05), rgba(200,168,78,0.03))',
              border: '1px solid rgba(200,168,78,0.1)',
            }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg className="absolute w-full h-full opacity-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                <circle cx="400" cy="200" r="180" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="6 10" />
                <circle cx="400" cy="200" r="120" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="4 8" />
              </svg>
            </div>

            <div className="relative flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #004baa, #003580)' }}
              >
                <Sparkles size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#e8ecf4' }}>AI 深度解读</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>结合星象学与您的具体问题分析</p>
              </div>
            </div>

            {/* 原始问题 */}
            {originalQuestion && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(0,75,170,0.1)', border: '1px solid rgba(0,75,170,0.15)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-primary-lighter)' }}>您的问题</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{originalQuestion}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiInterpretation}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 行动指引 */}
        {guidance && guidance.length > 0 && (
          <div
            className="rounded-2xl p-6 mb-8"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8ecf4' }}>
              <span style={{ color: 'var(--color-gold)' }}>|</span> 行动指引
            </h2>
            <div className="space-y-3">
              {guidance.map((g: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#0a0f2e' }}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{g}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 追问 + 重新占卜 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 追问 */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
              追问 AI
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="进一步了解..."
                className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#0a0f2e', border: '1px solid rgba(30,39,64,0.8)', color: '#e8ecf4' }}
              />
              <button
                className="px-4 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                追问
              </button>
            </div>
          </div>

          {/* 重新占卜 */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <RefreshCw size={18} style={{ color: 'var(--color-gold)' }} />
              再次占卜
            </h3>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>想再次体验占星骰子的神秘力量？</p>
            <button
              onClick={() => navigate('/astrodice')}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
            >
              重新掷骰子
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}