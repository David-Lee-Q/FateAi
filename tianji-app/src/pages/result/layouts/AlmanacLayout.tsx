/**
 * 老黄历布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function AlmanacLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const date = data.date as string;
    const yi = data.suitable as string[] | undefined;
    const ji = data.avoid as string[] | undefined;
    return (
      <div className="mb-6">
        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-bg-elevated)' }}>
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h4 className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>今日黄历</h4>
          </div>
          <div className="text-center text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>{date}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
              <div className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--state-success)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                宜
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{yi ? yi.join('、').substring(0, 40) : '无'}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
              <div className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--color-error)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                忌
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{ji ? ji.join('、').substring(0, 40) : '无'}</div>
            </div>
          </div>
        </div>
      </div>
    );
}
