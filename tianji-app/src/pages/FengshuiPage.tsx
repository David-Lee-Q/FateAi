import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Loader2 } from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/** 坐向选项 - 使用后端需要的大写英文 */
const FACING_OPTIONS = [
  { value: 'S', label: '坐北朝南', desc: '经典朝向，采光通风最佳' },
  { value: 'N', label: '坐南朝北', desc: '适合特定地形需求' },
  { value: 'W', label: '坐西朝东', desc: '迎朝阳，朝气蓬勃' },
  { value: 'E', label: '坐东朝西', desc: '夕照余晖，韵味独特' },
  { value: 'SE', label: '坐西北朝东南', desc: '兼顾采光与通风' },
  { value: 'NW', label: '坐东南朝西北', desc: '因地制宜的选择' },
  { value: 'SW', label: '坐西南朝东北', desc: '南方常见朝向' },
  { value: 'NE', label: '坐东北朝西南', desc: '适应地形布局' },
];

/** 环境类型选项 - 映射到后端值 */
const ENV_OPTIONS = [
  { value: 'residential', label: '住宅公寓', icon: '🏠' },
  { value: 'residential', label: '别墅洋房', icon: '🏡' },
  { value: 'office', label: '办公室', icon: '🏢' },
  { value: 'commercial', label: '商铺门店', icon: '🏪' },
  { value: 'commercial', label: '厂房仓库', icon: '🏭' },
  { value: 'residential', label: '宅基地/空地', icon: '🌿' },
];

/** 风水方位分析页面 */
export default function FengshuiPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState('S');
  const [envType, setEnvType] = useState('residential');
  const [floor, setFloor] = useState('');
  const [buildYear, setBuildYear] = useState('');
  const [address, setAddress] = useState('');
  const [question, setQuestion] = useState('');

  /** 提交风水分析 */
  const handleSubmit = async () => {
    if (!facing) return;
    setLoading(true);
    try {
      // 后端需要：direction（大写N/NE/E/SE/S/SW/W/NW）、buildingType（residential/commercial/office）
      const result = await submitFortuneQuery('fengshui', {
        direction: facing,
        buildingType: envType,
      });
      navigate(`/result/fengshui/${result.data.id}`);
    } catch {
      alert('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ====== 标题区（Hero） ====== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0e1a 100%)' }}>
        <div className="mx-auto px-4 lg:px-8 pt-12 pb-8" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 标题居中 */}
          <div className="text-center">
            {/* 金色徽章标签 */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 168, 78, 0.1)', border: '1px solid rgba(200, 168, 78, 0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
                <path d="M8 1L3 6h3v4h4V6h3L8 1z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-gold-light)' }}>环境堪舆</span>
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
              风水方位
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 'var(--leading-relaxed)' }}>
              堪舆风水，坐向方位环境分析，趋吉避凶
            </p>
          </div>
        </div>
      </section>

      {/* ====== 主体内容：表单区（居中卡片） ====== */}
      <section className="mx-auto px-4 lg:px-8 py-12" style={{ maxWidth: 'var(--max-width)' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="glass-card rounded-xl p-6 lg:p-8">
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>输入环境信息</h2>

              {/* 坐向选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>房屋坐向</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FACING_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setFacing(opt.value)}
                      className="rounded-lg p-3 text-center cursor-pointer transition-all"
                      style={{
                        border: facing === opt.value ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                        background: facing === opt.value ? 'var(--color-primary-bg-strong)' : 'var(--color-bg-elevated)',
                      }}
                    >
                      <p className="text-sm font-medium truncate" style={{ color: facing === opt.value ? 'var(--color-primary)' : 'var(--color-text)' }}>{opt.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 环境类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>环境类型</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ENV_OPTIONS.map((opt) => (
                    <div
                      key={opt.value + opt.label}
                      onClick={() => setEnvType(opt.value)}
                      className="rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-all"
                      style={{
                        border: envType === opt.value ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                        background: envType === opt.value ? 'var(--color-primary-bg-strong)' : 'var(--color-bg-elevated)',
                      }}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-medium" style={{ color: envType === opt.value ? 'var(--color-primary)' : 'var(--color-text)' }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 楼层/建造年份 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    楼层
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    placeholder="如：12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    建造年份
                  </label>
                  <input
                    type="number"
                    value={buildYear}
                    onChange={(e) => setBuildYear(e.target.value)}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    placeholder="如：2010"
                  />
                </div>
              </div>

              {/* 地址 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  详细地址
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                  placeholder="请输入详细地址（选填）"
                />
              </div>

              {/* 补充说明 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  补充说明（选填）
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors resize-none"
                  rows={2}
                  placeholder="其他需要说明的情况"
                />
              </div>

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 btn-primary"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Mountain size={20} />}
                {loading ? '分析中...' : '开始分析'}
              </button>

              {/* 提示 */}
              <p className="mt-4 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                风水分析综合坐向、环境类型及空间格局，给出方位布局建议
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}