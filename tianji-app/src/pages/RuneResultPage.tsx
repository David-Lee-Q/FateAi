import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFortuneResult } from '@/hooks/useFortuneResult';

/** 符文名称映射 */
const RUNE_NAMES: Record<string, { symbol: string; name: string; nameCn: string; meaning: string }> = {
  fehu: { symbol: 'ᚠ', name: 'Fehu', nameCn: '财富', meaning: '富足、丰收、流动的能量' },
  uruz: { symbol: 'ᚢ', name: 'Uruz', nameCn: '力量', meaning: '原始力量、健康、勇敢面对挑战' },
  thurisaz: { symbol: 'ᚦ', name: 'Thurisaz', nameCn: '荆棘', meaning: '防御、保护的边界、潜藏的危险' },
  ansuz: { symbol: 'ᚨ', name: 'Ansuz', nameCn: '神谕', meaning: '智慧、沟通、来自神灵的信息' },
  raido: { symbol: 'ᚱ', name: 'Raido', nameCn: '旅途', meaning: '旅途、节奏、人生的有序发展' },
  kenaz: { symbol: 'ᚲ', name: 'Kenaz', nameCn: '火炬', meaning: '创造力、灵感、内心的火焰' },
  gebo: { symbol: 'ᚷ', name: 'Gebo', nameCn: '礼物', meaning: '合作、平衡的交换、爱的联结' },
  wunjo: { symbol: 'ᚹ', name: 'Wunjo', nameCn: '喜悦', meaning: '幸福、满足、愿望的达成' },
  hagalaz: { symbol: 'ᚺ', name: 'Hagalaz', nameCn: '冰雹', meaning: '颠覆性变化、打破旧有模式' },
  nauthiz: { symbol: 'ᚾ', name: 'Nauthiz', nameCn: '必需', meaning: '匮乏中的成长、忍耐与自律' },
  isa: { symbol: 'ᛁ', name: 'Isa', nameCn: '冰', meaning: '静止、暂停、内省与等待' },
  jera: { symbol: 'ᛃ', name: 'Jera', nameCn: '丰收', meaning: '循环、因果报应、耐心等待收获' },
  eihwaz: { symbol: 'ᛇ', name: 'Eihwaz', nameCn: '紫杉', meaning: '坚韧、生死之间的桥梁、内在力量' },
  perthro: { symbol: 'ᛈ', name: 'Perthro', nameCn: '命运', meaning: '神秘、命运、隐藏的可能性' },
  algiz: { symbol: 'ᛉ', name: 'Algiz', nameCn: '守护', meaning: '保护、神圣的庇护、觉醒的意识' },
  sowilo: { symbol: 'ᛊ', name: 'Sowilo', nameCn: '太阳', meaning: '胜利、生命力、光明的力量' },
  tiwaz: { symbol: 'ᛏ', name: 'Tiwaz', nameCn: '战神', meaning: '正义、牺牲、为信念而战' },
  berkano: { symbol: 'ᛒ', name: 'Berkano', nameCn: '白桦', meaning: '新生、滋养、女性能量' },
  ehwaz: { symbol: 'ᛖ', name: 'Ehwaz', nameCn: '骏马', meaning: '伙伴关系、信任、前进的动力' },
  mannaz: { symbol: 'ᛗ', name: 'Mannaz', nameCn: '人类', meaning: '自我认知、人际和谐、智慧' },
  laguz: { symbol: 'ᛚ', name: 'Laguz', nameCn: '流水', meaning: '直觉、潜意识、流动与变化' },
  ingwaz: { symbol: 'ᛜ', name: 'Ingwaz', nameCn: '丰饶', meaning: '孕育、潜力、新生命的种子' },
  dagaz: { symbol: 'ᛞ', name: 'Dagaz', nameCn: '黎明', meaning: '觉醒、突破、光明驱散黑暗' },
  othala: { symbol: 'ᛟ', name: 'Othala', nameCn: '传承', meaning: '祖产、家族、精神遗产' },
};

/** 占卜方式标签 */
const SPREAD_LABELS: Record<string, string[]> = {
  single: ['单符文'],
  three: ['过去', '现在', '未来'],
  odin: ['过去', '现在', '未来', '建议', '结果'],
};

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

