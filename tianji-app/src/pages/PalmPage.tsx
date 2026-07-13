import { useState, useRef, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, UploadCloud, User, Activity, Hand, Wind } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';

/** 五行掌型数据 */
const PALM_TYPES = [
  { name: '金型手', emoji: '🪶', desc: '方厚端庄', trait: '务实稳健', color: 'rgba(200, 168, 78, 0.15)' },
  { name: '木型手', emoji: '🌿', desc: '修长优美', trait: '聪慧敏锐', color: 'rgba(34, 197, 94, 0.12)' },
  { name: '水型手', emoji: '💧', desc: '圆润柔和', trait: '情感丰富', color: 'rgba(56, 189, 248, 0.12)' },
  { name: '火型手', emoji: '🔥', desc: '尖尖纤长', trait: '热情洋溢', color: 'rgba(251, 146, 60, 0.12)' },
  { name: '土型手', emoji: '🏔️', desc: '浑厚宽大', trait: '稳重可靠', color: 'rgba(168, 85, 247, 0.12)' },
];

/** 分析说明卡片数据 */
const ANALYSIS_CARDS = [
  {
    icon: Activity,
    title: '三大主线分析',
    subtitle: '生命线 · 感情线 · 智慧线',
    desc: '深度解析手掌三大主线的形态、走向与特征，揭示性格特点与命运走向',
    color: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
  },
  {
    icon: Hand,
    title: '掌型特征',
    subtitle: '金 · 木 · 水 · 火 · 土',
    desc: '通过手掌形状、大小与指节比例，判别五行掌型，洞悉天赋特质',
    color: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
  },
  {
    icon: Wind,
    title: '五行手相',
    subtitle: '木 · 火 · 土 · 金 · 水',
    desc: '结合掌纹与五行理论，提供综合运势分析与人生指导建议',
    color: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#22c55e',
  },
];

/** 推荐工具数据 */
const RECOMMEND_TOOLS = [
  { icon: '🔮', label: '塔罗牌占卜', desc: '西方神秘学经典占卜工具', path: '/tarot' },
  { icon: '✨', label: '八字排盘', desc: '中国传统命理基础工具', path: '/bazi' },
  { icon: '🌙', label: '星座运势', desc: '西方占星术解读命运', path: '/zodiac' },
];

