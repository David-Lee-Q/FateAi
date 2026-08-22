/**
 * 生肖布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function ShengxiaoLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const animal = data.animal as string || '';
    const element = data.element as string | undefined;
    const luckyNumbers = data.luckyNumbers as number[] | undefined;
    const luckyColors = data.luckyColors as string[] | undefined;
    const monthlyAnalysis = data.monthlyAnalysis as Record<string, { score: number; status: string }> | undefined;
    const year = data.year as number | undefined || new Date().getFullYear();
    const animalEmojis: Record<string, string> = { 鼠: '🐭', 牛: '🐮', 虎: '🐯', 兔: '🐰', 龙: '🐲', 蛇: '🐍', 马: '🐴', 羊: '🐑', 猴: '🐵', 鸡: '🐔', 狗: '🐕', 猪: '🐷' };
    
    return (
      <div className="mb-6">
        {/* 生肖头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(180, 83, 9, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
            }}>
              {animalEmojis[animal] || '🐾'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-xl font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>{animal}年</h4>
                {element && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                    五行属{element}
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{year}年属相运势</p>
            </div>
          </div>
          
          {/* 幸运信息 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {luckyNumbers && luckyNumbers.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2"/>
                  <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
                </svg>
                幸运数：{luckyNumbers.slice(0, 3).join('、')}
              </span>
            )}
            {luckyColors && luckyColors.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                幸运色：{luckyColors.slice(0, 2).join('、')}
              </span>
            )}
          </div>
        </div>

        {/* 月度运势 */}
        {monthlyAnalysis && (
          <div className="p-5 rounded-2xl mt-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              月度运势
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(monthlyAnalysis).slice(0, 12).map(([month, info]) => {
                const monthInfo = info as { score: number; status: string };
                const statusColor = (monthInfo.status === '大吉' || monthInfo.status === '吉') ? '#22c55e' : (monthInfo.status === '平') ? '#eab308' : '#f43f5e';
                const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                const monthIndex = parseInt(month) - 1 || 0;
                return (
                  <div 
                    key={month}
                    className="p-3 rounded-xl text-center transition-all duration-200 hover:scale-105"
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(128, 128, 128, 0.25)'
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{months[monthIndex]}</div>
                    <div className="text-lg font-bold" style={{ color: statusColor }}>{monthInfo.score}</div>
                    <div className="text-[10px]" style={{ color: statusColor }}>{monthInfo.status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
}
