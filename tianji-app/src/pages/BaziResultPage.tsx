import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Share2, Loader2, ChevronLeft, Send, RefreshCw, Heart, FileText, ChevronRight,
} from 'lucide-react';
import { submitFollowUp } from '@/services/api';
import { useFortuneResult } from '@/hooks/useFortuneResult';

// 四柱卡片组件
function PillarsCard({ pillar, type, tiangan, dizhi, gainian, animal }: {
  pillar: string;
  type: string;
  tiangan: string;
  dizhi: string;
  gainian: string;
  animal: string;
}) {
  const isDay = pillar === '日柱';
  return (
    <div
      className="text-center p-4 rounded-lg relative"
      style={{
        background: isDay
          ? 'linear-gradient(180deg, rgba(200,168,78,0.2) 0%, rgba(200,168,78,0.05) 100%)'
          : 'linear-gradient(180deg, rgba(200,168,78,0.1) 0%, transparent 100%)',
        border: isDay ? '2px solid var(--color-gold)' : '1px solid rgba(200,168,78,0.2)',
        boxShadow: isDay ? '0 0 20px rgba(200,168,78,0.15)' : 'none',
      }}
    >
      {isDay && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px]"
          style={{ background: 'var(--color-gold)', color: '#0a0e1a' }}
        >
          日主
        </div>
      )}
      <div className="text-xs mb-2 mt-1" style={{ color: isDay ? 'var(--color-gold)' : 'var(--color-text-tertiary)' }}>
        {pillar} · {type}
      </div>
      <div className="flex justify-center gap-4 mb-2">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{tiangan}</div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>天干</div>
        </div>
        <div className="w-px" style={{ background: isDay ? 'var(--color-gold)' : 'var(--color-border)' }} />
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>{dizhi}</div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>地支</div>
        </div>
      </div>
      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{gainian} · {animal}</div>
    </div>
  );
}

// 五行进度条组件
function WuxingBar({ element, percentage, strength }: {
  element: string;
  percentage: number;
  strength: string;
}) {
  const colors: Record<string, string> = {
    金: 'linear-gradient(90deg, #e8d48b, #c8a84e)',
    木: 'linear-gradient(90deg, #7ab885, #5a9e6f)',
    水: 'linear-gradient(90deg, var(--color-primary-lighter), var(--color-primary))',
    火: 'linear-gradient(90deg, #e88078, #d4645a)',
    土: 'linear-gradient(90deg, #c4a878, #b09060)',
  };
  const textColors: Record<string, string> = {
    金: '#e8d48b',
    木: '#7ab885',
    水: '#60a5fa',
    火: '#e88078',
    土: '#c4a878',
  };

  return (
    <div className="text-center p-3 rounded-lg" style={{ background: `${textColors[element]}18` }}>
      <div className="text-2xl mb-1" style={{ color: textColors[element] }}>{element}</div>
      <div className="h-2 rounded-full mb-2" style={{ background: 'var(--color-border)' }}>
        <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: colors[element] }} />
      </div>
      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{strength} {percentage}%</div>
    </div>
  );
}

