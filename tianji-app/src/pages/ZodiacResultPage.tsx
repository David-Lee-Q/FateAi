import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Share2, Loader2, ChevronLeft, Send, RefreshCw, Heart, FileText, ChevronRight,
} from 'lucide-react';
import type { FortuneResult } from '@/types';
import { getFortuneResult, submitFollowUp } from '@/services/api';

// 星级评分组件
function StarRating({ rating, label, color }: { rating: number; label: string; color: string }) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="text-center p-4 rounded-lg" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      <div className="text-2xl mb-1">{
        label === '财运' ? '💰' :
        label === '事业' ? '💼' :
        label === '感情' ? '❤️' :
        label === '健康' ? '🏥' :
        label === '学习' ? '📚' : '⭐'
      }</div>
      <div className="text-sm font-medium" style={{ color }}>{label}</div>
      <div className="text-lg font-bold mt-1" style={{ color }}>
        {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
      </div>
    </div>
  );
}

// 行星状态组件
function PlanetCard({ planet, emoji, sign, status, effect }: {
  planet: string;
  emoji: string;
  sign: string;
  status: string;
  effect: string;
}) {
  const colorMap: Record<string, string> = {
    太阳: '#fbbf24',
    月亮: '#60a5fa',
    金星: '#f472b6',
    火星: '#ef4444',
    水星: '#34d399',
    木星: '#a78bfa',
    土星: '#6b7280',
  };

  return (
    <div className="p-4 rounded-lg" style={{
      background: `linear-gradient(135deg, ${colorMap[planet] || '#a78bfa'}18 0%, transparent 100%)`,
      border: `1px solid ${colorMap[planet] || '#a78bfa'}30`
    }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{emoji}</span>
        <span className="text-sm font-medium" style={{ color: colorMap[planet] || '#a78bfa' }}>{planet}</span>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>在{sign} · {status}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{effect}</p>
    </div>
  );
}

// AI 深度解读组件
function AIDeepDive({ interpretation, resultId }: { interpretation: string; resultId: string }) {
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setSubmitting(true);
    try {
      await submitFollowUp(resultId, question);
      setQuestion('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.3) 0%, transparent 70%)' }} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#fff' }}>AI 深度解读</h2>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            Powered by AI
          </span>
        </div>
        <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 flex items-center px-4 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <input
              type="text"
              placeholder="继续追问星座..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: '#fff' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}

// 星座结果页面
export default function ZodiacResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getFortuneResult(id);
        setResult(resp.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>星座解读中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-error)' }}>{error || '数据加载失败'}</p>
          <Link to="/zodiac" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <ChevronLeft className="w-4 h-4" /> 返回重新测算
          </Link>
        </div>
      </div>
    );
  }

  const data = (result.data || {}) as Record<string, string>;
  const interpretation = result.interpretation || '';

  // 星座信息
  const signMap: Record<string, { emoji: string; date: string; element: string; symbol: string }> = {
    白羊座: { emoji: '♈', date: '3月21日 - 4月19日', element: '火象星座', symbol: '♈' },
    金牛座: { emoji: '♉', date: '4月20日 - 5月20日', element: '土象星座', symbol: '♉' },
    双子座: { emoji: '♊', date: '5月21日 - 6月21日', element: '风象星座', symbol: '♊' },
    巨蟹座: { emoji: '♋', date: '6月22日 - 7月22日', element: '水象星座', symbol: '♋' },
    狮子座: { emoji: '♌', date: '7月23日 - 8月22日', element: '火象星座', symbol: '♌' },
    处女座: { emoji: '♍', date: '8月23日 - 9月22日', element: '土象星座', symbol: '♍' },
    天秤座: { emoji: '♎', date: '9月23日 - 10月23日', element: '风象星座', symbol: '♎' },
    天蝎座: { emoji: '♏', date: '10月24日 - 11月22日', element: '水象星座', symbol: '♏' },
    射手座: { emoji: '♐', date: '11月23日 - 12月21日', element: '火象星座', symbol: '♐' },
    摩羯座: { emoji: '♑', date: '12月22日 - 1月19日', element: '土象星座', symbol: '♑' },
    水瓶座: { emoji: '♒', date: '1月20日 - 2月18日', element: '风象星座', symbol: '♒' },
    双鱼座: { emoji: '♓', date: '2月19日 - 3月20日', element: '水象星座', symbol: '♓' },
  };

  const signName = String(data.sign || result.input?.sign || '狮子座');
  const signInfo = signMap[signName] || signMap['狮子座'];

  // 五项评分
  const ratings = {
    财运: parseInt(data.wealth as string) || 4,
    事业: parseInt(data.career as string) || 4,
    感情: parseInt(data.love as string) || 3,
    健康: parseInt(data.health as string) || 4,
    学习: parseInt(data.study as string) || 4,
  };

  // 行星状态
  const planets = [
    { planet: '太阳', emoji: '☀️', sign: signName, status: '庙旺位置', effect: '领导力、创造力爆发期' },
    { planet: '月亮', emoji: '🌙', sign: '白羊座', status: '旺相', effect: '情感表达直接有力' },
    { planet: '金星', emoji: '♀', sign: '双子座', status: '失势', effect: '感情观念趋于理性' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 星空背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15%" cy="20%" r="1.5" fill="var(--color-gold)" opacity="0.6" />
          <circle cx="35%" cy="10%" r="1" fill="var(--color-gold-light)" opacity="0.4" />
          <circle cx="55%" cy="25%" r="2" fill="var(--color-gold)" opacity="0.5" />
          <circle cx="75%" cy="15%" r="1.5" fill="var(--color-gold-light)" opacity="0.4" />
          <circle cx="85%" cy="30%" r="1" fill="var(--color-gold)" opacity="0.5" />
        </svg>
      </div>

      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 返回导航 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/zodiac"
            className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)' }}
          >
            <ChevronLeft className="w-4 h-4" />返回
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>西方占卜</span>
            <ChevronRight className="w-3 h-3" />
            <span>星座运势</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'var(--color-text-secondary)' }}>分析结果</span>
          </div>
        </div>

        {/* 星座专属头部 */}
        <section className="mb-8 p-6 rounded-xl text-center" style={{
          background: 'linear-gradient(180deg, rgba(147,51,234,0.1) 0%, transparent 100%)',
          border: '1px solid rgba(147,51,234,0.2)'
        }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #9333ea, #c026d3)', color: '#fff' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            西方占卜 · 星座运势
          </span>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-7xl">{signInfo.emoji}</span>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-gold)' }}>{signName}</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{signInfo.date} · {signInfo.element}</p>
            </div>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </section>

        {/* 综合运势 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c026d3" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            本月综合运势
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StarRating rating={ratings.财运} label="财运" color="#f87171" />
            <StarRating rating={ratings.事业} label="事业" color="#60a5fa" />
            <StarRating rating={ratings.感情} label="感情" color="#f472b6" />
            <StarRating rating={ratings.健康} label="健康" color="#4ade80" />
            <StarRating rating={ratings.学习} label="学习" color="#a855f7" />
          </div>
          {/* 综合评分 */}
          <div className="flex items-center justify-center gap-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)' }}>
            <svg className="w-24 h-24" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="48" cy="48" r="40" fill="none" stroke="var(--color-border)" strokeWidth="6" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="url(#goldGradient)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray="251.2" strokeDashoffset="37.68" style={{ filter: 'drop-shadow(0 0 6px var(--color-gold))' }} />
              <defs>
                <linearGradient id="goldGradient">
                  <stop offset="0%" stopColor="var(--color-gold-light)" />
                  <stop offset="100%" stopColor="var(--color-gold)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--color-gold)' }}>{(data.score) || 85}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>综合评分</div>
            </div>
          </div>
        </section>

        {/* 行星相位 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text)' }}>行星状态</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {planets.map((p, idx) => (
              <PlanetCard key={idx} {...p} />
            ))}
          </div>
        </section>

        {/* AI 深度解读 */}
        <AIDeepDive interpretation={interpretation} resultId={result.id} />
      </main>

      {/* 固定底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart className="w-5 h-5" /><span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 className="w-5 h-5" /><span className="text-xs">分享</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <FileText className="w-5 h-5" /><span className="text-xs">报告</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <RefreshCw className="w-5 h-5" /><span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}