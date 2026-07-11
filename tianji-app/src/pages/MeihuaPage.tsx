import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flower2, Hash, Clock, Type, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 起卦方式 */
type GuMethod = 'time' | 'number' | 'word' | 'random';

/** 梅花易数占卜页面 */
export default function MeihuaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<GuMethod>('time');
  const [upperNum, setUpperNum] = useState('');
  const [lowerNum, setLowerNum] = useState('');

  /** 提交梅花易数占卜 */
  const handleSubmit = async () => {
    if (!question) return;

    // 后端需要：method（number/time）、num1、num2、question
    let methodParam: string;
    let num1: number;
    let num2: number;

    if (method === 'number') {
      if (!upperNum || !lowerNum) return;
      methodParam = 'number';
      num1 = Number(upperNum);
      num2 = Number(lowerNum);
    } else {
      // 其他方式默认用时间起卦
      const now = new Date();
      methodParam = 'time';
      num1 = now.getMonth() + now.getDate();
      num2 = now.getHours();
    }

    setLoading(true);
    try {
      const result = await submitFortuneQuery('meihua', {
        method: methodParam,
        num1,
        num2,
        question,
      });
      navigate(`/result/${result.data.id}`);
    } catch {
      alert('占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 起卦方式配置 */
  const METHOD_OPTIONS: { key: GuMethod; label: string; desc: string; icon: typeof Flower2 }[] = [
    { key: 'time', label: '时间起卦', desc: '以当前时辰自动排卦', icon: Clock },
    { key: 'number', label: '数字起卦', desc: '输入两个数字成卦', icon: Hash },
    { key: 'word', label: '字数起卦', desc: '按所问文字笔画数起卦', icon: Type },
    { key: 'random', label: '随机起卦', desc: '心诚则灵随机得卦', icon: Sparkles },
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
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>先天心易</span>
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
              梅花易数
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              邵康节传世心易，随时随地皆可起卦
            </p>
          </div>
        </div>
      </section>

      {/* ====== 主体内容：表单区（居中卡片） ====== */}
      <section className="mx-auto px-4 lg:px-8 py-12" style={{ maxWidth: 'var(--max-width)' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="glass-card rounded-xl p-6 lg:p-8">
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>输入所问之事</h2>

              {/* 心中所问文本框 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  心中所问
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请输入您想占问的事情，例如：近期事业运程如何？"
                  rows={3}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* 起卦方式选择（4选项卡片网格） */}
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                选择起卦方式
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {METHOD_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = method === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => setMethod(opt.key)}
                      className="rounded-xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer transition-all"
                      style={{
                        border: isActive ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                        background: isActive ? 'var(--color-primary-bg-strong)' : 'var(--color-bg-elevated)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: isActive ? 'var(--color-primary)' : 'var(--color-primary-bg-strong)',
                          color: isActive ? 'var(--color-text-inverse)' : 'var(--color-primary)',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{opt.label}</p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-tertiary)' }}>{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 数字起卦额外输入区 */}
              {method === 'number' && (
                <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--color-bg-inset)', border: '1px dashed var(--color-border)' }}>
                  <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>请输入两个数字（1 ~ 999）</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>上卦数字</label>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={upperNum}
                        onChange={(e) => setUpperNum(e.target.value)}
                        placeholder="如：168"
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>下卦数字</label>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={lowerNum}
                        onChange={(e) => setLowerNum(e.target.value)}
                        placeholder="如：32"
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 时间起卦说明 */}
              {method === 'time' && (
                <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'var(--color-bg-inset)', color: 'var(--color-text-secondary)' }}>
                  将以当前时间自动起卦：年数÷8取余为上卦，月日之和÷8取余为下卦，年月日之和÷6取余为动爻。
                </div>
              )}

              {/* 起卦按钮 */}
              <button
                onClick={handleSubmit}
                disabled={loading || !question || (method === 'number' && (!upperNum || !lowerNum))}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Flower2 size={20} />}
                {loading ? '解读中...' : '开始起卦'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
