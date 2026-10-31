/**
 * 紫微斗数布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function ZiweiLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const mg = (data.mingGong || data.命宫 || {}) as Record<string, unknown>;
    const palaces = data.twelvePalaces || data.十二宫位;
    const palaceList = Array.isArray(palaces) ? (palaces as Array<Record<string, unknown>>) : [];
    const siHua = (data.siHua || {}) as Record<string, unknown>;
    const horoscope = (data.horoscope || null) as Record<string, any> | null;
    const metaChips: string[] = [
      data.wuXingJu ? `五行局 ${String(data.wuXingJu)}` : '',
      data.soul ? `命主 ${String(data.soul)}` : '',
      data.body ? `身主 ${String(data.body)}` : '',
    ].filter(Boolean);
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
                {Boolean(mg.heavenlyStem || mg.earthlyBranch) && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd' }}>
                    {String(mg.heavenlyStem || '')}{String(mg.earthlyBranch || '')}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold" style={{ color: '#a78bfa' }}>
                {String(mg.mainStar || mg.stars || '—')}
              </div>
              {metaChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {metaChips.map((chip) => (
                    <span key={chip} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}>
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 生年四化 */}
          {Object.keys(siHua).length > 0 && (
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
              {['化禄', '化权', '化科', '化忌'].map((key, i) => {
                const colors = ['#4ade80', '#60a5fa', '#fbbf24', '#f87171'];
                return (
                  <div key={key} className="p-2 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${colors[i]}33` }}>
                    <div className="text-[10px]" style={{ color: colors[i] }}>{key}</div>
                    <div className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                      {siHua[key] ? String(siHua[key]) : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 大限 / 流年 */}
          {horoscope && horoscope.decadal && (
            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.12)' }}>
                大限 {String(horoscope.decadal.heavenlyStem || '')}{String(horoscope.decadal.earthlyBranch || '')}
                {Array.isArray(horoscope.decadal.range) ? ` ${horoscope.decadal.range[0]}-${horoscope.decadal.range[1]}岁` : ''}
              </span>
              <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.12)' }}>
                流年 {String(horoscope.yearly?.heavenlyStem || '')}{String(horoscope.yearly?.earthlyBranch || '')}
              </span>
              {Array.isArray(horoscope.yearly?.mutagen) && horoscope.yearly.mutagen.length > 0 && (
                <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.12)' }}>
                  流年四化 {horoscope.yearly.mutagen.join('/')}
                </span>
              )}
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
                      <div className="text-xs mb-1.5 flex items-center justify-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span>{String(palaceName)}</span>
                        {Boolean(palace.heavenlyStem || palace.earthlyBranch) && (
                          <span className="text-[9px] opacity-70">{String(palace.heavenlyStem || '')}{String(palace.earthlyBranch || '')}</span>
                        )}
                        {palace.isBodyPalace === true && (
                          <span className="text-[9px] px-1 rounded" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>身</span>
                        )}
                      </div>
                      <div className="text-sm font-bold truncate mb-1" style={{ color: colors[idx % colors.length] }}>
                        {String(mainStar)}
                      </div>
                      {stars && typeof stars === 'string' && (
                        <div className="text-[10px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                          {stars.substring(0, 20)}
                        </div>
                      )}
                      {Boolean(palace.decadal) && typeof palace.decadal === 'object' && Array.isArray((palace.decadal as Record<string, unknown>).range) && (
                        <div className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}>
                          {(palace.decadal as { range: number[] }).range[0]}-{(palace.decadal as { range: number[] }).range[1]}岁
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
