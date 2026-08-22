/**
 * 占星骰子布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function AstrodiceLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const dice1 = data.dice1 as Record<string, unknown>;
    const dice2 = data.dice2 as Record<string, unknown> | undefined;
    const dice3 = data.dice3 as Record<string, unknown> | undefined;
    
    // 提取各骰子数据
    const planetData = dice1;
    const signData = dice2 ?? {};
    const houseData = dice3 ?? {};
    const planetName = String(planetData?.name || planetData?.symbol || '太阳');
    const signName = String(signData?.name || signData?.symbol || '白羊座');
    const houseName = String(houseData?.name || houseData?.symbol || '第5宫');
    const houseNum = String(houseData?.symbol || houseData?.name || '5').replace(/[^0-9]/g, '') || '5';
    
    // 根据宫位数生成四宫位网格数据
    const houseKeywords: Record<string, { love: string; creative: string; entertainment: string; talent: string }> = {
      '1': { love: '吸引他人', creative: '自我展现', entertainment: '个人享乐', talent: '领导才能' },
      '2': { love: '财务亲密', creative: '资源创造', entertainment: '享受生活', talent: '理财能力' },
      '3': { love: '沟通恋爱', creative: '写作创意', entertainment: '短途旅行', talent: '表达能力' },
      '4': { love: '家庭情感', creative: '房产相关', entertainment: '家庭聚会', talent: '照顾能力' },
      '5': { love: '热情浪漫', creative: '艺术创作', entertainment: '娱乐游戏', talent: '表演才华' },
      '6': { love: '日常相处', creative: '服务工作', entertainment: '健康养生', talent: '服务技能' },
      '7': { love: '伴侣关系', creative: '合伙创意', entertainment: '社交活动', talent: '协调能力' },
      '8': { love: '深层亲密', creative: '转化创造', entertainment: '神秘探索', talent: '洞察能力' },
      '9': { love: '理想之爱', creative: '智慧创造', entertainment: '长途旅行', talent: '哲学思维' },
      '10': { love: '事业吸引', creative: '公众形象', entertainment: '成就追求', talent: '领导能力' },
      '11': { love: '群体社交', creative: '创新想法', entertainment: '团体活动', talent: '理想主义' },
      '12': { love: '潜意识情感', creative: '艺术直觉', entertainment: '灵性修养', talent: '共情能力' },
    };
    const houseGrid = houseKeywords[houseNum] || houseKeywords['5'];
    
    return (
      <div className="mb-6 space-y-6">
        {/* 1. 占星骰子头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8" cy="8" r="1.5" fill="white"/>
                <circle cx="16" cy="8" r="1.5" fill="white"/>
                <circle cx="8" cy="16" r="1.5" fill="white"/>
                <circle cx="16" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>占星骰子解读</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>行星 · 星座 · 宫位</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <i className="fas fa-star"></i>行星：{planetName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
              <i className="fas fa-fire"></i>星座：{signName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              <i className="fas fa-home"></i>宫位：{houseName}
            </span>
          </div>
        </div>

        {/* 2. 三骰展示区域 */}
        <div className="p-8 rounded-2xl" style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
          border: '1px solid rgba(100, 116, 139, 0.3)' 
        }}>
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
            </svg>
            骰子结果
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* 行星骰子 */}
            <div className="flex flex-col items-center">
              <div className="mb-4" style={{ perspective: '1000px' }}>
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center" 
                  style={{ 
                    background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                    boxShadow: '0 20px 60px rgba(251, 191, 36, 0.3)'
                  }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-lg mb-1">{planetName} ☉</span>
              <span className="text-gray-400 text-sm">代表：核心自我、生命能量</span>
            </div>
            
            {/* 星座骰子 */}
            {signData && (
              <div className="flex flex-col items-center">
                <div className="mb-4" style={{ perspective: '1000px' }}>
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                      boxShadow: '0 20px 60px rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e'
                    }}>
                    ♈
                  </div>
                </div>
                <span className="text-rose-400 font-bold text-lg mb-1">{signName}</span>
                <span className="text-gray-400 text-sm">代表：行动力、开创精神</span>
              </div>
            )}
            
            {/* 宫位骰子 */}
            {houseData && (
              <div className="flex flex-col items-center">
                <div className="mb-4" style={{ perspective: '1000px' }}>
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                      boxShadow: '0 20px 60px rgba(167, 139, 250, 0.3)',
                      color: '#a78bfa'
                    }}>
                    {houseNum}
                  </div>
                </div>
                <span className="text-purple-400 font-bold text-lg mb-1">{houseName}</span>
                <span className="text-gray-400 text-sm">代表：恋爱、创意、子女</span>
              </div>
            )}
          </div>

          {Boolean(data.interpretation) && (
            <div className="rounded-xl p-5" style={{ 
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.05))',
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                综合含义
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {String(data.interpretation)}
              </p>
            </div>
          )}
        </div>

        {planetData && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
            border: '1px solid rgba(100, 116, 139, 0.3)' 
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span style={{ color: '#fbbf24' }}>{planetName} ☉</span>
              <span className="text-gray-400 text-sm font-normal">— 生命之光</span>
            </h2>
            <div className="rounded-xl p-5 mb-4" style={{ 
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <p className="text-amber-300 leading-relaxed">
                {String(planetData.description || planetData.meaning || `${planetName}是占星术中最重要的星体，代表核心自我、生命力、个人意志和创造力的来源。它揭示了你如何展现自己的力量，以及你生命中最重要的领域。`)}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                  正向特质
                </h4>
                <p className="text-gray-400 text-sm">{String(planetData.positiveTraits || planetData.traits || '自信、活力、创造力、领导力、慷慨')}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  挑战课题
                </h4>
                <p className="text-gray-400 text-sm">{String(planetData.challengeTraits || planetData.lessons || '避免自我中心、控制欲过强、过于争强好胜')}</p>
              </div>
            </div>
          </div>
        )}

        {Object.keys(signData).length > 0 && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
            border: '1px solid rgba(100, 116, 139, 0.3)' 
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ color: '#f43f5e' }}>{signName}</span>
              <span className="text-gray-400 text-sm font-normal">— 火的开始</span>
            </h2>
            <div className="rounded-xl p-5 mb-4" style={{ 
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              <p className="text-rose-300 leading-relaxed">
                {String(signData.description || signData.meaning || `${signName}是黄道十二星座的代表之一，充满热情和行动力，喜欢挑战和竞争，不畏惧成为第一个吃螃蟹的人。`)}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-rose-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  性格特点
                </h4>
                <p className="text-gray-400 text-sm">{String(signData.traits || '勇敢、直接、充满活力、独立、积极')}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-rose-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  人生课题
                </h4>
                <p className="text-gray-400 text-sm">{String(signData.lessons || signData.challenges || '学会耐心、倾听他人、接受失败')}</p>
              </div>
            </div>
          </div>
        )}

        {houseData && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)'
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span style={{ color: '#a78bfa' }}>{houseName}</span>
              <span className="text-gray-400 text-sm font-normal">— 创造与恋爱之宫</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {houseName}代表创造力、自我表达、恋爱关系、子女、娱乐和艺术才华。骰子落在此宫，暗示你在这几个方面拥有强大的能量和机遇。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" className="mx-auto mb-2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">恋爱</p>
                <p className="text-sm text-white font-medium">{houseGrid.love}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" className="mx-auto mb-2">
                  <circle cx="13.5" cy="6.5" r="2.5"/>
                  <circle cx="19" cy="17" r="2"/>
                  <circle cx="6" cy="12" r="3"/>
                  <path d="M12 9v4M9 11l3 2"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">创意</p>
                <p className="text-sm text-white font-medium">{houseGrid.creative}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" className="mx-auto mb-2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10,8 16,12 10,16 10,8"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">娱乐</p>
                <p className="text-sm text-white font-medium">{houseGrid.entertainment}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" className="mx-auto mb-2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">才华</p>
                <p className="text-sm text-white font-medium">{houseGrid.talent}</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. AI深度解读 */}
        {Boolean(data.aiInterpretation) && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.4)'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI 深度解读</h2>
                <p className="text-xs text-gray-400">基于占星原理的个性化分析</p>
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ 
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {String(data.aiInterpretation)}
              </p>
            </div>
          </div>
        )}
      </div>
    );
}
