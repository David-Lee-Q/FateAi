/**
 * 姓名测试布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function NametestLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const name = data.fullName as string;
    const score = data.score as number | undefined;
    const surnameScore = data.surnameScore as number | undefined;
    const givenNameScore = data.givenNameScore as number | undefined;
    const wuxing = data.wuxing as string | undefined;
    const bazi = data.bazi as string[] | undefined;
    
    return (
      <div className="mb-6">
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(14, 165, 233, 0.06) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)' }} />
          
          {/* 姓名头部 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{name}</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>姓名分析报告</p>
          </div>
          
          {/* 评分环形图 */}
          {score !== undefined && (() => {
            const progress = Math.round((score / 100) * 264);
            const dashArray = progress + ' 264';
            return (
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.4))' }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: '#0ea5e9' }}>{score}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>综合评分</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>姓名评分</div>
                <div className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>基于五行八卦分析</div>
                <div className="flex flex-wrap gap-2">
                  {wuxing && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" 
                      style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                      五行：{wuxing}
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
          })()}
          
          {/* 五格分析表格 */}
          {(surnameScore !== undefined || givenNameScore !== undefined || bazi) && (
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--color-border)' }}>
              <div className="p-4">
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#0ea5e9' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  五格分析
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  {surnameScore !== undefined && (
                    <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>天格</div>
                      <div className="text-lg font-bold" style={{ color: '#0ea5e9' }}>{surnameScore}</div>
                    </div>
                  )}
                  {givenNameScore !== undefined && (
                    <>
                      <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>人格</div>
                        <div className="text-lg font-bold" style={{ color: '#10b981' }}>{givenNameScore}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>地格</div>
                        <div className="text-lg font-bold" style={{ color: '#0ea5e9' }}>{givenNameScore}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {bazi && bazi.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>八字配合</div>
                  <div className="flex flex-wrap gap-2">
                    {bazi.slice(0, 4).map((b, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#7dd3fc' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
}
