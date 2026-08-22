/**
 * 风水布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function FengshuiLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const location = data.direction as string;
    const flyingStars = data.flyingStars as Record<string, { number: number; element: string; status: string }> | undefined;
    const auspicious = data.auspiciousLocations as string[] | undefined;
    const caution = data.cautionLocations as string[] | undefined;
    const suggestions = data.suggestions as string[] | undefined;
    
    const gridNumbers = flyingStars || {
      '西北': { number: 6, element: '金', status: '吉' },
      '西': { number: 7, element: '金', status: '平' },
      '东北': { number: 8, element: '土', status: '吉' },
      '南': { number: 9, element: '火', status: '吉' },
      '中': { number: 5, element: '土', status: '需注意' },
      '北': { number: 1, element: '水', status: '平' },
      '东南': { number: 4, element: '木', status: '平' },
      '东': { number: 3, element: '木', status: '平' },
      '西南': { number: 2, element: '土', status: '需注意' },
    };
    
    const elementColors: Record<string, string> = { '金': '#fbbf24', '木': '#22c55e', '水': '#3b82f6', '火': '#ef4444', '土': '#a3a3a3' };
    const statusColors: Record<string, string> = { '吉': '#22c55e', '平': '#6b7280', '需注意': '#f43f5e' };
    const positions = ['西北', '西', '东北', '南', '中', '北', '东南', '东', '西南'];
    
    return (
      <div className="mb-6">
        {/* 风水头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v20M2 12h20"/>
                <path d="M12 6l-4 4M12 6l4 4M12 18l-4-4M12 18l4-4"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>风水罗盘</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>九宫飞星 · 环境能量</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              </svg>
              位置：{location}
            </span>
            {auspicious && auspicious.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                吉位：{auspicious[0]}
              </span>
            )}
          </div>
        </div>

        {/* 九宫飞星 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            九宫飞星
          </h3>
          
          {/* 3×3 网格 */}
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {[6, 7, 8, 9, 5, 1, 4, 3, 2].map((num, idx) => {
              const dir = positions[idx];
              const info = gridNumbers[dir] || { number: num, element: '土', status: '平' };
              const elemColor = elementColors[info.element] || '#6b7280';
              const statColor = statusColors[info.status] || '#6b7280';
              
              return (
                <div 
                  key={idx}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-200 hover:scale-105"
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(128, 128, 128, 0.25)'
                  }}
                >
                  <span className="text-lg font-bold" style={{ color: elemColor }}>{info.number}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{info.element}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full mt-1" style={{ background: 'rgba(128, 128, 128, 0.12)', color: statColor }}>
                    {info.status}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* 方位标签 */}
          <div className="flex justify-between max-w-sm mx-auto mt-2 px-1">
            <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>北←</span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>→南</span>
          </div>
        </div>

        {/* 风水诊断 */}
        <div className="space-y-3">
          {auspicious && auspicious.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#22c55e' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                吉利方位
              </h4>
              <div className="flex flex-wrap gap-2">
                {auspicious.map((loc, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {caution && caution.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#f43f5e' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                需注意
              </h4>
              <div className="flex flex-wrap gap-2">
                {caution.map((loc, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fda4af' }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#10b981' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                改善建议
              </h4>
              <ul className="space-y-1">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: '#10b981' }}>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
}
