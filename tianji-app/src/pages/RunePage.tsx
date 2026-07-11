import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Loader2, ChevronRight, MessageCircle } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 24个符文数据 */
const RUNE_DATA = [
  { key: 'fehu', symbol: 'ᚠ', name: 'Fehu', nameCn: '财富', meaning: '富足、丰收、流动的能量', keywords: '财富 · 丰收 · 能量流动' },
  { key: 'uruz', symbol: 'ᚢ', name: 'Uruz', nameCn: '力量', meaning: '原始力量、健康、勇敢面对挑战', keywords: '力量 · 健康 · 勇气' },
  { key: 'thurisaz', symbol: 'ᚦ', name: 'Thurisaz', nameCn: '荆棘', meaning: '防御、保护的边界、潜藏的危险', keywords: '防御 · 边界 · 警示' },
  { key: 'ansuz', symbol: 'ᚨ', name: 'Ansuz', nameCn: '神谕', meaning: '智慧、沟通、来自神灵的信息', keywords: '智慧 · 沟通 · 神启' },
  { key: 'raido', symbol: 'ᚱ', name: 'Raido', nameCn: '旅途', meaning: '旅途、节奏、人生的有序发展', keywords: '旅途 · 节奏 · 秩序' },
  { key: 'kenaz', symbol: 'ᚲ', name: 'Kenaz', nameCn: '火炬', meaning: '创造力、灵感、内心的火焰', keywords: '创造 · 灵感 · 洞察' },
  { key: 'gebo', symbol: 'ᚷ', name: 'Gebo', nameCn: '礼物', meaning: '合作、平衡的交换、爱的联结', keywords: '合作 · 平衡 · 爱的联结' },
  { key: 'wunjo', symbol: 'ᚹ', name: 'Wunjo', nameCn: '喜悦', meaning: '幸福、满足、愿望的达成', keywords: '幸福 · 满足 · 愿望达成' },
  { key: 'hagalaz', symbol: 'ᚺ', name: 'Hagalaz', nameCn: '冰雹', meaning: '颠覆性变化、打破旧有模式', keywords: '颠覆 · 打破 · 重塑' },
  { key: 'nauthiz', symbol: 'ᚾ', name: 'Nauthiz', nameCn: '必需', meaning: '匮乏中的成长、忍耐与自律', keywords: '忍耐 · 自律 · 需求' },
  { key: 'isa', symbol: 'ᛁ', name: 'Isa', nameCn: '冰', meaning: '静止、暂停、内省与等待', keywords: '静止 · 等待 · 内省' },
  { key: 'jera', symbol: 'ᛃ', name: 'Jera', nameCn: '丰收', meaning: '循环、因果报应、耐心等待收获', keywords: '循环 · 收获 · 耐心' },
  { key: 'eihwaz', symbol: 'ᛇ', name: 'Eihwaz', nameCn: '紫杉', meaning: '坚韧、生死之间的桥梁、内在力量', keywords: '坚韧 · 转化 · 内在力量' },
  { key: 'perthro', symbol: 'ᛈ', name: 'Perthro', nameCn: '命运', meaning: '神秘、命运、隐藏的可能性', keywords: '命运 · 神秘 · 可能性' },
  { key: 'algiz', symbol: 'ᛉ', name: 'Algiz', nameCn: '守护', meaning: '保护、神圣的庇护、觉醒的意识', keywords: '守护 · 觉醒 · 庇护' },
  { key: 'sowilo', symbol: 'ᛊ', name: 'Sowilo', nameCn: '太阳', meaning: '胜利、生命力、光明的力量', keywords: '胜利 · 生命力 · 光明' },
  { key: 'tiwaz', symbol: 'ᛏ', name: 'Tiwaz', nameCn: '战神', meaning: '正义、牺牲、为信念而战', keywords: '正义 · 信念 · 牺牲' },
  { key: 'berkano', symbol: 'ᛒ', name: 'Berkano', nameCn: '白桦', meaning: '新生、滋养、女性能量', keywords: '新生 · 滋养 · 成长' },
  { key: 'ehwaz', symbol: 'ᛖ', name: 'Ehwaz', nameCn: '骏马', meaning: '伙伴关系、信任、前进的动力', keywords: '信任 · 伙伴 · 前进' },
  { key: 'mannaz', symbol: 'ᛗ', name: 'Mannaz', nameCn: '人类', meaning: '自我认知、人际和谐、智慧', keywords: '自我 · 人际 · 智慧' },
  { key: 'laguz', symbol: 'ᛚ', name: 'Laguz', nameCn: '流水', meaning: '直觉、潜意识、流动与变化', keywords: '直觉 · 潜意识 · 流动' },
  { key: 'ingwaz', symbol: 'ᛜ', name: 'Ingwaz', nameCn: '丰饶', meaning: '孕育、潜力、新生命的种子', keywords: '孕育 · 潜力 · 成熟' },
  { key: 'dagaz', symbol: 'ᛞ', name: 'Dagaz', nameCn: '黎明', meaning: '觉醒、突破、光明驱散黑暗', keywords: '觉醒 · 突破 · 转化' },
  { key: 'othala', symbol: 'ᛟ', name: 'Othala', nameCn: '传承', meaning: '祖产、家族、精神遗产', keywords: '传承 · 家族 · 根基' },
];

