/**
 * 八字布局（自 ResultPage.tsx SmartContentCard 拆分）
 */
import { WuxingBar } from '../WuxingBar';

export default function BaziLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const entries = Object.entries(data);
    const hasWuxing = entries.some(([k]) => ['wuxing', '五行', 'wuxing_strength'].includes(k));
    const pillars = ['year', 'month', 'day', 'hour'];
    const pillarLabels = { year: { main: '年柱', sub: '祖上' }, month: { main: '月柱', sub: '父母' }, day: { main: '日柱', sub: '自身' }, hour: { main: '时柱', sub: '子女' } };
    const wuxingData: Record<string, number> = {};
    const wuxingStrength: Record<string, string> = {};
    ['金', '木', '水', '火', '土'].forEach(el => {
      const entry = entries.find(([k]) => k === el);
      if (entry) {
        wuxingData[el] = Number(entry[1]) || 0;
        const val = Number(entry[1]) || 0;
        wuxingStrength[el] = val > 20 ? '旺' : val > 15 ? '中' : '弱';
      }
    });
    const totalWuxing = Object.values(wuxingData).reduce((a, b) => a + b, 0);
    const aiInterpretation = data.aiInterpretation || data.解读 || '';
    const score = data.score as number | undefined;
    const mingGe = String(data.mingGe || data.命格 || '水火既济');
    const mingGeLevel = String(data.mingGeLevel || data.评级 || '中上命格');
    const analysisText = String(data.analysis || data.分析 || '');
    
    const wuxingColors: Record<string, { bg: string; gradient: string }> = {
      '金': { bg: 'rgba(200,168,78,0.1)', gradient: 'linear-gradient(90deg, #e8d48b, #c8a84e)' },
      '木': { bg: 'rgba(90,158,111,0.1)', gradient: 'linear-gradient(90deg, #7ab885, #5a9e6f)' },
      '水': { bg: 'rgba(0,75,170,0.15)', gradient: 'linear-gradient(90deg, #4a90d9, #004baa)' },
      '火': { bg: 'rgba(212,100,90,0.1)', gradient: 'linear-gradient(90deg, #e88078, #d4645a)' },
      '土': { bg: 'rgba(176,144,96,0.1)', gradient: 'linear-gradient(90deg, #c4a878, #b09060)' },
    };
    
    return (
      <div className="mb-6">
        {/* 八字头部卡片 - 设计稿样式 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.15) 0%, rgba(0, 20, 50, 0.3) 100%)',
          border: '1px solid rgba(200, 168, 78, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="60" stroke="#c8a84e" strokeWidth="2" fill="none"/>
              <circle cx="64" cy="64" r="45" stroke="#c8a84e" strokeWidth="1" fill="none"/>
              <circle cx="64" cy="64" r="30" stroke="#c8a84e" strokeWidth="0.5" fill="none"/>
            </svg>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
                八字排盘
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                壬寅年 丙午月 壬午日 庚子时
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>公历 2026年7月10日 14:30 | 农历 六月十五 午时</p>
            </div>
            {/* 八字简盘预览 */}
            <div className="flex flex-col items-center p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
              <div className="grid grid-cols-4 gap-1 text-center">
                {pillars.map((key) => {
                  const pillarData = data[key] as Record<string, string> | undefined;
                  const stem = pillarData?.stem || pillarData?.天干 || '—';
                  const isDay = key === 'day';
                  return (
                    <div key={key} className="p-2" style={isDay ? { background: 'rgba(200,168,78,0.1)', border: '1px solid #c8a84e', borderRadius: '6px' } : {}}>
                      <div className="text-lg font-bold" style={{ color: '#c8a84e' }}>{stem}</div>
                      <div className="text-xs" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>{pillarLabels[key as keyof typeof pillarLabels].main.replace('柱', '')}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>日主壬水 得令</div>
            </div>
          </div>
        </div>

        {/* 综合评分卡 - 设计稿样式 */}
        {score !== undefined && (() => {
          const dashOffset = Math.round(301.6 - (score / 100) * 301.6);
          return (
          <div className="mt-6 p-6 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="shrink-0 relative">
                <svg className="w-28 h-28" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="56" cy="56" r="48" fill="none" stroke="var(--color-border)" strokeWidth="6"/>
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#c8a84e" strokeWidth="6" strokeLinecap="round" strokeDasharray="301.6" strokeDashoffset={dashOffset} style={{ filter: 'drop-shadow(0 0 8px #c8a84e)' }}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{score}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>命格评分</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{mingGe} · {mingGeLevel}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>优+</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {analysisText || '壬水日主生于午月，火势旺盛而水火相济。命局中木火土金水五行俱全，日主得令有力，整体格局较为平衡。'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>{mingGe}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>身旺财旺</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>贵人扶助</span>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* 四柱详细分析 - 设计稿样式 */}
        <div className="mt-6 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a84e" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            四柱详细分析
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {pillars.map((key) => {
              const pillarData = data[key] as Record<string, string> | undefined;
              if (!pillarData) return null;
              const stem = pillarData.stem || pillarData.天干 || '—';
              const branch = pillarData.branch || pillarData.地支 || '—';
              const stemWuxing = pillarData.stemWuxing || pillarData.天干五行 || '';
              const branchWuxing = pillarData.branchWuxing || pillarData.地支五行 || '';
              const naying = pillarData.naying || pillarData.纳音 || '';
              const zodiac = pillarData.zodiac || pillarData.属相 || '';
              const isDay = key === 'day';
              return (
                <div key={key} className="text-center p-4 rounded-lg relative" style={{ 
                  background: isDay ? 'linear-gradient(180deg, rgba(200,168,78,0.2) 0%, rgba(200,168,78,0.05) 100%)' : 'linear-gradient(180deg, rgba(200,168,78,0.1) 0%, transparent 100%)',
                  border: isDay ? '2px solid #c8a84e' : '1px solid rgba(200,168,78,0.2)',
                  boxShadow: isDay ? '0 0 20px rgba(200,168,78,0.15)' : 'none'
                }}>
                  {isDay && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px]" style={{ background: '#c8a84e', color: '#0a0e1a' }}>日主</div>}
                  <div className="text-xs mb-2 mt-1" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>
                    {pillarLabels[key as keyof typeof pillarLabels].main} · {pillarLabels[key as keyof typeof pillarLabels].sub}
                  </div>
                  <div className="flex justify-center gap-4 mb-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{stem}</div>
                      <div className="text-[10px]" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>天干 · {stemWuxing}</div>
                    </div>
                    <div className="w-px" style={{ background: isDay ? '#c8a84e' : 'var(--color-border)' }}></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{branch}</div>
                      <div className="text-[10px]" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>地支 · {branchWuxing}</div>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-secondary)' }}>纳音{isDay ? '' : ''}{naying} · {zodiac}</div>
                </div>
              );
            })}
          </div>
          {/* 地支藏干 */}
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>地支藏干</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>子</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏癸</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>寅</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏甲丙戊</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>午</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏丁己</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>子</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏癸</span></div>
            </div>
          </div>
        </div>

        {/* 五行力量分布 - 设计稿样式 */}
        {totalWuxing > 0 && Object.keys(wuxingData).length > 0 && (
          <div className="mt-6 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              五行力量分布
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(wuxingData).map(([el, val]) => {
                const strength = wuxingStrength[el] || '中';
                const isStrong = el === '水';
                const colors = wuxingColors[el] || { bg: 'var(--color-bg-inset)', gradient: '#888' };
                return (
                  <div key={el} className="text-center p-3 rounded-lg" style={{ 
                    background: colors.bg,
                    border: isStrong ? '1px solid var(--color-primary)' : 'none'
                  }}>
                    <div className="text-2xl mb-1" style={{ color: isStrong ? 'var(--color-primary-lighter)' : colors.gradient.includes('e8d48b') ? '#e8d48b' : colors.gradient.includes('7ab885') ? '#5a9e6f' : colors.gradient.includes('e88078') ? '#d4645a' : colors.gradient.includes('c4a878') ? '#b09060' : '#888' }}>{el}</div>
                    <div className="h-2 rounded-full mb-2" style={{ background: 'var(--color-border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: colors.gradient }}></div>
                    </div>
                    <div className="text-xs" style={{ color: isStrong ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: isStrong ? 600 : 400 }}>{strength} {val}%</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'var(--color-bg-inset)', color: 'var(--color-text-secondary)' }}>
              <span style={{ color: 'var(--color-primary)' }}>命理分析：</span>
              {analysisText || '日主壬水得令，水势旺盛。午月火旺，水火相济成格。命局中金水为喜用，木火土为忌神。宜补水金，忌火土。'}
            </div>
          </div>
        )}

        {/* AI 解读预览 - 设计稿样式 */}
        {aiInterpretation && (
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a84e" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#a88a3a' }}>AI 深度解读</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {typeof aiInterpretation === 'string' ? aiInterpretation : JSON.stringify(aiInterpretation)}
            </p>
          </div>
        )}

        {/* 五行分布详细 */}
        {hasWuxing && (
          <div className="mt-4 p-5 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20" />
              </svg>
              <h4 className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>五行详细分析</h4>
            </div>
            <div className="space-y-3">
              {entries.filter(([k]) => ['金', '木', '水', '火', '土'].includes(k)).map(([key, value]) => (
                <WuxingBar 
                  key={key} 
                  element={key} 
                  percentage={Number(value) || 0} 
                  strength={Number(value) > 20 ? '旺' : Number(value) > 15 ? '平' : '弱'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
