import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

/* ===== 按需加载页面组件（代码分割） ===== */
const HomePage = lazy(() => import('@/pages/HomePage'));
const BaziPage = lazy(() => import('@/pages/BaziPage'));
const TarotPage = lazy(() => import('@/pages/TarotPage'));
const ZodiacPage = lazy(() => import('@/pages/ZodiacPage'));
const DreamPage = lazy(() => import('@/pages/DreamPage'));
// 结果页面
const ResultPage = lazy(() => import('@/pages/ResultPage'));
const BaziResultPage = lazy(() => import('@/pages/BaziResultPage'));
const TarotResultPage = lazy(() => import('@/pages/TarotResultPage'));
const ZodiacResultPage = lazy(() => import('@/pages/ZodiacResultPage'));
const ZiweiResultPage = lazy(() => import('@/pages/ZiweiResultPage'));
const DreamResultPage = lazy(() => import('@/pages/DreamResultPage'));
const FengshuiResultPage = lazy(() => import('@/pages/FengshuiResultPage'));
const MoonphaseResultPage = lazy(() => import('@/pages/MoonphaseResultPage'));
const AlmanacResultPage = lazy(() => import('@/pages/AlmanacResultPage'));
const LiuyaoResultPage = lazy(() => import('@/pages/LiuyaoResultPage'));
const MeihuaResultPage = lazy(() => import('@/pages/MeihuaResultPage'));
const QimenResultPage = lazy(() => import('@/pages/QimenResultPage'));
const NumerologyResultPage = lazy(() => import('@/pages/NumerologyResultPage'));
const NametestResultPage = lazy(() => import('@/pages/NametestResultPage'));
const ShengxiaoResultPage = lazy(() => import('@/pages/ShengxiaoResultPage'));
const AstrodiceResultPage = lazy(() => import('@/pages/AstrodiceResultPage'));
const RuneResultPage = lazy(() => import('@/pages/RuneResultPage'));
const DrawlotResultPage = lazy(() => import('@/pages/DrawlotResultPage'));
const PalmResultPage = lazy(() => import('@/pages/PalmResultPage'));

// 新增页面
const ZiweiPage = lazy(() => import('@/pages/ZiweiPage'));
const LiuyaoPage = lazy(() => import('@/pages/LiuyaoPage'));
const MeihuaPage = lazy(() => import('@/pages/MeihuaPage'));
const QimenPage = lazy(() => import('@/pages/QimenPage'));
const FengshuiPage = lazy(() => import('@/pages/FengshuiPage'));
const NumerologyPage = lazy(() => import('@/pages/NumerologyPage'));
const AstrodicePage = lazy(() => import('@/pages/AstrodicePage'));
const MoonphasePage = lazy(() => import('@/pages/MoonphasePage'));
const RunePage = lazy(() => import('@/pages/RunePage'));
const NametestPage = lazy(() => import('@/pages/NametestPage'));
const ShengxiaoPage = lazy(() => import('@/pages/ShengxiaoPage'));
const AlmanacPage = lazy(() => import('@/pages/AlmanacPage'));
const DrawlotPage = lazy(() => import('@/pages/DrawlotPage'));
const PalmPage = lazy(() => import('@/pages/PalmPage'));
const ReportPage = lazy(() => import('@/pages/ReportPage'));
const TrendPage = lazy(() => import('@/pages/TrendPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const AdvicePage = lazy(() => import('@/pages/AdvicePage'));

// 分类聚合页
const EasternPage = lazy(() => import('@/pages/EasternPage'));
const WesternPage = lazy(() => import('@/pages/WesternPage'));
const FolkPage = lazy(() => import('@/pages/FolkPage'));
const AiInsightPage = lazy(() => import('@/pages/AiInsightPage'));

/** 全局加载占位组件 */
function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--color-text-light)' }}>加载中...</p>
      </div>
    </div>
  );
}

