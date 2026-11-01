/**
 * 数字能量布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function NumerologyLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const lifePath = data.lifePathNumber as number;
    const birthdayNumber = data.birthdayNumber as number | undefined;
    const personalYear = data.personalYear as number | undefined;
    const expressionNumber = data.expressionNumber as number | undefined;
    const soulNumber = data.soulNumber as number | undefined;
    const personalityTraits = data.personalityTraits as string[] | undefined;
    const calculationSteps = data.calculationSteps as string[] | undefined;
    const interpretation = data.interpretation as Record<string, string> | undefined;
    const annualNumber = data.annualNumber as number | undefined;
    
    const vibrationFrequency = data.vibrationFrequency as string | undefined;
    
    return (
      <div className="mb-6 max-w-[1280px] mx-auto">
        {/* 区域1：头部 - 生命灵数+生日+振动频率 */}
        <div className="p-6 rounded-2xl relative overflow-hidden mb-4" style={{ 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)'
        }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
            transform: 'translate(25%, -25%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">生命灵数</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>数字密码 · 命运解读</p>
            </div>
          </div>
          
          {/* 头部三指标 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#67e8f9' }}>生命灵数</div>
              <div className="text-2xl font-bold" style={{ color: '#22d3ee' }}>{lifePath}</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#a78bfa' }}>生日数字</div>
              <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{birthdayNumber || '-'}</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#fbbf24' }}>振动频率</div>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{vibrationFrequency || '-'}</div>
            </div>
          </div>
        </div>

        {/* 区域2：核心数字 - 数字圆环（脉冲动画）+数字含义 */}
        <div className="p-6 rounded-2xl mb-4 text-center relative overflow-hidden" style={{ 
          background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none" aria-hidden="true">
            <div className="w-64 h-64 rounded-full border-2 border-cyan-400 animate-ping"></div>
          </div>
          <div className="relative z-10">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.35), inset 0 0 30px rgba(6, 182, 212, 0.15)'
              }}>
                <span className="text-6xl font-bold" style={{ color: '#06b6d4', textShadow: '0 0 25px rgba(6, 182, 212, 0.7)' }}>
                  {lifePath}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#8b5cf6', color: 'white', boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}>
                LP
              </div>
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {interpretation?.['核心含义'] || interpretation?.['基本含义'] || '数字能量解读'}
            </div>
          </div>
        </div>

        {/* 区域3：计算过程 - 三步计算可视化，数字网格+公式 */}
        {calculationSteps && calculationSteps.length > 0 && (
          <div className="p-5 rounded-2xl mb-4" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(100, 116, 139, 0.25)'
          }}>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M8 12h8M12 8v8"/>
              </svg>
              计算过程
            </h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {calculationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
                    {idx + 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 区域4：多维解读 - 四列卡片（生命/性格/灵魂/使命）四色边框 */}
        <div className="p-5 rounded-2xl mb-4" style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v20M2 12h20"/>
            </svg>
            多维解读
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '生命', value: lifePath, color: '#06b6d4', abbr: 'LP', desc: '人生使命' },
              { label: '性格', value: expressionNumber, color: '#a78bfa', abbr: 'EN', desc: '表达方式' },
              { label: '灵魂', value: soulNumber, color: '#ec4899', abbr: 'SN', desc: '内在渴望' },
              { label: '使命', value: personalYear, color: '#10b981', abbr: 'PY', desc: '年度方向' },
            ].map((item) => (
              <div key={item.abbr} className="p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02]" 
                style={{ background: 'rgba(0, 0, 0, 0.04)', border: '2px solid rgba(128, 128, 128, 0.18)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(0, 0, 0, 0.08)' }}>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.abbr}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value || '-'}</div>
                <div className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</div>
                <div className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 区域5：年度数字 - 当前年份+数字含义，渐变卡片 */}
        {annualNumber && (
          <div className="p-5 rounded-2xl mb-4 relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.25)'
          }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{ 
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
              transform: 'translate(20%, -20%)'
            }}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium mb-1" style={{ color: '#fbbf24' }}>年度数字</h4>
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date().getFullYear()} · 个人年度能量指引
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ 
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.15))',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.25)'
                }}>
                  <span className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{annualNumber}</span>
                </div>
                <div className="text-xs max-w-[200px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {interpretation?.['年度指引'] || '把握年度能量机遇'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 区域6：AI解读 - 青色渐变卡片，三色标签解读 */}
        {interpretation && (
          <div className="p-5 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              AI深度解读
            </h4>
            <div className="space-y-3">
              {Object.entries(interpretation).slice(0, 4).map(([key, value], idx) => {
                const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981'];
                const color = colors[idx % colors.length];
                return (
                  <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.04)', border: '1px solid rgba(128, 128, 128, 0.12)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(128, 128, 128, 0.12)', color: color }}>
                        {key}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 性格特质标签 */}
        {personalityTraits && personalityTraits.length > 0 && (
          <div className="p-4 rounded-2xl mt-4" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
            <div className="flex flex-wrap gap-2 justify-center">
              {personalityTraits.map((trait, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ 
                  background: 'rgba(6, 182, 212, 0.12)', 
                  color: '#67e8f9',
                  border: '1px solid rgba(6, 182, 212, 0.25)'
                }}>
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
