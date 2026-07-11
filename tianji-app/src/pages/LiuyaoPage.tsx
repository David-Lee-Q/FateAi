import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coins, Loader2, RotateCw, ChevronRight } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 六爻卦象模拟铜钱结果 */
interface CoinResult {
  line: number;
  value: number;
  yao: string;
}

/** 铜钱值对应爻象 */
const YAO_MAP: Record<number, string> = {
  6: '老阴 x', 7: '少阳 ---', 8: '少阴 - -', 9: '老阳 o',
};

/** 起卦方式 */
type DivinationMethod = 'shake' | 'time' | 'number';

/** 快捷标签 */
const QUICK_TAGS = ['事业运', '感情缘', '财运', '健康', '学业'];

/** 六爻卦象占卜页面 */
export default function LiuyaoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [shaking, setShaking] = useState(false);
  const [coinResults, setCoinResults] = useState<CoinResult[]>([]);
  const [currentThrow, setCurrentThrow] = useState(0);
  const [method, setMethod] = useState<DivinationMethod>('shake');
  const [numberInput, setNumberInput] = useState('');

  /** 模拟铜钱摇卦 */
  const throwCoin = () => {
    if (currentThrow >= 6) return;
    setShaking(true);
    setTimeout(() => {
      const values = [6, 7, 7, 8, 8, 9];
      const val = values[Math.floor(Math.random() * values.length)];
      const newResult: CoinResult = {
        line: currentThrow + 1,
        value: val,
        yao: YAO_MAP[val],
      };
      setCoinResults((prev) => [...prev, newResult]);
      setCurrentThrow((prev) => prev + 1);
      setShaking(false);
    }, 800);
  };

  /** 重新起卦 */
  const resetThrow = () => {
    setCoinResults([]);
    setCurrentThrow(0);
  };

  /** 提交六爻占卜 */
  const handleSubmit = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const result = await submitFortuneQuery('liuyao', {
        question,
        method,
        lines: coinResults.length === 6 ? coinResults.map((r) => r.value) : undefined,
        number: numberInput,
      });
      navigate(`/result/${result.data.id}`);
    } catch {
      alert('占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 起卦方式配置 */
  const METHOD_OPTIONS: { key: DivinationMethod; label: string; desc: string; recommended?: boolean }[] = [
    { key: 'shake', label: '虚拟摇卦', desc: '模拟三枚铜钱抛掷，六次成卦，最贴近传统铜钱法', recommended: true },
    { key: 'time', label: '时间起卦', desc: '以当下时辰自动起卦，梅花易数时间法，无需操作' },
    { key: 'number', label: '数字起卦', desc: '输入心中所想数字，万物皆可成卦，简便灵活' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>
      {/* ====== Hero 区域 ====== */}
      <section className="relative py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0f1629 100%)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>

          {/* 标题居中 */}
          <div className="text-center">
            {/* 金色徽章标签 */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>周易古法</span>
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
              六爻卦象
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              周易古法占卜，铜钱摇卦断吉凶
            </p>
          </div>
        </div>
      </section>

      {/* ====== 问题输入区 ====== */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              诚心静意，默念所测之事
            </h2>
            <p className="text-sm mb-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              在心中默想你要占测的事情，然后简要描述下来
            </p>
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full resize-none rounded-xl p-4 text-base outline-none transition-colors"
                rows={4}
                placeholder="例：最近工作上的项目能否顺利推进？"
              />
              {/* 快捷标签 */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
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
          </div>
        </div>
      </section>

      {/* ====== 起卦方式选择 ====== */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择起卦方式
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>不同的起卦法各有妙处，选择最合心意的一种</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {METHOD_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                onClick={() => setMethod(opt.key)}
                className="relative rounded-xl p-6 cursor-pointer transition-all"
                style={{
                  border: method === opt.key ? '2px solid var(--color-gold)' : '2px solid var(--color-border)',
                  background: method === opt.key ? 'var(--color-bg-elevated)' : 'var(--color-bg-elevated)',
                  boxShadow: method === opt.key ? '0 0 0 1px var(--color-gold), 0 8px 24px rgba(200, 168, 78, 0.15)' : 'none',
                }}
              >
                {/* 推荐标签 */}
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
                    <Coins size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{opt.label}</h3>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-tertiary)' }}>{opt.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 虚拟摇卦交互区 */}
          {method === 'shake' && (
            <div className="max-w-3xl mx-auto mt-10">
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                {/* 爻象展示 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                    铜钱摇卦（需摇满 6 爻）
                  </label>
                  <div
                    className="flex min-h-[140px] flex-col-reverse items-center justify-center gap-3 rounded-lg p-4"
                    style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-light)' }}
                  >
                    {coinResults.length === 0 ? (
                      <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>点击下方按钮开始摇卦</span>
                    ) : (
                      coinResults.map((r) => (
                        <div key={r.line} className="flex items-center gap-3">
                          <span className="w-8 text-right text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{r.line}爻</span>
                          <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{r.yao}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 摇卦按钮 */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={throwCoin}
                    disabled={shaking || currentThrow >= 6}
                    className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-gold)' }}
                  >
                    {shaking ? (
                      <><RotateCw size={18} className="animate-spin" />摇卦中...</>
                    ) : (
                      <><Coins size={18} />摇铜钱 ({currentThrow}/6)</>
                    )}
                  </button>
                  {currentThrow > 0 && (
                    <button
                      type="button"
                      onClick={resetThrow}
                      className="rounded-lg px-4 py-3 text-sm font-medium transition-all"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
                    >
                      重新起卦
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 数字起卦输入区 */}
          {method === 'number' && (
            <div className="max-w-3xl mx-auto mt-10">
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  输入心中所想数字
                </label>
                <input
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                  placeholder="请输入一个数字"
                />
              </div>
            </div>
          )}

          {/* 起卦按钮 */}
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !question || (method === 'shake' && coinResults.length < 6)}
              className="inline-flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', boxShadow: '0 4px 16px rgba(0, 75, 170, 0.3)' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Coins size={18} />}
              {loading ? '起卦中...' : '开始起卦'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
