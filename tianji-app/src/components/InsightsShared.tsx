import { useNavigate } from 'react-router-dom';
import { Info, Inbox, Compass } from 'lucide-react';

/** 未登录态演示数据横幅 */
export function DemoBanner({ text = '演示数据，请登录体验' }: { text?: string }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        padding: '12px 18px',
        borderRadius: 12,
        background: 'rgba(200, 168, 78, 0.08)',
        border: '1px solid rgba(200, 168, 78, 0.3)',
        marginBottom: 'var(--space-8, 2rem)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--color-gold-light, #e8d48b)',
          fontSize: 'var(--text-sm, 0.875rem)',
          fontWeight: 500,
        }}
      >
        <Info size={16} style={{ flexShrink: 0 }} />
        {text}，登录后可查看基于你真实查询的分析
      </span>
      <button
        onClick={() => navigate('/login')}
        style={{
          padding: '8px 20px',
          borderRadius: 10,
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm, 0.875rem)',
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        去登录
      </button>
    </div>
  );
}

/** 登录态但无分析记录时的空态 */
export function EmptyInsights({ text = '暂无分析记录' }: { text?: string }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '96px 24px',
        background: 'var(--color-bg-elevated)',
        border: '1px dashed var(--color-border)',
        borderRadius: 20,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(200, 168, 78, 0.1)',
        }}
      >
        <Inbox size={28} style={{ color: 'var(--color-gold)' }} />
      </div>
      <h3 style={{ fontSize: 'var(--text-lg, 1.125rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
        {text}
      </h3>
      <p style={{ fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--color-text-secondary)', margin: 0, maxWidth: 420, lineHeight: 1.7 }}>
        完成任意一次占卜查询后，这里将展示基于你真实查询记录的分析结果。
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 28px',
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm, 0.875rem)',
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
          color: '#fff',
        }}
      >
        <Compass size={16} />
        去占卜
      </button>
    </div>
  );
}
