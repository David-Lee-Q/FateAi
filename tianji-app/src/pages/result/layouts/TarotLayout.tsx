/**
 * 塔罗牌布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function TarotLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const cards = data.cards as Array<Record<string, unknown>>;
    const spreadType = data.spreadType || data.牌阵 || '三牌阵';
    const readingDate = data.date || data.日期 || new Date().toLocaleDateString('zh-CN');
    const card1 = cards[0] as Record<string, unknown>;
    const card2 = cards[1] as Record<string, unknown>;
    const card3 = cards[2] as Record<string, unknown>;
    const cardPositions = [
      { key: '过去', icon: 'hourglass-start', color: 'amber', card: card1 },
      { key: '现在', icon: 'hourglass-half', color: 'purple', card: card2 },
      { key: '未来', icon: 'hourglass-end', color: 'cyan', card: card3 },
    ];
    return (
      <div className="mb-6">
        {/* 塔罗牌头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 24, 32, 0.8) 50%, rgba(120, 53, 15, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #f59e0b 100%)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>塔罗牌解读</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>维特塔罗 · 经典牌阵</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
              {String(spreadType)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {String(readingDate)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              解读完成
            </span>
          </div>
        </div>

        {/* 牌阵展示区 */}
        <div className="p-6 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 10h20"/>
            </svg>
            牌阵布局
          </h3>
          
          {/* 三牌阵可视化 */}
          <div className="flex justify-center gap-4 mb-6 py-4">
            {cardPositions.map((pos, idx) => (
              <div 
                key={idx}
                className="w-28 h-40 rounded-xl p-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
                style={{ 
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  border: idx === 1 ? '2px solid #8b5cf6' : '2px solid #8b5cf6',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                  zIndex: idx === 1 ? 10 : 5 - idx
                }}
              >
                <div className="text-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={idx === 0 ? '#fbbf24' : idx === 1 ? '#fbbf24' : '#22d3ee'} strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d={idx === 0 ? "M12 6v6l4 2" : idx === 1 ? "M12 2v4M12 18v4M4.93 4.93l2.83 2.83" : "M12 18v4l4-2"}/>
                  </svg>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{pos.key}</p>
                </div>
                <div className="flex-1 rounded-lg flex items-center justify-center p-1" style={{ 
                  background: idx === 0 ? 'linear-gradient(180deg, rgba(180, 83, 9, 0.3), rgba(120, 53, 15, 0.3))' :
                               idx === 1 ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.3), rgba(88, 28, 135, 0.3))' :
                               'linear-gradient(180deg, rgba(22, 100, 100, 0.3), rgba(21, 94, 117, 0.3))'
                }}>
                  <div className="text-center">
                    <p className="text-[10px] font-bold" style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#a78bfa' : '#22d3ee' }}>
                      {String(pos.card?.name || pos.card?.cardName || '待解读')}
                    </p>
                    <p className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(pos.card?.cnName || pos.card?.chineseName || '')}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-center">
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ 
                    background: 'rgba(139, 92, 246, 0.2)', 
                    color: pos.card?.isReversed ? '#fbbf24' : '#a78bfa'
                  }}>
                    {pos.card?.isReversed ? '逆位' : '正位'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 牌义解读 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cardPositions.map((pos, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(245, 158, 11, 0.03))',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                <h4 className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#a78bfa' : '#22d3ee' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {idx === 0 ? <path d="M12 6v6l4 2"/> : idx === 1 ? <circle cx="12" cy="12" r="10"/> : <path d="M12 18v4l4-2"/>}
                  </svg>
                  {pos.key} · {String(pos.card?.name || '待解读')}
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {String(pos.card?.uprightMeaning || pos.card?.meaning || pos.card?.interpretation || '').substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
