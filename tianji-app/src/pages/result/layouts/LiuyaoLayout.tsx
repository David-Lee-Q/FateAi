/**
 * 六爻布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function LiuyaoLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const originalGua = data.originalGua as Record<string, unknown>;
    const changedGua = data.changedGua as Record<string, unknown> | undefined;
    const question = data.question as string | undefined;
    const yaoLines = data.yaoLines as Array<{ position: number; line: string; meaning: string }> | undefined;
    const shiYing = data.shiYing as Record<string, unknown> | undefined;
    const liuQin = data.liuQin as Record<string, string> | undefined;
    const guaName = String(originalGua.name || '');
    const guaSymbol = String(originalGua.symbol || '');
    const upperGua = originalGua.upperGua as string || '上卦';
    const lowerGua = originalGua.lowerGua as string || '下卦';
    
    return (
      <div className="mb-6">
        {/* 六爻头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            {/* 卦象符号 */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                <rect x="10" y="8" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="18" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="28" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="38" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="48" width="40" height="7" rx="2" fill="white"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>六爻卦象</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>梅花易数 · 变化之道</p>
            </div>
          </div>
          
          {/* 卦名和结构 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: '#10b981' }}>{guaName}</span>
              <span className="text-2xl" style={{ color: 'rgba(16, 185, 129, 0.6)' }}>{guaSymbol}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              {upperGua} · {lowerGua}
            </span>
            {question && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(0, 0, 0, 0.2)', color: 'var(--color-text-secondary)' }}>
                问：{String(question).substring(0, 20)}
              </span>
            )}
            {changedGua && typeof changedGua === 'object' && 'name' in changedGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                变卦：{String(changedGua.name)}
              </span>
            ) : null}
          </div>
        </div>

        {/* 卦象结构 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
            </svg>
            卦象结构
          </h3>
          
          <div className="flex justify-center gap-8 mb-4">
            {/* 上卦 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="text-2xl font-bold" style={{ color: '#10b981' }}>{String(originalGua.upperTrigram || '☰').charAt(0)}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>上卦：{upperGua}</span>
            </div>
            {/* 卦名 */}
            <div className="flex items-center">
              <span className="text-4xl font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>{guaSymbol}</span>
            </div>
            {/* 下卦 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(5, 150, 105, 0.15)', border: '2px solid rgba(5, 150, 105, 0.3)' }}>
                <span className="text-2xl font-bold" style={{ color: '#059669' }}>{String(originalGua.lowerTrigram || '☰').charAt(0)}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>下卦：{lowerGua}</span>
            </div>
          </div>
          
          {/* 六爻线条 */}
          {yaoLines && yaoLines.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>六爻解读</p>
              {yaoLines.slice(0, 6).map((yao, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                    {yao.position}
                  </span>
                  <span className="text-sm" style={{ color: yao.line === '阳' ? '#fbbf24' : '#a3a3a3' }}>
                    {yao.line === '阳' ? '━━' : '━ ━'}
                  </span>
                  <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {yao.meaning || '爻辞解读...'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 世应分析 & 六亲 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 世应 */}
          {shiYing && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#10b981' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                世应分析
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>世爻</span>
                  <span className="text-xs font-medium" style={{ color: '#10b981' }}>{String(shiYing.shi || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>应爻</span>
                  <span className="text-xs font-medium" style={{ color: '#f43f5e' }}>{String(shiYing.ying || '')}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* 六亲 */}
          {liuQin && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#fbbf24' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                </svg>
                六亲对应
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
      </div>
    );
}
