/**
 * 星座布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function ZodiacLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const signData = data.sign || data;
    const signObj = typeof signData === 'object' && signData !== null ? signData as Record<string, unknown> : null;
    const sign = signObj ? String(signObj.name || signObj.星座 || signObj.zodiacSign || '') : String(signData || '');
    const element = signObj ? String(signObj.element || signObj.元素 || data.element || '') : String(data.element || '');
    const rulingPlanet = signObj ? String(signObj.rulingPlanet || signObj.守护星 || '') : String(data.rulingPlanet || data.守护星 || '');
    const traits = signObj?.traits as string[] | undefined || data.traits as string[] | undefined;
    const loveScore = Number(signObj?.loveScore ?? data.loveScore ?? data.爱情 ?? 0);
    const careerScore = Number(signObj?.careerScore ?? data.careerScore ?? data.事业 ?? 0);
    const wealthScore = Number(signObj?.wealthScore ?? data.wealthScore ?? data.财富 ?? 0);
    const healthScore = Number(signObj?.healthScore ?? data.healthScore ?? data.健康 ?? 0);
    const overallScore = Number(signObj?.overallScore ?? data.overallScore ?? data.综合 ?? 0);
    
    if (sign) {
      const elementColors: Record<string, string> = { 火: '#ef4444', 土: '#c4a878', 风: '#3b82f6', 水: '#06b6d4' };
      const elementColor = element ? elementColors[element] || '#8b5cf6' : '#8b5cf6';
      return (
        <div className="mb-6">
          {/* 星座头部卡片 */}
          <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)'
            }}></div>
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ 
                background: `linear-gradient(135deg, #8b5cf6 0%, ${elementColor} 100%)`,
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 0 0 20"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>{sign}</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                    {element}象星座
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {rulingPlanet && (
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/>
                      </svg>
                      守护星：{rulingPlanet}
                    </span>
                  )}
                  {signObj?.dateRange ? (
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                      {String(signObj.dateRange)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* 特质标签 */}
            {traits && traits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {traits.slice(0, 5).map((trait: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs" style={{ 
                    background: 'rgba(139, 92, 246, 0.15)', 
                    color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 五维运势 */}
          <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              五维运势分析
            </h3>
            <div className="space-y-3">
              {[
                { key: '综合运势', value: overallScore, icon: '☀️', color: '#f43f5e' },
                { key: '爱情运势', value: loveScore, icon: '💕', color: '#f97316' },
                { key: '事业运势', value: careerScore, icon: '💼', color: '#22c55e' },
                { key: '财富运势', value: wealthScore, icon: '💰', color: '#eab308' },
                { key: '健康运势', value: healthScore, icon: '🏥', color: '#06b6d4' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{item.icon}</span>
                  <span className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{item.key}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(100, 116, 139, 0.3)' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(20, Math.min(100, item.value))}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right" style={{ color: item.color }}>{item.value}分</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
}
