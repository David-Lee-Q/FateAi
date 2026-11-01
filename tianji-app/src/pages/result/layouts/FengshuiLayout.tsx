/**
 * 风水布局（八宅 + 玄空年飞星）
 * 数据来源：tianji-server fengshui.service
 */

interface FlyingStar {
  palace: string;
  direction: string;
  star: number;
  name: string;
  nature: string;
  meaning: string;
}

/** 洛书九宫（上南下北）：东南 正南 西南 / 正东 中宫 正西 / 东北 正北 西北 */
const GRID: string[][] = [
  ['东南', '正南', '西南'],
  ['正东', '中宫', '正西'],
  ['东北', '正北', '西北'],
];

const STAR_ELEMENT: Record<number, string> = {
  1: '水', 2: '土', 3: '木', 4: '木', 5: '土', 6: '金', 7: '金', 8: '土', 9: '火',
};

const ELEMENT_COLOR: Record<string, string> = {
  水: '#3b82f6', 土: '#a3a3a3', 木: '#22c55e', 金: '#fbbf24', 火: '#ef4444',
};

const NATURE_COLOR: Record<string, string> = { 吉: '#22c55e', 凶: '#f43f5e', 中: '#fbbf24' };

export default function FengshuiLayout({ data }: { data: Record<string, unknown>; system?: string }) {
  const direction = typeof data.direction === 'string' ? data.direction : '';
  const buildingType = typeof data.buildingType === 'string' ? data.buildingType : '';
  const year = typeof data.year === 'number' ? data.year : undefined;
  const centerStar = (data.yearStarCenter || null) as Record<string, unknown> | null;
  const baZhai = (data.baZhai || null) as Record<string, unknown> | null;
  const flying = (Array.isArray(data.flyingStars) ? data.flyingStars : []) as FlyingStar[];
  const favorable = (Array.isArray(data.favorableAreas) ? data.favorableAreas : []) as string[];
  const unfavorable = (Array.isArray(data.unfavorableAreas) ? data.unfavorableAreas : []) as string[];
  const advice = (Array.isArray(data.layoutAdvice) ? data.layoutAdvice : []) as string[];

  const starByDirection = new Map<string, FlyingStar>();
  for (const f of flying) starByDirection.set(f.direction, f);

  return (
    <div className="mb-6">
      {/* 头部 */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold" style={{ color: '#10b981' }}>风水罗盘</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {buildingType}坐{direction} · {year ? `${year} 年九宫飞星` : '九宫飞星'}
            </p>
          </div>
          {centerStar && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
              {String(centerStar.name)}入中
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          {baZhai && (
            <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)', color: 'var(--color-text-secondary)' }}>
              {String(baZhai.mingGua)} · {String(baZhai.group)}
            </span>
          )}
          {centerStar && (
            <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)', color: 'var(--color-text-secondary)' }}>
              寓意：{String(centerStar.meaning)}
            </span>
          )}
        </div>
      </div>

      {/* 九宫飞星 */}
      <div className="mt-3 p-4 rounded-2xl" style={{ background: 'rgba(30, 41, 59, 0.55)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>九宫飞星（上南下北）</h3>
        <div className="grid grid-cols-3 gap-1.5 max-w-sm mx-auto">
          {GRID.flat().map((dir) => {
            const f = starByDirection.get(dir);
            const element = f ? STAR_ELEMENT[f.star] : '';
            return (
              <div
                key={dir}
                className="rounded-xl p-2 min-h-[82px] flex flex-col items-center justify-center"
                style={{
                  background: dir === '中宫' ? 'rgba(120,113,108,0.15)' : 'rgba(0,0,0,0.28)',
                  border: `1px solid ${f ? (NATURE_COLOR[f.nature] + '44') : 'rgba(128,128,128,0.2)'}`,
                }}
              >
                <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{dir}</span>
                {f ? (
                  <>
                    <span className="text-lg font-bold" style={{ color: ELEMENT_COLOR[element] || '#cbd5e1' }}>{f.star}</span>
                    <span className="text-[9px]" style={{ color: ELEMENT_COLOR[element] || 'var(--color-text-tertiary)' }}>{element}</span>
                    <span className="text-[9px] mt-0.5 px-1 rounded" style={{ color: NATURE_COLOR[f.nature] }}>{f.nature}</span>
                  </>
                ) : (
                  <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between max-w-sm mx-auto mt-2 text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>
          <span>东</span>
          <span>南（上）</span>
          <span>西</span>
        </div>
      </div>

      {/* 吉方 / 煞方 / 建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <h4 className="text-sm font-medium mb-2" style={{ color: '#22c55e' }}>吉方</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {favorable.length > 0 ? favorable.join('、') : '—'}
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
          <h4 className="text-sm font-medium mb-2" style={{ color: '#f43f5e' }}>煞方（宜静忌动土）</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {unfavorable.length > 0 ? unfavorable.join('、') : '—'}
          </p>
        </div>
      </div>

      {advice.length > 0 && (
        <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.25)' }}>
          <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>布局建议</h4>
          <ul className="space-y-1">
            {advice.map((a, i) => (
              <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                · {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
