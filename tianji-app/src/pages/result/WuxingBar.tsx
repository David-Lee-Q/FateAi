export function WuxingBar({ element, percentage, strength }: { element: string; percentage: number; strength: string }) {
  const colors: Record<string, string> = {
    金: 'linear-gradient(90deg, #e8d48b, #c8a84e)',
    木: 'linear-gradient(90deg, #7ab885, #5a9e6f)',
    水: 'linear-gradient(90deg, var(--color-primary-lighter), var(--color-primary))',
    火: 'linear-gradient(90deg, #e88078, #d4645a)',
    土: 'linear-gradient(90deg, #c4a878, #b09060)',
  };
  const textColors: Record<string, string> = {
    金: '#c8a84e',
    木: '#5a9e6f',
    水: 'var(--color-primary)',
    火: '#d4645a',
    土: '#b09060',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-6 text-center text-sm font-medium" style={{ color: textColors[element] }}>
        {element}
      </span>
      <div className="wuxing-bar flex-1">
        <div
          className="wuxing-bar-fill"
          style={{ width: `${percentage}%`, background: colors[element] || colors['水'] }}
        />
      </div>
      <span className="text-xs w-10 text-right" style={{ color: 'var(--color-text-tertiary)' }}>
        {strength}
      </span>
    </div>
  );
}