/** 符文结果页 */
export default function RuneResultPage() {
  const navigate = useNavigate();
  const { result, data, interpretation, question, loading, error, retry } = useFortuneResult();
  const [followUpText, setFollowUpText] = useState('');

  if (loading) return <PageLoading />;
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-primary-darker)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-state-error)' }}>{error || '未找到结果'}</p>
          <button onClick={retry} className="mt-4 mr-2 px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            重试
          </button>
          <button onClick={() => navigate('/rune')} className="mt-4 px-6 py-2 rounded-lg text-sm" style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}>
            返回重新测试
          </button>
        </div>
      </div>
    );
  }

  const divData = (data || {}) as Record<string, unknown>;
  const details = (divData.details && typeof divData.details === 'object' ? divData.details : {}) as Record<string, unknown>;
  const aiText = interpretation;
  const runeList = (Array.isArray(details.runes) ? details.runes : []) as { name?: string; symbol?: string; meaning?: string; reversed?: boolean; position?: string }[];
  const spreadName = (typeof details.spread === 'string' && details.spread) || '';
  const spreadLabels = SPREAD_LABELS[runeList.length === 1 ? 'single' : runeList.length === 3 ? 'three' : 'single'] || [];
  const summary = (typeof divData.summary === 'string' && divData.summary) || '';

  return (
    <div style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)', color: '#e8ecf4', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <header className="sticky z-40" style={{ top: 'var(--navbar-height)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
            <span style={{ color: 'rgba(200,168,78,0.3)' }}>|</span>
            <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>符文占卜</span>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 符文展示 */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
            符文已显
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {spreadName || (runeList.length === 1 ? '单符文解读' : runeList.length === 3 ? '三符文：过去·现在·未来' : '符文解读')}
          </p>
          {summary && (
            <p className="text-xs mt-3 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>{summary}</p>
          )}

          {/* 符文卡片 */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {runeList.map((rune, i) => {
              const nameCn = (rune.name && RUNE_NAMES[rune.name.toLowerCase()]?.nameCn) || rune.name || '未知';
              const symbol = rune.symbol || RUNE_NAMES[rune.name?.toLowerCase() || '']?.symbol || '?';
              const meaning = rune.meaning || RUNE_NAMES[rune.name?.toLowerCase() || '']?.meaning || '';
              return (
                <div
                  key={i}
                  className="relative rounded-2xl p-6 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,168,78,0.08), rgba(0,75,170,0.04))',
                    border: '1px solid rgba(200,168,78,0.2)',
                    minWidth: 140,
                  }}
                >
                  {/* 位置标签 */}
                  {(spreadLabels[i] || rune.position) && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
                    >
                      {rune.position || spreadLabels[i]}
                    </span>
                  )}
                  {/* 符文符号 */}
                  <span className="block text-5xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: 'var(--color-gold-light)' }}>
                    {symbol}
                  </span>
                  {/* 符文名称 */}
                  <div className="font-semibold mb-1" style={{ color: '#e8ecf4' }}>{nameCn}</div>
                  <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{rune.name}{rune.reversed ? '（逆位）' : ''}</div>
                  {/* 含义 */}
                  <div className="text-xs mt-3 pt-3" style={{ color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(200,168,78,0.1)' }}>
                    {meaning}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI 解读 */}
        {aiText && (
          <div
            className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,75,170,0.05), rgba(200,168,78,0.03))',
              border: '1px solid rgba(200,168,78,0.1)',
            }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.05) 0%, transparent 70%)' }} />
            </div>

            <div className="relative flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}>
                <Sparkles size={20} style={{ color: '#0a0e1a' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: '#e8ecf4' }}>AI 深度解读</h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>北欧古老智慧与现代 AI 的结合</p>
              </div>
            </div>

            {question && (
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(200,168,78,0.05)', border: '1px solid rgba(200,168,78,0.1)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-gold)' }}>您的问题</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{question}</p>
              </div>
            )}

            <div className="prose prose-invert max-w-none" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiText}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 操作区 */}
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
                placeholder="对符文有更多疑问？"
                className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#0a0f2e', border: '1px solid rgba(30,39,64,0.8)', color: '#e8ecf4' }}
              />
              <button className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                追问
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(30,39,64,0.6)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e8ecf4' }}>
              <RefreshCw size={18} style={{ color: 'var(--color-gold)' }} />
              再次占卜
            </h3>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>让符文再次为你揭示命运的指引</p>
            <button
              onClick={() => navigate('/rune')}
              className="w-full py-2.5 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
            >
              重新抽符文
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}