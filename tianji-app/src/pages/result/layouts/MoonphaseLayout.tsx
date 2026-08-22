/**
 * 月相布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function MoonphaseLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const phase = data.moonPhase as string;
    const energy = data.energy as string | undefined;
    const energyIndex = data.energyIndex as number | undefined;
    const moonAge = data.moonAge as string | number | undefined;
    const illumination = Number(data.illumination || data.月光照度 || 50);
    const suitableActivities = data.suitableActivities as string[] | undefined;
    const avoidActivities = data.avoidActivities as string[] | undefined;
    const suggestions = data.suggestions as string[] | undefined;
    const astronomicalFeatures = String(data.astronomicalFeatures || data.天文特征 || data.features || '');
    const energyTraits = String(data.energyTraits || data.能量特质 || '');
    const emotionalEnergy = data.emotionalEnergy as number | undefined;
    const intuition = data.intuition as number | undefined;
    const action = data.action as number | undefined;
    const introspection = data.introspection as number | undefined;
    
    const moonEmojis: Record<string, string> = { '新月': '🌑', '蛾眉月': '🌒', '上弦月': '🌓', '盈凸月': '🌔', '满月': '🌕', '亏凸月': '🌖', '下弦月': '🌗', '残月': '🌘' };
    const phases = ['新月', '蛾眉月', '上弦月', '盈凸月', '满月', '亏凸月', '下弦月', '残月'];
    const phaseIndex = phases.findIndex(p => phase.includes(p.replace('月', ''))) || Math.floor(illumination / 12.5);
    const displayDate = data.date || data.日期 || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <div className="mb-6">
        {/* 区域1：月相头部卡片 */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ 
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            {/* 月相图标 */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-400 to-purple-500 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>月相占卜</h4>
              <p className="text-sm" style={{ color: 'rgba(167, 139, 250, 0.7)' }}>{phase} · 能量解读</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              <i className="fas fa-calendar mr-1"></i>{String(displayDate)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(100, 116, 139, 0.2)', color: 'rgba(203, 213, 225, 0.9)', border: '1px solid rgba(100, 116, 139, 0.4)' }}>
              <i className="fas fa-percentage mr-1"></i>月龄：{moonAge || `${(illumination / 3.7).toFixed(1)}天`}
            </span>
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <i className="fas fa-bolt mr-1"></i>能量指数：{energyIndex || illumination}%
            </span>
          </div>
        </div>

        {/* 区域2+3：月相展示与信息 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-moon" style={{ color: '#a78bfa' }}></i>
            当前月相
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
            {/* 月相图形展示 */}
            <div className="relative flex-shrink-0">
              <div className="relative w-44 h-44 rounded-full" style={{ 
                background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
                boxShadow: '0 0 60px rgba(167, 139, 250, 0.5), inset -20px -10px 40px rgba(0, 0, 0, 0.2)'
              }}>
                <div className="absolute inset-0 rounded-full" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 35%, rgba(0,0,0,0.08) 0%, transparent 18%), radial-gradient(circle at 60% 50%, rgba(0,0,0,0.06) 0%, transparent 12%), radial-gradient(circle at 45% 70%, rgba(0,0,0,0.05) 0%, transparent 10%)'
                }}></div>
                {/* 月相阴影覆盖层 */}
                {phase.includes('新月') || phase.includes('日食') ? (
                  <div className="absolute inset-0 rounded-full" style={{ background: '#1a1a2e' }}></div>
                ) : phase.includes('满月') ? null : (
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `linear-gradient(to right, rgba(26, 26, 46, ${1 - illumination / 100}) 0%, transparent 50%)`
                  }}></div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' }}>
                {phase}
              </div>
            </div>
            
            {/* 月相信息三列卡片 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">月相名称</h4>
                <p className="text-white text-sm">{phase}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">天文特征</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{astronomicalFeatures || `月球亮面${illumination}%，此刻月球能量处于${illumination > 50 ? '盈满' : '消退'}阶段。`}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">能量特质</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{energyTraits || energy || `月相能量正在${illumination > 50 ? '上升' : '衰减'}，适合${illumination > 50 ? '行动与决策' : '反思与调整'}。`}</p>
              </div>
            </div>
          </div>

          {/* 月相周期进度条 */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-gray-400 text-xs mb-3">月相周期示意</h4>
            <div className="flex items-center justify-between">
              {phases.map((p, idx) => {
                const isActive = idx <= phaseIndex;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all"
                      style={{ 
                        background: isActive 
                          ? (idx === phaseIndex 
                              ? 'linear-gradient(to right, rgba(167, 139, 250, 0.3), rgba(167, 139, 250, 0.8))' 
                              : 'linear-gradient(to right, rgba(100, 116, 139, 0.3), rgba(100, 116, 139, 0.6))')
                          : 'rgba(51, 65, 85, 0.5)',
                        boxShadow: idx === phaseIndex ? '0 0 15px rgba(167, 139, 250, 0.6)' : 'none'
                      }}
                    >
                      <span className="text-sm">{moonEmojis[p]}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: isActive ? '#a78bfa' : 'rgba(148, 163, 184, 0.6)' }}>{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 区域4：能量分析 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-bolt" style={{ color: '#fbbf24' }}></i>
            月相能量分析
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { label: '情感能量', value: emotionalEnergy || Math.round(illumination * 0.8 + 20), color: '#a78bfa' },
              { label: '直觉能力', value: intuition || Math.round(illumination * 0.85 + 15), color: '#c4b5fd' },
              { label: '行动力', value: action || Math.round(illumination * 0.9 + 10), color: '#a78bfa' },
              { label: '内省深度', value: introspection || Math.round((100 - illumination) * 0.6 + 30), color: '#c4b5fd' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl p-3" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-400 text-xs">{item.label}</span>
                  <span className="text-purple-400 text-xs font-medium">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.value}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {energy && (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(251, 191, 36, 0.05))', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <h4 className="text-purple-400 font-semibold mb-2 text-sm">能量解读</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{energy}</p>
            </div>
          )}
        </div>

        {/* 区域5：今日指引 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
            今日月相指引
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* 适合做 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <i className="fas fa-check text-emerald-400"></i>
              </div>
              <h4 className="text-emerald-400 font-medium mb-2 text-sm">适合做</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {suitableActivities && suitableActivities.length > 0 ? (
                  suitableActivities.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 制定计划、设定目标</li>
                    <li>• 做出重要决策</li>
                    <li>• 启动新项目</li>
                    <li>• 表达情感、沟通</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* 避免做 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(244, 63, 94, 0.2)' }}>
                <i className="fas fa-times text-rose-400"></i>
              </div>
              <h4 className="text-rose-400 font-medium mb-2 text-sm">避免做</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {avoidActivities && avoidActivities.length > 0 ? (
                  avoidActivities.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 冲动行事</li>
                    <li>• 过度犹豫不决</li>
                    <li>• 忽略他人意见</li>
                    <li>• 放弃正在进行的事</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* 建议 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                <i className="fas fa-lightbulb text-amber-400"></i>
              </div>
              <h4 className="text-amber-400 font-medium mb-2 text-sm">今日建议</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {suggestions && suggestions.length > 0 ? (
                  suggestions.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 把握行动时机</li>
                    <li>• 保持决策清晰</li>
                    <li>• 适度休息调整</li>
                    <li>• 记录灵感和想法</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 区域6：AI深度解读 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(167, 139, 250, 0.15) 50%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI 深度解读</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>基于月相周期的个性化分析</p>
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <p className="text-gray-300 text-xs leading-relaxed">
              {phase}如同{illumination > 50 ? '清晨的太阳，你的能量正在稳步上升。这是一段充满活力的时期，适合将想法转化为行动。' : '黄昏的余晖，能量逐渐回落。这是适合反思、整理和为下一轮做准备的时期。'}
              <br/><br/>
              <span className="text-purple-400 font-medium">核心启示：</span>{energy || ('月相能量正在' + (illumination > 50 ? '上升' : '衰减') + '，' + (illumination > 50 ? '这是制定决策、开启新事物的绝佳时机。' : '适合回顾总结，为新一轮周期做准备。'))}
              <br/><br/>
              <span className="text-amber-400 font-medium">行动指引：</span>{suitableActivities?.[0] || (illumination > 50 ? '专注于你真正想要启动的事情，采取第一个行动。' : '整理思绪，为下一阶段做好规划。')}
            </p>
          </div>
        </div>
      </div>
    );
}
