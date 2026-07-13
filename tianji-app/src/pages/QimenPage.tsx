import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Calendar, Type, Loader2, ChevronRight } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 起局方式 */
type JuMethod = 'date' | 'current' | 'direction';

/** 时辰选项 */
const SHICHEN_OPTIONS = [
  { value: '0', label: '子时 23:00 - 01:00' },
  { value: '1', label: '丑时 01:00 - 03:00' },
  { value: '2', label: '寅时 03:00 - 05:00' },
  { value: '3', label: '卯时 05:00 - 07:00' },
  { value: '4', label: '辰时 07:00 - 09:00' },
  { value: '5', label: '巳时 09:00 - 11:00' },
  { value: '6', label: '午时 11:00 - 13:00' },
  { value: '7', label: '未时 13:00 - 15:00' },
  { value: '8', label: '申时 15:00 - 17:00' },
  { value: '9', label: '酉时 17:00 - 19:00' },
  { value: '10', label: '戌时 19:00 - 21:00' },
  { value: '11', label: '亥时 21:00 - 23:00' },
];

/** 方位选项 */
const DIRECTION_OPTIONS = [
  { value: 'n', label: '北方（坎）' },
  { value: 'ne', label: '东北方（艮）' },
  { value: 'e', label: '东方（震）' },
  { value: 'se', label: '东南方（巽）' },
  { value: 's', label: '南方（离）' },
  { value: 'sw', label: '西南方（坤）' },
  { value: 'w', label: '西方（兑）' },
  { value: 'nw', label: '西北方（乾）' },
];

/** 局数类型 */
const JU_TYPE_OPTIONS = [
  { value: 'auto', label: '自动判断' },
  { value: 'yang', label: '阳遁' },
  { value: 'yin', label: '阴遁' },
];

/** 快捷标签 */
const QUICK_TAGS = ['事业运', '财运', '感情', '合作', '出行'];

/** 奇门遁甲占卜页面 */
export default function QimenPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<JuMethod>('date');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [direction, setDirection] = useState('n');
  const [juType, setJuType] = useState('auto');

  /** 提交奇门遁甲占卜 */
  const handleSubmit = async () => {
    if (!question) return;

    // 后端需要：year, month, day, hour, question
    let y: number, m: number, d: number, h: number;
    if (method === 'date' && date && hour) {
      // 按指定时间起局
      [y, m, d] = date.split('-').map(Number);
      h = Number(hour);
    } else {
      // 默认用当前时间起局
      const now = new Date();
      y = now.getFullYear();
      m = now.getMonth() + 1;
      d = now.getDate();
      h = now.getHours();
    }

    setLoading(true);
    try {
      const result = await submitFortuneQuery('qimen', {
        year: y,
        month: m,
        day: d,
        hour: h,
        question,
      });
      navigate(`/result/qimen/${result.data.id}`);
    } catch {
      alert('起局失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 起局方式配置 */
  const METHOD_OPTIONS: { key: JuMethod; label: string; desc: string; recommended?: boolean }[] = [
    { key: 'date', label: '按时间起局', desc: '输入特定年月日时，以四柱八字为基础排定奇门格局', recommended: true },
    { key: 'current', label: '按当前时间', desc: '自动取当前时辰起局，快速便捷，随时可测' },
    { key: 'direction', label: '按问题方向', desc: '根据所问之事选定方位起局，结合空间维度分析' },
  ];

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 标题居中 */}
          <div className="text-center">
            {/* 金色徽章标签（九宫格图标） */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
                <rect x="1" y="1" width="5" height="5" rx="1" />
                <rect x="5.5" y="1" width="5" height="5" rx="1" />
                <rect x="10" y="1" width="5" height="5" rx="1" />
                <rect x="1" y="5.5" width="5" height="5" rx="1" />
                <rect x="5.5" y="5.5" width="5" height="5" rx="1" />
                <rect x="10" y="5.5" width="5" height="5" rx="1" />
                <rect x="1" y="10" width="5" height="5" rx="1" />
                <rect x="5.5" y="10" width="5" height="5" rx="1" />
                <rect x="10" y="10" width="5" height="5" rx="1" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>帝王之术</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{
                color: 'var(--color-text-inverse)',
                textWrap: 'balance',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                fontFamily: 'var(--font-display)',
              }}
            >
              奇门遁甲
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              古代最高层次术数，天盘地盘人盘神盘格局分析
            </p>
          </div>
        </div>
      </section>

      {/* ====== 起局方式选择 ====== */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择起局方式
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>三种起局方式各有侧重，根据需求选择</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {METHOD_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                onClick={() => setMethod(opt.key)}
                className="relative rounded-xl p-6 cursor-pointer transition-all"
                style={{
                  border: method === opt.key ? '2px solid var(--color-gold)' : '2px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  boxShadow: method === opt.key ? '0 0 0 1px var(--color-gold), 0 8px 24px rgba(200, 168, 78, 0.15)' : 'none',
                }}
              >
                {opt.recommended && (
                  <span
                    className="absolute -top-px right-4 text-xs font-semibold px-2.5 py-0.5 rounded-b"
                    style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: 'var(--color-text-inverse)' }}
                  >
                    推荐
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: method === opt.key ? 'rgba(200, 168, 78, 0.1)' : 'var(--color-primary-bg-strong)',
                      color: method === opt.key ? 'var(--color-gold)' : 'var(--color-primary)',
                    }}
                  >
                    <Compass size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{opt.label}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-tertiary)' }}>{opt.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 日期时间输入 + 方位选择 */}
          <div className="max-w-3xl mx-auto mt-10">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 日期输入（按时间起局时显示） */}
                {method === 'date' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 cursor-pointer" style={{ color: 'var(--color-text)' }}>起局日期</label>
                      <div
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer"
                        onClick={(e) => {
                          (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus();
                        }}
                      >
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent border-none outline-none cursor-pointer"
                          style={{ color: 'inherit' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>起局时辰</label>
                      <select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                      >
                        <option value="">请选择</option>
                        {SHICHEN_OPTIONS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* 方位选择 */}
                {method !== 'current' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>方位选择</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    >
                      {DIRECTION_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 局数类型 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>局数类型</label>
                  <select
                    value={juType}
                    onChange={(e) => setJuType(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                  >
                    {JU_TYPE_OPTIONS.map((j) => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 问题输入 */}
              <div className="mt-5">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>所问之事</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full resize-none rounded-xl p-4 text-base outline-none transition-colors"
                  rows={3}
                  placeholder="请描述您要占测的事情，例如：近期能否升职加薪？"
                />
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>快捷问题：</span>
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuestion(tag)}
                      className="px-3 py-1 rounded-full text-sm transition-all"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 起局按钮 */}
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !question || (method === 'date' && (!date || !hour))}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 4px 16px rgba(0, 75, 170, 0.3)' }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Compass size={18} />}
                  {loading ? '起局中...' : '开始起局'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
