import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hash, Calculator, Loader2, ChevronRight } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 计算生命灵数（各位数字相加至个位数） */
function calcLifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

/** 分析类型 */
type AnalysisType = 'life-path' | 'name' | 'phone' | 'plate' | 'custom';

/** 分析类型选项 */
const ANALYSIS_TYPES: { key: AnalysisType; label: string; desc: string; iconSvg: JSX.Element }[] = [
  {
    key: 'life-path',
    label: '生命灵数',
    desc: '基于出生日期计算',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    ),
  },
  {
    key: 'name',
    label: '姓名灵数',
    desc: '解析姓名中的能量',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: '手机号能量',
    desc: '解读手机号码磁场',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    key: 'plate',
    label: '车牌号能量',
    desc: '分析车牌数字能量',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="5" width="22" height="14" rx="3" />
        <circle cx="7" cy="16" r="2" />
        <circle cx="17" cy="16" r="2" />
        <line x1="5" y1="10" x2="19" y2="10" />
      </svg>
    ),
  },
  {
    key: 'custom',
    label: '自定义数字',
    desc: '输入任意数字解析',
    iconSvg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9h0" />
        <path d="M15 15h0" />
        <path d="M8 8l8 8" />
      </svg>
    ),
  },
];

/** 数字含义速查表 */
const NUMBER_MEANINGS = [
  { num: 1, title: '领导力 / 开创', desc: '独立、自信、创新，天生的领导者和开拓者' },
  { num: 2, title: '和谐 / 合作', desc: '敏感、温和、善于调和，出色的合作伙伴' },
  { num: 3, title: '表达 / 创造', desc: '热情、富有创意，天生的艺术家和沟通者' },
  { num: 4, title: '稳定 / 务实', desc: '勤勉、可靠、注重秩序，坚实的建设者' },
  { num: 5, title: '自由 / 变化', desc: '冒险、适应力强，渴望自由和多彩的人生' },
  { num: 6, title: '责任 / 关怀', desc: '温暖、有爱心，天生的照顾者和调解者' },
  { num: 7, title: '内省 / 智慧', desc: '深度思考、直觉敏锐，探索生命真理的哲学家' },
  { num: 8, title: '成就 / 权力', desc: '目标导向、意志坚定，追求物质与精神成就' },
  { num: 9, title: '博爱 / 完成', desc: '富有同情心、人道主义，代表一个周期的完成' },
  { num: 11, title: '灵感 / 灵觉', desc: '大师数，高度直觉与灵性觉知，天生的导师' },
  { num: 22, title: '建造者 / 大师', desc: '大师数，将理想化为现实，卓越的执行与建设能力' },
  { num: 33, title: '大爱 / 治愈', desc: '大师数，无条件的爱与治愈力，无私奉献的典范' },
];

/** 页面标题区组件 */
function PageHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
      {/* 背景数字粒子装饰 SVG */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
        {/* 居中标题 */}
        <div className="text-center">
          {/* 金色徽章 */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
              <circle cx="8" cy="8" r="6.5" stroke="var(--color-gold)" strokeWidth="1.2" fill="none" />
              <text x="8" y="11" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="8" fontWeight="700" fill="var(--color-gold)">N</text>
            </svg>
            <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>数字密码</span>
          </div>
          <h1 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' }}>
            数字能量
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
            揭示姓名、生日、号码背后的数字密码
          </p>
        </div>
      </div>
    </section>
  );
}

