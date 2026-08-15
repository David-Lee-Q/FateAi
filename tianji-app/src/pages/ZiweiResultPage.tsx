import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Share2, Loader2, ChevronLeft, Send, RefreshCw, Heart, FileText, ChevronRight,
} from 'lucide-react';
import { submitFollowUp } from '@/services/api';
import { useFortuneResult } from '@/hooks/useFortuneResult';

// 命盘宫位卡片组件
function PalaceCard({ name, stars, isHighlight }: {
  name: string;
  stars: string;
  isHighlight?: boolean;
}) {
  return (
    <div
      className="p-4 rounded-lg text-center"
      style={{
        background: 'var(--color-bg-inset)',
        border: isHighlight ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--color-border)',
      }}
    >
      <div className="text-xs mb-1" style={{ color: isHighlight ? '#a78bfa' : 'var(--color-text-tertiary)' }}>
        {name}
      </div>
      <div className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
        {stars.split('·')[0]}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        {stars}
      </div>
    </div>
  );
}

// 星曜卡片组件
function StarCard({ name, emoji, position, meaning }: {
  name: string;
  emoji: string;
  position: string;
  meaning: string;
}) {
  const colorMap: Record<string, string> = {
    紫微星: '#a78bfa',
    天机星: '#60a5fa',
    太阳星: 'var(--color-gold)',
    太阴星: '#f472b6',
    天同星: '#34d399',
    天梁星: '#fbbf24',
    贪狼星: '#f87171',
    七杀星: '#ef4444',
  };

  return (
    <div
      className="p-4 rounded-lg text-center"
      style={{
        background: `linear-gradient(180deg, ${colorMap[name] || '#a78bfa'}24 0%, transparent 100%)`,
        border: `1px solid ${colorMap[name] || '#a78bfa'}40`,
      }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-sm font-bold" style={{ color: colorMap[name] || '#a78bfa' }}>{name}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{position}</div>
      <div className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>{meaning}</div>
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
      style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
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
              placeholder="继续追问命盘..."
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

// 紫微斗数结果页面
export default function ZiweiResultPage() {
  const { result, data, details, interpretation, loading, error, retry } = useFortuneResult();
  const [activeTab, setActiveTab] = useState('命宫详解');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>命盘解析中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p style={{ color: 'var(--color-error)' }}>{error || '数据加载失败'}</p>
          <button onClick={retry} className="mt-4 mr-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            重试
          </button>
          <Link to="/ziwei" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <ChevronLeft className="w-4 h-4" /> 返回重新测算
          </Link>
        </div>
      </div>
    );
  }

  const mdInterpretation = interpretation || '';

  // 命盘十二宫数据（真实排盘）
  const twelvePalaces = Array.isArray(details.twelvePalaces)
    ? details.twelvePalaces as { palace: string; mainStar: string; subStars: string[] }[]
    : [];
  const palaces = twelvePalaces.length > 0
    ? twelvePalaces.map((p) => ({
        name: p.palace,
        stars: [p.mainStar, ...(p.subStars || [])].filter(Boolean).join('·') || '空宫',
        isHighlight: p.palace.includes('命'),
      }))
    : [];

  // 主要星曜：以四化信息呈现（真实数据）
  const siHua = (details.siHua && typeof details.siHua === 'object') ? details.siHua as Record<string, string> : {};
  const mainStars = Object.entries(siHua).map(([position, name]) => ({
    name,
    emoji: '✨',
    position: `四化 · ${position}`,
    meaning: '紫微斗数四化飞星',
  }));

  const mingGong = (details.mingGong && typeof details.mingGong === 'object')
    ? (details.mingGong as { palace?: string; star?: string })
    : {};
  const birthInfo = (typeof details.birthInfo === 'string' ? details.birthInfo : '');
  const wuXingJu = (typeof details.wuXingJu === 'string' ? details.wuXingJu : '');

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 星象背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute top-1/3 left-1/4 w-96 h-96 opacity-5 animate-rotate" viewBox="0 0 400 400" style={{ animationDuration: '120s' }}>
          <circle cx="200" cy="200" r="180" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="150" stroke="var(--color-gold)" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="120" stroke="var(--color-gold)" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="90" stroke="var(--color-gold)" strokeWidth="0.5" fill="none" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.3" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.3" />
          <line x1="72" y1="72" x2="328" y2="328" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.3" />
          <line x1="328" y1="72" x2="72" y2="328" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.3" />
        </svg>
      </div>

      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 返回导航 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/ziwei"
            className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)' }}
          >
            <ChevronLeft className="w-4 h-4" />返回
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <ChevronRight className="w-3 h-3" />
            <span>紫微斗数</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'var(--color-text-secondary)' }}>命盘分析</span>
          </div>
        </div>

        {/* 紫微斗数专属头部 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
                </svg>
                紫微斗数
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {mingGong.star || '命宫无主星'} · {mingGong.palace || '命宫'}
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                出生日期：{result.input ? `${result.input.year}年${result.input.month}月${result.input.day}日` : ''} | {wuXingJu || '农历'}
              </p>
            </div>
            {/* 星曜预览 */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                紫微星
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                天机星
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(200,168,78,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(200,168,78,0.3)' }}>
                太阳星
              </span>
            </div>
          </div>
        </section>

        {/* 命盘可视化 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            命盘十二宫
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 左列 */}
            <div className="space-y-3">
              {palaces.slice(0, 6).map((p) => (
                <PalaceCard key={p.name} name={p.name} stars={p.stars} isHighlight={p.isHighlight} />
              ))}
            </div>
            {/* 中间：命盘图 */}
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="8" fill="#a78bfa" opacity="0.3" />
                  <circle cx="100" cy="100" r="4" fill="#a78bfa" />
                  <line x1="100" y1="5" x2="100" y2="195" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />
                  <line x1="5" y1="100" x2="195" y2="100" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />
                  <line x1="33" y1="33" x2="167" y2="167" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />
                  <line x1="167" y1="33" x2="33" y2="167" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />
                  <text x="100" y="18" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="600">命</text>
                  <text x="175" y="70" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">兄</text>
                  <text x="175" y="140" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">仆</text>
                  <text x="100" y="192" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">官</text>
                  <text x="25" y="140" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">迁</text>
                  <text x="25" y="70" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10">父</text>
                </svg>
              </div>
            </div>
            {/* 右列 */}
            <div className="space-y-3">
              {palaces.slice(6).map((p) => (
                <PalaceCard key={p.name} name={p.name} stars={p.stars} isHighlight={p.isHighlight} />
              ))}
            </div>
          </div>
        </section>

        {/* 星曜分析 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            主要星曜
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStars.length > 0 ? mainStars.map((star, idx) => (
              <StarCard key={idx} {...star} />
            )) : (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{wuXingJu || '紫微斗数'} 命盘排定，十二宫主星详见上方命盘。</p>
            )}
          </div>
        </section>

        {/* 详细分析 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--color-text)' }}>命理分析</h2>
          <div className="flex flex-wrap gap-2 mb-6 border-b pb-4" style={{ borderColor: 'var(--color-border-light)' }}>
            {['命宫详解', '事业财运', '感情婚姻', '健康提醒'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--color-text-tertiary)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {mingGong.star ? `${mingGong.star}入${mingGong.palace || '命宫'}，` : ''}{wuXingJu ? `命局属${wuXingJu}，` : ''}{birthInfo ? `生于${birthInfo}。` : ''}十二宫主星与四化分布见上方命盘，可结合 AI 深度解读综合参考。
            </p>
            <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--color-gold)' }}>命理建议</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {typeof data.summary === 'string' && data.summary
                  ? (data.summary.length > 120 ? `${data.summary.slice(0, 120)}…` : data.summary)
                  : '四化与宫位主星详见命盘，结合 AI 解读综合参考。'}
              </p>
            </div>
          </div>
        </section>

        {/* AI 深度解读 */}
        <AIDeepDive interpretation={mdInterpretation} resultId={result.id} />
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