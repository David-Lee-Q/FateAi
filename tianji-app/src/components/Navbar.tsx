import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { useAuth } from '@/context/useAuth';

/** 导航菜单配置 */
const NAV_LINKS = [
  { label: '首页', path: '/', children: ['/'] },
  {
    label: '东方命理',
    path: '/eastern',
    children: ['/eastern', '/bazi', '/ziwei', '/liuyao', '/meihua', '/qimen', '/fengshui'],
  },
  {
    label: '西方占卜',
    path: '/western',
    children: ['/western', '/tarot', '/zodiac', '/numerology', '/astrodice', '/moonphase', '/rune'],
  },
  {
    label: '民俗趣味',
    path: '/folk',
    children: ['/folk', '/dream', '/nametest', '/shengxiao', '/almanac', '/drawlot', '/palm'],
  },
  {
    label: 'AI 洞察',
    path: '/ai-insight',
    children: ['/ai-insight', '/report', '/trend', '/compare', '/calendar', '/advice'],
  },
  {
    label: '个人中心',
    path: '/profile',
    children: ['/profile', '/history', '/search'],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  /** 判断当前路径是否属于某个导航分类 */
  const isActive = useMemo(() => {
    const pathname = location.pathname;
    return (link: (typeof NAV_LINKS)[number]) =>
      link.children.some(
        (child) => child === '/' ? pathname === '/' : pathname.startsWith(child)
      );
  }, [location.pathname]);

  return (
    <nav
      className="nav-liquid-glass fixed top-0 left-0 right-0 z-50"
      style={{ height: 'var(--navbar-height)' }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 'var(--max-width)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span
            className="text-xl font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
          >
            天机
          </span>
        </Link>

        {/* 桌面端导航链接 */}
        <div className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-item ${active ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* 右侧操作 */}
        <div className="hidden items-center gap-4 md:flex">
          {/* 搜索按钮 */}
          <Link
            to="/search"
            className="rounded-lg p-2 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Search size={20} />
          </Link>
          {/* 登录 / 用户头像 */}
          {user ? (
            <Link
              to="/profile"
              className="flex h-8 items-center gap-2 rounded-full px-2"
              title={user.nickname}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
                  fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff',
                }}
              >
                {user.nickname.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.nickname}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg px-4"
              style={{
                border: '1px solid rgba(200, 168, 78, 0.4)',
                color: 'var(--color-gold)', fontSize: 'var(--text-sm)', fontWeight: 500,
              }}
            >
              <User size={15} /> 登录
            </Link>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <button
          className="rounded-lg p-2 md:hidden"
          style={{ color: 'var(--color-text)', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="切换菜单"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--color-bg-elevated)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link-item ${active ? 'active' : ''}`}
                  style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