/** 数字能量占卜页面 */
export default function NumerologyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<AnalysisType>('life-path');
  const [birthDate, setBirthDate] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [plateInput, setPlateInput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [refOpen, setRefOpen] = useState(false);

  /** 实时计算生命灵数 */
  const lifePathNumber = useMemo(() => {
    if (!birthDate) return null;
    return calcLifePathNumber(birthDate);
  }, [birthDate]);

  /** 获取当前输入值 */
  const getCurrentInput = () => {
    switch (activeType) {
      case 'life-path': return birthDate;
      case 'name': return nameInput;
      case 'phone': return phoneInput;
      case 'plate': return plateInput;
      case 'custom': return customInput;
      default: return '';
    }
  };

  const canSubmit = getCurrentInput().length > 0;

  /** 提交数字能量分析 */
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const result = await submitFortuneQuery('numerology', {
        type: activeType,
        value: getCurrentInput(),
        lifePathNumber: activeType === 'life-path' ? lifePathNumber : undefined,
      });
      navigate(`/result/${result.data.id}`);
    } catch {
      alert('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 渲染对应类型的输入区 */
  const renderInput = () => {
    const inputStyle: React.CSSProperties = {
      background: 'var(--color-bg-inset)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text)',
    };
    const labelStyle: React.CSSProperties = { color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 500 };

    switch (activeType) {
      case 'life-path':
        return (
          <div>
            <label className="block mb-2" style={labelStyle}>出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>选择您的出生日期，计算生命灵数</p>
          </div>
        );
      case 'name':
        return (
          <div>
            <label className="block mb-2" style={labelStyle}>姓名</label>
            <input
              type="text"
              placeholder="请输入您的姓名"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>支持中文姓名，将基于拼音或笔画计算灵数</p>
          </div>
        );
      case 'phone':
        return (
          <div>
            <label className="block mb-2" style={labelStyle}>手机号码</label>
            <input
              type="tel"
              placeholder="请输入手机号码"
              maxLength={13}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>分析手机号码中蕴含的数字能量磁场</p>
          </div>
        );
      case 'plate':
        return (
          <div>
            <label className="block mb-2" style={labelStyle}>车牌号码</label>
            <input
              type="text"
              placeholder="如：京A·12345"
              value={plateInput}
              onChange={(e) => setPlateInput(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>解析车牌中数字的能量与寓意</p>
          </div>
        );
      case 'custom':
        return (
          <div>
            <label className="block mb-2" style={labelStyle}>自定义数字</label>
            <input
              type="text"
              placeholder="输入任意数字序列"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>输入任意数字组合，分析其蕴含的能量</p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* 页面标题区 */}
      <PageHero />

      {/* 选择分析类型 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>选择分析类型</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>不同维度解读数字能量的奥秘</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {ANALYSIS_TYPES.map((t) => (
              <div
                key={t.key}
                className={`analysis-type-card ${activeType === t.key ? 'active' : ''}`}
                onClick={() => setActiveType(t.key)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                  style={{ background: activeType === t.key ? 'rgba(200, 168, 78, 0.1)' : 'var(--color-primary-bg-strong)' }}
                >
                  {t.iconSvg}
                </div>
                <h3 className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--color-text)' }}>{t.label}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 输入区 */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>输入信息</h2>
            <div className="rounded-2xl p-6 sm:p-8 glass-card" style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
              {/* 生命灵数实时展示 */}
              {activeType === 'life-path' && lifePathNumber && (
                <div className="glass-card mb-6 rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.06), rgba(200,168,78,0.08))', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <Calculator size={20} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>您的生命灵数</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>{lifePathNumber}</span>
                  </div>
                </div>
              )}

              {/* 动态输入表单 */}
              <div className="space-y-4 mb-4">{renderInput()}</div>

              {/* 提交按钮 */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="9" cy="9" r="7" />
                      <path d="M9 6v3l2 2" />
                    </svg>
                  )}
                  {loading ? '解读中...' : '开始解析'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 数字含义速查表（可折叠） */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-3xl mx-auto">
            {/* 折叠标题 */}
            <button
              className="w-full flex items-center justify-between rounded-2xl p-5 sm:p-6 transition-all"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}
              onClick={() => setRefOpen(!refOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-bg-strong)' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="14" height="14" rx="3" />
                    <line x1="7" y1="8" x2="13" y2="8" />
                    <line x1="10" y1="5" x2="10" y2="11" />
                    <path d="M7 13l3 3 3-3" />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>数字含义速查表</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>1-9 及大师数 11 / 22 / 33 的简要含义</p>
                </div>
              </div>
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round"
                style={{ transition: 'transform 250ms ease', transform: refOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </button>

            {/* 折叠内容 */}
            <div style={{ maxHeight: refOpen ? '2000px' : '0', overflow: 'hidden', transition: 'max-height 400ms ease' }}>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {NUMBER_MEANINGS.map((item) => (
                  <div
                    key={item.num}
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{
                      background: item.num === 7 ? 'rgba(200, 168, 78, 0.06)' : 'var(--color-bg-elevated)',
                      border: item.num === 7 ? '1px solid rgba(200, 168, 78, 0.2)' : '1px solid var(--color-border-light)',
                    }}
                  >
                    <span className="font-bold shrink-0 w-8 text-center text-2xl" style={{ fontFamily: 'var(--font-display)', color: item.num > 9 ? 'var(--color-primary)' : 'var(--color-gold)', minWidth: item.num > 9 ? '2.5rem' : '2rem' }}>{item.num}</span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--color-text)' }}>{item.title}</h4>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部说明 */}
      <section className="py-8" style={{ background: 'var(--color-primary-darker)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: 'var(--max-width)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>占卜结果仅供参考娱乐，不构成任何决策建议</p>
        </div>
      </section>
    </div>
  );
}
