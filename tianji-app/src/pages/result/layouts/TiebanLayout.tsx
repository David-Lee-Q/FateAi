/**
 * 铁板神数布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function TiebanLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const mainCode = typeof data.mainNumber === 'object' && data.mainNumber !== null
      ? String((data.mainNumber as Record<string, unknown>).mainNumber ?? '')
      : String(data.mainCode ?? '');
    const subNums = Array.isArray(data.subNumbers) ? data.subNumbers as Array<Record<string, unknown>> : [];
    const categories = ['一生命运', '事业发展', '感情婚姻', '健康状况'];
    const fortunes = [
      data.lifeFortune,
      data.careerFortune,
      data.loveFortune,
      data.healthFortune,
    ];
    return (
      <div className="mb-6">
        {/* 铁板神数头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 12h16M12 4v16" />
                  <circle cx="8" cy="8" r="1.5" fill="white" />
                  <circle cx="16" cy="16" r="1.5" fill="white" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#a855f7', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>铁板神数</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>数术命理 · 铁口直断</p>
              </div>
            </div>
            {mainCode && (
              <div className="text-center px-5 py-3 rounded-xl" style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div className="text-3xl font-bold" style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}>{String(mainCode)}</div>
                <div className="text-xs" style={{ color: '#c4b5fd' }}>主码</div>
              </div>
            )}
          </div>
          
          {/* 附数展示 */}
          {subNums.length > 0 && (
            <div className="relative z-10 flex justify-center gap-4 mb-6">
              {subNums.slice(0, 3).map((sub, i) => (
                <div key={i} className="text-center px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                  style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#c084fc' }}>{String(sub.number || sub.mainNumber)}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>附数{i + 1}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* 四宫预测 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
              四宫预测
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <div key={cat} className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                  <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: '#c4b5fd' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(168, 85, 247, 0.3)' }}>{i + 1}</span>
                    {cat}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {String(fortunes[i] || '').substring(0, 60)}{fortunes[i] && String(fortunes[i]).length > 60 ? '…' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}
