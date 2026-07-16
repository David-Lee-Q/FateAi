import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Bookmark, Send, Compass, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchFortuneResult } from '@/services/api';

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadResult = async () => {
      setLoading(true);
      try {
        const data = await fetchFortuneResult(id);
        setResult(data.data || data);
      } catch (err) {
        setError('获取结果失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [id]);

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
          <button onClick={() => navigate('/qimen')} className="px-6 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            返回奇门
          </button>
        </div>
      </div>
    );
  }

  const question = result.question || result.data?.question || '奇门占卜';
  const details = result.details || result.data?.details || {};
  // AI 解读从多个可能的位置获取
  const aiContent = result.aiInterpretation
    || result.aiAnalysis
    || result.data?.aiInterpretation
    || result.data?.suggestion
    || '';

  // 九宫方位映射
  const palaceMap: Record<string, { name: string; star: string; door: string; shadow: string }> = {
    '正南': details.baMen?.['离九宫'] || '景门',
    '西南': details.baMen?.['坤二宫'] || '死门',
    '正东': details.baMen?.['震三宫'] || '伤门',
    '东南': details.baMen?.['巽四宫'] || '景门',
    '中宫': details.baMen?.['中五宫'] || '伤门',
    '正西': details.baMen?.['兑七宫'] || '惊门',
    '东北': details.baMen?.['艮八宫'] || '死门',
    '正北': details.baMen?.['坎一宫'] || '休门',
    '西北': details.baMen?.['乾六宫'] || '开门',
  };

  // 从 details 构建九宫数据
  const palaces = {
    '正南': { star: details.jiuXing?.['离九宫'] || details.tianPan?.['离九宫'] || '天英', door: details.baMen?.['离九宫'] || '景门', shadow: details.baShen?.['离九宫'] || '螣蛇' },
    '西南': { star: details.jiuXing?.['坤二宫'] || details.tianPan?.['坤二宫'] || '天任', door: details.baMen?.['坤二宫'] || '死门', shadow: details.baShen?.['坤二宫'] || '太阴' },
    '正东': { star: details.jiuXing?.['震三宫'] || details.tianPan?.['震三宫'] || '天冲', door: details.baMen?.['震三宫'] || '生门', shadow: details.baShen?.['震三宫'] || '九地' },
    '东南': { star: details.jiuXing?.['巽四宫'] || details.tianPan?.['巽四宫'] || '天辅', door: details.baMen?.['巽四宫'] || '景门', shadow: details.baShen?.['巽四宫'] || '九天' },
    '中宫': { star: details.jiuXing?.['中五宫'] || details.tianPan?.['中五宫'] || '天英', door: details.baMen?.['中五宫'] || '伤门', shadow: details.baShen?.['中五宫'] || '太阴' },
    '正西': { star: details.jiuXing?.['兑七宫'] || details.tianPan?.['兑七宫'] || '天柱', door: details.baMen?.['兑七宫'] || '惊门', shadow: details.baShen?.['兑七宫'] || '玄武' },
    '东北': { star: details.jiuXing?.['艮八宫'] || details.tianPan?.['艮八宫'] || '天心', door: details.baMen?.['艮八宫'] || '死门', shadow: details.baShen?.['艮八宫'] || '螣蛇' },
    '正北': { star: details.jiuXing?.['坎一宫'] || details.tianPan?.['坎一宫'] || '天蓬', door: details.baMen?.['坎一宫'] || '开门', shadow: details.baShen?.['坎一宫'] || '值符' },
    '西北': { star: details.jiuXing?.['乾六宫'] || details.tianPan?.['乾六宫'] || '天芮', door: details.baMen?.['乾六宫'] || '杜门', shadow: details.baShen?.['乾六宫'] || '值使' },
  };

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
            {details.juShu || '奇门遁甲'}
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            问事：{question}
          </p>
          {result.fortune && (
            <div className="flex justify-center mt-4">
              <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                {result.fortune}
              </div>
            </div>
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
            {result.patterns || [
              { type: '吉', title: '三奇得使', content: '乙丙丁三奇配合六仪，利出行、交易、求财。' },
              { type: '吉', title: '开门吉位', content: '西北乾宫开门，临九天，适合事业发展。' },
              { type: '注意', title: '白虎凶动', content: '正东震宫白虎临位，谨言慎行，避免冲突。' },
            ].map((item: any, idx: number) => (
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
        {(aiContent || result.suggestion) && (
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
                  {aiContent || result.suggestion || ''}
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