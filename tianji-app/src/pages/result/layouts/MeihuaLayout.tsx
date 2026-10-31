/**
 * 梅花易数布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function MeihuaLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const mainGua = data.mainGua as Record<string, unknown>;
    const huGua = data.huGua as Record<string, unknown> | undefined;
    const bianGua = data.bianGua as Record<string, unknown> | undefined;
    const tiYong = data.tiYong as Record<string, unknown> | undefined;
    const liuQin = data.liuQin as Record<string, string> | undefined;
    const wuxingRelations = data.wuxingRelations as Record<string, string[]> | undefined;
    const guaName = String(mainGua.name || '');
    const guaSymbol = String(mainGua.symbol || '');
    const method = typeof data.method === 'string' ? data.method : '';
    const methodDetail = typeof data.methodDetail === 'string' ? data.methodDetail : '';
    const dongYaoDesc = typeof data.dongYaoDesc === 'string' ? data.dongYaoDesc : '';
    const tiYongRelation = typeof tiYong?.relation === 'string' ? tiYong.relation : '';
    const tiYongLucky = typeof tiYong?.lucky === 'string' ? tiYong.lucky : '';
    const tiYongText = typeof tiYong?.text === 'string' ? tiYong.text : '';
    const luckyColor = tiYongLucky === '大吉' ? '#34d399' : tiYongLucky === '吉' ? '#10b981' : tiYongLucky === '平' ? '#fbbf24' : '#f87171';
    
    return (
      <div className="mb-6">
        {/* 梅花头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-emerald-500 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
                <path d="M12 12l9-4.5M12 12v9M12 12L3 7.5"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#ec4899', textShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>梅花易数</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>本卦 · 互卦 · 变卦</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.4)' }}>
              本卦：{guaName}
            </span>
            {huGua && typeof huGua === 'object' && 'name' in huGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                互卦：{String(huGua.name)}
              </span>
            ) : null}
            {bianGua && typeof bianGua === 'object' && 'name' in bianGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                变卦：{String(bianGua.name)}
              </span>
            ) : null}
            {dongYaoDesc && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                {dongYaoDesc}
              </span>
            )}
            {tiYongRelation && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(0,0,0,0.25)', color: luckyColor, border: `1px solid ${luckyColor}55` }}>
                {tiYongRelation} · {tiYongLucky}
              </span>
            )}
          </div>
          {(method || methodDetail) && (
            <p className="relative z-10 mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
              {method}{method ? '：' : ''}{methodDetail}
            </p>
          )}
        </div>

        {/* 三卦展示 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
              <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
            </svg>
            三卦演变
          </h3>
          
          <div className="flex justify-center gap-4 mb-4">
            {/* 本卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))', border: '2px solid rgba(236, 72, 153, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#ec4899' }}>本卦</span>
                <span className="text-2xl font-bold" style={{ color: '#f472b6' }}>{guaSymbol}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#ec4899' }}>{guaName}</span>
              {Boolean(mainGua.meaning) && (
                <div className="text-[10px] mt-0.5 px-1" style={{ color: 'var(--color-text-tertiary)' }}>{String(mainGua.meaning)}</div>
              )}
            </div>
            
            {/* 箭头 */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            
            {/* 互卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))', border: '2px solid rgba(139, 92, 246, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#a78bfa' }}>互卦</span>
                <span className="text-2xl font-bold" style={{ color: '#c4b5fd' }}>{String(huGua?.symbol || '☰')}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>{String(huGua?.name || '互卦')}</span>
              {Boolean(huGua?.meaning) && (
                <div className="text-[10px] mt-0.5 px-1" style={{ color: 'var(--color-text-tertiary)' }}>{String(huGua?.meaning)}</div>
              )}
            </div>
            
            {/* 箭头 */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            
            {/* 变卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#10b981' }}>变卦</span>
                <span className="text-2xl font-bold" style={{ color: '#34d399' }}>{String(bianGua?.symbol || '☰')}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#10b981' }}>{String(bianGua?.name || '变卦')}</span>
              {Boolean(bianGua?.meaning) && (
                <div className="text-[10px] mt-0.5 px-1" style={{ color: 'var(--color-text-tertiary)' }}>{String(bianGua?.meaning)}</div>
              )}
            </div>
          </div>
        </div>

        {/* 体用分析 & 六亲 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiYong && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#ec4899' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
                体用分析
              </h4>
              <div className="flex gap-4">
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>体</span>
                  <p className="text-lg font-bold" style={{ color: '#ec4899' }}>{String(tiYong.ti || '')}</p>
                </div>
                <div className="flex items-center">
                  <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                </div>
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>用</span>
                  <p className="text-lg font-bold" style={{ color: '#10b981' }}>{String(tiYong.yong || '')}</p>
                </div>
              </div>
              {tiYongText && (
                <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {tiYongText}
                </p>
              )}
            </div>
          )}
          
          {liuQin && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#fbbf24' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                </svg>
                六亲关系
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(liuQin).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <div className="text-xs font-medium" style={{ color: '#fbbf24' }}>{value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 五行生克 */}
        {wuxingRelations && (
          <div className="p-4 rounded-xl mt-4" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#a78bfa' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
              五行生克
            </h4>
            <div className="space-y-2">
              {Object.entries(wuxingRelations).map(([relation, items]) => (
                <div key={relation} className="flex items-center gap-2">
                  <span className="text-xs w-12 shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{relation}</span>
                  <div className="flex flex-wrap gap-1">
                    {(items as string[]).map((item, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
