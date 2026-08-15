import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dices, Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 12星座 */
const ZODIAC_SIGNS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
/** 10个主要天体 */
const PLANETS = ['太阳', '月亮', '水星', '金星', '火星', '木星', '土星', '天王星', '海王星', '冥王星'];
/** 12个宫位 */
const HOUSES = ['第一宫', '第二宫', '第三宫', '第四宫', '第五宫', '第六宫', '第七宫', '第八宫', '第九宫', '第十宫', '第十一宫', '第十二宫'];

/** 快捷问题标签 */
const QUICK_TOPICS = ['爱情', '事业', '财运', '健康', '学业'];

/** 推荐数据 */
const RECOMMEND_LIST = [
  { name: '塔罗牌占卜', path: '/tarot', desc: '78 张塔罗牌的古老智慧，AI 帮你解读命运的启示与指引' },
  { name: '星座运势', path: '/zodiac', desc: '十二星座每日/每周/每月运势，爱情、事业、财运全面覆盖' },
  { name: '符文占卜', path: '/rune', desc: '古老北欧符文的神秘力量，透过 Rune 聆听远古的智慧' },
];

/** 星星 SVG 背景装饰 */
function StarBg() {
  return (
    <svg className="absolute w-full h-full" viewBox="0 0 1280 320" preserveAspectRatio="xMidYMid slice">
      {[
        [80, 40, 1.5, 0], [200, 80, 1, 0.5], [350, 30, 1.2, 1], [500, 90, 0.8, 1.5],
        [620, 50, 1.5, 0.3], [750, 100, 1, 2], [900, 35, 1.3, 0.8], [1050, 70, 0.8, 1.2],
        [1180, 45, 1.5, 1.8], [150, 150, 1, 2.5], [420, 180, 0.8, 0.7], [680, 160, 1.2, 1.3],
        [950, 200, 1, 0.4], [1100, 170, 0.8, 2.2],
      ].map(([cx, cy, r, delay], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="var(--color-gold-light)" style={{ animation: 'twinkle1 3s ease-in-out infinite alternate', animationDelay: `${delay}s` }} />
      ))}
    </svg>
  );
}

