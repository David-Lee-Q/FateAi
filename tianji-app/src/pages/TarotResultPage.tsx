import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Share2, Loader2, ChevronLeft, Send, RefreshCw, Heart, FileText, ChevronRight, Star,
} from 'lucide-react';
import type { FortuneResult } from '@/types';
import { getFortuneResult, submitFollowUp } from '@/services/api';

// 塔罗牌卡片组件
function TarotCard({ card, position, orientation }: {
  card: { name: string; nameEn: string; meaning: string };
  position: string;
  orientation: 'upright' | 'reversed';
}) {
  const isReversed = orientation === 'reversed';
  const colorMap: Record<string, string> = {
    过去: '#fbbf24',
    现在: '#a855f7',
    未来: '#06b6d4',
  };
  const iconMap: Record<string, React.ReactNode> = {
    过去: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    现在: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    未来: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  };

  return (
    <div
      className="w-32 h-48 rounded-xl p-3 flex flex-col text-center"
      style={{
        background: 'linear-gradient(145deg, #1a2235, #0f1525)',
        border: `2px solid ${colorMap[position] || '#a855f7'}`,
        boxShadow: `0 0 30px ${colorMap[position] || '#a855f7'}40`,
        transform: isReversed ? 'rotate(180deg)' : 'none',
      }}
    >
      <div className="text-center mb-2">
        <div style={{ color: colorMap[position] || '#a855f7' }}>{iconMap[position]}</div>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{position}</p>
      </div>
      <div className="flex-1 bg-gradient-to-b from-purple-800/30 to-purple-900/30 rounded-lg flex items-center justify-center p-2">
        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: colorMap[position] }}>{card.name}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{card.nameEn}</p>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            background: `${colorMap[position]}30`,
            color: colorMap[position],
          }}
        >
          {isReversed ? '逆位' : '正位'}
        </span>
      </div>
    </div>
  );
}

// AI 深度解读组件
function AIDeepDive({ interpretation, system }: { interpretation: string; system: string }) {
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setSubmitting(true);
    try {
      await submitFollowUp({ question, system });
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
              placeholder="继续追问牌义..."
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

// 塔罗牌结果页面
export default function TarotResultPage() {
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
        const data = await getFortuneResult(id);
        setResult(data);
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
          <p style={{ color: 'var(--color-text-secondary)' }}>塔罗牌解读中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-error)' }}>{error || '数据加载失败'}</p>
          <Link to="/tarot" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <ChevronLeft className="w-4 h-4" /> 返回重新抽牌
          </Link>
        </div>
      </div>
    );
  }

  // 解析塔罗牌数据
  const cards = result.data?.cards || [
    { name: '愚人', nameEn: 'The Fool', position: '过去', orientation: 'upright', meaning: '新的开始、冒险' },
    { name: '恋人', nameEn: 'The Lovers', position: '现在', orientation: 'reversed', meaning: '抉择、平衡' },
    { name: '星星', nameEn: 'The Star', position: '未来', orientation: 'upright', meaning: '希望、疗愈' },
  ];

  const interpretation = result.interpretation || '';
  const guidance = result.guidance || {};

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 返回导航 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/tarot"
            className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)' }}
          >
            <ChevronLeft className="w-4 h-4" />返回
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>西方占卜</span>
            <ChevronRight className="w-3 h-3" />
            <span>塔罗牌</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'var(--color-text-secondary)' }}>解读结果</span>
          </div>
        </div>

        {/* 塔罗牌头部 */}
        <section className="mb-8 p-6 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(251,191,36,0.05) 100%)',
          border: '1px solid rgba(139,92,246,0.2)'
        }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>塔罗牌解读</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>维特塔罗 · 三牌阵</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Star className="w-3 h-3 inline mr-1" />三牌阵
            </span>
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(200,168,78,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(200,168,78,0.3)' }}>
              {result.createdAt ? new Date(result.createdAt).toLocaleDateString('zh-CN') : '今日'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
              解读完成
            </span>
          </div>
        </section>

        {/* 牌阵展示区 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" />
            </svg>
            牌阵布局
          </h2>

          {/* 三牌阵可视化 */}
          <div className="flex justify-center gap-6 mb-8 py-8 flex-wrap">
            {cards.map((card: Record<string, unknown>, idx: number) => (
              <TarotCard
                key={idx}
                card={card as { name: string; nameEn: string; meaning: string }}
                position={card.position as string || ['过去', '现在', '未来'][idx]}
                orientation={(card.orientation as 'upright' | 'reversed') || 'upright'}
              />
            ))}
          </div>

          {/* 牌义解读 */}
          <div className="grid md:grid-cols-3 gap-4">
            {cards.map((card: Record<string, unknown>, idx: number) => {
              const colorMap: Record<string, string> = {
                过去: '#fbbf24',
                现在: '#a855f7',
                未来: '#06b6d4',
              };
              const position = card.position as string || ['过去', '现在', '未来'][idx];
              return (
                <div
                  key={idx}
                  className="rounded-xl p-4"
                  style={{
                    background: `linear-gradient(135deg, ${colorMap[position]}18, transparent)`,
                    border: `1px solid ${colorMap[position]}40`
                  }}
                >
                  <h3 className="font-medium mb-2 flex items-center gap-2" style={{ color: colorMap[position] }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {idx === 0 ? <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> :
                       idx === 1 ? <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> :
                       <><path d="M5 12h14M12 5l7 7-7 7"/></>}
                    </svg>
                    {position} · {card.name as string}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {card.meaning as string || '牌义解读内容'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 综合指引 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, var(--color-bg-elevated) 100%)',
          border: '1px solid rgba(139,92,246,0.2)'
        }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            综合指引
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {guidance.love || '感情方面需要冷静思考，给彼此空间。'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(251,191,36,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {guidance.career || '事业上将有新机遇，保持创意与希望。'}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {guidance.health || '健康注意调节身心，适当休息与放松。'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(6,182,212,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {guidance.lucky || '幸运色：紫色与金色；幸运方位：东方；幸运数字：7'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI 深度解读 */}
        <AIDeepDive interpretation={interpretation} system="tarot" />
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
            <RefreshCw className="w-5 h-5" /><span className="text-xs">重抽</span>
          </button>
        </div>
      </div>
    </div>
  );
}