/** 包裹 Suspense 的页面加载辅助函数 */
function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 所有路由共享 MainLayout 布局 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={withSuspense(HomePage)} />
          <Route path="/result" element={withSuspense(ResultPage)} />
          <Route path="/result/:id" element={withSuspense(ResultPage)} />
          {/* 专属结果页面 */}
          <Route path="/result/bazi/:id" element={withSuspense(BaziResultPage)} />
          <Route path="/result/tarot/:id" element={withSuspense(TarotResultPage)} />
          <Route path="/result/zodiac/:id" element={withSuspense(ZodiacResultPage)} />
          <Route path="/result/ziwei/:id" element={withSuspense(ZiweiResultPage)} />
          <Route path="/result/dream/:id" element={withSuspense(DreamResultPage)} />
          <Route path="/result/fengshui/:id" element={withSuspense(FengshuiResultPage)} />
          <Route path="/result/moonphase/:id" element={withSuspense(MoonphaseResultPage)} />
          <Route path="/result/almanac/:id" element={withSuspense(AlmanacResultPage)} />
          <Route path="/result/liuyao/:id" element={withSuspense(LiuyaoResultPage)} />
          <Route path="/result/meihua/:id" element={withSuspense(MeihuaResultPage)} />
          <Route path="/result/qimen/:id" element={withSuspense(QimenResultPage)} />
          <Route path="/result/numerology/:id" element={withSuspense(NumerologyResultPage)} />
          <Route path="/result/nametest/:id" element={withSuspense(NametestResultPage)} />
          <Route path="/result/shengxiao/:id" element={withSuspense(ShengxiaoResultPage)} />
          <Route path="/result/astrodice/:id" element={withSuspense(AstrodiceResultPage)} />
          <Route path="/result/rune/:id" element={withSuspense(RuneResultPage)} />
          <Route path="/result/drawlot/:id" element={withSuspense(DrawlotResultPage)} />
          <Route path="/result/palm/:id" element={withSuspense(PalmResultPage)} />

          {/* 分类聚合页 */}
          <Route path="/eastern" element={withSuspense(EasternPage)} />
          <Route path="/western" element={withSuspense(WesternPage)} />
          <Route path="/folk" element={withSuspense(FolkPage)} />
          <Route path="/ai-insight" element={withSuspense(AiInsightPage)} />

          {/* 东方命理系列 */}
          <Route path="/bazi" element={withSuspense(BaziPage)} />
          <Route path="/ziwei" element={withSuspense(ZiweiPage)} />
          <Route path="/liuyao" element={withSuspense(LiuyaoPage)} />
          <Route path="/meihua" element={withSuspense(MeihuaPage)} />
          <Route path="/qimen" element={withSuspense(QimenPage)} />
          <Route path="/tieban" element={withSuspense(QimenPage)} />
          <Route path="/daliuren" element={withSuspense(QimenPage)} />
          <Route path="/fengshui" element={withSuspense(FengshuiPage)} />

          {/* 西方占卜系列 */}
          <Route path="/tarot" element={withSuspense(TarotPage)} />
          <Route path="/zodiac" element={withSuspense(ZodiacPage)} />
          <Route path="/numerology" element={withSuspense(NumerologyPage)} />
          <Route path="/astrodice" element={withSuspense(AstrodicePage)} />
          <Route path="/moonphase" element={withSuspense(MoonphasePage)} />
          <Route path="/rune" element={withSuspense(RunePage)} />

          {/* 民俗趣味系列 */}
          <Route path="/dream" element={withSuspense(DreamPage)} />
          <Route path="/nametest" element={withSuspense(NametestPage)} />
          <Route path="/shengxiao" element={withSuspense(ShengxiaoPage)} />
          <Route path="/almanac" element={withSuspense(AlmanacPage)} />
          <Route path="/drawlot" element={withSuspense(DrawlotPage)} />
          <Route path="/palm" element={withSuspense(PalmPage)} />

          {/* AI 洞察与工具 */}
          <Route path="/report" element={withSuspense(ReportPage)} />
          <Route path="/trend" element={withSuspense(TrendPage)} />
          <Route path="/compare" element={withSuspense(ComparePage)} />
          <Route path="/calendar" element={withSuspense(CalendarPage)} />
          <Route path="/advice" element={withSuspense(AdvicePage)} />

          {/* 个人与搜索 */}
          <Route path="/profile" element={withSuspense(ProfilePage)} />
          <Route path="/search" element={withSuspense(SearchPage)} />
          <Route path="/history" element={withSuspense(HistoryPage)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
