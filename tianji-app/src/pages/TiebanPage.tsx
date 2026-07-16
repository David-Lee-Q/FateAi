import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Clock, Loader2, User } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';
import DatePicker from '@/components/DatePicker';

/** 起课方式 */
type MethodType = 'birth' | 'current';

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

/** 快捷问题标签 */
const QUICK_TAGS = ['事业前程', '婚姻感情', '求财求名', '疾病健康', '官非诉讼'];

/** 铁板神数占卜页面 */
export default function TiebanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<MethodType>('birth');
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
  const [birthHour, setBirthHour] = useState('');
  const [gender, setGender] = useState('male');
  const [question, setQuestion] = useState('');

  /** 提交铁板神数占卜 */
  const handleSubmit = async () => {
    if (method === 'birth' && (!birthDate.year || !birthDate.month || !birthDate.day || !birthHour)) {
      alert('请填写完整的出生信息');
      return;
    }

    let year: number, month: number, day: number, hour: number;
    
    if (method === 'birth') {
      year = parseInt(birthDate.year);
      month = parseInt(birthDate.month);
      day = parseInt(birthDate.day);
      hour = Number(birthHour);
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
      day = now.getDate();
      hour = now.getHours();
    }

    setLoading(true);
    try {
      const result = await submitFortuneQuery('tieban', {
        year,
        month,
        day,
        hour,
        gender,
        question,
      });
      navigate(`/result/tieban/${result.data.id}`);
    } catch {
      alert('起数失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 起课方式配置 */
  const METHOD_OPTIONS: { key: MethodType; label: string; desc: string; recommended?: boolean }[] = [
    { key: 'birth', label: '按出生时间', desc: '输入出生年月日时，以四柱为基础推算命运数字', recommended: true },
    { key: 'current', label: '按当前时间', desc: '自动取当前时辰起数，快速便捷，随时可测' },
  ];

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center">
            {/* 紫色徽章标签（四柱图标） */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#7c3aed">
                <rect x="1" y="1" width="6" height="14" rx="1" />
                <rect x="9" y="1" width="6" height="14" rx="1" />
                <rect x="3" y="4" width="4" height="2" rx="0.5" fill="#fff" opacity="0.6" />
                <rect x="3" y="9" width="4" height="2" rx="0.5" fill="#fff" opacity="0.6" />
              </svg>
              <span className="text-sm font-medium" style={{ color: '#a78bfa' }}>四柱秘术</span>
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
              铁板神数
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              以四柱八字为根基，通过数字演绎人生密码
            </p>
          </div>
        </div>
      </section>

      {/* 起课方式选择 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择起数方式
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>两种起数方式，根据需求选择</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {METHOD_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                onClick={() => setMethod(opt.key)}
                className="relative rounded-xl p-6 cursor-pointer transition-all"
                style={{
                  border: method === opt.key ? '2px solid #7c3aed' : '2px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  boxShadow: method === opt.key ? '0 0 0 1px #7c3aed, 0 8px 24px rgba(124, 58, 237, 0.15)' : 'none',
                }}
              >
                {opt.recommended && (
                  <span
                    className="absolute -top-px right-4 text-xs font-semibold px-2.5 py-0.5 rounded-b"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
                  >
                    推荐
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: method === opt.key ? 'rgba(124, 58, 237, 0.1)' : 'var(--color-primary-bg-strong)',
                      color: method === opt.key ? '#7c3aed' : 'var(--color-primary)',
                    }}
                  >
                    <Hash size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{opt.label}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-tertiary)' }}>{opt.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 输入表单 */}
          <div className="max-w-3xl mx-auto mt-10">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 出生日期输入（按出生时间时显示） */}
                {method === 'birth' && (
                  <DatePicker
                    label="出生日期"
                    value={birthDate}
                    onChange={setBirthDate}
                    placeholder="请选择日期"
                  />
                )}

                {/* 出生时辰（按出生时间时显示） */}
                {method === 'birth' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                      <Clock size={14} className="inline mr-1" />
                      出生时辰
                    </label>
                    <select
                      value={birthHour}
                      onChange={(e) => setBirthHour(e.target.value)}
                      className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    >
                      <option value="">请选择时辰</option>
                      {SHICHEN_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 性别选择 */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    <User size={14} className="inline mr-1" />
                    性别
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
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
                  placeholder="请描述您要测算的事情，例如：今年事业发展如何？"
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

              {/* 起数按钮 */}
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || (method === 'birth' && (!birthDate.year || !birthDate.month || !birthDate.day || !birthHour))}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)' }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Hash size={18} />}
                  {loading ? '起数中...' : '开始起数'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能说明 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>关于铁板神数</h3>
              <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                <p>铁板神数是中国传统命理学中的高级术数体系，与八字、紫微斗数并称为"命学三大秘术"。</p>
                <p>它以四柱八字为基础，结合数字推演，能精准揭示人生各阶段的运势走向、财富数字、官职品位等具体信息。</p>
                <p>铁板神数的最大特点是其数字的精确性，能够给出具体的年份、数字等量化信息，为人生决策提供独特参考。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}