import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Compass, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 奇门宫位卡片 */
function QimenPalaceCard({ palace, star, door, shadow }: { palace: string; star: string; door: string; shadow: string }) {
  return (
    <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}>
      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{palace}</div>
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{star}</div>
      <div className="text-xs mb-1" style={{ color: '#10b981' }}>{door}</div>
      <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{shadow}</div>
    </div>
  );
}

/** 奇门遁甲结果页 */
export default function QimenResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-light)' }}>奇门起局中...</p>
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
          <button onClick={() => navigate('/qimen')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回奇门
          </button>
        </div>
      </div>
    );
  }

  const details = (data.details && typeof data.details === 'object' ? data.details : {}) as Record<string, unknown>;
  const questionText = question || '奇门占卜';
  const aiContent = interpretation;
  const summary = (typeof data.summary === 'string' && data.summary) || '';
  const baMen = (details.baMen && typeof details.baMen === 'object') ? (details.baMen as Record<string, string>) : {};
  const baShen = (details.baShen && typeof details.baShen === 'object') ? (details.baShen as Record<string, string>) : {};

  const jiuXing = (details.jiuXing && typeof details.jiuXing === 'object') ? (details.jiuXing as Record<string, string>) : {};
  const tianPan = (details.tianPan && typeof details.tianPan === 'object') ? (details.tianPan as Record<string, string>) : {};

  // 从 details 构建九宫数据
  const palaces: Record<string, { star: string; door: string; shadow: string }> = {
    '正南': { star: jiuXing['离九宫'] || tianPan['离九宫'] || '天英', door: baMen['离九宫'] || '景门', shadow: baShen['离九宫'] || '螣蛇' },
    '西南': { star: jiuXing['坤二宫'] || tianPan['坤二宫'] || '天任', door: baMen['坤二宫'] || '死门', shadow: baShen['坤二宫'] || '太阴' },
    '正东': { star: jiuXing['震三宫'] || tianPan['震三宫'] || '天冲', door: baMen['震三宫'] || '生门', shadow: baShen['震三宫'] || '九地' },
    '东南': { star: jiuXing['巽四宫'] || tianPan['巽四宫'] || '天辅', door: baMen['巽四宫'] || '景门', shadow: baShen['巽四宫'] || '九天' },
    '中宫': { star: jiuXing['中五宫'] || tianPan['中五宫'] || '天英', door: baMen['中五宫'] || '伤门', shadow: baShen['中五宫'] || '太阴' },
    '正西': { star: jiuXing['兑七宫'] || tianPan['兑七宫'] || '天柱', door: baMen['兑七宫'] || '惊门', shadow: baShen['兑七宫'] || '玄武' },
    '东北': { star: jiuXing['艮八宫'] || tianPan['艮八宫'] || '天心', door: baMen['艮八宫'] || '死门', shadow: baShen['艮八宫'] || '螣蛇' },
    '正北': { star: jiuXing['坎一宫'] || tianPan['坎一宫'] || '天蓬', door: baMen['坎一宫'] || '开门', shadow: baShen['坎一宫'] || '值符' },
    '西北': { star: jiuXing['乾六宫'] || tianPan['乾六宫'] || '天芮', door: baMen['乾六宫'] || '杜门', shadow: baShen['乾六宫'] || '值使' },
  };

  // 从真实排盘数据构建吉凶格局
  const luckyDoors = ['开门', '休门', '生门'];
  const unluckyDoors = ['死门', '惊门', '伤门'];
  const patterns: { type: string; title: string; content: string }[] = [];
  const luckyGongs = Object.entries(baMen).filter(([, door]) => luckyDoors.includes(door));
  const unluckyGongs = Object.entries(baMen).filter(([, door]) => unluckyDoors.includes(door));
  for (const [gong, door] of luckyGongs.slice(0, 3)) patterns.push({ type: '吉', title: `${gong}·${door}`, content: `${gong}临${door}，主吉，宜主动进取。` });
  for (const [gong, door] of unluckyGongs.slice(0, 3)) patterns.push({ type: '注意', title: `${gong}·${door}`, content: `${gong}临${door}，宜谨慎，避免冒进。` });
  const zhiFuGong = Object.entries(baShen).find(([, shen]) => shen === '值符');
  if (zhiFuGong) patterns.push({ type: '吉', title: `值符临${zhiFuGong[0]}`, content: `值符${zhiFuGong[0]}，大吉之象，主贵人扶持。` });

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <button onClick={() => navigate('/qimen')} className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
            <ChevronLeft size={16} />返回
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <span>/</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>奇门遁甲</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 专属头部 - 奇门风格 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,75,170,0.06) 100%)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}>
              <Compass size={16} />奇门遁甲
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {typeof details.juShu === 'string' ? details.juShu : '奇门遁甲'}
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{questionText}
          </p>
          {summary && (
            <p className="mt-3 text-xs text-center max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {summary}
            </p>
          )}
        </section>

        {/* 九宫飞盘 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <span>🎯</span>九宫飞盘
          </h2>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            <QimenPalaceCard palace="巽" star={palaces['东南'].star} door={palaces['东南'].door} shadow={palaces['东南'].shadow} />
            <QimenPalaceCard palace="离" star={palaces['正南'].star} door={palaces['正南'].door} shadow={palaces['正南'].shadow} />
            <QimenPalaceCard palace="坤" star={palaces['西南'].star} door={palaces['西南'].door} shadow={palaces['西南'].shadow} />
            <QimenPalaceCard palace="震" star={palaces['正东'].star} door={palaces['正东'].door} shadow={palaces['正东'].shadow} />
            <QimenPalaceCard palace="中" star={palaces['中宫'].star} door={palaces['中宫'].door} shadow={palaces['中宫'].shadow} />
            <QimenPalaceCard palace="兑" star={palaces['正西'].star} door={palaces['正西'].door} shadow={palaces['正西'].shadow} />
            <QimenPalaceCard palace="艮" star={palaces['东北'].star} door={palaces['东北'].door} shadow={palaces['东北'].shadow} />
            <QimenPalaceCard palace="坎" star={palaces['正北'].star} door={palaces['正北'].door} shadow={palaces['正北'].shadow} />
            <QimenPalaceCard palace="乾" star={palaces['西北'].star} door={palaces['西北'].door} shadow={palaces['西北'].shadow} />
          </div>
        </section>

        {/* 吉凶格局 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span>⚡</span>吉凶格局
          </h2>
          <div className="space-y-3">
            {patterns.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg"
                style={{
                  background: item.type === '吉' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${item.type === '吉' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: item.type === '吉' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: item.type === '吉' ? '#10b981' : '#fbbf24' }}>{item.type}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{item.title}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI 深度解读 */}
        {aiContent && (
          <section className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(168,85,247,0.04))', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                  <Sparkles size={16} style={{ color: '#fff' }} />
                </div>
                <h2 className="text-lg font-bold">AI 深度解读</h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Powered by AI</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: '#c4b5fd' }}>{children}</strong>,
                  }}
                >
                  {aiContent}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* 追问区域 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Compass size={18} style={{ color: '#7c3aed' }} />继续追问
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)} className="w-full rounded-xl pl-4 pr-4 py-3 text-sm outline-none" style={{ background: 'var(--color-bg-inset)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }} placeholder="继续询问奇门格局..." />
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
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors" style={{ color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Share2 size={20} />
            <span className="text-xs">分享</span>
          </button>
          <button onClick={() => navigate('/qimen')} className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
            <Heart size={20} />
            <span className="text-xs">重测</span>
          </button>
        </div>
      </div>
    </div>
  );
}