/** 占星骰子占卜页面 */
export default function AstrodicePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [rolling, setRolling] = useState(false);
  const [diceResults, setDiceResults] = useState<{
    planet: string;
    zodiac: string;
    house: string;
  } | null>(null);

  /** 模拟掷骰子 */
  const rollDice = () => {
    setRolling(true);
    setDiceResults(null);
    setTimeout(() => {
      setRolling(false);
      setDiceResults({
        planet: PLANETS[Math.floor(Math.random() * PLANETS.length)],
        zodiac: ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)],
        house: HOUSES[Math.floor(Math.random() * HOUSES.length)],
      });
    }, 2000);
  };

  /** 提交占星骰子占卜 */
  const handleSubmit = async () => {
    if (!question || !diceResults) return;
    setLoading(true);
    try {
      const result = await submitFortuneQuery('astrodice', {
        question,
        planet: diceResults.planet,
        zodiac: diceResults.zodiac,
        house: diceResults.house,
      });
      navigate(`/result/astrodice/${result.data.id}`);
    } catch {
      alert('占卜失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        {/* 星星背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <StarBg />
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 居中标题 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
                <rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" />
                <circle cx="5" cy="5" r="1.2" />
                <circle cx="11" cy="5" r="1.2" />
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="5" cy="11" r="1.2" />
                <circle cx="11" cy="11" r="1.2" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>精准占卜</span>
            </div>
            <h1 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-inverse)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)' }}>
              占星骰子
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              三颗骰子，星座 x 行星 x 宫位的精准回答
            </p>
          </div>
        </div>
      </section>

      {/* 问题输入区 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>心中默念你的问题</h2>
            <p className="text-sm text-center mb-8" style={{ color: 'var(--color-text-tertiary)' }}>越具体的问题，骰子的回答越精准</p>

            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full resize-none rounded-xl p-4 text-base outline-none transition-colors"
                rows={4}
                placeholder="描述你的具体问题，例如：我最近面试的那份工作能拿到offer吗？"
                style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              />
              {/* 快捷问题标签 */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>快捷问题：</span>
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    className="inline-block px-3 py-1 text-sm rounded-full border transition-all whitespace-nowrap"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-gold-dark)'; e.currentTarget.style.background = 'rgba(200,168,78,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* 掷骰子按钮 */}
            <div className="text-center mt-8">
              <button
                onClick={rollDice}
                disabled={rolling}
                className="btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
                style={{ boxShadow: '0 4px 20px rgba(200, 168, 78, 0.35), 0 0 40px rgba(200, 168, 78, 0.12)' }}
              >
                <Dices size={24} />
                {rolling ? '骰子旋转中...' : '掷骰子'}
              </button>
              <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>点击按钮，让宇宙为你揭示答案</p>
            </div>
          </div>
        </div>
      </section>

      {/* 骰子展示区（掷骰后显示） */}
      {diceResults && !rolling && (
        <section className="relative py-14 sm:py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f2e 0%, var(--color-primary-darker) 50%, #0a0f2e 100%)' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute w-full h-full opacity-15" viewBox="0 0 1280 600" preserveAspectRatio="xMidYMid slice">
              <circle cx="640" cy="280" r="260" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="6 10" />
              <circle cx="640" cy="280" r="200" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="640" cy="280" r="140" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" strokeDasharray="3 6" />
            </svg>
          </div>

          <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>骰子已落定</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>星座 / 行星 / 宫位</p>
            </div>

            {/* 三颗骰子 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16">
              {/* 星座骰 */}
              <div className="text-center">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(220, 80, 80, 0.15)', color: '#f0a0a0' }}>星座骰</span>
                <div className="mx-auto" style={{ width: 140, height: 140, perspective: '600px' }}>
                  <div className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center" style={{ background: 'linear-gradient(145deg, #c0392b 0%, #962d22 40%, #7a2519 100%)', boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.15), inset 0 -2px 6px rgba(0,0,0,0.2), 0 8px 32px rgba(150, 45, 34, 0.4)', border: '2px solid rgba(255,200,180,0.2)' }}>
                    <span style={{ fontSize: 48, lineHeight: 1, color: '#fff' }}>&#x2648;</span>
                    <span className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{diceResults.zodiac}</span>
                  </div>
                </div>
                <p className="text-sm mt-4 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>行动力与开创</p>
              </div>

              {/* 行星骰 */}
              <div className="text-center">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(74, 144, 217, 0.15)', color: '#a0ccf0' }}>行星骰</span>
                <div className="mx-auto" style={{ width: 140, height: 140, perspective: '600px' }}>
                  <div className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center" style={{ background: 'linear-gradient(145deg, #2e86c1 0%, #2471a3 40%, #1a5276 100%)', boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.15), inset 0 -2px 6px rgba(0,0,0,0.2), 0 8px 32px rgba(36, 113, 163, 0.4)', border: '2px solid rgba(180,220,255,0.2)' }}>
                    <span style={{ fontSize: 48, lineHeight: 1, color: '#fff' }}>&#x2609;</span>
                    <span className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{diceResults.planet}</span>
                  </div>
                </div>
                <p className="text-sm mt-4 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>自我意志与光芒</p>
              </div>

              {/* 宫位骰 */}
              <div className="text-center">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(46, 139, 87, 0.15)', color: '#a0e0c0' }}>宫位骰</span>
                <div className="mx-auto" style={{ width: 140, height: 140, perspective: '600px' }}>
                  <div className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center" style={{ background: 'linear-gradient(145deg, #27ae60 0%, #1e8449 40%, #196f3d 100%)', boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.15), inset 0 -2px 6px rgba(0,0,0,0.2), 0 8px 32px rgba(30, 132, 73, 0.4)', border: '2px solid rgba(180,255,200,0.2)' }}>
                    <span className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: '#fff' }}>{HOUSES.indexOf(diceResults.house) + 1}</span>
                    <span className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{diceResults.house}</span>
                  </div>
                </div>
                <p className="text-sm mt-4 font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>命运领域</p>
              </div>
            </div>

            {/* 组合标签 */}
            <div className="flex items-center justify-center gap-3 mt-10 sm:mt-14 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgba(192, 57, 43, 0.15)', color: '#f0a0a0', border: '1px solid rgba(192, 57, 43, 0.2)' }}>
                {diceResults.zodiac}
              </span>
              <ArrowRight size={20} style={{ color: 'var(--color-gold-light)' }} />
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgba(46, 134, 193, 0.15)', color: '#a0ccf0', border: '1px solid rgba(46, 134, 193, 0.2)' }}>
                {diceResults.planet}
              </span>
              <ArrowRight size={20} style={{ color: 'var(--color-gold-light)' }} />
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#a0e0c0', border: '1px solid rgba(39, 174, 96, 0.2)' }}>
                {HOUSES.indexOf(diceResults.house) + 1} 宫
              </span>
            </div>

            {/* 开始解读按钮 */}
            <div className="text-center mt-10">
              <button
                onClick={handleSubmit}
                disabled={loading || !question}
                className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <MessageCircle size={20} />}
                {loading ? '解读中...' : '开始解读'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 相关推荐 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>探索更多占卜</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>天机为你提供多种精准占卜方式</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECOMMEND_LIST.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-2xl p-6 transition-all"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-bg-strong)', color: 'var(--color-primary)' }}>
                    <Dices size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium mt-2" style={{ color: 'var(--color-primary)' }}>
                      了解更多
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8" style={{ background: 'var(--color-primary-darker)', borderTop: '1px solid rgba(200, 168, 78, 0.1)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: 'var(--max-width)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>占星骰子仅供娱乐与参考，不构成任何决策建议。请理性对待占卜结果。</p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>TIANJI &copy; 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