// AI 深度解读组件
function AIDeepDive({ resultId, interpretation }: { resultId: string; interpretation: string }) {
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
      style={{ background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200,168,78,0.2) 0%, transparent 70%)' }} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,168,78,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="2">
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
              placeholder="继续追问命理..."
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

/**
 * 按标题分割八字解读文本，提取指定 Tab 对应的内容
 */
function getTabContent(text: string, activeTab: string): string {
  if (!text) return '暂无分析内容，可尝试追问获取更多解读。';
  if (!activeTab) return text;

  const tabKeywords: Record<string, string[]> = {
    '性格特征': ['性格', '人格', '个人特质'],
    '事业方向': ['事业', '工作', '职业', '行业', '职场'],
    '感情婚姻': ['感情', '爱情', '婚姻', '桃花', '恋爱'],
    '财运分析': ['财运', '财富', '理财', '财星', '收入'],
    '健康运势': ['健康', '身体', '保健', '养生', '体质'],
    '近期提醒': ['大运', '流年', '近期', '运势', '提醒'],
  };

  const keywordList = tabKeywords[activeTab] || [];
  const lines = text.split('\n');
  const matchedSections: string[] = [];
  let currentSection = '';
  let currentMatches = false;

  for (const line of lines) {
    const trimmed = line.trim();

    const numMatch = trimmed.match(/^###\s*\d+\.\s*(.+)/);
    if (numMatch) {
      if (currentMatches && currentSection) {
        matchedSections.push(currentSection.trim());
      }
      const title = numMatch[1].trim();
      currentMatches = keywordList.some(k => title.includes(k));
      currentSection = currentMatches ? line + '\n' : '';
      continue;
    }

    const mdMatch = trimmed.match(/^###\s*(.+)/);
    if (mdMatch) {
      if (currentMatches && currentSection) {
        matchedSections.push(currentSection.trim());
      }
      const title = mdMatch[1].trim();
      currentMatches = keywordList.some(k => title.includes(k));
      currentSection = currentMatches ? line + '\n' : '';
      continue;
    }

    if (currentMatches) {
      currentSection += line + '\n';
    }
  }

  if (currentMatches && currentSection) {
    matchedSections.push(currentSection.trim());
  }

  if (matchedSections.length > 0) {
    return matchedSections.join('\n\n');
  }

  return '该维度暂无详细分析，可尝试切换其他 Tab 查看。';
}

// 八字结果页面
export default function BaziResultPage() {
  const { result, data, interpretation, loading, error, retry } = useFortuneResult();
  const [activeTab, setActiveTab] = useState('性格特征');

  // 解析八字数据
  const parseBaziData = useCallback((d: Record<string, unknown>) => {
    const ZODIAC: Record<string, string> = {
      子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇',
      午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪',
    };
    const getPillar = (key: string) => (d[key] as Record<string, string>) || {};
    const yearP = getPillar('yearPillar');
    const monthP = getPillar('monthPillar');
    const dayP = getPillar('dayPillar');
    const hourP = getPillar('hourPillar');

    const naYinCache = (d._naYin as Record<string, string>) || {};
    const yearGZ = `${yearP.gan || ''}${yearP.zhi || ''}`;
    const monthGZ = `${monthP.gan || ''}${monthP.zhi || ''}`;
    const dayGZ = `${dayP.gan || ''}${dayP.zhi || ''}`;
    const hourGZ = `${hourP.gan || ''}${hourP.zhi || ''}`;

    const pillars = [
      { pillar: '年柱', type: '祖上', tiangan: yearP.gan || '--', dizhi: yearP.zhi || '--', gainian: naYinCache.yearNaYin || naYinCache[yearGZ] || '--', animal: ZODIAC[yearP.zhi || ''] || '--' },
      { pillar: '月柱', type: '父母', tiangan: monthP.gan || '--', dizhi: monthP.zhi || '--', gainian: naYinCache.monthNaYin || naYinCache[monthGZ] || '--', animal: ZODIAC[monthP.zhi || ''] || '--' },
      { pillar: '日柱', type: '自身', tiangan: dayP.gan || '--', dizhi: dayP.zhi || '--', gainian: naYinCache.dayNaYin || naYinCache[dayGZ] || '--', animal: ZODIAC[dayP.zhi || ''] || '--' },
      { pillar: '时柱', type: '子女', tiangan: hourP.gan || '--', dizhi: hourP.zhi || '--', gainian: naYinCache.hourNaYin || naYinCache[hourGZ] || '--', animal: ZODIAC[hourP.zhi || ''] || '--' },
    ];

    const wuXingCount = (d.wuXingCount as Record<string, number>) || {};
    const total = 8; // 4 pillars × 2 (gan + zhi)
    const getStrength = (count: number): string => {
      if (count >= 4) return '旺';
      if (count >= 3) return '强';
      if (count >= 2) return '平';
      if (count >= 1) return '弱';
      return '缺';
    };

    const wuxingData: Record<string, { percentage: number; strength: string }> = {
      金: { percentage: Math.round(((wuXingCount['金'] || 0) / total) * 100), strength: getStrength(wuXingCount['金'] || 0) },
      木: { percentage: Math.round(((wuXingCount['木'] || 0) / total) * 100), strength: getStrength(wuXingCount['木'] || 0) },
      水: { percentage: Math.round(((wuXingCount['水'] || 0) / total) * 100), strength: getStrength(wuXingCount['水'] || 0) },
      火: { percentage: Math.round(((wuXingCount['火'] || 0) / total) * 100), strength: getStrength(wuXingCount['火'] || 0) },
      土: { percentage: Math.round(((wuXingCount['土'] || 0) / total) * 100), strength: getStrength(wuXingCount['土'] || 0) },
    };

    const trueSolar = (d.trueSolar as { note?: string; changed?: boolean }) || null;

    return { pillars, wuxingData, wuXingCount, trueSolarNote: trueSolar?.note ?? null };
  }, []);

  const { pillars, wuxingData, wuXingCount, trueSolarNote } = parseBaziData(data);

  // 命格评分：由五行俱全程度真实派生
  const presentCount = Object.values(wuXingCount).filter((c) => c > 0).length;
  const baziScore = Math.max(50, Math.min(99, 100 - (5 - presentCount) * 10));

  // 命格标题：由日主干支与五行旺衰真实派生
  const dayPillar = (data.dayPillar as Record<string, string>) || {};
  const title = `${dayPillar.gan || ''}${dayPillar.zhi || ''}日 · ${dayPillar.ganWuXing || ''}命 · 五行${presentCount}种`;

  // 命局概况：优先取后端 summary
  const baziSummary = (typeof data.summary === 'string' && data.summary) || '';

  // 从输入参数获取基本信息
  const input = (result?.input ?? {}) as Record<string, unknown>;
  const birthInfo = `${input.year || ''}年${input.month || ''}月${input.day || ''}日`;

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
          <Link to="/bazi" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            <ChevronLeft className="w-4 h-4" /> 返回重新测算
          </Link>
        </div>
      </div>
    );
  }

  const mdInterpretation = interpretation || '暂无详细解读';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute top-1/4 right-[5%] w-64 h-64 opacity-10 animate-rotate" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="95" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
          <path d="M100 5 L100 195 M5 100 L195 100" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.5" />
          <path d="M29.3 29.3 L170.7 170.7 M170.7 29.3 L29.3 170.7" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 返回导航 */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/bazi"
            className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)' }}
          >
            <ChevronLeft className="w-4 h-4" />返回
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>东方命理</span>
            <ChevronRight className="w-3 h-3" />
            <span>八字排盘</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'var(--color-text-secondary)' }}>分析结果</span>
          </div>
        </div>

        {/* 八字专属头部：命盘时间线 */}
        <section className="mb-8 p-6 rounded-xl relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(0,75,170,0.15) 0%, rgba(0,20,50,0.3) 100%)',
          border: '1px solid rgba(200,168,78,0.2)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="60" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
              <circle cx="64" cy="64" r="45" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
              <circle cx="64" cy="64" r="30" stroke="var(--color-gold)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" />
                </svg>
                八字排盘
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {pillars.map(p => p.tiangan + p.dizhi).join(' ')}
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                公历 {birthInfo} | 农历 {birthInfo}
              </p>
            </div>
            {/* 八字简盘预览 */}
            <div className="flex flex-col items-center p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
              <div className="grid grid-cols-4 gap-1 text-center">
                {pillars.map((p, idx) => (
                  <div key={idx} className="p-2">
                    <div className="text-lg font-bold" style={{ color: 'var(--color-gold)' }}>{p.tiangan}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {idx === 2 ? '日' : ['年', '月', '时'][idx]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                日主{pillars[2]?.tiangan} 得令
              </div>
            </div>
          </div>
        </section>

        {/* 综合评分卡 */}
        <section className="mb-8 p-6 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* 环形评分 */}
            <div className="shrink-0 relative">
              <svg className="w-28 h-28" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="56" cy="56" r="48" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                <circle cx="56" cy="56" r="48" fill="none" stroke="var(--color-gold)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray="301.6" strokeDashoffset="45" style={{ filter: 'drop-shadow(0 0 8px var(--color-gold))' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: 'var(--color-gold)' }}>
                  {baziScore}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>命格评分</span>
              </div>
            </div>
            {/* 评分说明 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{title}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>优+</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {baziSummary || '命局中五行分布已解析，可参考下方四柱与五行详情。'}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>水火既济</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>身旺财旺</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>贵人扶助</span>
              </div>
            </div>
          </div>
        </section>

        {/* 四柱详情 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            四柱详细分析
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {pillars.map((p, idx) => (
              <PillarsCard key={idx} {...p} />
            ))}
          </div>
          {trueSolarNote && (
            <div
              className="mt-4 p-4 rounded-lg text-sm leading-relaxed"
              style={{ background: 'rgba(0,75,170,0.08)', border: '1px solid rgba(0,75,170,0.25)', color: 'var(--color-text-secondary)' }}
            >
              {trueSolarNote}
            </div>
          )}
          {/* 藏干信息 */}
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>地支藏干</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pillars.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--color-gold)' }}>{p.dizhi}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏甲丙戊</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 五行分析 */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
            </svg>
            五行力量分布
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(wuxingData).map(([element, wd]) => (
              <WuxingBar key={element} element={element} percentage={wd.percentage} strength={wd.strength} />
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'var(--color-bg-inset)', color: 'var(--color-text-secondary)' }}>
            <span style={{ color: 'var(--color-primary)' }}>命理分析：</span>
            {baziSummary ? baziSummary.split('\n').find((line) => line.includes('五行')) || baziSummary : '五行分布详情见上方，日主强弱与喜用神可参考 AI 解读。'}
          </div>
        </section>

        {/* 详细分析Tab */}
        <section className="mb-8 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            详细分析报告
          </h2>
          <div className="flex flex-wrap gap-2 mb-6 border-b pb-4" style={{ borderColor: 'var(--color-border-light)' }}>
            {['性格特征', '事业方向', '感情婚姻', '财运分析', '健康运势', '近期提醒'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--color-text-tertiary)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {getTabContent(mdInterpretation, activeTab)}
            </ReactMarkdown>
          </div>
        </section>

        {/* AI 深度解读 */}
        <AIDeepDive resultId={result.id || ''} interpretation={mdInterpretation} />
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