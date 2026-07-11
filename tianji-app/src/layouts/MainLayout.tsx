import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      {/* 内容区域，顶部留出导航栏高度 */}
      <main
        className="flex-1"
        style={{ paddingTop: 'var(--navbar-height)' }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
