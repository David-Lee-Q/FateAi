import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Sparkles, Calendar, Star, Clock, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 黄历宜忌标签组件 */
function YiJiTag({ text, type }: { text: string; type: 'yi' | 'ji' }) {
  const colors = type === 'yi'
    ? { bg: 'rgba(26,138,92,0.12)', text: '#1a8a5c', border: 'rgba(26,138,92,0.2)' }
    : { bg: 'rgba(196,58,58,0.12)', text: '#c43a3a', border: 'rgba(196,58,58,0.2)' };

  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg text-sm"
      style={{
        padding: 'var(--space-3) var(--space-5)',
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {type === 'yi' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {text}
    </span>
  );
}

/** 时辰吉凶卡片 */
function HourCard({ name, time, status }: { name: string; time: string; status: '吉' | '凶' | '平' }) {
  const isLucky = status === '吉';
  const isBad = status === '凶';
  return (
    <div
      className="flex-shrink-0 rounded-lg p-4 text-center"
      style={{
        width: 100,
        background: 'var(--color-bg-elevated)',
        border: `1px solid ${isLucky ? 'rgba(26,138,92,0.3)' : isBad ? 'rgba(196,58,58,0.3)' : 'var(--color-border)'}`,
      }}
    >
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)', fontFamily: "'Noto Serif SC', serif" }}>{name}</div>
      <div className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{time}</div>
      <span
        className="inline-block rounded-full text-xs font-medium"
        style={{
          padding: '2px var(--space-3)',
          background: isLucky ? 'rgba(26,138,92,0.15)' : isBad ? 'rgba(196,58,58,0.15)' : 'rgba(139,146,168,0.15)',
          color: isLucky ? '#1a8a5c' : isBad ? '#c43a3a' : 'var(--color-text-tertiary)',
        }}
      >
        {status}
      </span>
    </div>
  );
}

/** 黄历结果页 */
export default function AlmanacResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>黄历查询中...</p>
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
          <button onClick={() => navigate('/almanac')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回黄历
          </button>
        </div>
      </div>
    );
  }

  // 解析黄历数据
  const divData = (data || {}) as Record<string, unknown>;
  const details = (divData.details && typeof divData.details === 'object' ? divData.details : {}) as Record<string, unknown>;
  const aiText = interpretation;
  const date = (typeof details.date === 'string' && details.date) || '今日';
  const lunarDate = (typeof details.lunarDate === 'string' && details.lunarDate) || '农历日期';
  const ganZhiObj = (details.ganZhi && typeof details.ganZhi === 'object') ? (details.ganZhi as Record<string, string>) : {};
  const ganZhi = `${ganZhiObj.year || ''}年 ${ganZhiObj.month || ''}月 ${ganZhiObj.day || ''}日`;

  const yiList = (Array.isArray(details.yi) ? details.yi : []) as string[];
  const jiList = (Array.isArray(details.ji) ? details.ji : []) as string[];
  const goodGods = (Array.isArray(details.jiShen) ? details.jiShen : []) as string[];
  const badGods = (Array.isArray(details.xiongShen) ? details.xiongShen : []) as string[];
  const chongSha = (typeof details.chongSha === 'string' && details.chongSha) || '';
  const chong = chongSha.split('煞')[0]?.replace('冲', '') || '';
  const sha = chongSha.split('煞')[1] || '';

  // 十二时辰（后端 shiChenLuck: { name, luck }）
  const shiChenLuck = (Array.isArray(details.shiChenLuck) ? details.shiChenLuck : []) as { name?: string; luck?: string }[];
  const hours = shiChenLuck.length > 0
    ? shiChenLuck.map((h) => ({
        name: h.name || '子时',
        time: '—',
        status: (h.luck === '吉' || h.luck === '凶' ? h.luck : '平') as '吉' | '凶' | '平',
      }))
    : [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/almanac')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>民俗趣味</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>黄历宜忌</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 黄历风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(200,168,78,0.08) 0%, rgba(200,168,78,0.04) 100%)', border: '1px solid rgba(200,168,78,0.2)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))', color: '#0a0e1a' }}>
              <Calendar size={16} />黄历宜忌
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {date} · {lunarDate}
          </h1>
          {/* 农历信息行 */}
          {ganZhi.trim() !== '年  月  日' && (
          <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-1">
              <Star size={14} style={{ color: 'var(--color-gold)' }} />
              {ganZhi}
            </span>
            <span className="flex items-center gap-1">
              <Compass size={14} style={{ color: 'var(--color-text-tertiary)' }} />
              {chongSha || '冲煞'}
            </span>
          </div>
          )}
        </section>

        {/* 宜忌主区域 */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 今日宜 */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(26,138,92,0.08), rgba(26,138,92,0.03))',
              border: '1px solid rgba(26,138,92,0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(26,138,92,0.15)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a8a5c" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#1a8a5c' }}>今日宜</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>适合进行的活动事项</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {yiList.map((item: string, idx: number) => (
                <YiJiTag key={idx} text={item} type="yi" />
              ))}
            </div>
          </div>

          {/* 今日忌 */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(196,58,58,0.08), rgba(196,58,58,0.03))',
              border: '1px solid rgba(196,58,58,0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(196,58,58,0.15)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c43a3a" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#c43a3a' }}>今日忌</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>应避免进行的活动事项</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {jiList.map((item: string, idx: number) => (
                <YiJiTag key={idx} text={item} type="ji" />
              ))}
            </div>
          </div>
        </section>

        {/* 吉神凶神 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Sparkles size={18} style={{ color: 'var(--color-gold)' }} />吉神凶神
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium block mb-3" style={{ color: 'var(--color-gold-dark)' }}>吉神宜趋</span>
              <div className="flex flex-wrap gap-2">
                {goodGods.map((god: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full text-sm"
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: 'rgba(200,168,78,0.12)',
                      color: 'var(--color-gold-dark)',
                      border: '1px solid rgba(200,168,78,0.25)',
                    }}
                  >
                    <Star size={14} />{god}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium block mb-3" style={{ color: '#c43a3a' }}>凶神宜忌</span>
              <div className="flex flex-wrap gap-2">
                {badGods.map((god: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full text-sm"
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: 'rgba(196,58,58,0.08)',
                      color: '#c43a3a',
                      border: '1px solid rgba(196,58,58,0.15)',
                    }}
                  >
                    <span>⚠️</span>{god}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 十二时辰吉凶 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Clock size={18} style={{ color: 'var(--color-primary)' }} />十二时辰吉凶
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {hours.map((h, idx) => (
              <HourCard key={idx} name={h.name} time={h.time} status={h.status} />
            ))}
          </div>
        </section>

        {/* 冲煞方位 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Compass size={18} style={{ color: 'var(--color-primary)' }} />冲煞方位
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
              <div className="inline-flex items-center justify-center rounded-full w-14 h-14 mb-3 font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: 'var(--color-text-inverse)' }}>
                冲
              </div>
              <div className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{chong}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>今日需注意</div>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
              <div className="inline-flex items-center justify-center rounded-full w-14 h-14 mb-3 font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: 'var(--color-text-inverse)' }}>
                煞
              </div>
              <div className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{sha}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>方位需避开</div>
            </div>
          </div>
        </section>

        {/* AI 解读 */}
        {aiText && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.06), rgba(200,168,78,0.04))', border: '1px solid rgba(0,75,170,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))' }}>
                  <Sparkles size={16} style={{ color: '#fff' }} />
                </div>
                <h2 className="text-lg font-bold">AI 个性化推荐</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: 'var(--color-gold-light)' }}>{children}</strong>,
                  }}
                >
                  {aiText}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Calendar size={18} style={{ color: 'var(--color-primary)' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none"
                style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                placeholder="继续询问今日宜忌..."
              />
            </div>
            <button className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
              <Send size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* 底部工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--color-bg-elevated)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors"
            style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/almanac')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}