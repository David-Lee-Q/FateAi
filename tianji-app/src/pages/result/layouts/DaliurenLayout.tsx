/**
 * 大六壬布局（月将加时 · 四课三传）
 * 数据来源：tianji-server daliuren.service
 */

interface ChuanItem {
  zhi: string;
  gan?: string;
  liuqin?: string;
  jiang?: string;
  kong?: boolean;
}

const LIUQIN_COLOR: Record<string, string> = {
  父母: '#60a5fa',
  兄弟: '#a78bfa',
  子孙: '#34d399',
  妻财: '#fbbf24',
  官鬼: '#f87171',
};

export default function DaliurenLayout({ data }: { data: Record<string, unknown>; system?: string }) {
  const time = (data.time || {}) as Record<string, unknown>;
  const ke = (data.ke || {}) as Record<string, unknown>;
  const chuan = (data.chuan || {}) as Record<string, unknown>;
  const shen = (data.shen || {}) as Record<string, unknown>;

  const keDetail = Array.isArray(ke.detail) ? (ke.detail as string[]) : [];
  const chuanDetail = Array.isArray(chuan.detail) ? (chuan.detail as ChuanItem[]) : [];
  const zongmen = typeof chuan.zongmen === 'string' ? chuan.zongmen : '';
  const yuejiang = typeof time.yuejiang === 'string' ? time.yuejiang : '';
  const yuejiangName = typeof time.yuejiangName === 'string' ? time.yuejiangName : '';
  const fourPillars = typeof time.fourPillars === 'string' ? time.fourPillars : '';
  const shichen = typeof time.shichen === 'string' ? time.shichen : '';

  return (
    <div className="mb-6">
      {/* 头部 */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.25)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-bold" style={{ color: '#fbbf24' }}>六壬神课</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              月将加时 · {shichen}{fourPillars ? ` · ${fourPillars}` : ''}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {zongmen && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                {zongmen}
              </span>
            )}
            {yuejiang && (
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                月将 {yuejiang}{yuejiangName ? `（${yuejiangName}）` : ''}
              </span>
            )}
          </div>
        </div>

        {Boolean(shen.guiZhi) && (
          <div className="flex flex-wrap gap-2 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>
              贵人 {String(shen.guiZhi)}（临地盘{String(shen.guiEarth)}）
            </span>
            <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.25)' }}>
              天将{String(shen.direction)}
            </span>
          </div>
        )}
      </div>

      {/* 四课 */}
      {keDetail.length > 0 && (
        <div className="mt-3 p-4 rounded-2xl" style={{ background: 'rgba(30, 41, 59, 0.55)', border: '1px solid rgba(251, 191, 36, 0.18)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>四课</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {keDetail.map((item, idx) => {
              const [label, rest] = item.split('：');
              return (
                <div key={idx} className="p-2 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.22)' }}>
                  <div className="text-[10px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{label}</div>
                  <div className="text-xs font-medium" style={{ color: '#fbbf24' }}>{rest || item}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 三传 */}
      {chuanDetail.length > 0 && (
        <div className="mt-3 p-4 rounded-2xl" style={{ background: 'rgba(30, 41, 59, 0.55)', border: '1px solid rgba(251, 191, 36, 0.18)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>三传</h3>
          <div className="grid grid-cols-3 gap-2">
            {['初传', '中传', '末传'].map((label, i) => {
              const c = chuanDetail[i];
              if (!c) return null;
              return (
                <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.22)', border: `1px solid ${LIUQIN_COLOR[c.liuqin || ''] || '#64748b'}33` }}>
                  <div className="text-[10px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{label}</div>
                  <div className="text-lg font-bold" style={{ color: '#fbbf24' }}>
                    {c.gan || ''}{c.zhi}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: LIUQIN_COLOR[c.liuqin || ''] || 'var(--color-text-secondary)' }}>
                    {c.liuqin || '—'}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {c.jiang || '—'}{c.kong ? ' · 旬空' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 天将四课对应 */}
      {Boolean(shen.shen1 || shen.shen2 || shen.shen3 || shen.shen4) && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
          <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>干阳 {String(shen.shen1 || '—')}</span>
          <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>干阴 {String(shen.shen2 || '—')}</span>
          <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>支阳 {String(shen.shen3 || '—')}</span>
          <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>支阴 {String(shen.shen4 || '—')}</span>
        </div>
      )}
    </div>
  );
}
