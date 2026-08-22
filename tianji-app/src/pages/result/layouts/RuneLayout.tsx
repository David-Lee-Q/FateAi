/**
 * 符文布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function RuneLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const runes = data.runes as Array<Record<string, unknown>>;
    const runeSymbols: Record<string, string> = { Fehu: 'ᚠ', Uruz: 'ᚢ', Thurisaz: 'ᚦ', Ansuz: 'ᚨ', Raido: 'ᚱ', Kenaz: 'ᚲ', Gebo: 'ᚷ', Wunjo: 'ᚹ', Sowilo: 'ᛊ', Tiwaz: 'ᛏ' };
    
    return (
      <div className="mb-6">
        {/* 符文头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 50%, rgba(161, 98, 7, 0.05) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="12" y1="3" x2="12" y2="21"/>
                <line x1="5" y1="8" x2="19" y2="8"/>
                <line x1="7" y1="12" x2="17" y2="12"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#fb923c', textShadow: '0 0 20px rgba(251, 146, 60, 0.5)' }}>符文占卜</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>如尼符文 · 古老智慧</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {runes.slice(0, 3).map((r, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" 
                style={{ 
                  background: 'rgba(249, 115, 22, 0.2)', 
                  color: '#fb923c', 
                  border: '1px solid rgba(249, 115, 22, 0.4)'
                }}>
                {runeSymbols[String(r.name)] || ''} {String(r.name)}
              </span>
            ))}
          </div>
        </div>

        {/* 符文石展示 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(28, 25, 23, 0.8) 0%, rgba(41, 37, 36, 0.8) 100%)', border: '1px solid rgba(120, 113, 108, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            符文阵法
          </h3>
          
          {/* 石符视觉 */}
          <div className="flex justify-center mb-5">
            <div className="flex gap-6">
              {runes.slice(0, 3).map((r, idx) => {
                const symbol = runeSymbols[String(r.name)] || '?';
                const meaning = r.meaning as string || r.definition as string || '';
                return (
                  <div key={idx} className="flex flex-col items-center transition-all duration-300 hover:-translate-y-2">
                    <div className="w-20 h-24 rounded-lg flex items-center justify-center text-4xl font-bold" 
                      style={{ 
                        background: 'linear-gradient(145deg, #d4d4d4, #a3a3a3)',
                        color: '#1c1917',
                        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.5), -2px -2px 10px rgba(255, 255, 255, 0.2)',
                        filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))'
                      }}>
                      {symbol}
                    </div>
                    <span className="mt-2 text-sm font-semibold" style={{ color: '#fb923c' }}>{String(r.name)}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{meaning.substring(0, 20)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 符文含义卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {runes.slice(0, 3).map((r, idx) => {
              const symbol = runeSymbols[String(r.name)] || '?';
              const meaning = r.meaning as string || r.definition as string || '';
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(161, 98, 7, 0.05))',
                    border: '1px solid rgba(249, 115, 22, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold" style={{ color: '#fb923c' }}>{symbol}</span>
                    <span className="text-sm font-medium" style={{ color: '#fb923c' }}>{String(r.name)}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {meaning.substring(0, 80) || '古日耳曼符文的古老含义...'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 常用符文对照表 */}
        <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            常用符文对照
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { symbol: 'ᚠ', name: 'Fehu', desc: '财富' },
              { symbol: 'ᚢ', name: 'Uruz', desc: '力量' },
              { symbol: 'ᚦ', name: 'Thurisaz', desc: '保护' },
              { symbol: 'ᚨ', name: 'Ansuz', desc: '沟通' },
              { symbol: 'ᚱ', name: 'Raido', desc: '旅程' },
              { symbol: 'ᚲ', name: 'Kenaz', desc: '点燃' },
              { symbol: 'ᚷ', name: 'Gebo', desc: '礼物' },
              { symbol: 'ᚹ', name: 'Wunjo', desc: '喜悦' },
            ].map((r, idx) => (
              <div key={idx} className="p-2 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <span className="text-lg font-bold block" style={{ color: '#fb923c' }}>{r.symbol}</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{r.name}</span>
                <span className="text-[10px] block" style={{ color: '#a3a3a3' }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
