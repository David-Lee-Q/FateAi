/**
 * 抽签布局（自 ResultPage.tsx SmartContentCard 拆分）
 */

export default function DrawlotLayout({ data }: { data: Record<string, unknown>; system?: string }) {
    const lotNumber = data.lotNumber as number;
    const luck = data.luck as string | undefined;
    return (
      <div className="mb-6">
        <div className="p-6 rounded-2xl text-center" style={{ background: 'var(--color-bg-elevated)' }}>
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" className="mx-auto mb-4">
            <rect x="5" y="5" width="30" height="40" rx="2" fill="var(--color-gold)" opacity="0.3" />
            <rect x="8" y="8" width="30" height="40" rx="2" fill="var(--color-primary)" />
            <text x="23" y="30" textAnchor="middle" fill="white" fontSize="12">签</text>
          </svg>
          {luck ? (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium mb-2" style={{ background: 'rgba(0, 75, 170, 0.1)', color: 'var(--color-primary)' }}>
              {luck}
            </span>
          ) : null}
          <div className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>第{lotNumber}签</div>
        </div>
      </div>
    );
}