export default function PalmPage() {
  const navigate = useNavigate();
  const { loading, error, query } = useFortune('palm');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = imageFile !== null;

  /** 处理文件选择 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /** 处理拖拽上传 */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  /** 处理文件 */
  const processFile = (file: File) => {
    // 限制图片大小为 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB，请选择更小的图片');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /** 表单提交 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    const result = await query({
      gender,
      image: imagePreview,
    });

    if (result) {
      navigate(`/result/palm/${result.id}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 星空背景动画样式 */}
      <style>{`
        @keyframes twinkle1 {
          0%, 100% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        @keyframes twinkle2 {
          0%, 100% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @keyframes twinkle3 {
          0%, 100% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
        .starfield .layer-1 {
          width: 2px; height: 2px;
          box-shadow: 120px 40px 0 0 rgba(255,255,255,0.7), 250px 120px 0 0 rgba(255,255,255,0.5),
            400px 30px 0 0 rgba(255,255,255,0.6), 550px 180px 0 0 rgba(255,255,255,0.4),
            700px 80px 0 0 rgba(255,255,255,0.8), 850px 200px 0 0 rgba(255,255,255,0.5);
          animation: twinkle1 4s ease-in-out infinite alternate;
        }
        .starfield .layer-2 {
          width: 1px; height: 1px;
          box-shadow: 80px 100px 0 0 rgba(255,255,255,0.4), 200px 200px 0 0 rgba(255,255,255,0.3),
            350px 80px 0 0 rgba(255,255,255,0.5), 480px 220px 0 0 rgba(255,255,255,0.3),
            620px 140px 0 0 rgba(255,255,255,0.6);
          animation: twinkle2 6s ease-in-out infinite alternate;
        }
        .starfield .layer-3 {
          width: 3px; height: 3px;
          box-shadow: 180px 60px 0 0 rgba(200,168,78,0.6), 450px 150px 0 0 rgba(200,168,78,0.4);
          animation: twinkle3 5s ease-in-out infinite alternate;
        }
      `}</style>

      {/* ====== 页面标题区 ====== */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0e1a 100%)' }}
      >
        {/* 星空背景 */}
        <div className="starfield absolute inset-0 overflow-hidden pointer-events-none">
          <div className="layer-1 absolute rounded-full" />
          <div className="layer-2 absolute rounded-full" />
          <div className="layer-3 absolute rounded-full" />
        </div>

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 'var(--max-width)' }}>
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
            <Link to="/home" className="hover:text-white no-underline" style={{ color: 'var(--color-text-tertiary)' }}>
              首页
            </Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Link to="/folk" className="hover:text-white no-underline" style={{ color: 'var(--color-text-tertiary)' }}>
              民俗趣味
            </Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: 'var(--color-gold-light)' }}>手相算命</span>
          </nav>

          {/* 手掌装饰 + 标题 */}
          <div className="flex items-center gap-6 mb-6">
            <div className="hidden sm:flex items-center justify-center" style={{ width: 72, height: 72 }}>
              <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
                <path d="M32 8C32 8 28 16 28 24C28 32 32 36 32 36" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 12C20 12 14 20 14 28C14 36 18 42 18 42" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M44 12C44 12 50 20 50 28C50 36 46 42 46 42" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 28C32 28 24 32 20 40C16 48 16 56 32 56C48 56 48 48 44 40C40 32 32 28 32 28Z" fill="rgba(200,168,78,0.15)" stroke="var(--color-gold)" strokeWidth="2" />
                <path d="M24 36C24 36 28 48 32 48C36 48 40 36 40 36" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M26 44C26 44 30 50 32 50C34 50 38 44 38 44" stroke="var(--color-gold-light)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h1
                className="font-bold"
                style={{ fontSize: 'clamp(2rem, 4vw, var(--text-4xl))', color: '#fff', letterSpacing: '0.04em', lineHeight: 'var(--leading-tight)', fontFamily: "'Noto Serif SC', serif" }}
              >
                手相算命
              </h1>
              <p className="mt-3" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
                上传手掌照片，AI 智能分析三大主线与掌型特征
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 输入表单区 ====== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-12) 0 var(--space-16)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* 左侧：上传区域 + 性别选择 */}
            <div>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)', fontFamily: "'Noto Serif SC', serif" }}>
                上传手掌照片
              </h2>

              {/* 上传区域 */}
              <div
                className="relative mb-6 cursor-pointer transition-all duration-250"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  border: `2px dashed ${isDragOver ? 'var(--color-gold)' : 'rgba(200, 168, 78, 0.3)'}`,
                  background: isDragOver ? 'rgba(200, 168, 78, 0.1)' : 'rgba(200, 168, 78, 0.03)',
                  transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="p-4 flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="手掌照片预览"
                      className="max-h-64 rounded-lg object-contain mb-4"
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                    />
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      点击或拖拽更换照片
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(200, 168, 78, 0.1)' }}
                    >
                      <UploadCloud size={32} style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <p className="text-base font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                      点击或拖拽上传手掌照片
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      支持 JPG、PNG 格式，建议光线充足、手掌清晰
                    </p>
                  </div>
                )}
              </div>

              {/* 性别选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  性别（用于辅助分析）
                </label>
                <div className="flex gap-4">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className="flex-1 py-3.5 px-6 rounded-xl text-base font-medium transition-all"
                      style={{
                        border: `1px solid ${gender === g ? 'var(--color-gold)' : 'var(--color-border)'}`,
                        background: gender === g ? 'rgba(200, 168, 78, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        color: gender === g ? 'var(--color-gold-light)' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <User size={18} className="inline-block mr-2 vertical-align-middle" />
                      {g === 'male' ? '男' : '女'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div
                  className="rounded-lg px-4 py-3 text-sm mb-4"
                  style={{ backgroundColor: 'rgba(196, 58, 58, 0.1)', color: 'var(--state-error)' }}
                >
                  {error}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className="w-full py-4 px-8 rounded-xl text-base font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: 'var(--color-gold)',
                  color: 'var(--color-primary-darker)',
                  boxShadow: '0 4px 12px rgba(200, 168, 78, 0.25)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && canSubmit) {
                    e.currentTarget.style.background = 'var(--color-gold-light)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 168, 78, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-gold)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 168, 78, 0.25)';
                }}
              >
                {loading ? (
                  <>
                    <Sparkles size={18} className="inline-block mr-2" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="inline-block mr-2" />
                    开始分析
                  </>
                )}
              </button>
            </div>

            {/* 右侧：分析说明 */}
            <div>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)', fontFamily: "'Noto Serif SC', serif" }}>
                分析内容
              </h2>

              <div className="space-y-4">
                {ANALYSIS_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="p-5 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: card.color }}
                        >
                          <Icon size={24} style={{ color: card.iconColor }} />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                            {card.title}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                            {card.subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 掌型知识卡片 ====== */}
      <section style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)', padding: 'var(--space-16) 0 var(--space-24)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <h2
            className="text-2xl font-bold text-center mb-3"
            style={{ color: '#fff', letterSpacing: '0.04em', fontFamily: "'Noto Serif SC', serif" }}
          >
            五种掌型解读
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--color-text-secondary)' }}>
            不同掌型代表着不同的天赋与性格特质
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PALM_TYPES.map((type) => (
              <div
                key={type.name}
                className="p-5 rounded-xl text-center transition-all cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: type.color }}
                >
                  <span style={{ fontSize: 28 }}>{type.emoji}</span>
                </div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                  {type.name}
                </h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)', lineHeight: 'var(--leading-relaxed)' }}>
                  {type.desc}<br />{type.trait}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 底部推荐工具 ====== */}
      <section style={{ background: '#111827', padding: 'var(--space-16) 0 var(--space-8)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <h2
            className="text-lg sm:text-xl font-semibold mb-6 text-center"
            style={{ fontFamily: "'Noto Serif SC', serif", color: 'var(--color-text)' }}
          >
            推荐工具
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {RECOMMEND_TOOLS.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="flex flex-col items-center gap-3 p-6 transition-all text-center no-underline"
                style={{
                  background: '#111827',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border-light)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-lighter)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(0, 75, 170, 0.1)' }}
                >
                  {tool.icon}
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                  {tool.label}
                </h3>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 页脚 ====== */}
      <footer style={{ background: '#060a14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'var(--space-12) 0 var(--space-8)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="text-base font-semibold" style={{ color: 'var(--color-gold)', fontFamily: "'Noto Serif SC', serif" }}>
                天机
              </span>
              <p className="mt-2" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)' }}>
                免责声明：本工具所有占卜结果仅供娱乐参考，不构成任何决策建议。命运掌握在自己手中。
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm no-underline transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                关于我们
              </a>
              <a href="#" className="text-sm no-underline transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                使用条款
              </a>
              <a href="#" className="text-sm no-underline transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                隐私政策
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
              © 2026 天机 AI 运势查询工具. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}