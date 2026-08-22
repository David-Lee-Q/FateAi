/**
 * 大六壬布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function DaliurenLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const chuan = Array.isArray(data.chuan) ? data.chuan as Array<Record<string, unknown>> : [];
    const liuShen = data.liuShen as Record<string, string> | undefined;
    const siKe = Array.isArray(data.siKe) ? data.siKe as Array<Record<string, unknown>> : [];
    const monthJiang = data.monthJiang as string | undefined;
    
    return (
      <div className="mb-6">
        {/* 大六壬头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                  <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>六壬神课</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>三传四课 · 壬学经典</p>
              </div>
            </div>
            {monthJiang && (
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                {String(monthJiang)}
              </span>
            )}
          </div>
          
          {/* 四课展示 */}
          {siKe.length > 0 && (
            <div className="relative z-10 mb-5">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                四课
              </div>
              <div className="grid grid-cols-2 gap-2">
                {siKe.map((k, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>第{i + 1}课</span>
                      <span className="text-sm font-bold" style={{ color: '#fcd34d' }}>
                        {String(k.gan || '')}{String(k.zhi || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 六神展示 */}
          {liuShen ? (
            <div className="relative z-10 mb-5">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
                六神
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(liuShen).map(([shen, zhi], idx) => {
                  const shenColors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#fcd34d', '#fde68a'];
                  return (
                    <div key={shen} className="flex items-center gap-2 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                      style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(128, 128, 128, 0.18)' }}>
                      <span className="text-xs font-bold" style={{ color: shenColors[idx % shenColors.length] }}>{shen}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{zhi}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          
          {/* 三传展示 */}
          {chuan.length > 0 && (
            <div className="relative z-10">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                三传
              </div>
              <div className="space-y-2">
                {chuan.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300" 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(251, 191, 36, 0.2)'
                    }}>
                    <span className="shrink-0 text-xs px-3 py-1.5 rounded-full font-medium" 
                      style={{ background: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }}>
                      {String(c.chuan || ['初传', '中传', '末传'][i])}
                    </span>
                    <span className="text-lg font-bold" style={{ color: '#fcd34d' }}>
                      {String(c.gan)}{String(c.zhi)}
                    </span>
                    {c.shen ? (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
                        {String(c.shen)}
                      </span>
                    ) : null}
                    <span className="text-xs flex-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(c.description || '').substring(0, 50)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
