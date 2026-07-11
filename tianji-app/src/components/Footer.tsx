export default function Footer() {
  return (
    <footer
      className="border-t py-8 text-center text-sm"
      style={{
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--max-width)' }}>
        <p style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
          TIANJI
        </p>
        <p className="mt-2">天机 AI 运势查询工具 -- 仅供参考，不构成任何决策建议</p>
        <p className="mt-1" style={{ color: 'var(--color-text-light)' }}>
          &copy; {new Date().getFullYear()} 天机. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
