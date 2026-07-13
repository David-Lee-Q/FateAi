import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Loader2, ChevronRight } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';

/** 星座数据 */
interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dateRange: string;
  birthDate: string;
}

/** 12 星座配置（对齐设计稿 HTML 实体符号） */
const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', symbol: '\u2648', dateRange: '3.21 - 4.19', birthDate: '2000-04-05' },
  { id: 'taurus', name: '金牛座', symbol: '\u2649', dateRange: '4.20 - 5.20', birthDate: '2000-05-10' },
  { id: 'gemini', name: '双子座', symbol: '\u264A', dateRange: '5.21 - 6.21', birthDate: '2000-06-10' },
  { id: 'cancer', name: '巨蟹座', symbol: '\u264B', dateRange: '6.22 - 7.22', birthDate: '2000-07-10' },
  { id: 'leo', name: '狮子座', symbol: '\u264C', dateRange: '7.23 - 8.22', birthDate: '2000-08-10' },
  { id: 'virgo', name: '处女座', symbol: '\u264D', dateRange: '8.23 - 9.22', birthDate: '2000-09-10' },
  { id: 'libra', name: '天秤座', symbol: '\u264E', dateRange: '9.23 - 10.23', birthDate: '2000-10-10' },
  { id: 'scorpio', name: '天蝎座', symbol: '\u264F', dateRange: '10.24 - 11.22', birthDate: '2000-11-10' },
  { id: 'sagittarius', name: '射手座', symbol: '\u2650', dateRange: '11.23 - 12.21', birthDate: '2000-12-10' },
  { id: 'capricorn', name: '摩羯座', symbol: '\u2651', dateRange: '12.22 - 1.19', birthDate: '2000-01-10' },
  { id: 'aquarius', name: '水瓶座', symbol: '\u2652', dateRange: '1.20 - 2.18', birthDate: '2000-02-05' },
  { id: 'pisces', name: '双鱼座', symbol: '\u2653', dateRange: '2.19 - 3.20', birthDate: '2000-03-05' },
];

/** 运势类型 — 对齐设计稿 Tab */
const FORTUNE_TYPES = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '本年' },
];

/** 星座运势页面 */
export default function ZodiacPage() {
  const navigate = useNavigate();
  const { loading, error, query } = useFortune('zodiac');

  // 表单状态
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [fortuneType, setFortuneType] = useState('today');

  /** 表单提交处理 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSign) return;

    // 后端需要 birthDate（自动算出星座），使用选中星座的中间日期
    const resultData = await query({
      birthDate: selectedSign.birthDate,
      type: fortuneType,
    });

    if (resultData) {
      navigate(`/result/zodiac/${resultData.id}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ color: 'var(--color-text)' }}>
      {/* ====== 页面标题区 ====== */}
      <div className="mx-auto" style={{ maxWidth: 'var(--max-width)', padding: '0 var(--space-6)' }}>
        <section className="pt-24 pb-8">
          {/* 面包屑 */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>首页</Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>&#8250;</span>
            <span className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>西方占卜</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>&#8250;</span>
            <span style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)' }}>星座运势</span>
          </div>
          {/* 标题 */}
          <h1
            className="font-bold mb-3"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: 'var(--color-text-inverse)',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-display)',
            }}
          >
            星座运势
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 'var(--leading-relaxed)' }}>
            基于太阳星座与天象运行，探索每日运势密码
          </p>
        </section>

        {/* ====== 星座选择网格（对齐设计稿 zodiac-card 样式） ====== */}
        <section className="pb-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {ZODIAC_SIGNS.map((sign) => {
              const isActive = selectedSign?.id === sign.id;
              return (
                <button
                  key={sign.id}
                  type="button"
                  onClick={() => setSelectedSign(sign)}
                  className="flex flex-col items-center gap-2 p-5 transition-all text-center cursor-pointer"
                  style={{
                    background: isActive ? 'rgba(200, 168, 78, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1.5px solid var(--color-gold)' : '1.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: isActive ? '0 0 20px rgba(200, 168, 78, 0.15), inset 0 0 20px rgba(200, 168, 78, 0.05)' : 'none',
                  }}
                >
                  <span
                    className="block mb-1"
                    style={{
                      fontSize: '2rem',
                      color: isActive ? 'var(--color-gold)' : 'var(--color-gold-light)',
                      textShadow: isActive ? '0 0 12px rgba(200, 168, 78, 0.5)' : 'none',
                      transition: 'var(--transition-base)',
                    }}
                  >
                    {sign.symbol}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: isActive ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.9)' }}>
                    {sign.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {sign.dateRange}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ====== 时间范围切换 Tab ====== */}
        <section className="pb-8">
          <div className="inline-flex items-center gap-2 p-1" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-lg)' }}>
            {FORTUNE_TYPES.map((type) => {
              const isActive = fortuneType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFortuneType(type.value)}
                  className="transition-all whitespace-nowrap"
                  style={{
                    padding: 'var(--space-2) var(--space-6)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#0a0e27' : 'rgba(255, 255, 255, 0.6)',
                    background: isActive ? 'var(--color-gold)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ====== 提交区 ====== */}
        <section className="pb-12">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              {/* 错误提示 */}
              {error && (
                <div
                  className="rounded-lg px-4 py-3 text-sm mb-4"
                  style={{ backgroundColor: 'rgba(196, 58, 58, 0.1)', color: 'var(--color-error)' }}
                >
                  {error}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !selectedSign}
                className="btn-primary w-full py-3 rounded-lg text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="inline animate-spin mr-2" />
                    解读中...
                  </>
                ) : (
                  <>
                    <Sun size={18} className="inline mr-2" />
                    查看运势
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
