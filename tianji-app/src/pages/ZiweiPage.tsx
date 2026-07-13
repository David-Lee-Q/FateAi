import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Calendar, Clock, User, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

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

/** 排盘类型 */
type ChartType = 'benming' | 'daxian' | 'liunian' | 'liuyue';

/** 紫微斗数占卜页面 */
export default function ZiweiPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [chartType, setChartType] = useState<ChartType>('benming');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  /** 提交紫微斗数排盘 */
  const handleSubmit = async () => {
    if (!birthDate || !birthTime) return;
    setLoading(true);
    try {
      // 将日期字符串解析为年/月/日
      const [y, m, d] = birthDate.split('-').map(Number);
      const h = Number(birthTime);
      const result = await submitFortuneQuery('ziwei', {
        year: y,
        month: m,
        day: d,
        hour: h,
        gender,
      });
      navigate(`/result/ziwei/${result.data.id}`);
    } catch {
      alert('排盘失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 排盘类型标签 */
  const CHART_TABS: { key: ChartType; label: string }[] = [
    { key: 'benming', label: '本命盘' },
    { key: 'daxian', label: '大限盘' },
    { key: 'liunian', label: '流年盘' },
    { key: 'liuyue', label: '流月盘' },
  ];

  /** 省份选项 */
  const PROVINCE_OPTIONS = [
    { value: '', label: '请选择' },
    { value: 'bj', label: '北京' },
    { value: 'sh', label: '上海' },
    { value: 'gd', label: '广东' },
    { value: 'zj', label: '浙江' },
    { value: 'js', label: '江苏' },
    { value: 'sc', label: '四川' },
    { value: 'hb', label: '湖北' },
    { value: 'hn', label: '湖南' },
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
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>帝王学命理</span>
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
              紫微斗数
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              帝王学命理，十二宫位星曜分布，推演一生运势格局
            </p>
          </div>
        </div>
      </section>

      {/* ====== 主体内容：表单区（居中卡片） ====== */}
      <section className="mx-auto px-4 lg:px-8 pb-12" style={{ maxWidth: 'var(--max-width)' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="glass-card rounded-xl p-6 lg:p-8">
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>输入出生信息</h2>

              {/* 排盘类型 Tab 切换 */}
              <div className="mb-6">
                <div className="flex flex-nowrap overflow-x-auto gap-2 p-1 rounded-xl" style={{ background: 'var(--color-bg-inset)' }}>
                  {CHART_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setChartType(tab.key)}
                      className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: chartType === tab.key ? 'var(--color-primary)' : 'transparent',
                        color: chartType === tab.key ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-5">
                {/* 历/阳历切换 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>历法</span>
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                    <button
                      type="button"
                      onClick={() => setCalendarType('solar')}
                      className="px-4 py-1.5 text-sm font-medium transition-colors"
                      style={{
                        background: calendarType === 'solar' ? 'var(--color-primary)' : 'transparent',
                        color: calendarType === 'solar' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                      }}
                    >
                      阳历
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarType('lunar')}
                      className="px-4 py-1.5 text-sm transition-colors"
                      style={{
                        background: calendarType === 'lunar' ? 'var(--color-primary)' : 'transparent',
                        color: calendarType === 'lunar' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                      }}
                    >
                      农历
                    </button>
                  </div>
                </div>

                {/* 出生日期 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    placeholder="请选择出生日期"
                  />
                </div>

                {/* 出生时辰 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    出生时辰
                  </label>
                  <select
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                  >
                    <option value="">请选择时辰</option>
                    {SHICHEN_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* 性别 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    性别
                  </label>
                  <div className="flex items-center gap-4">
                    {[
                      { label: '男', value: 'male' as const },
                      { label: '女', value: 'female' as const },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === opt.value}
                          onChange={() => setGender(opt.value)}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text)' }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 高级选项（可折叠） */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <ChevronDown
                      size={16}
                      className="transition-transform"
                      style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                    高级选项
                  </button>
                  {showAdvanced && (
                    <div className="mt-3 flex flex-col gap-4">
                      {/* 出生省份 */}
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                          出生省份
                        </label>
                        <select
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                        >
                          {PROVINCE_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                      {/* 出生城市 */}
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                          出生城市
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                        >
                          <option value="">请选择</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 提交按钮 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !birthDate || !birthTime}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-base font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Star size={20} />}
                    {loading ? '排盘中...' : '开始排盘'}
                  </button>
                </div>
              </form>

              {/* 提示文字 */}
              <p className="mt-4 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                紫微斗数以出生时辰定位命宫，时辰准确度直接影响十二宫位排列
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
