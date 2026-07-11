import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Moon, Loader2, ChevronRight, MessageCircle } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 月相数据 */
const MOON_PHASES = [
  {
    key: 'new',
    name: '新月',
    phase: '0~1%',
    icon: '🌑',
    meaning: '新的开始',
    desc: '月隐之时，万物静待萌发。适合设定新目标，开启新计划，许下新的愿望。',
    energy: '启动能量',
    color: '#1a1a2e',
  },
  {
    key: 'waxing-crescent',
    name: '眉月',
    phase: '1~25%',
    icon: '🌒',
    meaning: '蓄势待发',
    desc: '月牙初现，能量逐渐积累。适合学习、研究、为计划做准备和收集资源。',
    energy: '成长能量',
    color: '#1e2a4a',
  },
  {
    key: 'first-quarter',
    name: '上弦月',
    phase: '25~50%',
    icon: '🌓',
    meaning: '挑战与行动',
    desc: '半月高悬，面临关键抉择。适合面对挑战、采取行动、克服困难。',
    energy: '行动能量',
    color: '#1a2a50',
  },
  {
    key: 'waxing-gibbous',
    name: '盈凸月',
    phase: '50~75%',
    icon: '🌔',
    meaning: '调整与完善',
    desc: '月满将至，接近目标。适合调整计划、优化细节、完善已有成果。',
    energy: '完善能量',
    color: '#1e2e55',
  },
  {
    key: 'full',
    name: '满月',
    phase: '75~99%',
    icon: '🌕',
    meaning: '圆满与收获',
    desc: '明月高悬，能量达到顶峰。适合庆祝成果、表白感情、完成重要事项。',
    energy: '圆满能量',
    color: '#0f1f40',
  },
  {
    key: 'waning-gibbous',
    name: '亏凸月',
    phase: '99~75%',
    icon: '🌖',
    meaning: '感恩与分享',
    desc: '月色渐退，分享收获。适合表达感谢、分享经验、教会他人。',
    energy: '分享能量',
    color: '#1a2845',
  },
  {
    key: 'last-quarter',
    name: '下弦月',
    phase: '75~50%',
    icon: '🌗',
    meaning: '释怀与放下',
    desc: '半月沉落，告别过去。适合断舍离、结束旧事、原谅与自我疗愈。',
    energy: '释放能量',
    color: '#15203d',
  },
  {
    key: 'waning-crescent',
    name: '残月',
    phase: '50~1%',
    icon: '🌘',
    meaning: '静心与反思',
    desc: '月影将尽，回归内心。适合冥想、反思、休息与充电，为新一轮做准备。',
    energy: '休憩能量',
    color: '#121a30',
  },
];

/** 月相占卜问题类别 */
const QUESTION_CATEGORIES = ['爱情', '事业', '财运', '健康', '学业', '人际关系', '自我成长'];

/** 月相占卜页面 */
export default function MoonphasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /** 提交月相占卜 */
  const handleSubmit = async () => {
    if (!selectedPhase || !question) return;
    setLoading(true);
    try {
      const result = await submitFortuneQuery('moonphase', {
        phase: selectedPhase,
        question,
        category: selectedCategory,
      });
      navigate(`/result/${result.data.id}`);
    } catch {
      alert('占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = MOON_PHASES.find((p) => p.key === selectedPhase);

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        {/* 背景星星 + 月亮装饰 SVG */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 居中标题 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <Moon size={16} style={{ color: 'var(--color-gold)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>月相能量</span>
            </div>
            <h1 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' }}>
              月相占卜
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              倾听月亮的声音，感受月相能量的指引
            </p>
          </div>
        </div>
      </section>

      {/* 月相选择区 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>选择月相</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>选择与你当下心境最共鸣的月相</p>
          </div>

          {/* 月相卡片网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {MOON_PHASES.map((phase) => (
              <div
                key={phase.key}
                onClick={() => setSelectedPhase(phase.key)}
                className="rounded-2xl p-5 transition-all cursor-pointer"
                style={{
                  background: selectedPhase === phase.key ? 'linear-gradient(135deg, rgba(200,168,78,0.08), rgba(0,75,170,0.06))' : 'var(--color-bg-elevated)',
                  border: selectedPhase === phase.key ? '1.5px solid var(--color-gold)' : '1px solid var(--color-border-light)',
                  boxShadow: selectedPhase === phase.key ? '0 4px 24px rgba(200,168,78,0.15)' : 'var(--shadow-sm)',
                }}
              >
                {/* 月相图标 */}
                <div className="text-center mb-3">
                  <span style={{ fontSize: 40, lineHeight: 1 }}>{phase.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-center mb-1" style={{ color: selectedPhase === phase.key ? 'var(--color-gold-light)' : 'var(--color-text)' }}>{phase.name}</h3>
                <p className="text-xs text-center mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{phase.meaning}</p>
                <div className="text-center">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,75,170,0.1)', color: 'var(--color-primary)' }}>{phase.energy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 选中月相详情 */}
          {currentPhase && (
            <div className="mt-8 rounded-2xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 text-center">
                  <span style={{ fontSize: 72, lineHeight: 1 }}>{currentPhase.icon}</span>
                  <h3 className="text-xl font-bold mt-2" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>{currentPhase.name}</h3>
                  <span className="inline-block text-xs px-3 py-1 rounded-full mt-2" style={{ background: 'rgba(200,168,78,0.1)', color: 'var(--color-gold)', border: '1px solid rgba(200,168,78,0.2)' }}>{currentPhase.energy}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>月相含义</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{currentPhase.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 问题输入区 */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>输入你的问题</h2>
            <p className="text-sm text-center mb-6" style={{ color: 'var(--color-text-tertiary)' }}>月光会照亮你内心的答案</p>

            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
              {/* 问题类别选择 */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>问题类别</label>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="inline-block px-3 py-1.5 text-sm rounded-full border transition-all whitespace-nowrap"
                      style={{
                        borderColor: selectedCategory === cat ? 'var(--color-gold)' : 'var(--color-border)',
                        color: selectedCategory === cat ? 'var(--color-gold-light)' : 'var(--color-text-secondary)',
                        background: selectedCategory === cat ? 'rgba(200,168,78,0.08)' : 'transparent',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 问题输入 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>你的问题</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full resize-none rounded-xl p-4 text-sm outline-none transition-colors"
                  rows={4}
                  placeholder="描述你想问月亮的问题..."
                  style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
              </div>

              {/* 提交按钮 */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedPhase || !question}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                  {loading ? '解读中...' : '开始月相占卜'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 月相知识区 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>月相能量指南</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>不同月相对应不同的能量场和最佳行动时机</p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOON_PHASES.map((phase) => (
              <div
                key={phase.key}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)' }}
              >
                <span className="shrink-0 text-3xl" style={{ lineHeight: 1 }}>{phase.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{phase.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-bg-strong)', color: 'var(--color-primary)' }}>{phase.phase}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8" style={{ background: 'var(--color-primary-darker)', borderTop: '1px solid rgba(200, 168, 78, 0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: 'var(--max-width)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>月相占卜仅供娱乐与参考，不构成任何决策建议。请理性对待占卜结果。</p>
        </div>
      </footer>
    </div>
  );
}
