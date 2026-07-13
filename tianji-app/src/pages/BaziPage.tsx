import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircleDot, Calendar, User, Clock, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';

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

/** 生成年份选项（1940-2030） */
const YEAR_OPTIONS = Array.from({ length: 91 }, (_, i) => 1940 + i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

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

/** 通用下拉选择框组件 */
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

/** 八字排盘页面 */
export default function BaziPage() {
  const navigate = useNavigate();
  const { loading, error, query } = useFortune('bazi');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  /** 提交八字排盘 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!year || !month || !day || !hour || !gender) return;
    const res = await query({ year, month, day, hour, gender, calendarType, province, city });
    if (res) navigate(`/result/bazi/${res.id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>
      {/* ====== Hero 区域 ====== */}
      <section className="relative py-16 sm:py-24" style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0f1629 100%)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>

        {/* 标题行 */}
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1
              className="font-bold truncate"
              style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)',
                textWrap: 'balance',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
              }}
            >
              八字排盘
            </h1>
            <p className="mt-3 text-base lg:text-lg line-clamp-2" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              根据出生年月日时推算四柱八字，分析五行十神与大运流年
            </p>
          </div>

          {/* 八卦太极 CSS 图形装饰 */}
          <div className="hidden sm:flex items-center justify-center shrink-0" style={{ width: 64, height: 64 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'conic-gradient(var(--color-primary) 0deg 180deg, var(--color-gold) 180deg 360deg)',
                position: 'relative',
              }}
              aria-hidden="true"
            >
              <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-gold)' }} />
              <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-primary)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '2px solid var(--color-primary-darker)' }} />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ====== 主体内容：表单区（居中卡片） ====== */}
      <section className="mx-auto px-4 lg:px-8 pb-12" style={{ maxWidth: 'var(--max-width)' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div
              className="rounded-xl p-6 lg:p-8"
              style={{
                background: 'var(--color-bg-elevated)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>输入出生信息</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                {/* 出生日期：年月日一行 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>出生日期</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors">
                      <option value="" disabled>年份</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}年</option>
                      ))}
                    </select>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors">
                      <option value="" disabled>月份</option>
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m} value={m}>{m}月</option>
                      ))}
                    </select>
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors">
                      <option value="" disabled>日期</option>
                      {DAY_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}日</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 时辰 + 性别一行 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 出生时辰 */}
                  <SelectField
                    label="出生时辰"
                    value={hour}
                    onChange={setHour}
                    options={SHICHEN_OPTIONS.map((s) => ({
                      value: s.value,
                      label: s.label,
                    }))}
                    placeholder="请选择时辰"
                  />
                  {/* 性别 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>性别</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === 'male'}
                          onChange={() => setGender('male')}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text)' }}>男</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === 'female'}
                          onChange={() => setGender('female')}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text)' }}>女</span>
                      </label>
                    </div>
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
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectField
                        label="出生省份"
                        value={province}
                        onChange={setProvince}
                        options={PROVINCE_OPTIONS}
                      />
                      <SelectField
                        label="出生城市"
                        value={city}
                        onChange={setCity}
                        options={[{ value: '', label: '请选择' }]}
                      />
                    </div>
                  )}
                </div>

                {/* 错误提示 */}
                {error && (
                  <div
                    className="rounded-lg px-4 py-3 text-sm"
                    style={{
                      backgroundColor: 'rgba(196, 58, 58, 0.1)',
                      color: 'var(--color-error)',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* 提交按钮 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !year || !month || !day || !hour || !gender}
                    className="btn-primary w-full py-3 rounded-lg text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="inline animate-spin mr-2" />
                        排盘中...
                      </>
                    ) : (
                      '开始排盘'
                    )}
                  </button>
                </div>
              </form>

              {/* 提示文字 */}
              <p className="mt-4 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                出生时间越精确，排盘结果越准确
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
