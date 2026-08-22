/**
 * 手相布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function PalmLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const linesObj = (data.lines ?? {}) as Record<string, { description?: string; length?: string; status?: string }>;
    const lines = linesObj;
    const handType = data.handType as string | undefined;
    const gender = data.gender as string | undefined;
    const overallAnalysis = data.overallAnalysis as { love?: number; career?: number; health?: number } | undefined;
    
    const lineConfigs = [
      { key: 'life', name: '生命线', color: '#ef4444', desc: lines?.life?.description || '', status: lines?.life?.status },
      { key: 'heart', name: '感情线', color: '#ec4899', desc: lines?.heart?.description || '', status: lines?.heart?.status },
      { key: 'mind', name: '智慧线', color: '#3b82f6', desc: lines?.mind?.description || '', status: lines?.mind?.status },
      { key: 'fate', name: '命运线', color: '#8b5cf6', desc: lines?.fate?.description || '', status: lines?.fate?.status },
    ];
    
    return (
      <div className="mb-6">
        {/* 手相头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>手相算命</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>掌纹分析 · 手型解读</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {handType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                </svg>
                手型：{handType}
              </span>
            )}
            {gender && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                性别：{gender}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              分析完成
            </span>
          </div>
        </div>

        {/* 掌纹可视化 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            掌纹示意
          </h3>
          
          {/* SVG掌纹图 */}
          <div className="flex justify-center mb-5">
            <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-4">
              <svg width="180" height="220" viewBox="0 0 180 220">
                {/* 手掌轮廓 */}
                <path d="M50 180 Q30 160 35 130 Q38 100 45 80 L50 60 Q52 50 58 48 L68 48 L68 30 Q70 20 78 20 L82 20 Q90 20 92 30 L92 48 L102 48 L102 30 Q104 20 112 20 L116 20 Q124 20 126 30 L126 48 L136 48 L136 30 Q138 20 146 20 L150 20 Q158 20 160 30 L160 48 L155 55 Q160 50 165 55 L165 90 Q168 130 160 160 Q155 180 140 195 L90 215 L40 195 Q25 180 20 160 Q12 130 15 90 L10 55 Q15 50 20 55 L25 48 L25 30 Q27 20 35 20 L39 20 Q47 20 49 30 L49 48 L50 55 Q50 45 55 48 L55 80 Q58 100 55 130 Q52 160 50 180 Z" 
                  fill="rgba(251,191,36,0.3)" stroke="#92400e" strokeWidth="1"/>
                {/* 生命线 */}
                <path d="M55 200 Q35 150 40 100 Q50 60 80 40" 
                  fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}/>
                {/* 感情线 */}
                <path d="M30 70 Q80 85 150 65 Q165 60 170 55" 
                  fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ec4899)' }}/>
                {/* 智慧线 */}
                <path d="M45 110 Q90 100 150 105 Q165 108 175 115" 
                  fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}/>
                {/* 命运线 */}
                <path d="M100 230 L105 100 Q110 70 115 50" 
                  fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #8b5cf6)' }}/>
              </svg>
              
              {/* 图例 */}
              <div className="absolute top-2 left-2 bg-slate-900/80 rounded-lg p-2 text-[10px]">
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-red-500 rounded"></span><span className="text-gray-300">生命线</span></div>
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-pink-500 rounded"></span><span className="text-gray-300">感情线</span></div>
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-blue-500 rounded"></span><span className="text-gray-300">智慧线</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 rounded"></span><span className="text-gray-300">命运线</span></div>
              </div>
            </div>
          </div>
          
          {/* 掌纹分析卡片 */}
          <div className="grid grid-cols-2 gap-3">
            {lineConfigs.slice(0, 4).map((line) => (
              <div 
                key={line.key}
                className="p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  background: `linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.03))`,
                  border: '1px solid rgba(128, 128, 128, 0.25)'
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3 h-0.5 rounded" style={{ background: line.color }}></span>
                  <span className="text-xs font-medium" style={{ color: line.color }}>{line.name}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {line.desc.substring(0, 60) || '暂无分析'}
                </p>
                {line.status && (
                  <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded" style={{ 
                    background: 'rgba(128, 128, 128, 0.12)', 
                    color: line.color
                  }}>
                    {line.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 综合评分 */}
        {overallAnalysis && (
          <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              综合评分
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: '感情', value: overallAnalysis.love, color: '#ec4899', icon: '❤️' },
                { key: '事业', value: overallAnalysis.career, color: '#3b82f6', icon: '💼' },
                { key: '健康', value: overallAnalysis.health, color: '#22c55e', icon: '💪' },
              ].map((item) => (
                <div 
                  key={item.key}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(128, 128, 128, 0.06)', border: '1px solid rgba(128, 128, 128, 0.18)' }}
                >
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.key}运势</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
