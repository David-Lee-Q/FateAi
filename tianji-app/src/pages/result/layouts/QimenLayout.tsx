/**
 * 奇门遁甲布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function QimenLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const juShu = data.juShu as string | undefined;
    const tianPan = data.tianPan as Record<string, string> | undefined;
    const diPan = data.diPan as Record<string, string> | undefined;
    const baMen = data.baMen as Record<string, string> | undefined;
    const nineStars = tianPan ? Object.entries(tianPan) : [];
    const diPanStars = diPan ? Object.entries(diPan) : [];
    
    return (
      <div className="mb-6">
        {/* 奇门遁甲头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.2)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(167, 139, 250, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>奇门遁甲</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>九宫八卦 · 时空密码</p>
              </div>
            </div>
            {juShu && (
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
                {juShu}
              </span>
            )}
          </div>
          
          {/* 九宫格 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              九宫天盘
            </div>
            {nineStars.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {nineStars.map(([gong, xing], idx) => {
                  const colors = ['#a78bfa', '#c4b5fd', '#8b5cf6'];
                  return (
                    <div key={gong} className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1" 
                      style={{ 
                        background: idx < 5 ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(128, 128, 128, 0.25)'
                      }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{gong}</div>
                      <div className="text-sm font-bold" style={{ color: colors[idx % colors.length] }}>{xing}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {['蓬', '任', '冲', '辅', '英', '芮', '柱', '心', '禽'].map((gong, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(167, 139, 250, 0.2)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                    <div className="text-lg font-bold" style={{ color: '#a78bfa' }}>{gong}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/*地盘和八门 */}
          {(diPanStars.length > 0 || baMen) && (
            <div className="relative z-10 mt-4 grid grid-cols-2 gap-4">
              {diPanStars.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: '#c4b5fd' }}>地盘</div>
                  <div className="grid grid-cols-3 gap-1">
                    {diPanStars.slice(0, 9).map(([gong, xing]) => (
                      <div key={gong} className="text-center p-1.5 rounded" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{gong}</div>
                        <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>{xing}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {baMen && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: '#c4b5fd' }}>八门</div>
                  <div className="grid grid-cols-4 gap-1">
                    {Object.entries(baMen).map(([men, pos]) => (
                      <div key={men} className="text-center p-1.5 rounded" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{men}</div>
                        <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>{pos}</div>
                      </div>
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
