/**
 * 六爻布局（京房纳甲排盘）
 * 数据来源：tianji-server liuyao.service（真实摇卦 + 纳甲装卦）
 */

interface SixLine {
  position: number;
  ganZhi: string;
  yinYang: '阳' | '阴';
  isMoving: boolean;
  liuQin: string;
  liuShen: string;
  element: string;
  shiYing: '' | '世' | '应';
  isKong: boolean;
  monthRelation: string;
  dayRelation: string;
  changedGanZhi?: string;
  changedLiuQin?: string;
  changedRelation?: string;
}

const LIU_QIN_COLOR: Record<string, string> = {
  父母: '#60a5fa',
  兄弟: '#a78bfa',
  子孙: '#34d399',
  妻财: '#fbbf24',
  官鬼: '#f87171',
};

const SHEN_COLOR: Record<string, string> = {
  青龙: '#34d399',
  朱雀: '#f87171',
  勾陈: '#fbbf24',
  腾蛇: '#f472b6',
  白虎: '#e5e7eb',
  玄武: '#60a5fa',
};

export default function LiuyaoLayout({ data }: { data: Record<string, unknown>; system?: string }) {
  const originalGua = (data.originalGua || {}) as Record<string, unknown>;
  const changedGua = (data.changedGua || {}) as Record<string, unknown>;
  const question = typeof data.question === 'string' ? data.question : '';
  const sixLines = (Array.isArray(data.sixLines) ? data.sixLines : []) as SixLine[];
  const castInfo = (data.castInfo || null) as Record<string, unknown> | null;
  const yongShen = typeof data.yongShen === 'string' ? data.yongShen : '';
  const shiYing = (data.shiYing || {}) as Record<string, unknown>;
  const movingCount = typeof data.movingCount === 'number' ? data.movingCount : 0;

  const guaName = String(originalGua.name || '');
  const guaSymbol = String(originalGua.symbol || '');
  const upperGua = String(originalGua.upperGua || '上卦');
  const lowerGua = String(originalGua.lowerGua || '下卦');
  const palace = String(originalGua.palace || '');
  const palaceElement = String(originalGua.palaceElement || '');

  // 排盘自上而下展示（上爻在顶）
  const displayLines = [...sixLines].sort((a, b) => b.position - a.position);

  return (
    <div className="mb-6">
      {/* 头部 */}
      <div
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
        }}
      >
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl text-white font-bold">
            {guaSymbol || '☯'}
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: '#10b981' }}>
              {guaName}
              {palace ? ` · ${palace}${palaceElement}` : ''}
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {upperGua}上 {lowerGua}下
              {movingCount > 0 && changedGua.name ? ` · 变卦 ${String(changedGua.name)}` : ' · 静卦'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {question && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(0, 0, 0, 0.2)', color: 'var(--color-text-secondary)' }}>
              问：{question.substring(0, 24)}
            </span>
          )}
          {yongShen && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.35)' }}>
              用神：{yongShen}
            </span>
          )}
        </div>
      </div>

      {/* 起卦信息 */}
      {castInfo && (
        <div className="mt-3 p-3 rounded-xl flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(100, 116, 139, 0.25)', color: 'var(--color-text-secondary)' }}>
          <span>起卦：{String(castInfo.time || '')}</span>
          <span>四柱：{String(castInfo.yearPillar || '')} {String(castInfo.monthPillar || '')} {String(castInfo.dayPillar || '')}</span>
          <span>月建：{String(castInfo.monthBuild || '')}</span>
          <span>日辰：{String(castInfo.dayChen || '')}</span>
          <span style={{ color: '#f87171' }}>旬空：{String(castInfo.xunKong || '')}</span>
        </div>
      )}

      {/* 六爻排盘表 */}
      {displayLines.length > 0 && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-3">六爻排盘</h3>
          <div className="space-y-1.5">
            {displayLines.map((line) => {
              const qinColor = LIU_QIN_COLOR[line.liuQin] || '#cbd5e1';
              return (
                <div
                  key={line.position}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px]"
                  style={{ background: line.isMoving ? 'rgba(251, 191, 36, 0.08)' : 'rgba(0, 0, 0, 0.2)' }}
                >
                  <span className="w-8 shrink-0 text-center" style={{ color: 'var(--color-text-tertiary)' }}>{line.position}爻</span>
                  <span className="w-10 shrink-0 font-medium" style={{ color: SHEN_COLOR[line.liuShen] || '#cbd5e1' }}>{line.liuShen}</span>
                  <span className="w-10 shrink-0 font-semibold" style={{ color: qinColor }}>{line.liuQin}</span>
                  <span className="w-14 shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                    {line.ganZhi}
                    <span className="opacity-60">({line.element})</span>
                  </span>
                  <span className="w-10 shrink-0 text-center" style={{ color: line.yinYang === '阳' ? '#fbbf24' : '#94a3b8' }}>
                    {line.yinYang === '阳' ? '━━━' : '━ ━'}
                  </span>
                  <span className="w-6 shrink-0 text-center font-bold" style={{ color: line.shiYing === '世' ? '#10b981' : line.shiYing === '应' ? '#f43f5e' : 'transparent' }}>
                    {line.shiYing || '—'}
                  </span>
                  <span className="w-12 shrink-0 text-center">
                    {line.isMoving ? (
                      <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>动</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-tertiary)' }}>静</span>
                    )}
                  </span>
                  <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                    {line.isMoving && line.changedGanZhi
                      ? `→ ${line.changedLiuQin}${line.changedGanZhi}${line.changedRelation ? `(${line.changedRelation})` : ''}`
                      : '—'}
                  </span>
                  <span className="w-10 shrink-0 text-center" style={{ color: line.isKong ? '#f87171' : 'transparent' }}>空</span>
                  <span className="hidden sm:inline w-24 shrink-0 text-right" style={{ color: 'var(--color-text-tertiary)' }}>
                    月{line.monthRelation} 日{line.dayRelation}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 世应 + 动变 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Boolean(shiYing.shi || shiYing.ying) && (
          <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#10b981' }}>世应</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>世爻</span>
                <span className="text-xs font-medium" style={{ color: '#10b981' }}>{String(shiYing.shi || '—')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>应爻</span>
                <span className="text-xs font-medium" style={{ color: '#f43f5e' }}>{String(shiYing.ying || '—')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h4 className="text-sm font-medium mb-3" style={{ color: '#fbbf24' }}>动变分析</h4>
          {movingCount === 0 ? (
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>六爻安静，以本卦卦意与用神旺衰断之</p>
          ) : (
            <div className="space-y-1.5">
              {sixLines
                .filter((l) => l.isMoving)
                .map((l) => (
                  <div key={l.position} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {l.position}爻 {l.liuQin}{l.ganZhi} 动化 {l.changedLiuQin}{l.changedGanZhi}
                    {l.changedRelation ? `（${l.changedRelation}）` : ''}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
