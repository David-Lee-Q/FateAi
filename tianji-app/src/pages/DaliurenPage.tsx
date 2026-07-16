import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, Loader2, User } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';
import DatePicker from '@/components/DatePicker';

/** 起课方式 */
type MethodType = 'birth' | 'current' | 'question';

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
const QUICK_TAGS = ['出行远行', '求财贸易', '婚姻嫁娶', '词讼争斗', '疾病瘟疫'];

/** 大六壬占卜页面 */
export default function DaliurenPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<MethodType>('birth');
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
  const [birthHour, setBirthHour] = useState('');
  const [gender, setGender] = useState('male');
  const [question, setQuestion] = useState('');

  /** 提交大六壬占卜 */
  const handleSubmit = async () => {
    if (method === 'birth' && (!birthDate.year || !birthDate.month || !birthDate.day || !birthHour)) {
      alert('请填写完整的出生信息');
      return;
    }
    if (method === 'question' && !question) {
      alert('请输入您要占测的事情');
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
      const result = await submitFortuneQuery('daliuren', {
        year,
        month,
        day,
        hour,
        gender,
        question: method === 'question' ? question : undefined,
      });
      navigate(`/result/daliuren/${result.data.id}`);
    } catch {
      alert('起课失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  /** 起课方式配置 */
  const METHOD_OPTIONS: { key: MethodType; label: string; desc: string; recommended?: boolean }[] = [
    { key: 'birth', label: '按出生时间', desc: '输入出生年月日时，以四柱为基础起课', recommended: true },
    { key: 'current', label: '按当前时间', desc: '自动取当前时辰起课，快速便捷' },
    { key: 'question', label: '专问一事', desc: '针对具体事情起课，更精确分析', },
  ];

  return (
    <div>
      {/* 页面标题区 */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center">
            {/* 金色徽章标签（六壬盘图标） */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#f59e0b">
                <circle cx="8" cy="8" r="7" fill="none" stroke="#f59e0b" strokeWidth="1.2"/>
                <circle cx="8" cy="8" r="4" fill="none" stroke="#f59e0b" strokeWidth="0.8"/>
                <circle cx="8" cy="8" r="1.5" fill="#f59e0b"/>
                <line x1="8" y1="1" x2="8" y2="4" stroke="#f59e0b" strokeWidth="1"/>
                <line x1="8" y1="12" x2="8" y2="15" stroke="#f59e0b" strokeWidth="1"/>
                <line x1="1" y1="8" x2="4" y2="8" stroke="#f59e0b" strokeWidth="1"/>
                <line x1="12" y1="8" x2="15" y2="8" stroke="#f59e0b" strokeWidth="1"/>
              </svg>
              <span className="text-sm font-medium" style={{ color: '#fbbf24' }}>三式之首</span>
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
              大六壬
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              古传三式之一，以月将加时推算吉凶祸福
            </p>
          </div>
        </div>
      </section>

      {/* 起课方式选择 */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--tracking-tight)' }}>
              选择起课方式
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>三种起课方式，根据需求选择</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {METHOD_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                onClick={() => setMethod(opt.key)}
                className="relative rounded-xl p-6 cursor-pointer transition-all"
                style={{
                  border: method === opt.key ? '2px solid #f59e0b' : '2px solid var(--color-border)',
                  background: 'var(--color-bg-elevated)',
                  boxShadow: method === opt.key ? '0 0 0 1px #f59e0b, 0 8px 24px rgba(245, 158, 11, 0.15)' : 'none',
                }}
              >
                {opt.recommended && (
                  <span
                    className="absolute -top-px right-4 text-xs font-semibold px-2.5 py-0.5 rounded-b"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0a0e1a' }}
                  >
                    推荐
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: method === opt.key ? 'rgba(245, 158, 11, 0.1)' : 'var(--color-primary-bg-strong)',
                      color: method === opt.key ? '#f59e0b' : 'var(--color-primary)',
                    }}
                  >
                    <Compass size={24} />
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
                  placeholder="请描述您要占测的事情，例如：近日出行是否顺利？"
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

              {/* 起课按钮 */}
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || (method === 'birth' && (!birthDate.year || !birthDate.month || !birthDate.day || !birthHour)) || (method === 'question' && !question)}
                  className="inline-flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)', color: '#0a0e1a' }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Compass size={18} />}
                  {loading ? '起课中...' : '开始起课'}
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
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>关于大六壬</h3>
              <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                <p>大六壬是中国古代三大预测学"三式"之首（太乙、奇门、六壬），相传为九天玄女所创，以天道运行规律推演人事吉凶。</p>
                <p>大六壬以月将加时为起盘基础，通过天地盘、四课、三传的层层推演，能准确判断事情的来龙去脉和发展趋势。</p>
                <p>相比其他术数，大六壬的特点是反应迅速、信息量大、断事精准，尤其擅长分析具体事件的细节和时机。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}