/** 占卜方式 */
const SPREAD_TYPES = [
  { key: 'single', label: '单符文', desc: '抽取一枚符文，快速获得指引' },
  { key: 'three', label: '三符文', desc: '过去-现在-未来，深入了解趋势' },
  { key: 'odin', label: '奥丁之眼', desc: '抽取五枚符文，全面深入解读' },
];

/** 符文占卜页面 */
export default function RunePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRunes, setSelectedRunes] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('single');

  /** 切换符文选中状态 */
  const toggleRune = (key: string) => {
    setSelectedRunes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        // 根据占卜方式限制选中数量
        const maxCount = spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 5;
        if (next.size >= maxCount) return prev;
        next.add(key);
      }
      return next;
    });
  };

  /** 随机抽取符文 */
  const randomDraw = () => {
    const maxCount = spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 5;
    const shuffled = [...RUNE_DATA].sort(() => Math.random() - 0.5);
    setSelectedRunes(new Set(shuffled.slice(0, maxCount).map((r) => r.key)));
  };

  /** 提交符文占卜 */
  const handleSubmit = async () => {
    if (selectedRunes.size === 0) return;
    setLoading(true);
    try {
      const result = await submitFortuneQuery('rune', {
        runes: Array.from(selectedRunes),
        question,
        spreadType,
      });
      navigate(`/result/${result.data.id}`);
    } catch {
      alert('占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 获取选中的符文列表 */
  const getSelectedRunesData = () => {
    return RUNE_DATA.filter((r) => selectedRunes.has(r.key));
  };

  const requiredCount = spreadType === 'single' ? 1 : spreadType === 'three' ? 3 : 5;

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        {/* 背景装饰：符文符号 + 星星 */}
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 居中标题 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <Hexagon size={16} style={{ color: 'var(--color-gold)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>北欧智慧</span>
            </div>
            <h1 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' }}>
              符文占卜
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              聆听北欧古老符文的神秘指引
            </p>
          </div>
        </div>
      </section>

      {/* 占卜方式选择 */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>选择占卜方式</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>不同方式揭示不同层面的指引</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-3xl mx-auto">
            {SPREAD_TYPES.map((st) => (
              <div
                key={st.key}
                onClick={() => {
                  setSpreadType(st.key);
                  setSelectedRunes(new Set()); // 切换方式时清空已选
                }}
                className="flex-1 rounded-2xl p-5 transition-all cursor-pointer"
                style={{
                  background: spreadType === st.key ? 'linear-gradient(135deg, rgba(200,168,78,0.08), rgba(0,75,170,0.06))' : 'var(--color-bg-elevated)',
                  border: spreadType === st.key ? '1.5px solid var(--color-gold)' : '1px solid var(--color-border-light)',
                  boxShadow: spreadType === st.key ? '0 4px 24px rgba(200,168,78,0.15)' : 'var(--shadow-sm)',
                }}
              >
                <h3 className="text-base font-bold mb-1" style={{ color: spreadType === st.key ? 'var(--color-gold-light)' : 'var(--color-text)' }}>{st.label}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 符文选择网格 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择符文
              <span className="text-sm font-normal ml-2" style={{ color: 'var(--color-text-tertiary)' }}>
                （已选 {selectedRunes.size}/{requiredCount}）
              </span>
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>凭直觉选择与你产生共鸣的符文，或点击随机抽取</p>
          </div>

          {/* 随机抽取按钮 */}
          <div className="text-center mb-6">
            <button
              onClick={randomDraw}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--color-primary-bg-strong)', color: 'var(--color-primary)', border: '1px solid rgba(0,75,170,0.2)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 8h2l2-4 2 8 2-4 2 4h2" />
              </svg>
              随机抽取
            </button>
          </div>

          {/* 符文网格 6x4 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
            {RUNE_DATA.map((rune) => {
              const isSelected = selectedRunes.has(rune.key);
              return (
                <div
                  key={rune.key}
                  onClick={() => toggleRune(rune.key)}
                  className="rounded-xl p-3 sm:p-4 transition-all cursor-pointer text-center"
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(200,168,78,0.1), rgba(0,75,170,0.06))' : 'var(--color-bg-elevated)',
                    border: isSelected ? '1.5px solid var(--color-gold)' : '1px solid var(--color-border-light)',
                    boxShadow: isSelected ? '0 2px 16px rgba(200,168,78,0.12)' : 'var(--shadow-sm)',
                  }}
                >
                  <span className="block text-2xl sm:text-3xl mb-1" style={{ color: isSelected ? 'var(--color-gold-light)' : 'var(--color-text)', fontFamily: 'Cinzel, serif' }}>{rune.symbol}</span>
                  <span className="block text-xs font-medium truncate" style={{ color: isSelected ? 'var(--color-gold-light)' : 'var(--color-text-secondary)' }}>{rune.nameCn}</span>
                </div>
              );
            })}
          </div>

          {/* 已选符文展示 */}
          {selectedRunes.size > 0 && (
            <div className="mt-6 rounded-xl p-4 sm:p-5" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)' }}>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-tertiary)' }}>已选符文</p>
              <div className="flex flex-wrap gap-3">
                {getSelectedRunesData().map((rune, i) => (
                  <div key={rune.key} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(200,168,78,0.06)', border: '1px solid rgba(200,168,78,0.15)' }}>
                    <span className="text-lg" style={{ fontFamily: 'Cinzel, serif', color: 'var(--color-gold)' }}>{rune.symbol}</span>
                    <div>
                      <span className="text-xs font-semibold block" style={{ color: 'var(--color-text)' }}>{rune.nameCn}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        {spreadType === 'three' ? ['过去', '现在', '未来'][i] : ''}
                        {spreadType === 'odin' ? ['过去', '现在', '未来', '建议', '结果'][i] : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 问题输入 + 提交 */}
      <section className="py-10 sm:py-14" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>输入你的问题</h2>
              <p className="text-sm text-center mb-6" style={{ color: 'var(--color-text-tertiary)' }}>符文将为你揭示命运的指引（可选）</p>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full resize-none rounded-xl p-4 text-sm outline-none transition-colors"
                rows={3}
                placeholder="描述你想了解的问题..."
                style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />

              {/* 提交按钮 */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedRunes.size !== requiredCount}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                  {loading ? '解读中...' : `开始符文占卜（需选${requiredCount}枚）`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 符文知识速查 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>24 枚符文速查</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>了解每枚符文的基本含义与关键词</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RUNE_DATA.map((rune) => (
              <div
                key={rune.key}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)' }}
              >
                <span className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'var(--color-primary-bg-strong)', color: 'var(--color-gold)', fontFamily: 'Cinzel, serif' }}>{rune.symbol}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{rune.nameCn}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{rune.name}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rune.meaning}</p>
                  <p className="text-xs" style={{ color: 'var(--color-primary)' }}>{rune.keywords}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8" style={{ background: 'var(--color-primary-darker)', borderTop: '1px solid rgba(200, 168, 78, 0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: 'var(--max-width)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>符文占卜仅供娱乐与参考，不构成任何决策建议。请理性对待占卜结果。</p>
        </div>
      </footer>
    </div>
  );
}
