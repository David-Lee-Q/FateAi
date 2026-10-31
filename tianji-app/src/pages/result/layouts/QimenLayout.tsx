/**
 * 奇门遁甲布局（时家奇门九宫盘）
 * 数据来源：tianji-server qimen.service（三元九局真实排盘）
 */

interface QimenPalace {
  number: number;
  trigram: string;
  direction: string;
  element: string;
  earthStem: string;
  hostedStem?: string;
  heavenStems: string[];
  stars: string[];
  door: string;
  deity: string;
  isVoid: boolean;
  isHorse: boolean;
}

/** 洛书九宫方位布局（上南下北，左东右西） */
const LAYOUT: number[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const DOOR_COLOR: Record<string, string> = {
  开门: '#34d399',
  休门: '#60a5fa',
  生门: '#a3e635',
  伤门: '#f87171',
  杜门: '#a78bfa',
  景门: '#fbbf24',
  死门: '#94a3b8',
  惊门: '#f472b6',
};

const STAR_COLOR: Record<string, string> = {
  天蓬: '#60a5fa',
  天芮: '#f472b6',
  天冲: '#fbbf24',
  天辅: '#34d399',
  天禽: '#c4b5fd',
  天心: '#a78bfa',
  天柱: '#f59e0b',
  天任: '#22d3ee',
  天英: '#f87171',
};

export default function QimenLayout({ data }: { data: Record<string, unknown>; system?: string }) {
  const palaces = (Array.isArray(data.palaces) ? data.palaces : []) as QimenPalace[];
  const juShu = typeof data.juShu === 'string' ? data.juShu : '';
  const term = typeof data.solarTerm === 'string' ? data.solarTerm : '';
  const yuan = typeof data.yuan === 'string' ? data.yuan : '';
  const fourPillars = (data.fourPillars || null) as Record<string, unknown> | null;
  const xunHead = typeof data.xunHead === 'string' ? data.xunHead : '';
  const hiddenStem = typeof data.hiddenStem === 'string' ? data.hiddenStem : '';
  const voidBranches = Array.isArray(data.voidBranches) ? (data.voidBranches as string[]) : [];
  const leaders = (data.leaders || null) as Record<string, unknown> | null;
  const horse = (data.horse || null) as Record<string, unknown> | null;

  const byNum = new Map<number, QimenPalace>();
  for (const p of palaces) byNum.set(p.number, p);

  return (
    <div className="mb-6">
      {/* 头部 */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold" style={{ color: '#a78bfa' }}>奇门遁甲</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {term}{yuan ? ` · ${yuan}` : ''} · 时家奇门
            </p>
          </div>
          {juShu && (
            <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              {juShu}
            </span>
          )}
        </div>

        {fourPillars && (
          <div className="flex flex-wrap gap-2 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>
              四柱 {String(fourPillars.year || '')} {String(fourPillars.month || '')} {String(fourPillars.day || '')} {String(fourPillars.hour || '')}
            </span>
            {xunHead && (
              <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>
                旬首 {xunHead}{hiddenStem ? `（遁${hiddenStem}）` : ''}
              </span>
            )}
            {voidBranches.length > 0 && (
              <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                旬空 {voidBranches.join('')}
              </span>
            )}
            {leaders && (
              <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd' }}>
                值符 {String(leaders.star || '')} · 值使 {String(leaders.door || '')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 九宫盘 */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {LAYOUT.flat().map((num) => {
          const p = byNum.get(num);
          if (!p) return <div key={num} />;
          const isCenter = p.number === 5;
          return (
            <div
              key={num}
              className="p-2 rounded-xl min-h-[104px] flex flex-col justify-between"
              style={{
                background: isCenter ? 'rgba(120, 113, 108, 0.12)' : 'rgba(30, 41, 59, 0.55)',
                border: `1px solid ${isCenter ? 'rgba(148, 163, 184, 0.25)' : 'rgba(167, 139, 250, 0.22)'}`,
              }}
            >
              {/* 八神 + 宫位 */}
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: '#c4b5fd' }}>{p.deity || '—'}</span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>
                  {p.number}宫{p.trigram === '中' ? '' : p.trigram}
                </span>
              </div>

              {/* 九星 + 天盘干 */}
              <div className="text-center my-1">
                {!isCenter && (
                  <div className="text-[11px] font-semibold" style={{ color: STAR_COLOR[p.stars[0]] || '#a78bfa' }}>
                    {p.stars.join(' ') || '—'}
                  </div>
                )}
                <div className="text-base font-bold" style={{ color: '#e2e8f0' }}>
                  {p.heavenStems.join('') || '—'}
                  <span className="text-[10px] font-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                    {p.earthStem ? ` / ${p.earthStem}` : ''}
                  </span>
                </div>
              </div>

              {/* 八门 + 标记 */}
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: DOOR_COLOR[p.door] || 'var(--color-text-tertiary)' }}>{p.door || '—'}</span>
                <span className="flex gap-1">
                  {p.isVoid && <span style={{ color: '#f87171' }}>空</span>}
                  {p.isHorse && <span style={{ color: '#fbbf24' }}>马</span>}
                  {p.isVoid === false && p.isHorse === false && <span style={{ color: 'transparent' }}>·</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
        <span>每宫显示：八神 / 宫位 / 九星 / 天盘干÷地盘干 / 八门</span>
        {horse && Boolean(horse.branch) && <span>马星：{String(horse.branch)}（{String(horse.palace)}宫）</span>}
      </div>
    </div>
  );
}
