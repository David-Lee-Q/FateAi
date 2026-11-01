import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Compass, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 壬课宫位卡片 */
function DaliurenPalaceCard({ palace, ganZhi, shenJiang, xingChen }: { palace: string; ganZhi: string; shenJiang: string; xingChen: string }) {
  return (
    <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="text-xs mb-1" style={{ color: 'var(--color-gold)' }}>{palace}</div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{ganZhi}</div>
      <div className="text-xs mb-1" style={{ color: '#10b981' }}>{shenJiang}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{xingChen}</div>
    </div>
  );
}

/** 大六壬结果页 */
export default function DaliurenResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpResult, setFollowUpResult] = useState('');

  const handleFollowUp = async () => {
    if (!followUpText.trim() || followUpLoading) return;
    setFollowUpLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFollowUpResult(prev => prev + (prev ? '\n\n---\n\n' : '') + `**您问**：${followUpText}\n\n**AI答**：根据六壬课象分析，这个问题需要结合您之前的占卜结果来解读...`);
      setFollowUpText('');
    } catch {
      alert('追问失败，请稍后重试');
    } finally {
      setFollowUpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto mb-4 animate-spin" style={{ color: 'var(--color-gold)' }} />
          <p style={{ color: 'var(--color-text-light)' }}>大六壬起课中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: '#ef4444' }}>{error || '未找到结果'}</p>
          <button onClick={retry} className="mr-2 px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            重试
          </button>
          <button onClick={() => navigate('/daliuren')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            返回大六壬
          </button>
        </div>
      </div>
    );
  }

  const questionText = question || '大六壬占卜';
  const aiContent = interpretation;
  const timeInfo = (data.time && typeof data.time === 'object') ? (data.time as Record<string, string>) : {};
  const judgments = (data.judgments && typeof data.judgments === 'object') ? (data.judgments as Record<string, unknown>) : {};
  const overallFortune = (typeof judgments.overall === 'string' && judgments.overall) ? (judgments.overall as string) : '';
  const fortuneLevel = (typeof judgments.fortune === 'string' && judgments.fortune) ? (judgments.fortune as string) : '';
  const zongmen = (typeof judgments.lesson === 'string' && judgments.lesson)
    ? (judgments.lesson as string)
    : (overallFortune.split(/[，。,.；;]/)[0] || '六壬课');
  const goodAspects = Array.isArray(judgments.goodAspects) ? (judgments.goodAspects as string[]) : [];
  const badAspects = Array.isArray(judgments.badAspects) ? (judgments.badAspects as string[]) : [];
  const liuqin = Array.isArray(data.liuqin) ? (data.liuqin as string[]) : [];

  const keInfo = (data.ke && typeof data.ke === 'object') ? (data.ke as Record<string, string>) : {};
  const shenInfo = (data.shen && typeof data.shen === 'object') ? (data.shen as Record<string, string>) : {};
  const tianpan = (data.tianpan && typeof data.tianpan === 'object') ? (data.tianpan as Record<string, string>) : {};
  const dipan = (data.dipan && typeof data.dipan === 'object') ? (data.dipan as Record<string, string>) : {};

  const PALACE_DIRS = ['东南', '正南', '西南', '正东', '正西', '东北', '正北', '西北'];
  const palaceData = PALACE_DIRS.reduce<Record<string, { ganZhi: string; shenJiang: string; xingChen: string }>>((acc, dir) => {
    const wei = dir === '正东' ? '震' : dir === '正南' ? '离' : dir === '正西' ? '兑' : dir === '正北' ? '坎' : dir === '东南' ? '巽' : dir === '西南' ? '坤' : dir === '东北' ? '艮' : '乾';
    const keKey = { '东南': 'ke4', '正东': 'ke3', '东北': 'ke2', '正北': 'ke1' }[dir];
    const shenKey = { '东南': 'shen4', '正东': 'shen3', '东北': 'shen2', '正北': 'shen1' }[dir];
    acc[dir] = {
      ganZhi: (keKey ? keInfo[keKey] : '') || tianpan[wei] || dipan[wei] || '--',
      shenJiang: (shenKey ? shenInfo[shenKey] : '') || '--',
      xingChen: dipan[wei] || tianpan[wei] || '--',
    };
    return acc;
  }, {});

  const patterns: { type: string; title: string; content: string }[] = [];
  for (const good of goodAspects) patterns.push({ type: '吉', title: '吉利之处', content: good });
  for (const bad of badAspects) patterns.push({ type: '注意', title: '需要注意', content: bad });
  for (const item of liuqin) patterns.push({ type: '注意', title: '三传六亲', content: item });
  if (patterns.length === 0 && overallFortune) {
    patterns.push({ type: '吉', title: '课象总断', content: overallFortune });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="sticky z-40 w-full" style={{ top: 'var(--navbar-height)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/daliuren')} className="nav-back-btn inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>大六壬</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(200,168,78,0.06) 100%)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a0e1a' }}>
              <Compass size={16} />大六壬
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {zongmen}
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{questionText}
            {timeInfo.shichen ? ` ｜ 起课：${timeInfo.shichen}` : ''}
            {timeInfo.yuejiang ? ` ｜ 月将：${timeInfo.yuejiang}` : ''}
          </p>
          {overallFortune && (
            <div className="flex justify-center gap-3 mt-4">
              {fortuneLevel && (
                <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: fortuneLevel === '吉' || fortuneLevel === '上' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: fortuneLevel === '吉' || fortuneLevel === '上' ? '#10b981' : '#fbbf24', border: `1px solid ${fortuneLevel === '吉' || fortuneLevel === '上' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}` }}>
                  吉凶：{fortuneLevel}
                </div>
              )}
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a0e1a', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
                {overallFortune}
              </div>
            </div>
          )}
        </section>

        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>🎯</span>六壬地盘
          </h2>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            <DaliurenPalaceCard palace="巽" {...palaceData['东南']} />
            <DaliurenPalaceCard palace="离" {...palaceData['正南']} />
            <DaliurenPalaceCard palace="坤" {...palaceData['西南']} />
            <DaliurenPalaceCard palace="震" {...palaceData['正东']} />
            <DaliurenPalaceCard palace="中" ganZhi="寄" shenJiang="坤" xingChen="未" />
            <DaliurenPalaceCard palace="兑" {...palaceData['正西']} />
            <DaliurenPalaceCard palace="艮" {...palaceData['东北']} />
            <DaliurenPalaceCard palace="坎" {...palaceData['正北']} />
            <DaliurenPalaceCard palace="乾" {...palaceData['西北']} />
          </div>
        </section>

        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>⚡</span>吉凶判断
          </h2>
          <div className="space-y-3">
            {patterns.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ background: item.type === '吉' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${item.type === '吉' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: item.type === '吉' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: item.type === '吉' ? '#10b981' : '#fbbf24' }}>{item.type}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.title}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {aiContent && (
          <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(200,168,78,0.04))', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                <Sparkles size={16} style={{ color: '#0a0e1a' }} />
              </div>
              <h2 className="text-lg font-bold">AI 深度解读</h2>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiContent}
              </ReactMarkdown>
            </div>
          </section>
        )}

        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Compass size={18} style={{ color: '#f59e0b' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续询问六壬课象..."
              />
            </div>
            <button
              onClick={handleFollowUp}
              disabled={!followUpText.trim() || followUpLoading}
              className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
            >
              {followUpLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          {followUpResult && (
            <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {followUpResult}
              </ReactMarkdown>
            </div>
          )}
        </section>
      </div>

      <div className="result-toolbar fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors" style={{ color: isBookmarked ? 'var(--color-gold)' : 'var(--color-text-secondary)' }}>
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="tool-btn flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/daliuren')} className="tool-btn flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}