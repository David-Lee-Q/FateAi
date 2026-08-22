/**
 * 紫微斗数布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function ZiweiLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const mg = (data.mingGong || data.命宫 || {}) as Record<string, unknown>;
    const palaces = data.twelvePalaces || data.十二宫位;
    const palaceList = Array.isArray(palaces) ? (palaces as Array<Record<string, unknown>>) : [];
    return (
      <div className="mb-6">
        {/* 紫微斗数头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(167, 139, 250, 0.04) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(167, 139, 250, 0.4)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>紫微斗数</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>星曜布局 · 命宫分析</p>
            </div>
          </div>
          
          {/* 命宫信息 */}
          {Boolean(mg.mainStar || mg.stars) && (
            <div className="relative z-10 p-4 rounded-xl mb-5" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: '#c4b5fd' }}>命宫主星</span>
              </div>
              <div className="text-xl font-bold" style={{ color: '#a78bfa' }}>
                {String(mg.mainStar || mg.stars || '—')}
              </div>
            </div>
          )}
          
          {/* 十二宫位网格 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              十二宫位
            </div>
            {palaceList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {palaceList.slice(0, 12).map((palace, idx) => {
                  const palaceName = palace.palace || palace.宫位 || `宫位${idx + 1}`;
                  const mainStar = palace.mainStar || palace.主星 || '—';
                  const stars = palace.stars || palace.星曜 || '';
                  const colors = ['#a78bfa', '#c4b5fd', '#818cf8', '#a855f7', '#8b5cf6', '#7c3aed'];
                  const bgColors = ['rgba(167, 139, 250, 0.15)', 'rgba(196, 181, 253, 0.1)', 'rgba(129, 140, 248, 0.15)', 'rgba(168, 85, 247, 0.15)', 'rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.15)'];
                  return (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ 
                        background: bgColors[idx % bgColors.length],
                        border: '1px solid rgba(128, 128, 128, 0.18)'
                      }}
                    >
                      <div className="text-xs mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {String(palaceName)}
                      </div>
                      <div className="text-sm font-bold truncate mb-1" style={{ color: colors[idx % colors.length] }}>
                        {String(mainStar)}
                      </div>
                      {stars && typeof stars === 'string' && (
                        <div className="text-[10px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                          {stars.substring(0, 15)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['命宫', '身宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '仆役宫', '官禄宫', '田宅宫', '福德宫'].map((palace, idx) => {
                  const value = data[palace];
                  const colors = ['#a78bfa', '#c4b5fd', '#818cf8', '#a855f7', '#8b5cf6', '#7c3aed'];
                  const bgColors = ['rgba(167, 139, 250, 0.15)', 'rgba(196, 181, 253, 0.1)', 'rgba(129, 140, 248, 0.15)', 'rgba(168, 85, 247, 0.15)'];
                  return (
                    <div 
                      key={palace}
                      className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1"
                      style={{ 
                        background: bgColors[idx % bgColors.length],
                        border: '1px solid rgba(128, 128, 128, 0.18)'
                      }}
                    >
                      <div className="text-xs mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {palace}
                      </div>
                      <div className="text-sm font-bold truncate" style={{ color: colors[idx % colors.length] }}>
                        {value ? String(value).split('、')[0] : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
