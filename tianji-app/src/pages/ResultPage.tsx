import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Share2, Loader2, Sparkles, Clock, ChevronLeft, Send, RefreshCw, Heart, FileText,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import type { FortuneResult } from '@/types';
import { getFortuneResult, getHistory, submitFollowUp } from '@/services/api';
import { getFieldLabel, getUnmappedFields } from '@/config/fieldLabels';

// 环形进度条组件
function ProgressRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="shrink-0 relative">
      <svg className="progress-ring w-24 h-24" viewBox="0 0 100 100">
        <circle
          className="progress-ring-circle-bg"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className="progress-ring-circle"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="display-font font-bold text-2xl"
          style={{ color: 'var(--color-primary)', lineHeight: 1 }}
        >
          {score}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
          综合评分
        </span>
      </div>
    </div>
  );
}

// 太阳装饰图标组件
function SunIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-float">
      <circle cx="24" cy="24" r="10" fill="var(--color-gold)" opacity="0.3" />
      <circle cx="24" cy="24" r="16" stroke="var(--color-gold)" strokeWidth="1" opacity="0.2" />
      <g stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.3" strokeLinecap="round">
        <line x1="24" y1="2" x2="24" y2="6" />
        <line x1="24" y1="42" x2="24" y2="46" />
        <line x1="2" y1="24" x2="6" y2="24" />
        <line x1="42" y1="24" x2="46" y2="24" />
        <line x1="8.4" y1="8.4" x2="11.3" y2="11.3" />
        <line x1="36.7" y1="36.7" x2="39.6" y2="39.6" />
        <line x1="8.4" y1="39.6" x2="11.3" y2="36.7" />
        <line x1="36.7" y1="11.3" x2="39.6" y2="8.4" />
      </g>
    </svg>
  );
}

// 背景装饰层组件
function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <svg
        className="absolute top-16 left-[5%] w-64 h-32 opacity-30 animate-drift"
        viewBox="0 0 256 64"
        style={{ animationDelay: '0s' }}
      >
        <defs>
          <linearGradient id="cloudGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary-lightest)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-primary-lightest)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-primary-lightest)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <ellipse cx="128" cy="40" rx="100" ry="24" fill="url(#cloudGradient1)" />
        <ellipse cx="80" cy="32" rx="50" ry="20" fill="url(#cloudGradient1)" />
        <ellipse cx="180" cy="36" rx="60" ry="22" fill="url(#cloudGradient1)" />
      </svg>
      <svg
        className="absolute top-[40%] right-[3%] w-48 h-24 opacity-20 animate-drift"
        viewBox="0 0 192 48"
        style={{ animationDelay: '3s' }}
      >
        <ellipse cx="96" cy="28" rx="80" ry="20" fill="var(--color-primary-lightest)" fillOpacity="0.4" />
        <ellipse cx="60" cy="24" rx="40" ry="16" fill="var(--color-primary-lightest)" fillOpacity="0.3" />
        <ellipse cx="140" cy="26" rx="45" ry="18" fill="var(--color-primary-lightest)" fillOpacity="0.35" />
      </svg>
      <svg className="absolute bottom-[20%] left-[8%] w-3 h-3" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5" fill="var(--color-primary-lightest)" />
      </svg>
      <svg className="absolute bottom-[35%] right-[12%] w-2 h-2" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" fill="var(--color-gold)" opacity="0.3" />
      </svg>
    </div>
  );
}

// 五行进度条组件
function WuxingBar({ element, percentage, strength }: { element: string; percentage: number; strength: string }) {
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

// Tab 内容装饰组件
function TabContentDecoration() {
  return (
    <div className="hidden md:flex flex-col items-center gap-4 shrink-0">
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--color-primary-bg)' }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.3" />
          <path d="M16 6v20M6 16h20" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" />
          <circle cx="16" cy="16" r="6" fill="var(--color-primary)" opacity="0.15" />
          <circle cx="16" cy="16" r="3" fill="var(--color-primary)" />
        </svg>
      </div>
      <div className="w-px h-12" style={{ background: 'linear-gradient(180deg, var(--color-primary), transparent)' }} />
    </div>
  );
}

// 关键词标签组件
function KeywordTag({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
      style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}
    >
      {icon}
      {label}
    </span>
  );
}

// 系统图标映射
const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  bazi: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
  ),
  tarot: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  ziwei: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20" />
      <path d="M12 2a10 10 0 0 0 0 20" />
    </svg>
  ),
  palm: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  ),
  tieban: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h16M12 4v16" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  daliuren: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
      <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
    </svg>
  ),
};

// 通用数据卡片组件 - 根据数据类型智能分组展示
function GeneralDataCards({ data, system }: { data: Record<string, unknown>; system: string }) {
  const entries = Object.entries(data).filter(([k, v]) => 
    v !== null && v !== undefined && !shouldHideField(k)
  );
  
  if (entries.length === 0) return null;
  
  // 检测数据特点
  const hasLongText = entries.some(([, v]) => String(v).length > 50);
  const hasShortPairs = entries.filter(([, v]) => String(v).length <= 20).length > 3;
  const entryCount = entries.length;
  
  // 长文本为主的布局
  if (hasLongText && entryCount <= 3) {
    return (
      <div className="space-y-4">
        {entries.map(([key, value]) => {
          const label = getFieldLabel(system, key);
          return (
            <div key={key} className="p-5 rounded-xl" style={{ background: 'var(--color-bg-elevated)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-4 rounded-full" style={{ background: 'var(--color-primary)' }} />
                <h4 className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {label}
                </h4>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {String(value)}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
  
  // 短数据对的网格布局
  if (hasShortPairs && entryCount <= 8) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {entries.map(([key, value]) => {
          const label = getFieldLabel(system, key);
          return (
            <div key={key} className="p-3 rounded-lg text-center" style={{ background: 'var(--color-primary-bg)' }}>
              <div className="text-xs mb-1.5 truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                {label}
              </div>
              <div className="text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>
                {String(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  // 中等数据量的双列布局
  if (entryCount <= 12) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entries.map(([key, value]) => {
          const label = getFieldLabel(system, key);
          return (
            <div key={key} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                {label}
              </span>
              <span className="text-sm font-medium text-right" style={{ color: 'var(--color-text)' }}>
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  
  // 默认列表布局
  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => {
        const label = getFieldLabel(system, key);
        return (
          <div key={key} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {label}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>
              {String(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DreamLayout({ data }: { data: Record<string, unknown> }) {
  const entries = data.entries as Array<Record<string, unknown>>;
  const firstEntry = entries[0];
  const dream: string = String((Array.isArray(data.keywords) ? data.keywords[0] : undefined) || firstEntry?.symbol || '');
  const symbols = entries.map(e => e.symbol).filter(Boolean);
  const emotion = data.emotion as string | undefined;
  const dreamTime = data.dreamTime as string | undefined;
  const clarity = data.clarity as string | undefined;
  return (
    <div className="mb-6">
      <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        {/* 装饰云 SVG */}
        <div className="absolute -top-3 -left-3 w-24 h-16 opacity-30" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <svg viewBox="0 0 96 64" fill="none">
            <ellipse cx="48" cy="40" rx="40" ry="20" fill="rgba(99, 102, 241, 0.3)" />
            <ellipse cx="32" cy="32" rx="24" ry="16" fill="rgba(99, 102, 241, 0.3)" />
            <ellipse cx="64" cy="36" rx="28" ry="18" fill="rgba(99, 102, 241, 0.3)" />
          </svg>
        </div>
        <div className="absolute top-10 right-16 w-16 h-12 opacity-20" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }}>
          <svg viewBox="0 0 64 48" fill="none">
            <ellipse cx="32" cy="28" rx="28" ry="16" fill="rgba(14, 165, 233, 0.3)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
              <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: '#818cf8', textShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}>梦境解析</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>潜意识密码 · 心理图谱</p>
          </div>
        </div>
        
        {/* 梦境标签信息 */}
        <div className="flex flex-wrap gap-2 mb-5">
          {dreamTime && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" 
              style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              做梦时间：{dreamTime}
            </span>
          )}
          {clarity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" 
              style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              清醒度：{clarity}
            </span>
          )}
          {emotion && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" 
              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              情绪：{emotion}
            </span>
          )}
        </div>
        
        {/* 梦境描述引用 */}
        {dream && (
          <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/>
                </svg>
              </div>
              <p className="text-sm italic leading-relaxed" style={{ color: '#c7d2fe' }}>
                "{String(dream).substring(0, 200)}"
              </p>
            </div>
          </div>
        )}
        
        {/* 核心元素解析网格 */}
        {symbols.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {symbols.slice(0, 6).map((s: unknown, i: number) => {
              const symbolColors = ['rgba(14, 165, 233, 0.2)', 'rgba(251, 191, 36, 0.2)', 'rgba(156, 163, 175, 0.2)', 'rgba(99, 102, 241, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(139, 92, 246, 0.2)'];
              return (
                <div 
                  key={i} 
                  className="p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ 
                    background: symbolColors[i % symbolColors.length],
                    border: '1px solid rgba(128, 128, 128, 0.25)',
                  }}
                >
                  <div className="text-lg mb-1">{String(s)}</div>
                  {entries[i]?.meaning ? (
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(entries[i].meaning).substring(0, 30)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
        
        {/* 综合解读卡片 */}
        {entries.length > 1 && Boolean(entries[0]?.interpretation) && (
          <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h5 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#a5b4fc' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              综合解读
            </h5>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {String(entries[0].interpretation).substring(0, 150)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 智能内容卡片组件 - 根据数据类型选择合适的展示样式
function SmartContentCard({ 
  data, 
  system 
}: { 
  data: Record<string, unknown>; 
  system: string;
}) {  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  // 检测是否为八字四柱数据
  const isBazi = system === 'bazi';
  const hasPillar = ['year', 'month', 'day', 'hour'].some(k => data[k] && typeof data[k] === 'object');
  const hasWuxing = entries.some(([k]) => ['wuxing', '五行', 'wuxing_strength'].includes(k));
  
  // 检测是否有命盘信息
  const isZiwei = system === 'ziwei';

  // 八字四柱布局
  if (isBazi && hasPillar) {
    const pillars = ['year', 'month', 'day', 'hour'];
    const pillarLabels = { year: { main: '年柱', sub: '祖上' }, month: { main: '月柱', sub: '父母' }, day: { main: '日柱', sub: '自身' }, hour: { main: '时柱', sub: '子女' } };
    const wuxingData: Record<string, number> = {};
    const wuxingStrength: Record<string, string> = {};
    ['金', '木', '水', '火', '土'].forEach(el => {
      const entry = entries.find(([k]) => k === el);
      if (entry) {
        wuxingData[el] = Number(entry[1]) || 0;
        const val = Number(entry[1]) || 0;
        wuxingStrength[el] = val > 20 ? '旺' : val > 15 ? '中' : '弱';
      }
    });
    const totalWuxing = Object.values(wuxingData).reduce((a, b) => a + b, 0);
    const aiInterpretation = data.aiInterpretation || data.解读 || '';
    const score = data.score as number | undefined;
    const mingGe = String(data.mingGe || data.命格 || '水火既济');
    const mingGeLevel = String(data.mingGeLevel || data.评级 || '中上命格');
    const analysisText = String(data.analysis || data.分析 || '');
    
    const wuxingColors: Record<string, { bg: string; gradient: string }> = {
      '金': { bg: 'rgba(200,168,78,0.1)', gradient: 'linear-gradient(90deg, #e8d48b, #c8a84e)' },
      '木': { bg: 'rgba(90,158,111,0.1)', gradient: 'linear-gradient(90deg, #7ab885, #5a9e6f)' },
      '水': { bg: 'rgba(0,75,170,0.15)', gradient: 'linear-gradient(90deg, #4a90d9, #004baa)' },
      '火': { bg: 'rgba(212,100,90,0.1)', gradient: 'linear-gradient(90deg, #e88078, #d4645a)' },
      '土': { bg: 'rgba(176,144,96,0.1)', gradient: 'linear-gradient(90deg, #c4a878, #b09060)' },
    };
    
    return (
      <div className="mb-6">
        {/* 八字头部卡片 - 设计稿样式 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.15) 0%, rgba(0, 20, 50, 0.3) 100%)',
          border: '1px solid rgba(200, 168, 78, 0.2)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="60" stroke="#c8a84e" strokeWidth="2" fill="none"/>
              <circle cx="64" cy="64" r="45" stroke="#c8a84e" strokeWidth="1" fill="none"/>
              <circle cx="64" cy="64" r="30" stroke="#c8a84e" strokeWidth="0.5" fill="none"/>
            </svg>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
                八字排盘
              </span>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                壬寅年 丙午月 壬午日 庚子时
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>公历 2026年7月10日 14:30 | 农历 六月十五 午时</p>
            </div>
            {/* 八字简盘预览 */}
            <div className="flex flex-col items-center p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)' }}>
              <div className="grid grid-cols-4 gap-1 text-center">
                {pillars.map((key) => {
                  const pillarData = data[key] as Record<string, string> | undefined;
                  const stem = pillarData?.stem || pillarData?.天干 || '—';
                  const isDay = key === 'day';
                  return (
                    <div key={key} className="p-2" style={isDay ? { background: 'rgba(200,168,78,0.1)', border: '1px solid #c8a84e', borderRadius: '6px' } : {}}>
                      <div className="text-lg font-bold" style={{ color: '#c8a84e' }}>{stem}</div>
                      <div className="text-xs" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>{pillarLabels[key as keyof typeof pillarLabels].main.replace('柱', '')}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>日主壬水 得令</div>
            </div>
          </div>
        </div>

        {/* 综合评分卡 - 设计稿样式 */}
        {score !== undefined && (() => {
          const dashOffset = Math.round(301.6 - (score / 100) * 301.6);
          return (
          <div className="mt-6 p-6 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="shrink-0 relative">
                <svg className="w-28 h-28" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="56" cy="56" r="48" fill="none" stroke="var(--color-border)" strokeWidth="6"/>
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#c8a84e" strokeWidth="6" strokeLinecap="round" strokeDasharray="301.6" strokeDashoffset={dashOffset} style={{ filter: 'drop-shadow(0 0 8px #c8a84e)' }}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{score}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>命格评分</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{mingGe} · {mingGeLevel}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>优+</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {analysisText || '壬水日主生于午月，火势旺盛而水火相济。命局中木火土金水五行俱全，日主得令有力，整体格局较为平衡。'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>{mingGe}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>身旺财旺</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>贵人扶助</span>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* 四柱详细分析 - 设计稿样式 */}
        <div className="mt-6 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a84e" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            四柱详细分析
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {pillars.map((key) => {
              const pillarData = data[key] as Record<string, string> | undefined;
              if (!pillarData) return null;
              const stem = pillarData.stem || pillarData.天干 || '—';
              const branch = pillarData.branch || pillarData.地支 || '—';
              const stemWuxing = pillarData.stemWuxing || pillarData.天干五行 || '';
              const branchWuxing = pillarData.branchWuxing || pillarData.地支五行 || '';
              const naying = pillarData.naying || pillarData.纳音 || '';
              const zodiac = pillarData.zodiac || pillarData.属相 || '';
              const isDay = key === 'day';
              return (
                <div key={key} className="text-center p-4 rounded-lg relative" style={{ 
                  background: isDay ? 'linear-gradient(180deg, rgba(200,168,78,0.2) 0%, rgba(200,168,78,0.05) 100%)' : 'linear-gradient(180deg, rgba(200,168,78,0.1) 0%, transparent 100%)',
                  border: isDay ? '2px solid #c8a84e' : '1px solid rgba(200,168,78,0.2)',
                  boxShadow: isDay ? '0 0 20px rgba(200,168,78,0.15)' : 'none'
                }}>
                  {isDay && <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px]" style={{ background: '#c8a84e', color: '#0a0e1a' }}>日主</div>}
                  <div className="text-xs mb-2 mt-1" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>
                    {pillarLabels[key as keyof typeof pillarLabels].main} · {pillarLabels[key as keyof typeof pillarLabels].sub}
                  </div>
                  <div className="flex justify-center gap-4 mb-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{stem}</div>
                      <div className="text-[10px]" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>天干 · {stemWuxing}</div>
                    </div>
                    <div className="w-px" style={{ background: isDay ? '#c8a84e' : 'var(--color-border)' }}></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: '#c8a84e', fontFamily: 'var(--font-display)' }}>{branch}</div>
                      <div className="text-[10px]" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-tertiary)' }}>地支 · {branchWuxing}</div>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: isDay ? '#c8a84e' : 'var(--color-text-secondary)' }}>纳音{isDay ? '' : ''}{naying} · {zodiac}</div>
                </div>
              );
            })}
          </div>
          {/* 地支藏干 */}
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>地支藏干</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>子</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏癸</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>寅</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏甲丙戊</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>午</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏丁己</span></div>
              <div className="flex items-center gap-2"><span className="text-sm" style={{ color: '#c8a84e' }}>子</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>藏癸</span></div>
            </div>
          </div>
        </div>

        {/* 五行力量分布 - 设计稿样式 */}
        {totalWuxing > 0 && Object.keys(wuxingData).length > 0 && (
          <div className="mt-6 p-6 md:p-8 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--color-text)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              五行力量分布
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(wuxingData).map(([el, val]) => {
                const strength = wuxingStrength[el] || '中';
                const isStrong = el === '水';
                const colors = wuxingColors[el] || { bg: 'var(--color-bg-inset)', gradient: '#888' };
                return (
                  <div key={el} className="text-center p-3 rounded-lg" style={{ 
                    background: colors.bg,
                    border: isStrong ? '1px solid var(--color-primary)' : 'none'
                  }}>
                    <div className="text-2xl mb-1" style={{ color: isStrong ? 'var(--color-primary-lighter)' : colors.gradient.includes('e8d48b') ? '#e8d48b' : colors.gradient.includes('7ab885') ? '#5a9e6f' : colors.gradient.includes('e88078') ? '#d4645a' : colors.gradient.includes('c4a878') ? '#b09060' : '#888' }}>{el}</div>
                    <div className="h-2 rounded-full mb-2" style={{ background: 'var(--color-border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: colors.gradient }}></div>
                    </div>
                    <div className="text-xs" style={{ color: isStrong ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: isStrong ? 600 : 400 }}>{strength} {val}%</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'var(--color-bg-inset)', color: 'var(--color-text-secondary)' }}>
              <span style={{ color: 'var(--color-primary)' }}>命理分析：</span>
              {analysisText || '日主壬水得令，水势旺盛。午月火旺，水火相济成格。命局中金水为喜用，木火土为忌神。宜补水金，忌火土。'}
            </div>
          </div>
        )}

        {/* AI 解读预览 - 设计稿样式 */}
        {aiInterpretation && (
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-inset)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a84e" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#a88a3a' }}>AI 深度解读</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {typeof aiInterpretation === 'string' ? aiInterpretation : JSON.stringify(aiInterpretation)}
            </p>
          </div>
        )}

        {/* 五行分布详细 */}
        {hasWuxing && (
          <div className="mt-4 p-5 rounded-xl" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20" />
              </svg>
              <h4 className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>五行详细分析</h4>
            </div>
            <div className="space-y-3">
              {entries.filter(([k]) => ['金', '木', '水', '火', '土'].includes(k)).map(([key, value]) => (
                <WuxingBar 
                  key={key} 
                  element={key} 
                  percentage={Number(value) || 0} 
                  strength={Number(value) > 20 ? '旺' : Number(value) > 15 ? '平' : '弱'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 紫微斗数布局
  const hasMingGong = data.mingGong || data.命宫;
  const hasTwelvePalaces = data.twelvePalaces || data.十二宫位;
  if (isZiwei && (hasMingGong || hasTwelvePalaces)) {
    const mg = (data.mingGong || data.命宫 || {}) as Record<string, unknown>;
    const palaces = data.twelvePalaces || data.十二宫位;
    const palaceList = Array.isArray(palaces) ? (palaces as Array<Record<string, unknown>>) : [];
    return (
      <div className="mb-6">
        {/* 紫微斗数头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(167, 139, 250, 0.04) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(167, 139, 250, 0.4)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>紫微斗数</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>星曜布局 · 命宫分析</p>
            </div>
          </div>
          
          {/* 命宫信息 */}
          {Boolean(mg.mainStar || mg.stars) && (
            <div className="relative z-10 p-4 rounded-xl mb-5" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: '#c4b5fd' }}>命宫主星</span>
              </div>
              <div className="text-xl font-bold" style={{ color: '#a78bfa' }}>
                {String(mg.mainStar || mg.stars || '—')}
              </div>
            </div>
          )}
          
          {/* 十二宫位网格 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              十二宫位
            </div>
            {palaceList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {palaceList.slice(0, 12).map((palace, idx) => {
                  const palaceName = palace.palace || palace.宫位 || `宫位${idx + 1}`;
                  const mainStar = palace.mainStar || palace.主星 || '—';
                  const stars = palace.stars || palace.星曜 || '';
                  const colors = ['#a78bfa', '#c4b5fd', '#818cf8', '#a855f7', '#8b5cf6', '#7c3aed'];
                  const bgColors = ['rgba(167, 139, 250, 0.15)', 'rgba(196, 181, 253, 0.1)', 'rgba(129, 140, 248, 0.15)', 'rgba(168, 85, 247, 0.15)', 'rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.15)'];
                  return (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ 
                        background: bgColors[idx % bgColors.length],
                        border: '1px solid rgba(128, 128, 128, 0.18)'
                      }}
                    >
                      <div className="text-xs mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {String(palaceName)}
                      </div>
                      <div className="text-sm font-bold truncate mb-1" style={{ color: colors[idx % colors.length] }}>
                        {String(mainStar)}
                      </div>
                      {stars && typeof stars === 'string' && (
                        <div className="text-[10px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                          {stars.substring(0, 15)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['命宫', '身宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '仆役宫', '官禄宫', '田宅宫', '福德宫'].map((palace, idx) => {
                  const value = data[palace];
                  const colors = ['#a78bfa', '#c4b5fd', '#818cf8', '#a855f7', '#8b5cf6', '#7c3aed'];
                  const bgColors = ['rgba(167, 139, 250, 0.15)', 'rgba(196, 181, 253, 0.1)', 'rgba(129, 140, 248, 0.15)', 'rgba(168, 85, 247, 0.15)'];
                  return (
                    <div 
                      key={palace}
                      className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1"
                      style={{ 
                        background: bgColors[idx % bgColors.length],
                        border: '1px solid rgba(128, 128, 128, 0.18)'
                      }}
                    >
                      <div className="text-xs mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {palace}
                      </div>
                      <div className="text-sm font-bold truncate" style={{ color: colors[idx % colors.length] }}>
                        {value ? String(value).split('、')[0] : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== 塔罗牌布局 ====================
  if (Array.isArray(data.cards) && data.cards.length) {
    const cards = data.cards as Array<Record<string, unknown>>;
    const spreadType = data.spreadType || data.牌阵 || '三牌阵';
    const readingDate = data.date || data.日期 || new Date().toLocaleDateString('zh-CN');
    const card1 = cards[0] as Record<string, unknown>;
    const card2 = cards[1] as Record<string, unknown>;
    const card3 = cards[2] as Record<string, unknown>;
    const cardPositions = [
      { key: '过去', icon: 'hourglass-start', color: 'amber', card: card1 },
      { key: '现在', icon: 'hourglass-half', color: 'purple', card: card2 },
      { key: '未来', icon: 'hourglass-end', color: 'cyan', card: card3 },
    ];
    return (
      <div className="mb-6">
        {/* 塔罗牌头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 24, 32, 0.8) 50%, rgba(120, 53, 15, 0.15) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #f59e0b 100%)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>塔罗牌解读</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>维特塔罗 · 经典牌阵</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
              {String(spreadType)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {String(readingDate)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              解读完成
            </span>
          </div>
        </div>

        {/* 牌阵展示区 */}
        <div className="p-6 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 10h20"/>
            </svg>
            牌阵布局
          </h3>
          
          {/* 三牌阵可视化 */}
          <div className="flex justify-center gap-4 mb-6 py-4">
            {cardPositions.map((pos, idx) => (
              <div 
                key={idx}
                className="w-28 h-40 rounded-xl p-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
                style={{ 
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  border: idx === 1 ? '2px solid #8b5cf6' : '2px solid #8b5cf6',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                  zIndex: idx === 1 ? 10 : 5 - idx
                }}
              >
                <div className="text-center mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={idx === 0 ? '#fbbf24' : idx === 1 ? '#fbbf24' : '#22d3ee'} strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d={idx === 0 ? "M12 6v6l4 2" : idx === 1 ? "M12 2v4M12 18v4M4.93 4.93l2.83 2.83" : "M12 18v4l4-2"}/>
                  </svg>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{pos.key}</p>
                </div>
                <div className="flex-1 rounded-lg flex items-center justify-center p-1" style={{ 
                  background: idx === 0 ? 'linear-gradient(180deg, rgba(180, 83, 9, 0.3), rgba(120, 53, 15, 0.3))' :
                               idx === 1 ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.3), rgba(88, 28, 135, 0.3))' :
                               'linear-gradient(180deg, rgba(22, 100, 100, 0.3), rgba(21, 94, 117, 0.3))'
                }}>
                  <div className="text-center">
                    <p className="text-[10px] font-bold" style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#a78bfa' : '#22d3ee' }}>
                      {String(pos.card?.name || pos.card?.cardName || '待解读')}
                    </p>
                    <p className="text-[9px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(pos.card?.cnName || pos.card?.chineseName || '')}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-center">
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ 
                    background: 'rgba(139, 92, 246, 0.2)', 
                    color: pos.card?.isReversed ? '#fbbf24' : '#a78bfa'
                  }}>
                    {pos.card?.isReversed ? '逆位' : '正位'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 牌义解读 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cardPositions.map((pos, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(245, 158, 11, 0.03))',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                <h4 className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: idx === 0 ? '#fbbf24' : idx === 1 ? '#a78bfa' : '#22d3ee' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {idx === 0 ? <path d="M12 6v6l4 2"/> : idx === 1 ? <circle cx="12" cy="12" r="10"/> : <path d="M12 18v4l4-2"/>}
                  </svg>
                  {pos.key} · {String(pos.card?.name || '待解读')}
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {String(pos.card?.uprightMeaning || pos.card?.meaning || pos.card?.interpretation || '').substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==================== 手相布局 ====================
  const linesObj = (data.lines ?? {}) as Record<string, { description?: string; length?: string; status?: string }>;
  if (linesObj.life || linesObj.heart || linesObj.mind || data.handType) {
    const lines = linesObj;
    const handType = data.handType as string | undefined;
    const gender = data.gender as string | undefined;
    const overallAnalysis = data.overallAnalysis as { love?: number; career?: number; health?: number } | undefined;
    
    const lineConfigs = [
      { key: 'life', name: '生命线', color: '#ef4444', desc: lines?.life?.description || '', status: lines?.life?.status },
      { key: 'heart', name: '感情线', color: '#ec4899', desc: lines?.heart?.description || '', status: lines?.heart?.status },
      { key: 'mind', name: '智慧线', color: '#3b82f6', desc: lines?.mind?.description || '', status: lines?.mind?.status },
      { key: 'fate', name: '命运线', color: '#8b5cf6', desc: lines?.fate?.description || '', status: lines?.fate?.status },
    ];
    
    return (
      <div className="mb-6">
        {/* 手相头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0"/>
                <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
                <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>手相算命</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>掌纹分析 · 手型解读</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {handType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
                </svg>
                手型：{handType}
              </span>
            )}
            {gender && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                性别：{gender}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              分析完成
            </span>
          </div>
        </div>

        {/* 掌纹可视化 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            掌纹示意
          </h3>
          
          {/* SVG掌纹图 */}
          <div className="flex justify-center mb-5">
            <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-4">
              <svg width="180" height="220" viewBox="0 0 180 220">
                {/* 手掌轮廓 */}
                <path d="M50 180 Q30 160 35 130 Q38 100 45 80 L50 60 Q52 50 58 48 L68 48 L68 30 Q70 20 78 20 L82 20 Q90 20 92 30 L92 48 L102 48 L102 30 Q104 20 112 20 L116 20 Q124 20 126 30 L126 48 L136 48 L136 30 Q138 20 146 20 L150 20 Q158 20 160 30 L160 48 L155 55 Q160 50 165 55 L165 90 Q168 130 160 160 Q155 180 140 195 L90 215 L40 195 Q25 180 20 160 Q12 130 15 90 L10 55 Q15 50 20 55 L25 48 L25 30 Q27 20 35 20 L39 20 Q47 20 49 30 L49 48 L50 55 Q50 45 55 48 L55 80 Q58 100 55 130 Q52 160 50 180 Z" 
                  fill="rgba(251,191,36,0.3)" stroke="#92400e" strokeWidth="1"/>
                {/* 生命线 */}
                <path d="M55 200 Q35 150 40 100 Q50 60 80 40" 
                  fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}/>
                {/* 感情线 */}
                <path d="M30 70 Q80 85 150 65 Q165 60 170 55" 
                  fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ec4899)' }}/>
                {/* 智慧线 */}
                <path d="M45 110 Q90 100 150 105 Q165 108 175 115" 
                  fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}/>
                {/* 命运线 */}
                <path d="M100 230 L105 100 Q110 70 115 50" 
                  fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #8b5cf6)' }}/>
              </svg>
              
              {/* 图例 */}
              <div className="absolute top-2 left-2 bg-slate-900/80 rounded-lg p-2 text-[10px]">
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-red-500 rounded"></span><span className="text-gray-300">生命线</span></div>
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-pink-500 rounded"></span><span className="text-gray-300">感情线</span></div>
                <div className="flex items-center gap-1.5 mb-1"><span className="w-3 h-0.5 bg-blue-500 rounded"></span><span className="text-gray-300">智慧线</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 rounded"></span><span className="text-gray-300">命运线</span></div>
              </div>
            </div>
          </div>
          
          {/* 掌纹分析卡片 */}
          <div className="grid grid-cols-2 gap-3">
            {lineConfigs.slice(0, 4).map((line) => (
              <div 
                key={line.key}
                className="p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  background: `linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.03))`,
                  border: '1px solid rgba(128, 128, 128, 0.25)'
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3 h-0.5 rounded" style={{ background: line.color }}></span>
                  <span className="text-xs font-medium" style={{ color: line.color }}>{line.name}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {line.desc.substring(0, 60) || '暂无分析'}
                </p>
                {line.status && (
                  <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded" style={{ 
                    background: 'rgba(128, 128, 128, 0.12)', 
                    color: line.color
                  }}>
                    {line.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 综合评分 */}
        {overallAnalysis && (
          <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              综合评分
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: '感情', value: overallAnalysis.love, color: '#ec4899', icon: '❤️' },
                { key: '事业', value: overallAnalysis.career, color: '#3b82f6', icon: '💼' },
                { key: '健康', value: overallAnalysis.health, color: '#22c55e', icon: '💪' },
              ].map((item) => (
                <div 
                  key={item.key}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(128, 128, 128, 0.06)', border: '1px solid rgba(128, 128, 128, 0.18)' }}
                >
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.key}运势</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 铁板神数布局 ====================
  if (data.mainCode !== undefined || data.mainNumber) {
    const mainCode = typeof data.mainNumber === 'object' && data.mainNumber !== null
      ? String((data.mainNumber as Record<string, unknown>).mainNumber ?? '')
      : String(data.mainCode ?? '');
    const subNums = Array.isArray(data.subNumbers) ? data.subNumbers as Array<Record<string, unknown>> : [];
    const categories = ['一生命运', '事业发展', '感情婚姻', '健康状况'];
    const fortunes = [
      data.lifeFortune,
      data.careerFortune,
      data.loveFortune,
      data.healthFortune,
    ];
    return (
      <div className="mb-6">
        {/* 铁板神数头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <path d="M4 12h16M12 4v16" />
                  <circle cx="8" cy="8" r="1.5" fill="white" />
                  <circle cx="16" cy="16" r="1.5" fill="white" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#a855f7', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>铁板神数</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>数术命理 · 铁口直断</p>
              </div>
            </div>
            {mainCode && (
              <div className="text-center px-5 py-3 rounded-xl" style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div className="text-3xl font-bold" style={{ color: '#a855f7', textShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}>{String(mainCode)}</div>
                <div className="text-xs" style={{ color: '#c4b5fd' }}>主码</div>
              </div>
            )}
          </div>
          
          {/* 附数展示 */}
          {subNums.length > 0 && (
            <div className="relative z-10 flex justify-center gap-4 mb-6">
              {subNums.slice(0, 3).map((sub, i) => (
                <div key={i} className="text-center px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                  style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#c084fc' }}>{String(sub.number || sub.mainNumber)}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>附数{i + 1}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* 四宫预测 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
              四宫预测
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <div key={cat} className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                  <div className="text-xs mb-2 flex items-center gap-1.5" style={{ color: '#c4b5fd' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(168, 85, 247, 0.3)' }}>{i + 1}</span>
                    {cat}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {String(fortunes[i] || '').substring(0, 60)}{fortunes[i] && String(fortunes[i]).length > 60 ? '…' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 大六壬布局 ====================
  if (data.chuan || data.diPan || data.shen) {
    const chuan = Array.isArray(data.chuan) ? data.chuan as Array<Record<string, unknown>> : [];
    const liuShen = data.liuShen as Record<string, string> | undefined;
    const siKe = Array.isArray(data.siKe) ? data.siKe as Array<Record<string, unknown>> : [];
    const monthJiang = data.monthJiang as string | undefined;
    
    return (
      <div className="mb-6">
        {/* 大六壬头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                  <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>六壬神课</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>三传四课 · 壬学经典</p>
              </div>
            </div>
            {monthJiang && (
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                {String(monthJiang)}
              </span>
            )}
          </div>
          
          {/* 四课展示 */}
          {siKe.length > 0 && (
            <div className="relative z-10 mb-5">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                四课
              </div>
              <div className="grid grid-cols-2 gap-2">
                {siKe.map((k, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>第{i + 1}课</span>
                      <span className="text-sm font-bold" style={{ color: '#fcd34d' }}>
                        {String(k.gan || '')}{String(k.zhi || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 六神展示 */}
          {liuShen ? (
            <div className="relative z-10 mb-5">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
                六神
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(liuShen).map(([shen, zhi], idx) => {
                  const shenColors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#fcd34d', '#fde68a'];
                  return (
                    <div key={shen} className="flex items-center gap-2 p-2 rounded-xl transition-all duration-300 hover:-translate-y-1" 
                      style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(128, 128, 128, 0.18)' }}>
                      <span className="text-xs font-bold" style={{ color: shenColors[idx % shenColors.length] }}>{shen}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{zhi}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          
          {/* 三传展示 */}
          {chuan.length > 0 && (
            <div className="relative z-10">
              <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#fcd34d' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                三传
              </div>
              <div className="space-y-2">
                {chuan.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300" 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(251, 191, 36, 0.2)'
                    }}>
                    <span className="shrink-0 text-xs px-3 py-1.5 rounded-full font-medium" 
                      style={{ background: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24' }}>
                      {String(c.chuan || ['初传', '中传', '末传'][i])}
                    </span>
                    <span className="text-lg font-bold" style={{ color: '#fcd34d' }}>
                      {String(c.gan)}{String(c.zhi)}
                    </span>
                    {c.shen ? (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
                        {String(c.shen)}
                      </span>
                    ) : null}
                    <span className="text-xs flex-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(c.description || '').substring(0, 50)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 星座布局 ====================
  if (system === 'zodiac') {
    const signData = data.sign || data;
    const signObj = typeof signData === 'object' && signData !== null ? signData as Record<string, unknown> : null;
    const sign = signObj ? String(signObj.name || signObj.星座 || signObj.zodiacSign || '') : String(signData || '');
    const element = signObj ? String(signObj.element || signObj.元素 || data.element || '') : String(data.element || '');
    const rulingPlanet = signObj ? String(signObj.rulingPlanet || signObj.守护星 || '') : String(data.rulingPlanet || data.守护星 || '');
    const traits = signObj?.traits as string[] | undefined || data.traits as string[] | undefined;
    const loveScore = Number(signObj?.loveScore ?? data.loveScore ?? data.爱情 ?? 0);
    const careerScore = Number(signObj?.careerScore ?? data.careerScore ?? data.事业 ?? 0);
    const wealthScore = Number(signObj?.wealthScore ?? data.wealthScore ?? data.财富 ?? 0);
    const healthScore = Number(signObj?.healthScore ?? data.healthScore ?? data.健康 ?? 0);
    const overallScore = Number(signObj?.overallScore ?? data.overallScore ?? data.综合 ?? 0);
    
    if (sign) {
      const elementColors: Record<string, string> = { 火: '#ef4444', 土: '#c4a878', 风: '#3b82f6', 水: '#06b6d4' };
      const elementColor = element ? elementColors[element] || '#8b5cf6' : '#8b5cf6';
      return (
        <div className="mb-6">
          {/* 星座头部卡片 */}
          <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)'
            }}></div>
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ 
                background: `linear-gradient(135deg, #8b5cf6 0%, ${elementColor} 100%)`,
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a10 10 0 0 0 0 20"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>{sign}</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                    {element}象星座
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {rulingPlanet && (
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/>
                      </svg>
                      守护星：{rulingPlanet}
                    </span>
                  )}
                  {signObj?.dateRange ? (
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                      {String(signObj.dateRange)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* 特质标签 */}
            {traits && traits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {traits.slice(0, 5).map((trait: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs" style={{ 
                    background: 'rgba(139, 92, 246, 0.15)', 
                    color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 五维运势 */}
          <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              五维运势分析
            </h3>
            <div className="space-y-3">
              {[
                { key: '综合运势', value: overallScore, icon: '☀️', color: '#f43f5e' },
                { key: '爱情运势', value: loveScore, icon: '💕', color: '#f97316' },
                { key: '事业运势', value: careerScore, icon: '💼', color: '#22c55e' },
                { key: '财富运势', value: wealthScore, icon: '💰', color: '#eab308' },
                { key: '健康运势', value: healthScore, icon: '🏥', color: '#06b6d4' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{item.icon}</span>
                  <span className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-secondary)' }}>{item.key}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(100, 116, 139, 0.3)' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(20, Math.min(100, item.value))}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right" style={{ color: item.color }}>{item.value}分</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  // ==================== 梦境解析布局 ====================
  if (Array.isArray(data.entries) && data.entries.length) {
    return <DreamLayout data={data} />;
  }

  // ==================== 六爻布局 ====================
  if (data.originalGua && typeof data.originalGua === 'object' && 'name' in (data.originalGua as object)) {
    const originalGua = data.originalGua as Record<string, unknown>;
    const changedGua = data.changedGua as Record<string, unknown> | undefined;
    const question = data.question as string | undefined;
    const yaoLines = data.yaoLines as Array<{ position: number; line: string; meaning: string }> | undefined;
    const shiYing = data.shiYing as Record<string, unknown> | undefined;
    const liuQin = data.liuQin as Record<string, string> | undefined;
    const guaName = String(originalGua.name || '');
    const guaSymbol = String(originalGua.symbol || '');
    const upperGua = originalGua.upperGua as string || '上卦';
    const lowerGua = originalGua.lowerGua as string || '下卦';
    
    return (
      <div className="mb-6">
        {/* 六爻头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(5, 150, 105, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            {/* 卦象符号 */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                <rect x="10" y="8" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="18" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="28" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="38" width="40" height="7" rx="2" fill="white"/>
                <rect x="10" y="48" width="40" height="7" rx="2" fill="white"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>六爻卦象</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>梅花易数 · 变化之道</p>
            </div>
          </div>
          
          {/* 卦名和结构 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: '#10b981' }}>{guaName}</span>
              <span className="text-2xl" style={{ color: 'rgba(16, 185, 129, 0.6)' }}>{guaSymbol}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              {upperGua} · {lowerGua}
            </span>
            {question && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(0, 0, 0, 0.2)', color: 'var(--color-text-secondary)' }}>
                问：{String(question).substring(0, 20)}
              </span>
            )}
            {changedGua && typeof changedGua === 'object' && 'name' in changedGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                变卦：{String(changedGua.name)}
              </span>
            ) : null}
          </div>
        </div>

        {/* 卦象结构 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
            </svg>
            卦象结构
          </h3>
          
          <div className="flex justify-center gap-8 mb-4">
            {/* 上卦 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="text-2xl font-bold" style={{ color: '#10b981' }}>{String(originalGua.upperTrigram || '☰').charAt(0)}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>上卦：{upperGua}</span>
            </div>
            {/* 卦名 */}
            <div className="flex items-center">
              <span className="text-4xl font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>{guaSymbol}</span>
            </div>
            {/* 下卦 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-2" style={{ background: 'rgba(5, 150, 105, 0.15)', border: '2px solid rgba(5, 150, 105, 0.3)' }}>
                <span className="text-2xl font-bold" style={{ color: '#059669' }}>{String(originalGua.lowerTrigram || '☰').charAt(0)}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>下卦：{lowerGua}</span>
            </div>
          </div>
          
          {/* 六爻线条 */}
          {yaoLines && yaoLines.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>六爻解读</p>
              {yaoLines.slice(0, 6).map((yao, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                    {yao.position}
                  </span>
                  <span className="text-sm" style={{ color: yao.line === '阳' ? '#fbbf24' : '#a3a3a3' }}>
                    {yao.line === '阳' ? '━━' : '━ ━'}
                  </span>
                  <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {yao.meaning || '爻辞解读...'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 世应分析 & 六亲 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 世应 */}
          {shiYing && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#10b981' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                世应分析
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>世爻</span>
                  <span className="text-xs font-medium" style={{ color: '#10b981' }}>{String(shiYing.shi || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>应爻</span>
                  <span className="text-xs font-medium" style={{ color: '#f43f5e' }}>{String(shiYing.ying || '')}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* 六亲 */}
          {liuQin && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#fbbf24' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                </svg>
                六亲对应
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(liuQin).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <div className="text-xs font-medium" style={{ color: '#fbbf24' }}>{value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 梅花易数布局 ====================
  if (data.mainGua && typeof data.mainGua === 'object' && 'name' in (data.mainGua as object)) {
    const mainGua = data.mainGua as Record<string, unknown>;
    const huGua = data.huGua as Record<string, unknown> | undefined;
    const bianGua = data.bianGua as Record<string, unknown> | undefined;
    const tiYong = data.tiYong as Record<string, unknown> | undefined;
    const liuQin = data.liuQin as Record<string, string> | undefined;
    const wuxingRelations = data.wuxingRelations as Record<string, string[]> | undefined;
    const guaName = String(mainGua.name || '');
    const guaSymbol = String(mainGua.symbol || '');
    
    return (
      <div className="mb-6">
        {/* 梅花头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-emerald-500 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
                <path d="M12 12l9-4.5M12 12v9M12 12L3 7.5"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#ec4899', textShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>梅花易数</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>本卦 · 互卦 · 变卦</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.4)' }}>
              本卦：{guaName}
            </span>
            {huGua && typeof huGua === 'object' && 'name' in huGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                互卦：{String(huGua.name)}
              </span>
            ) : null}
            {bianGua && typeof bianGua === 'object' && 'name' in bianGua ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                变卦：{String(bianGua.name)}
              </span>
            ) : null}
          </div>
        </div>

        {/* 三卦展示 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
              <path d="M12 3l-9 4.5v9L12 21l9-4.5v-9L12 3z"/>
            </svg>
            三卦演变
          </h3>
          
          <div className="flex justify-center gap-4 mb-4">
            {/* 本卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))', border: '2px solid rgba(236, 72, 153, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#ec4899' }}>本卦</span>
                <span className="text-2xl font-bold" style={{ color: '#f472b6' }}>{guaSymbol}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#ec4899' }}>{guaName}</span>
            </div>
            
            {/* 箭头 */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            
            {/* 互卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))', border: '2px solid rgba(139, 92, 246, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#a78bfa' }}>互卦</span>
                <span className="text-2xl font-bold" style={{ color: '#c4b5fd' }}>{String(huGua?.symbol || '☰')}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>{String(huGua?.name || '互卦')}</span>
            </div>
            
            {/* 箭头 */}
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            
            {/* 变卦 */}
            <div className="text-center">
              <div className="w-24 h-28 rounded-xl flex flex-col items-center justify-center p-2 mb-2 transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
                <span className="text-lg font-bold mb-1" style={{ color: '#10b981' }}>变卦</span>
                <span className="text-2xl font-bold" style={{ color: '#34d399' }}>{String(bianGua?.symbol || '☰')}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: '#10b981' }}>{String(bianGua?.name || '变卦')}</span>
            </div>
          </div>
        </div>

        {/* 体用分析 & 六亲 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiYong && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#ec4899' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
                体用分析
              </h4>
              <div className="flex gap-4">
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>体</span>
                  <p className="text-lg font-bold" style={{ color: '#ec4899' }}>{String(tiYong.ti || '')}</p>
                </div>
                <div className="flex items-center">
                  <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
                </div>
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>用</span>
                  <p className="text-lg font-bold" style={{ color: '#10b981' }}>{String(tiYong.yong || '')}</p>
                </div>
              </div>
            </div>
          )}
          
          {liuQin && (
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#fbbf24' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                </svg>
                六亲关系
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(liuQin).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    <div className="text-xs font-medium" style={{ color: '#fbbf24' }}>{value}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 五行生克 */}
        {wuxingRelations && (
          <div className="p-4 rounded-xl mt-4" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#a78bfa' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
              五行生克
            </h4>
            <div className="space-y-2">
              {Object.entries(wuxingRelations).map(([relation, items]) => (
                <div key={relation} className="flex items-center gap-2">
                  <span className="text-xs w-12 shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{relation}</span>
                  <div className="flex flex-wrap gap-1">
                    {(items as string[]).map((item, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 奇门遁甲布局 ====================
  if (data.juShu || data.tianPan) {
    const juShu = data.juShu as string | undefined;
    const tianPan = data.tianPan as Record<string, string> | undefined;
    const diPan = data.diPan as Record<string, string> | undefined;
    const baMen = data.baMen as Record<string, string> | undefined;
    const nineStars = tianPan ? Object.entries(tianPan) : [];
    const diPanStars = diPan ? Object.entries(diPan) : [];
    
    return (
      <div className="mb-6">
        {/* 奇门遁甲头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.2)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, transparent 70%)' }} />
          
          {/* 头部信息 */}
          <div className="relative z-10 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(167, 139, 250, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>奇门遁甲</h4>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>九宫八卦 · 时空密码</p>
              </div>
            </div>
            {juShu && (
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
                {juShu}
              </span>
            )}
          </div>
          
          {/* 九宫格 */}
          <div className="relative z-10">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: '#c4b5fd' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              九宫天盘
            </div>
            {nineStars.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {nineStars.map(([gong, xing], idx) => {
                  const colors = ['#a78bfa', '#c4b5fd', '#8b5cf6'];
                  return (
                    <div key={gong} className="p-3 rounded-xl text-center transition-all duration-300 hover:-translate-y-1" 
                      style={{ 
                        background: idx < 5 ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(128, 128, 128, 0.25)'
                      }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{gong}</div>
                      <div className="text-sm font-bold" style={{ color: colors[idx % colors.length] }}>{xing}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {['蓬', '任', '冲', '辅', '英', '芮', '柱', '心', '禽'].map((gong, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(167, 139, 250, 0.2)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                    <div className="text-lg font-bold" style={{ color: '#a78bfa' }}>{gong}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/*地盘和八门 */}
          {(diPanStars.length > 0 || baMen) && (
            <div className="relative z-10 mt-4 grid grid-cols-2 gap-4">
              {diPanStars.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: '#c4b5fd' }}>地盘</div>
                  <div className="grid grid-cols-3 gap-1">
                    {diPanStars.slice(0, 9).map(([gong, xing]) => (
                      <div key={gong} className="text-center p-1.5 rounded" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{gong}</div>
                        <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>{xing}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {baMen && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: '#c4b5fd' }}>八门</div>
                  <div className="grid grid-cols-4 gap-1">
                    {Object.entries(baMen).map(([men, pos]) => (
                      <div key={men} className="text-center p-1.5 rounded" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{men}</div>
                        <div className="text-xs font-bold" style={{ color: '#a78bfa' }}>{pos}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 风水布局 ====================
  if (data.direction) {
    const location = data.direction as string;
    const flyingStars = data.flyingStars as Record<string, { number: number; element: string; status: string }> | undefined;
    const auspicious = data.auspiciousLocations as string[] | undefined;
    const caution = data.cautionLocations as string[] | undefined;
    const suggestions = data.suggestions as string[] | undefined;
    
    const gridNumbers = flyingStars || {
      '西北': { number: 6, element: '金', status: '吉' },
      '西': { number: 7, element: '金', status: '平' },
      '东北': { number: 8, element: '土', status: '吉' },
      '南': { number: 9, element: '火', status: '吉' },
      '中': { number: 5, element: '土', status: '需注意' },
      '北': { number: 1, element: '水', status: '平' },
      '东南': { number: 4, element: '木', status: '平' },
      '东': { number: 3, element: '木', status: '平' },
      '西南': { number: 2, element: '土', status: '需注意' },
    };
    
    const elementColors: Record<string, string> = { '金': '#fbbf24', '木': '#22c55e', '水': '#3b82f6', '火': '#ef4444', '土': '#a3a3a3' };
    const statusColors: Record<string, string> = { '吉': '#22c55e', '平': '#6b7280', '需注意': '#f43f5e' };
    const positions = ['西北', '西', '东北', '南', '中', '北', '东南', '东', '西南'];
    
    return (
      <div className="mb-6">
        {/* 风水头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v20M2 12h20"/>
                <path d="M12 6l-4 4M12 6l4 4M12 18l-4-4M12 18l4-4"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#10b981', textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>风水罗盘</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>九宫飞星 · 环境能量</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              </svg>
              位置：{location}
            </span>
            {auspicious && auspicious.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                吉位：{auspicious[0]}
              </span>
            )}
          </div>
        </div>

        {/* 九宫飞星 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            九宫飞星
          </h3>
          
          {/* 3×3 网格 */}
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {[6, 7, 8, 9, 5, 1, 4, 3, 2].map((num, idx) => {
              const dir = positions[idx];
              const info = gridNumbers[dir] || { number: num, element: '土', status: '平' };
              const elemColor = elementColors[info.element] || '#6b7280';
              const statColor = statusColors[info.status] || '#6b7280';
              
              return (
                <div 
                  key={idx}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-200 hover:scale-105"
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(128, 128, 128, 0.25)'
                  }}
                >
                  <span className="text-lg font-bold" style={{ color: elemColor }}>{info.number}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{info.element}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full mt-1" style={{ background: 'rgba(128, 128, 128, 0.12)', color: statColor }}>
                    {info.status}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* 方位标签 */}
          <div className="flex justify-between max-w-sm mx-auto mt-2 px-1">
            <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>北←</span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>→南</span>
          </div>
        </div>

        {/* 风水诊断 */}
        <div className="space-y-3">
          {auspicious && auspicious.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#22c55e' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                吉利方位
              </h4>
              <div className="flex flex-wrap gap-2">
                {auspicious.map((loc, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {caution && caution.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#f43f5e' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                需注意
              </h4>
              <div className="flex flex-wrap gap-2">
                {caution.map((loc, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#fda4af' }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#10b981' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                改善建议
              </h4>
              <ul className="space-y-1">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: '#10b981' }}>•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 数字能量布局 ====================
  if (data.lifePathNumber !== undefined) {
    const lifePath = data.lifePathNumber as number;
    const birthdayNumber = data.birthdayNumber as number | undefined;
    const personalYear = data.personalYear as number | undefined;
    const expressionNumber = data.expressionNumber as number | undefined;
    const soulNumber = data.soulNumber as number | undefined;
    const personalityTraits = data.personalityTraits as string[] | undefined;
    const calculationSteps = data.calculationSteps as string[] | undefined;
    const interpretation = data.interpretation as Record<string, string> | undefined;
    const annualNumber = data.annualNumber as number | undefined;
    
    const vibrationFrequency = data.vibrationFrequency as string | undefined;
    
    return (
      <div className="mb-6 max-w-[1280px] mx-auto">
        {/* 区域1：头部 - 生命灵数+生日+振动频率 */}
        <div className="p-6 rounded-2xl relative overflow-hidden mb-4" style={{ 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)'
        }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ 
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
            transform: 'translate(25%, -25%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">生命灵数</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>数字密码 · 命运解读</p>
            </div>
          </div>
          
          {/* 头部三指标 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#67e8f9' }}>生命灵数</div>
              <div className="text-2xl font-bold" style={{ color: '#22d3ee' }}>{lifePath}</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#a78bfa' }}>生日数字</div>
              <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{birthdayNumber || '-'}</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div className="text-[10px] mb-1" style={{ color: '#fbbf24' }}>振动频率</div>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{vibrationFrequency || '-'}</div>
            </div>
          </div>
        </div>

        {/* 区域2：核心数字 - 数字圆环（脉冲动画）+数字含义 */}
        <div className="p-6 rounded-2xl mb-4 text-center relative overflow-hidden" style={{ 
          background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-64 h-64 rounded-full border-2 border-cyan-400 animate-ping"></div>
          </div>
          <div className="relative z-10">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.35), inset 0 0 30px rgba(6, 182, 212, 0.15)'
              }}>
                <span className="text-6xl font-bold" style={{ color: '#06b6d4', textShadow: '0 0 25px rgba(6, 182, 212, 0.7)' }}>
                  {lifePath}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#8b5cf6', color: 'white', boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}>
                LP
              </div>
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {interpretation?.['核心含义'] || interpretation?.['基本含义'] || '数字能量解读'}
            </div>
          </div>
        </div>

        {/* 区域3：计算过程 - 三步计算可视化，数字网格+公式 */}
        {calculationSteps && calculationSteps.length > 0 && (
          <div className="p-5 rounded-2xl mb-4" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(100, 116, 139, 0.25)'
          }}>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M8 12h8M12 8v8"/>
              </svg>
              计算过程
            </h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {calculationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
                    {idx + 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 区域4：多维解读 - 四列卡片（生命/性格/灵魂/使命）四色边框 */}
        <div className="p-5 rounded-2xl mb-4" style={{ 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v20M2 12h20"/>
            </svg>
            多维解读
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '生命', value: lifePath, color: '#06b6d4', abbr: 'LP', desc: '人生使命' },
              { label: '性格', value: expressionNumber, color: '#a78bfa', abbr: 'EN', desc: '表达方式' },
              { label: '灵魂', value: soulNumber, color: '#ec4899', abbr: 'SN', desc: '内在渴望' },
              { label: '使命', value: personalYear, color: '#10b981', abbr: 'PY', desc: '年度方向' },
            ].map((item) => (
              <div key={item.abbr} className="p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02]" 
                style={{ background: 'rgba(0, 0, 0, 0.04)', border: '2px solid rgba(128, 128, 128, 0.18)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(0, 0, 0, 0.08)' }}>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.abbr}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value || '-'}</div>
                <div className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</div>
                <div className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 区域5：年度数字 - 当前年份+数字含义，渐变卡片 */}
        {annualNumber && (
          <div className="p-5 rounded-2xl mb-4 relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(251, 191, 36, 0.25)'
          }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{ 
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
              transform: 'translate(20%, -20%)'
            }}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium mb-1" style={{ color: '#fbbf24' }}>年度数字</h4>
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date().getFullYear()} · 个人年度能量指引
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ 
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(139, 92, 246, 0.15))',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.25)'
                }}>
                  <span className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{annualNumber}</span>
                </div>
                <div className="text-xs max-w-[200px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {interpretation?.['年度指引'] || '把握年度能量机遇'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 区域6：AI解读 - 青色渐变卡片，三色标签解读 */}
        {interpretation && (
          <div className="p-5 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              AI深度解读
            </h4>
            <div className="space-y-3">
              {Object.entries(interpretation).slice(0, 4).map(([key, value], idx) => {
                const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981'];
                const color = colors[idx % colors.length];
                return (
                  <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.04)', border: '1px solid rgba(128, 128, 128, 0.12)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(128, 128, 128, 0.12)', color: color }}>
                        {key}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 性格特质标签 */}
        {personalityTraits && personalityTraits.length > 0 && (
          <div className="p-4 rounded-2xl mt-4" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
            <div className="flex flex-wrap gap-2 justify-center">
              {personalityTraits.map((trait, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ 
                  background: 'rgba(6, 182, 212, 0.12)', 
                  color: '#67e8f9',
                  border: '1px solid rgba(6, 182, 212, 0.25)'
                }}>
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 占星骰子布局 ====================
  if (data.dice1) {
    const dice1 = data.dice1 as Record<string, unknown>;
    const dice2 = data.dice2 as Record<string, unknown> | undefined;
    const dice3 = data.dice3 as Record<string, unknown> | undefined;
    
    // 提取各骰子数据
    const planetData = dice1;
    const signData = dice2 ?? {};
    const houseData = dice3 ?? {};
    const planetName = String(planetData?.name || planetData?.symbol || '太阳');
    const signName = String(signData?.name || signData?.symbol || '白羊座');
    const houseName = String(houseData?.name || houseData?.symbol || '第5宫');
    const houseNum = String(houseData?.symbol || houseData?.name || '5').replace(/[^0-9]/g, '') || '5';
    
    // 根据宫位数生成四宫位网格数据
    const houseKeywords: Record<string, { love: string; creative: string; entertainment: string; talent: string }> = {
      '1': { love: '吸引他人', creative: '自我展现', entertainment: '个人享乐', talent: '领导才能' },
      '2': { love: '财务亲密', creative: '资源创造', entertainment: '享受生活', talent: '理财能力' },
      '3': { love: '沟通恋爱', creative: '写作创意', entertainment: '短途旅行', talent: '表达能力' },
      '4': { love: '家庭情感', creative: '房产相关', entertainment: '家庭聚会', talent: '照顾能力' },
      '5': { love: '热情浪漫', creative: '艺术创作', entertainment: '娱乐游戏', talent: '表演才华' },
      '6': { love: '日常相处', creative: '服务工作', entertainment: '健康养生', talent: '服务技能' },
      '7': { love: '伴侣关系', creative: '合伙创意', entertainment: '社交活动', talent: '协调能力' },
      '8': { love: '深层亲密', creative: '转化创造', entertainment: '神秘探索', talent: '洞察能力' },
      '9': { love: '理想之爱', creative: '智慧创造', entertainment: '长途旅行', talent: '哲学思维' },
      '10': { love: '事业吸引', creative: '公众形象', entertainment: '成就追求', talent: '领导能力' },
      '11': { love: '群体社交', creative: '创新想法', entertainment: '团体活动', talent: '理想主义' },
      '12': { love: '潜意识情感', creative: '艺术直觉', entertainment: '灵性修养', talent: '共情能力' },
    };
    const houseGrid = houseKeywords[houseNum] || houseKeywords['5'];
    
    return (
      <div className="mb-6 space-y-6">
        {/* 1. 占星骰子头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8" cy="8" r="1.5" fill="white"/>
                <circle cx="16" cy="8" r="1.5" fill="white"/>
                <circle cx="8" cy="16" r="1.5" fill="white"/>
                <circle cx="16" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>占星骰子解读</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>行星 · 星座 · 宫位</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <i className="fas fa-star"></i>行星：{planetName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
              <i className="fas fa-fire"></i>星座：{signName}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" 
              style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              <i className="fas fa-home"></i>宫位：{houseName}
            </span>
          </div>
        </div>

        {/* 2. 三骰展示区域 */}
        <div className="p-8 rounded-2xl" style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
          border: '1px solid rgba(100, 116, 139, 0.3)' 
        }}>
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
            </svg>
            骰子结果
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* 行星骰子 */}
            <div className="flex flex-col items-center">
              <div className="mb-4" style={{ perspective: '1000px' }}>
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center" 
                  style={{ 
                    background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                    boxShadow: '0 20px 60px rgba(251, 191, 36, 0.3)'
                  }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-lg mb-1">{planetName} ☉</span>
              <span className="text-gray-400 text-sm">代表：核心自我、生命能量</span>
            </div>
            
            {/* 星座骰子 */}
            {signData && (
              <div className="flex flex-col items-center">
                <div className="mb-4" style={{ perspective: '1000px' }}>
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                      boxShadow: '0 20px 60px rgba(244, 63, 94, 0.3)',
                      color: '#f43f5e'
                    }}>
                    ♈
                  </div>
                </div>
                <span className="text-rose-400 font-bold text-lg mb-1">{signName}</span>
                <span className="text-gray-400 text-sm">代表：行动力、开创精神</span>
              </div>
            )}
            
            {/* 宫位骰子 */}
            {houseData && (
              <div className="flex flex-col items-center">
                <div className="mb-4" style={{ perspective: '1000px' }}>
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
                    style={{ 
                      background: 'linear-gradient(135deg, #2d1b69, #1a1040)',
                      boxShadow: '0 20px 60px rgba(167, 139, 250, 0.3)',
                      color: '#a78bfa'
                    }}>
                    {houseNum}
                  </div>
                </div>
                <span className="text-purple-400 font-bold text-lg mb-1">{houseName}</span>
                <span className="text-gray-400 text-sm">代表：恋爱、创意、子女</span>
              </div>
            )}
          </div>

          {Boolean(data.interpretation) && (
            <div className="rounded-xl p-5" style={{ 
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.05))',
              border: '1px solid rgba(124, 58, 237, 0.3)'
            }}>
              <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                综合含义
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {String(data.interpretation)}
              </p>
            </div>
          )}
        </div>

        {planetData && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
            border: '1px solid rgba(100, 116, 139, 0.3)' 
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span style={{ color: '#fbbf24' }}>{planetName} ☉</span>
              <span className="text-gray-400 text-sm font-normal">— 生命之光</span>
            </h2>
            <div className="rounded-xl p-5 mb-4" style={{ 
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <p className="text-amber-300 leading-relaxed">
                {String(planetData.description || planetData.meaning || `${planetName}是占星术中最重要的星体，代表核心自我、生命力、个人意志和创造力的来源。它揭示了你如何展现自己的力量，以及你生命中最重要的领域。`)}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                  正向特质
                </h4>
                <p className="text-gray-400 text-sm">{String(planetData.positiveTraits || planetData.traits || '自信、活力、创造力、领导力、慷慨')}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  挑战课题
                </h4>
                <p className="text-gray-400 text-sm">{String(planetData.challengeTraits || planetData.lessons || '避免自我中心、控制欲过强、过于争强好胜')}</p>
              </div>
            </div>
          </div>
        )}

        {Object.keys(signData).length > 0 && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', 
            border: '1px solid rgba(100, 116, 139, 0.3)' 
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ color: '#f43f5e' }}>{signName}</span>
              <span className="text-gray-400 text-sm font-normal">— 火的开始</span>
            </h2>
            <div className="rounded-xl p-5 mb-4" style={{ 
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              <p className="text-rose-300 leading-relaxed">
                {String(signData.description || signData.meaning || `${signName}是黄道十二星座的代表之一，充满热情和行动力，喜欢挑战和竞争，不畏惧成为第一个吃螃蟹的人。`)}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-rose-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  性格特点
                </h4>
                <p className="text-gray-400 text-sm">{String(signData.traits || '勇敢、直接、充满活力、独立、积极')}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <h4 className="text-rose-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  人生课题
                </h4>
                <p className="text-gray-400 text-sm">{String(signData.lessons || signData.challenges || '学会耐心、倾听他人、接受失败')}</p>
              </div>
            </div>
          </div>
        )}

        {houseData && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)'
          }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span style={{ color: '#a78bfa' }}>{houseName}</span>
              <span className="text-gray-400 text-sm font-normal">— 创造与恋爱之宫</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {houseName}代表创造力、自我表达、恋爱关系、子女、娱乐和艺术才华。骰子落在此宫，暗示你在这几个方面拥有强大的能量和机遇。
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" className="mx-auto mb-2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">恋爱</p>
                <p className="text-sm text-white font-medium">{houseGrid.love}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" className="mx-auto mb-2">
                  <circle cx="13.5" cy="6.5" r="2.5"/>
                  <circle cx="19" cy="17" r="2"/>
                  <circle cx="6" cy="12" r="3"/>
                  <path d="M12 9v4M9 11l3 2"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">创意</p>
                <p className="text-sm text-white font-medium">{houseGrid.creative}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" className="mx-auto mb-2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10,8 16,12 10,16 10,8"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">娱乐</p>
                <p className="text-sm text-white font-medium">{houseGrid.entertainment}</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" className="mx-auto mb-2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                </svg>
                <p className="text-xs text-gray-400 mb-1">才华</p>
                <p className="text-sm text-white font-medium">{houseGrid.talent}</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. AI深度解读 */}
        {Boolean(data.aiInterpretation) && (
          <div className="p-6 rounded-2xl" style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.4)'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI 深度解读</h2>
                <p className="text-xs text-gray-400">基于占星原理的个性化分析</p>
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ 
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {String(data.aiInterpretation)}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 月相布局 ====================
  if (data.moonPhase) {
    const phase = data.moonPhase as string;
    const energy = data.energy as string | undefined;
    const energyIndex = data.energyIndex as number | undefined;
    const moonAge = data.moonAge as string | number | undefined;
    const illumination = Number(data.illumination || data.月光照度 || 50);
    const suitableActivities = data.suitableActivities as string[] | undefined;
    const avoidActivities = data.avoidActivities as string[] | undefined;
    const suggestions = data.suggestions as string[] | undefined;
    const astronomicalFeatures = String(data.astronomicalFeatures || data.天文特征 || data.features || '');
    const energyTraits = String(data.energyTraits || data.能量特质 || '');
    const emotionalEnergy = data.emotionalEnergy as number | undefined;
    const intuition = data.intuition as number | undefined;
    const action = data.action as number | undefined;
    const introspection = data.introspection as number | undefined;
    
    const moonEmojis: Record<string, string> = { '新月': '🌑', '蛾眉月': '🌒', '上弦月': '🌓', '盈凸月': '🌔', '满月': '🌕', '亏凸月': '🌖', '下弦月': '🌗', '残月': '🌘' };
    const phases = ['新月', '蛾眉月', '上弦月', '盈凸月', '满月', '亏凸月', '下弦月', '残月'];
    const phaseIndex = phases.findIndex(p => phase.includes(p.replace('月', ''))) || Math.floor(illumination / 12.5);
    const displayDate = data.date || data.日期 || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
      <div className="mb-6">
        {/* 区域1：月相头部卡片 */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ 
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.5) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            {/* 月相图标 */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-400 to-purple-500 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-2xl font-bold" style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(167, 139, 250, 0.5)' }}>月相占卜</h4>
              <p className="text-sm" style={{ color: 'rgba(167, 139, 250, 0.7)' }}>{phase} · 能量解读</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              <i className="fas fa-calendar mr-1"></i>{String(displayDate)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(100, 116, 139, 0.2)', color: 'rgba(203, 213, 225, 0.9)', border: '1px solid rgba(100, 116, 139, 0.4)' }}>
              <i className="fas fa-percentage mr-1"></i>月龄：{moonAge || `${(illumination / 3.7).toFixed(1)}天`}
            </span>
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
              <i className="fas fa-bolt mr-1"></i>能量指数：{energyIndex || illumination}%
            </span>
          </div>
        </div>

        {/* 区域2+3：月相展示与信息 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-moon" style={{ color: '#a78bfa' }}></i>
            当前月相
          </h3>
          
          <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
            {/* 月相图形展示 */}
            <div className="relative flex-shrink-0">
              <div className="relative w-44 h-44 rounded-full" style={{ 
                background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
                boxShadow: '0 0 60px rgba(167, 139, 250, 0.5), inset -20px -10px 40px rgba(0, 0, 0, 0.2)'
              }}>
                <div className="absolute inset-0 rounded-full" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 35%, rgba(0,0,0,0.08) 0%, transparent 18%), radial-gradient(circle at 60% 50%, rgba(0,0,0,0.06) 0%, transparent 12%), radial-gradient(circle at 45% 70%, rgba(0,0,0,0.05) 0%, transparent 10%)'
                }}></div>
                {/* 月相阴影覆盖层 */}
                {phase.includes('新月') || phase.includes('日食') ? (
                  <div className="absolute inset-0 rounded-full" style={{ background: '#1a1a2e' }}></div>
                ) : phase.includes('满月') ? null : (
                  <div className="absolute inset-0 rounded-full" style={{
                    background: `linear-gradient(to right, rgba(26, 26, 46, ${1 - illumination / 100}) 0%, transparent 50%)`
                  }}></div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' }}>
                {phase}
              </div>
            </div>
            
            {/* 月相信息三列卡片 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">月相名称</h4>
                <p className="text-white text-sm">{phase}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">天文特征</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{astronomicalFeatures || `月球亮面${illumination}%，此刻月球能量处于${illumination > 50 ? '盈满' : '消退'}阶段。`}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(192, 192, 192, 0.05))', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <h4 className="text-purple-400 font-medium mb-2 text-sm">能量特质</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{energyTraits || energy || `月相能量正在${illumination > 50 ? '上升' : '衰减'}，适合${illumination > 50 ? '行动与决策' : '反思与调整'}。`}</p>
              </div>
            </div>
          </div>

          {/* 月相周期进度条 */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-gray-400 text-xs mb-3">月相周期示意</h4>
            <div className="flex items-center justify-between">
              {phases.map((p, idx) => {
                const isActive = idx <= phaseIndex;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all"
                      style={{ 
                        background: isActive 
                          ? (idx === phaseIndex 
                              ? 'linear-gradient(to right, rgba(167, 139, 250, 0.3), rgba(167, 139, 250, 0.8))' 
                              : 'linear-gradient(to right, rgba(100, 116, 139, 0.3), rgba(100, 116, 139, 0.6))')
                          : 'rgba(51, 65, 85, 0.5)',
                        boxShadow: idx === phaseIndex ? '0 0 15px rgba(167, 139, 250, 0.6)' : 'none'
                      }}
                    >
                      <span className="text-sm">{moonEmojis[p]}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: isActive ? '#a78bfa' : 'rgba(148, 163, 184, 0.6)' }}>{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 区域4：能量分析 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-bolt" style={{ color: '#fbbf24' }}></i>
            月相能量分析
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { label: '情感能量', value: emotionalEnergy || Math.round(illumination * 0.8 + 20), color: '#a78bfa' },
              { label: '直觉能力', value: intuition || Math.round(illumination * 0.85 + 15), color: '#c4b5fd' },
              { label: '行动力', value: action || Math.round(illumination * 0.9 + 10), color: '#a78bfa' },
              { label: '内省深度', value: introspection || Math.round((100 - illumination) * 0.6 + 30), color: '#c4b5fd' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl p-3" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-gray-400 text-xs">{item.label}</span>
                  <span className="text-purple-400 text-xs font-medium">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.value}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {energy && (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(251, 191, 36, 0.05))', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <h4 className="text-purple-400 font-semibold mb-2 text-sm">能量解读</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{energy}</p>
            </div>
          )}
        </div>

        {/* 区域5：今日指引 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
            今日月相指引
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* 适合做 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <i className="fas fa-check text-emerald-400"></i>
              </div>
              <h4 className="text-emerald-400 font-medium mb-2 text-sm">适合做</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {suitableActivities && suitableActivities.length > 0 ? (
                  suitableActivities.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 制定计划、设定目标</li>
                    <li>• 做出重要决策</li>
                    <li>• 启动新项目</li>
                    <li>• 表达情感、沟通</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* 避免做 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(244, 63, 94, 0.2)' }}>
                <i className="fas fa-times text-rose-400"></i>
              </div>
              <h4 className="text-rose-400 font-medium mb-2 text-sm">避免做</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {avoidActivities && avoidActivities.length > 0 ? (
                  avoidActivities.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 冲动行事</li>
                    <li>• 过度犹豫不决</li>
                    <li>• 忽略他人意见</li>
                    <li>• 放弃正在进行的事</li>
                  </>
                )}
              </ul>
            </div>
            
            {/* 建议 */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                <i className="fas fa-lightbulb text-amber-400"></i>
              </div>
              <h4 className="text-amber-400 font-medium mb-2 text-sm">今日建议</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {suggestions && suggestions.length > 0 ? (
                  suggestions.slice(0, 4).map((item, i) => <li key={i}>• {item}</li>)
                ) : (
                  <>
                    <li>• 把握行动时机</li>
                    <li>• 保持决策清晰</li>
                    <li>• 适度休息调整</li>
                    <li>• 记录灵感和想法</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 区域6：AI深度解读 */}
        <div className="mt-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(167, 139, 250, 0.15) 50%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <i className="fas fa-brain text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI 深度解读</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>基于月相周期的个性化分析</p>
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <p className="text-gray-300 text-xs leading-relaxed">
              {phase}如同{illumination > 50 ? '清晨的太阳，你的能量正在稳步上升。这是一段充满活力的时期，适合将想法转化为行动。' : '黄昏的余晖，能量逐渐回落。这是适合反思、整理和为下一轮做准备的时期。'}
              <br/><br/>
              <span className="text-purple-400 font-medium">核心启示：</span>{energy || ('月相能量正在' + (illumination > 50 ? '上升' : '衰减') + '，' + (illumination > 50 ? '这是制定决策、开启新事物的绝佳时机。' : '适合回顾总结，为新一轮周期做准备。'))}
              <br/><br/>
              <span className="text-amber-400 font-medium">行动指引：</span>{suitableActivities?.[0] || (illumination > 50 ? '专注于你真正想要启动的事情，采取第一个行动。' : '整理思绪，为下一阶段做好规划。')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 符文布局 ====================
  if (Array.isArray(data.runes) && data.runes.length) {
    const runes = data.runes as Array<Record<string, unknown>>;
    const runeSymbols: Record<string, string> = { Fehu: 'ᚠ', Uruz: 'ᚢ', Thurisaz: 'ᚦ', Ansuz: 'ᚨ', Raido: 'ᚱ', Kenaz: 'ᚲ', Gebo: 'ᚷ', Wunjo: 'ᚹ', Sowilo: 'ᛊ', Tiwaz: 'ᛏ' };
    
    return (
      <div className="mb-6">
        {/* 符文头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 50%, rgba(161, 98, 7, 0.05) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="12" y1="3" x2="12" y2="21"/>
                <line x1="5" y1="8" x2="19" y2="8"/>
                <line x1="7" y1="12" x2="17" y2="12"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold" style={{ color: '#fb923c', textShadow: '0 0 20px rgba(251, 146, 60, 0.5)' }}>符文占卜</h4>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>如尼符文 · 古老智慧</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {runes.slice(0, 3).map((r, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" 
                style={{ 
                  background: 'rgba(249, 115, 22, 0.2)', 
                  color: '#fb923c', 
                  border: '1px solid rgba(249, 115, 22, 0.4)'
                }}>
                {runeSymbols[String(r.name)] || ''} {String(r.name)}
              </span>
            ))}
          </div>
        </div>

        {/* 符文石展示 */}
        <div className="p-5 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(28, 25, 23, 0.8) 0%, rgba(41, 37, 36, 0.8) 100%)', border: '1px solid rgba(120, 113, 108, 0.3)' }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            符文阵法
          </h3>
          
          {/* 石符视觉 */}
          <div className="flex justify-center mb-5">
            <div className="flex gap-6">
              {runes.slice(0, 3).map((r, idx) => {
                const symbol = runeSymbols[String(r.name)] || '?';
                const meaning = r.meaning as string || r.definition as string || '';
                return (
                  <div key={idx} className="flex flex-col items-center transition-all duration-300 hover:-translate-y-2">
                    <div className="w-20 h-24 rounded-lg flex items-center justify-center text-4xl font-bold" 
                      style={{ 
                        background: 'linear-gradient(145deg, #d4d4d4, #a3a3a3)',
                        color: '#1c1917',
                        boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.5), -2px -2px 10px rgba(255, 255, 255, 0.2)',
                        filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))'
                      }}>
                      {symbol}
                    </div>
                    <span className="mt-2 text-sm font-semibold" style={{ color: '#fb923c' }}>{String(r.name)}</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{meaning.substring(0, 20)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 符文含义卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {runes.slice(0, 3).map((r, idx) => {
              const symbol = runeSymbols[String(r.name)] || '?';
              const meaning = r.meaning as string || r.definition as string || '';
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(161, 98, 7, 0.05))',
                    border: '1px solid rgba(249, 115, 22, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold" style={{ color: '#fb923c' }}>{symbol}</span>
                    <span className="text-sm font-medium" style={{ color: '#fb923c' }}>{String(r.name)}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {meaning.substring(0, 80) || '古日耳曼符文的古老含义...'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 常用符文对照表 */}
        <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            常用符文对照
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { symbol: 'ᚠ', name: 'Fehu', desc: '财富' },
              { symbol: 'ᚢ', name: 'Uruz', desc: '力量' },
              { symbol: 'ᚦ', name: 'Thurisaz', desc: '保护' },
              { symbol: 'ᚨ', name: 'Ansuz', desc: '沟通' },
              { symbol: 'ᚱ', name: 'Raido', desc: '旅程' },
              { symbol: 'ᚲ', name: 'Kenaz', desc: '点燃' },
              { symbol: 'ᚷ', name: 'Gebo', desc: '礼物' },
              { symbol: 'ᚹ', name: 'Wunjo', desc: '喜悦' },
            ].map((r, idx) => (
              <div key={idx} className="p-2 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <span className="text-lg font-bold block" style={{ color: '#fb923c' }}>{r.symbol}</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{r.name}</span>
                <span className="text-[10px] block" style={{ color: '#a3a3a3' }}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==================== 姓名测试布局 ====================
  if (data.fullName) {
    const name = data.fullName as string;
    const score = data.score as number | undefined;
    const surnameScore = data.surnameScore as number | undefined;
    const givenNameScore = data.givenNameScore as number | undefined;
    const wuxing = data.wuxing as string | undefined;
    const bazi = data.bazi as string[] | undefined;
    
    return (
      <div className="mb-6">
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(14, 165, 233, 0.06) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)'
        }}>
          {/* 背景装饰 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)' }} />
          
          {/* 姓名头部 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{name}</h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>姓名分析报告</p>
          </div>
          
          {/* 评分环形图 */}
          {score !== undefined && (() => {
            const progress = Math.round((score / 100) * 264);
            const dashArray = progress + ' 264';
            return (
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.4))' }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: '#0ea5e9' }}>{score}</span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>综合评分</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>姓名评分</div>
                <div className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>基于五行八卦分析</div>
                <div className="flex flex-wrap gap-2">
                  {wuxing && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" 
                      style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                      五行：{wuxing}
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
          })()}
          
          {/* 五格分析表格 */}
          {(surnameScore !== undefined || givenNameScore !== undefined || bazi) && (
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--color-border)' }}>
              <div className="p-4">
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#0ea5e9' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  五格分析
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  {surnameScore !== undefined && (
                    <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>天格</div>
                      <div className="text-lg font-bold" style={{ color: '#0ea5e9' }}>{surnameScore}</div>
                    </div>
                  )}
                  {givenNameScore !== undefined && (
                    <>
                      <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>人格</div>
                        <div className="text-lg font-bold" style={{ color: '#10b981' }}>{givenNameScore}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>地格</div>
                        <div className="text-lg font-bold" style={{ color: '#0ea5e9' }}>{givenNameScore}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {bazi && bazi.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>八字配合</div>
                  <div className="flex flex-wrap gap-2">
                    {bazi.slice(0, 4).map((b, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#7dd3fc' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 生肖布局 ====================
  if (data.animal || system === 'shengxiao') {
    const animal = data.animal as string || '';
    const element = data.element as string | undefined;
    const luckyNumbers = data.luckyNumbers as number[] | undefined;
    const luckyColors = data.luckyColors as string[] | undefined;
    const monthlyAnalysis = data.monthlyAnalysis as Record<string, { score: number; status: string }> | undefined;
    const year = data.year as number | undefined || new Date().getFullYear();
    const animalEmojis: Record<string, string> = { 鼠: '🐭', 牛: '🐮', 虎: '🐯', 兔: '🐰', 龙: '🐲', 蛇: '🐍', 马: '🐴', 羊: '🐑', 猴: '🐵', 鸡: '🐔', 狗: '🐕', 猪: '🐷' };
    
    return (
      <div className="mb-6">
        {/* 生肖头部卡片 */}
        <div className="p-6 rounded-2xl relative overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(180, 83, 9, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ 
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
            }}>
              {animalEmojis[animal] || '🐾'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-xl font-bold" style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>{animal}年</h4>
                {element && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                    五行属{element}
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{year}年属相运势</p>
            </div>
          </div>
          
          {/* 幸运信息 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {luckyNumbers && luckyNumbers.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2"/>
                  <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
                </svg>
                幸运数：{luckyNumbers.slice(0, 3).join('、')}
              </span>
            )}
            {luckyColors && luckyColors.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                幸运色：{luckyColors.slice(0, 2).join('、')}
              </span>
            )}
          </div>
        </div>

        {/* 月度运势 */}
        {monthlyAnalysis && (
          <div className="p-5 rounded-2xl mt-4" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              月度运势
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(monthlyAnalysis).slice(0, 12).map(([month, info]) => {
                const monthInfo = info as { score: number; status: string };
                const statusColor = (monthInfo.status === '大吉' || monthInfo.status === '吉') ? '#22c55e' : (monthInfo.status === '平') ? '#eab308' : '#f43f5e';
                const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                const monthIndex = parseInt(month) - 1 || 0;
                return (
                  <div 
                    key={month}
                    className="p-3 rounded-xl text-center transition-all duration-200 hover:scale-105"
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(128, 128, 128, 0.25)'
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{months[monthIndex]}</div>
                    <div className="text-lg font-bold" style={{ color: statusColor }}>{monthInfo.score}</div>
                    <div className="text-[10px]" style={{ color: statusColor }}>{monthInfo.status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 老黄历布局 ====================
  if (data.date) {
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

  // ==================== 抽签布局 ====================
  if (data.lotNumber !== undefined) {
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

  // 默认通用布局
  return null;
}

// 智能关键词提取
function extractKeywords(data: Record<string, unknown>, interpretation: string): string[] {
  const keywords: string[] = [];
  
  // 从 interpretation 中提取关键短语
  const patterns = [
    /性格[：:]([^。；\n]+)/,
    /特征[：:]([^。；\n]+)/,
    /优势[：:]([^。；\n]+)/,
    /建议[：:]([^。；\n]+)/,
    /适合[：:]([^。；\n]+)/,
  ];
  
  patterns.forEach(pattern => {
    const match = String(interpretation).match(pattern);
    if (match && match[1]) {
      const phrase = match[1].substring(0, 8);
      if (phrase.length > 2) keywords.push(phrase);
    }
  });

  // 从 data 中提取有价值的信息
  if (data.personality) keywords.push(String(data.personality).substring(0, 6));
  if (data.talent) keywords.push(String(data.talent).substring(0, 6));
  if (data.advice) keywords.push(String(data.advice).substring(0, 6));
  
  return keywords.slice(0, 5);
}

// AI 深度解读增强组件
function EnhancedAIInterpretation({ 
  interpretation, 
  data
}: { 
  interpretation: string; 
  data: Record<string, unknown>;
}) {
  // 解析解读内容，分段处理
  const paragraphs = interpretation.split(/\n+/).filter(p => p.trim());
  const sections: Array<{ title?: string; content: string }> = [];
  let currentSection: { title?: string; content: string } = { content: '' };

  paragraphs.forEach((para) => {
    const trimmed = para.trim();
    if (/^[一二三四五六七八九十]、/.test(trimmed) || /^[【[【]/.test(trimmed)) {
      if (currentSection.content) sections.push(currentSection);
      const titleMatch = trimmed.match(/^[一二三四五六七八九十]、[^\s：:]+/);
      const bracketMatch = trimmed.match(/^[【[【][^】】\]]+[】】\]]:?\s*/);
      const title = titleMatch ? titleMatch[0] : bracketMatch ? bracketMatch[0].replace(/[：:]\s*$/, '') : undefined;
      currentSection = { 
        title, 
        content: trimmed.replace(/^[一二三四五六七八九十]、[^\s：:：]+[：:]\s*/, '').replace(/^[【[【][^】】\]]+[】】\]]:?\s*/, '') 
      };
    } else {
      currentSection.content += (currentSection.content ? '\n' : '') + trimmed;
    }
  });
  if (currentSection.content) sections.push(currentSection);

  const keywords = extractKeywords(data, interpretation);
  
  const themes = {
    career: /事业|工作|职业|财运|财富|收入|创业|投资/.test(interpretation),
    love: /感情|爱情|婚姻|桃花|伴侣|姻缘|甜蜜|争吵/.test(interpretation),
    health: /健康|身体|疾病|养生|保养|精力|作息/.test(interpretation),
    personality: /性格|个性|特质|为人|思维|想法|内心/.test(interpretation),
    lucky: /运势|运气|贵人|吉凶|顺利|波折|机遇/.test(interpretation),
    learning: /学习|考试|成长|进步|提升|发展/.test(interpretation),
  };
  const activeThemes = Object.entries(themes).filter(([, active]) => active);

  // 提取关键洞察
  const insightMatch = interpretation.match(/总体[是为].{0,60}/);
  const luckLevel = /大吉|吉利|顺利|旺盛/.test(interpretation) ? '极佳' : /平顺|一般|普通/.test(interpretation) ? '平稳' : '波动';
  const luckColor = luckLevel === '极佳' ? '#e74c3c' : luckLevel === '平稳' ? '#3498db' : '#9b59b6';

  const themeIcons: Record<string, React.ReactNode> = {
    career: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>,
    love: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    health: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    personality: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    lucky: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    learning: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  };
  const themeLabels: Record<string, string> = {
    career: '事业发展', love: '感情婚姻', health: '健康养生',
    personality: '性格解析', lucky: '运势提示', learning: '学业成长',
  };

  return (
    <div className="relative">
      {/* 顶部装饰 SVG */}
      <div className="absolute -top-4 -right-4 opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="1" />
          <path d="M60 10 L60 110 M10 60 L110 60" stroke="currentColor" strokeWidth="0.5" />
          <path d="M25 25 L95 95 M95 25 L25 95" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* 标题区 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #667eea 100%)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>AI 深度解读</h3>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>基于星象能量与命盘逻辑的综合分析</p>
        </div>
      </div>

      {/* 主题标签 */}
      {activeThemes.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {activeThemes.map(([key]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0, 75, 170, 0.08)', color: 'var(--color-primary)', border: '1px solid rgba(0, 75, 170, 0.15)' }}
            >
              {themeIcons[key]}
              {themeLabels[key]}
            </span>
          ))}
        </div>
      )}

      {/* AI 洞察摘要卡片 */}
      <div className="mb-5 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.06) 0%, rgba(102, 126, 234, 0.04) 100%)', border: '1px solid rgba(0, 75, 170, 0.12)' }}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: luckColor + '18' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={luckColor} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>运势等级</p>
            <p className="text-sm font-semibold" style={{ color: luckColor }}>{luckLevel}</p>
            {insightMatch && (
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>{insightMatch[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* 分段内容 */}
      {sections.length > 0 ? (
        <div className="space-y-4 mb-5">
          {sections.map((section, idx) => (
            <div key={idx} className="relative">
              {section.title ? (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
                  <h4 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{section.title}</h4>
                </div>
              ) : null}
              <div className="text-sm leading-relaxed pl-3.5" style={{ color: 'var(--color-text-secondary)' }}>
                {section.content.split('\n').map((line, lineIdx) => (
                  <p key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {paragraphs.slice(0, 3).map((para, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{para}</p>
          ))}
        </div>
      )}

      {/* 关键词建议区 */}
      {keywords.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(0, 75, 170, 0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>建议关注</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(0, 75, 170, 0.06)', color: 'var(--color-primary)', border: '1px solid rgba(0, 75, 170, 0.1)' }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 底部装饰 */}
      <div className="mt-5 flex items-center justify-center gap-1 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
        <div className="w-4 h-px" style={{ background: 'var(--color-primary)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
        <div className="w-4 h-px" style={{ background: 'var(--color-primary)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
      </div>
    </div>
  );
}

// Tab 图标映射
const TAB_ICONS: Record<string, React.ReactNode> = {
  personality: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  career: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
    </svg>
  ),
  love: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  health: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  fortune: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const IS_DEV = import.meta.env.DEV;

/** 系统名称映射 */
const SYSTEM_LABELS: Record<string, string> = {
  bazi: '八字排盘',
  tarot: '塔罗占卜',
  zodiac: '星座运势',
  dream: '周公解梦',
  ziwei: '紫微斗数',
  liuyao: '六爻卦象',
  meihua: '梅花易数',
  qimen: '奇门遁甲',
  fengshui: '风水罗盘',
  numerology: '数字能量',
  astrodice: '占星骰子',
  moonphase: '月相占卜',
  rune: '符文占卜',
  nametest: '姓名测试',
  shengxiao: '生肖运势',
  almanac: '每日黄历',
  drawlot: '求签解签',
  palm: '手相算命',
  tieban: '铁板神数',
  daliuren: '六壬神课',
};

/** 系统分类映射 */
const SYSTEM_CATEGORIES: Record<string, string> = {
  bazi: '东方命理',
  ziwei: '东方命理',
  liuyao: '东方命理',
  meihua: '东方命理',
  qimen: '东方命理',
  shengxiao: '东方命理',
  tieban: '东方命理',
  daliuren: '东方命理',
  tarot: '西方占卜',
  astrodice: '西方占卜',
  moonphase: '西方占卜',
  rune: '西方占卜',
  zodiac: '西方占卜',
  numerology: '西方占卜',
  nametest: '民俗趣味',
  fengshui: '民俗趣味',
  almanac: '民俗趣味',
  drawlot: '民俗趣味',
  dream: '民俗趣味',
  palm: '民俗趣味',
};

/** 系统路由映射（用于"重新占卜"按钮） */
const SYSTEM_ROUTES: Record<string, string> = {
  bazi: '/bazi',
  tarot: '/tarot',
  zodiac: '/zodiac',
  dream: '/dream',
};

/** 格式化时间 */
function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/** 详细分析 Tab 配置 */
const ANALYSIS_TABS = [
  { key: 'personality', label: '性格特征' },
  { key: 'career', label: '事业方向' },
  { key: 'love', label: '感情婚姻' },
  { key: 'health', label: '健康提醒' },
  { key: 'fortune', label: '大运流年' },
];

/** Tab 内容占位组件 */
function TabPlaceholder({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4" style={{ opacity: 0.3 }}>
        {icon}
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
        {title}分析即将开放
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>
        AI 正在深度学习中，敬请期待
      </p>
    </div>
  );
}

/**
 * 按标题分割 AI 解读文本
 * 支持多种格式：
 * 1. ### 1. 性格特征 / ### 2. 事业方向 ...
 * 2. ### 性格特征 / ### 事业方向 ...
 * 3. 事业方向：内容 / 感情婚姻：内容 ... (中文冒号分隔)
 * 4. 【事业方向】内容 / 【感情婚姻】内容 ... (中文方括号)
 */
function splitAIInterpretation(text: string): Record<string, string> {
  const sections: Record<string, string> = {
    personality: '',
    career: '',
    love: '',
    health: '',
    fortune: '',
  };

  // 中文标题关键词映射
  const titleMap: Record<string, string[]> = {
    personality: ['性格', '人格', '个人特质'],
    career: ['事业', '工作', '职业', '职场'],
    love: ['感情', '爱情', '婚姻', '桃花', '恋爱'],
    health: ['健康', '身体', '保健', '养生'],
    fortune: ['财运', '财富', '金钱', '理财', '大运', '流年', '运势'],
  };

  const lines = text.split('\n');
  let currentKey = '';
  let introText = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let matched = false;

    // 模式1: ### 数字. 标题
    const numMatch = trimmed.match(/^###\s*(\d+)\.\s*(.+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      const tabKeys = ['personality', 'career', 'love', 'health', 'fortune'];
      if (num >= 1 && num <= 5) {
        currentKey = tabKeys[num - 1];
        matched = true;
      }
    }

    // 模式2: ### 标题
    if (!matched) {
      const mdTitleMatch = trimmed.match(/^###\s*(.+)/);
      if (mdTitleMatch) {
        const title = mdTitleMatch[1].trim();
        for (const [key, keywords] of Object.entries(titleMap)) {
          if (keywords.some(k => title.includes(k))) {
            currentKey = key;
            matched = true;
            break;
          }
        }
      }
    }

    // 模式3: 标题：内容 或 【标题】内容
    if (!matched) {
      const colonMatch = trimmed.match(/^【?([^\]】]+)】?[：:]/);
      if (colonMatch) {
        const title = colonMatch[1].trim();
        for (const [key, keywords] of Object.entries(titleMap)) {
          if (keywords.some(k => title.includes(k))) {
            currentKey = key;
            matched = true;

            // 提取冒号后的内容并收集
            const colonIdx = trimmed.indexOf('：') > -1 ? trimmed.indexOf('：') : trimmed.indexOf(':');
            if (colonIdx > -1 && colonIdx < trimmed.length - 1) {
              const content = trimmed.substring(colonIdx + 1).trim();
              if (content) {
                sections[currentKey] += (sections[currentKey] ? '\n' : '') + content;
              }
            }
            break;
          }
        }
      }
    }

    if (matched) continue;

    // 收集内容
    if (currentKey) {
      if (trimmed) {
        sections[currentKey] += (sections[currentKey] ? '\n' : '') + trimmed;
      }
    } else {
      introText += (introText ? '\n' : '') + trimmed;
    }
  }

  // 引导语放入 personality 开头
  if (introText.trim()) {
    sections.personality = introText + (sections.personality ? '\n\n' + sections.personality : '');
  }

  return sections;
}

/** 追问消息类型 */
interface FollowUpMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

/**
 * Markdown 文本渲染 - 使用 react-markdown
 */
function MarkdownText({ text, theme = 'light' }: { text: string; theme?: 'light' | 'dark' }) {
  const textColor = theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'var(--color-text)';
  const headingColor = theme === 'dark' ? 'rgba(255,255,255,0.95)' : 'var(--color-text)';
  const secondaryColor = theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'var(--color-text-tertiary)';

  return (
    <div style={{ color: textColor }} className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2" style={{ color: headingColor }}>{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2" style={{ color: headingColor }}>{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-2" style={{ color: headingColor }}>{children}</h3>,
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded text-sm" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: secondaryColor }}>
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 pl-4 my-2 opacity-80" style={{ borderColor: secondaryColor }}>{children}</blockquote>
          ),
          hr: () => <hr className="my-4 opacity-30" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

/** 判断字段是否应该隐藏（内部字段） */
function shouldHideField(field: string): boolean {
  const hiddenFields = ['aiInterpretation', 'interpretation', 'ai_analysis', 'summary', 'id', 'system', 'createdAt', 'status'];
  return hiddenFields.includes(field);
}

/** 判断字段是否为布尔值（用于格式化显示） */
function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

/** 递归渲染结构化数据 */
function DataSection({ data, system }: { data: Record<string, unknown>; system: string }) {
  if (!data || typeof data !== 'object') return null;

  // 统一数据结构：优先使用 details 中的详细数据，兼容顶层数据
  const detailsData = (data.details && typeof data.details === 'object' && data.details !== null)
    ? data.details as Record<string, unknown>
    : data;

  // 智能内容卡片布局（针对特定系统）
  const smartCard = <SmartContentCard data={detailsData} system={system} />;
  
  // 通用数据卡片布局
  const generalCards = <GeneralDataCards data={detailsData} system={system} />;

  return (
    <div className="space-y-4">
      {smartCard}
      {smartCard ? null : generalCards}
      {Object.entries(detailsData).map(([key, value]) => {
        if (value === null || value === undefined) return null;
        if (shouldHideField(key)) return null;

        const label = getFieldLabel(system, key);

        /* 嵌套对象：递归渲染 */
        if (typeof value === 'object' && !Array.isArray(value)) {
          // 紫微斗数四化飞星特殊处理（中文键名）
          if (key === 'siHua' && system === 'ziwei') {
            return (
              <div key={key}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-primary-lighter)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}
                >
                  {label}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center p-2 rounded-lg" style={{ background: 'var(--color-bg-inset)' }}>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{k}</span>
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 紫微斗数命宫信息特殊处理
          if (key === 'mingGong' && system === 'ziwei') {
            const mg = value as Record<string, unknown>;
            return (
              <div key={key}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-primary-lighter)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}
                >
                  {label}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {mg.palace ? (
                    <div className="flex gap-2">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>宫位：</span>
                      <span className="font-medium" style={{ color: 'var(--color-primary)' }}>{String(mg.palace)}</span>
                    </div>
                  ) : null}
                  {mg.star ? (
                    <div className="flex gap-2">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>主星：</span>
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>{String(mg.star)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          }

          // 通用嵌套对象处理
          return (
            <div key={key}>
              <h3
                className="text-sm font-semibold mb-2 pb-1"
                style={{ color: 'var(--color-primary-lighter)', borderBottom: '1px solid var(--color-border-light)' }}
              >
                {label}
              </h3>
              <div className="pl-4">
                <DataSection data={value as Record<string, unknown>} system={system} />
              </div>
            </div>
          );
        }

        /* 数组：列表渲染 */
        if (Array.isArray(value)) {
          // 紫微斗数十二宫位特殊处理
          if (key === 'twelvePalaces' && system === 'ziwei') {
            return (
              <div key={key}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-primary-lighter)' }}
                >
                  {label}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {value.map((item: Record<string, unknown>, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg"
                      style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
                        {item.palace || item.name ? String(item.palace || item.name) : ('宫位' + (idx + 1))}
                      </div>
                      <div className="text-xs space-y-0.5">
                        {item.mainStar ? (
                          <div className="flex gap-2">
                            <span style={{ color: 'var(--color-text-tertiary)' }}>主星：</span>
                            <span style={{ color: 'var(--color-text-secondary)' }}>{String(item.mainStar)}</span>
                          </div>
                        ) : null}
                        {item.subStars ? (
                          <div className="flex gap-2 flex-wrap">
                            <span style={{ color: 'var(--color-text-tertiary)' }}>辅星：</span>
                            <span style={{ color: 'var(--color-text-secondary)' }}>
                              {Array.isArray(item.subStars) ? (item.subStars as string[]).join('、') : String(item.subStars)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 塔罗牌、符文等卡片数组特殊处理
          if ((key === 'cards' && system === 'tarot') || (key === 'runes' && system === 'rune')) {
            return (
              <div key={key}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-primary-lighter)' }}
                >
                  {label}
                </h3>
                <div className="space-y-3">
                  {value.map((item: Record<string, unknown>, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg"
                      style={{ background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="flex items-start gap-4">
                        {item.position ? (
                          <div
                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                          >
                            {idx + 1}
                          </div>
                        ) : null}
                        <div className="flex-1">
                          {item.cardName ? (
                            <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
                              {String(item.cardName)}
                            </div>
                          ) : null}
                          {item.name ? (
                            <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
                              {String(item.name)}
                            </div>
                          ) : null}
                          {item.symbol ? (
                            <div className="text-lg mb-1">{String(item.symbol)}</div>
                          ) : null}
                          {item.upright !== undefined && (
                            <div className="flex gap-2 mb-1">
                              <span style={{ color: 'var(--color-text-tertiary)' }}>位置：</span>
                              <span className="text-sm" style={{ color: item.upright ? 'var(--state-success)' : 'var(--state-warning)' }}>
                                {item.upright ? '正位' : '逆位'}
                              </span>
                            </div>
                          )}
                          {item.reversed !== undefined && typeof item.reversed === 'boolean' && (
                            <div className="flex gap-2 mb-1">
                              <span style={{ color: 'var(--color-text-tertiary)' }}>位置：</span>
                              <span className="text-sm" style={{ color: item.reversed ? 'var(--state-warning)' : 'var(--state-success)' }}>
                                {item.reversed ? '逆位' : '正位'}
                              </span>
                            </div>
                          )}
                          {item.meaning ? (
                            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              {String(item.meaning)}
                            </div>
                          ) : null}
                          {item.reversedMeaning ? (
                            <div className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                              逆位：{String(item.reversedMeaning)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 通用数组处理
          return (
            <div key={key}>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: 'var(--color-primary-lighter)' }}
              >
                {label}
              </h3>
              <ul className="space-y-1 pl-4">
                {value.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)', listStyle: 'disc' }}
                  >
                    {typeof item === 'object' ? (
                      // 对象数组：展示为键值对
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {Object.entries(item as Record<string, unknown>).map(([k, v]) => {
                          if (shouldHideField(k)) return null;
                          return (
                            <span key={k}>
                              <span style={{ color: 'var(--color-text-tertiary)' }}>{getFieldLabel(system, k)}：</span>
                              <span>{isBoolean(v) ? (v ? '是' : '否') : String(v)}</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      String(item)
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        /* 基本类型 */
        return (
          <div key={key} className="flex gap-3 text-sm">
            <span className="shrink-0 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {label}：
            </span>
            <span style={{ color: 'var(--color-text)' }}>
              {isBoolean(value) ? (value ? '是' : '否') : String(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 结果展示主页面 */
export default function ResultPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personality');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [followQuestion, setFollowQuestion] = useState('');
  const [followMessages, setFollowMessages] = useState<FollowUpMessage[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** 开发环境：自动检测未映射字段并输出到控制台 */
  useEffect(() => {
    if (IS_DEV && result?.data) {
      const unmapped = getUnmappedFields(result.system, result.data as Record<string, unknown>);
      if (unmapped.length > 0) {
        console.warn(`[字段映射] 系统 "${result.system}" 存在未映射字段:`, unmapped);
      }
    }
  }, [result]);

  /** 初始化书签状态 */
  useEffect(() => {
    if (result?.id) {
      const key = 'tianji_bookmarks';
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      setBookmarked(list.includes(result.id));
    }
  }, [result?.id]);

  /** 计算综合评分（从 data 中提取 score 字段） */
  const scoreRaw = result?.data?.score ?? result?.data?.total_score;
  const scoreNum = typeof scoreRaw === 'number' ? scoreRaw : undefined;
  const scoreSummary = result?.data?.summary ?? result?.data?.score_summary;

  /** AI 深度解读文本 - 优先从 details.aiInterpretation 获取专属深度解读 */
  const detailsData = result?.data?.details as Record<string, unknown> | undefined;
  const aiInterpretation =
    (detailsData?.aiInterpretation as string | undefined) ??
    (result?.data as Record<string, unknown>)?.aiInterpretation as string | undefined ??
    (result?.data as Record<string, unknown>)?.ai_analysis as string | undefined;

  /** AI 解读分段内容（按 tab 分割） */
  const interpretationSections = aiInterpretation ? splitAIInterpretation(String(aiInterpretation)) : {} as Record<string, string>;

  /** 当前系统对应的重新占卜路由 */
  const systemRoute = result ? SYSTEM_ROUTES[result.system] : undefined;

  /** 无 ID 时的处理：从历史记录获取最新结果 */
  useEffect(() => {
    if (!id) {
      let cancelled = false;

      async function loadLatestFromHistory() {
        try {
          setLoading(true);
          const resp = await getHistory();
          if (cancelled) return;

          const payload = resp as unknown as Record<string, unknown>;
          const historyList = (payload.data ?? payload) as FortuneResult[];

          if (historyList && historyList.length > 0) {
            // 有历史记录，获取最新一条
            const latest = historyList[0];
            if (latest?.id) {
              // 用最新结果的 ID 加载详情
              const detailResp = await getFortuneResult(latest.id);
              if (cancelled) return;
              const detailPayload = detailResp as unknown as Record<string, unknown>;
              const detailData = (detailPayload.data ?? detailPayload) as FortuneResult;
              setResult(detailData);
            }
          } else {
            // 无历史记录，显示提示
            setError('暂无占卜记录，请先进行占卜');
          }
        } catch (err) {
          if (!cancelled) {
            setError('加载历史记录失败');
            console.error('获取历史记录失败:', err);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      loadLatestFromHistory();
      return () => { cancelled = true; };
    }
  }, [id]);

  /** 加载占卜结果 */
  useEffect(() => {
    // 有 ID 时直接加载
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadResult() {
      try {
        setLoading(true);
        setError(null);
        const resp = await getFortuneResult(id as string);
        if (cancelled) return;

        /* 兼容 { success, data } 和 { code, message, data } 两种格式 */
        const payload = (resp as unknown as Record<string, unknown>);
        const fortuneData = (payload.data ?? payload) as FortuneResult;
        setResult(fortuneData);
      } catch (err) {
        if (!cancelled) {
          setError('加载结果失败，请稍后重试');
          console.error('获取占卜结果失败:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResult();
    return () => { cancelled = true; };
  }, [id]);

  /** 自动滚动到消息底部 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [followMessages]);

  /** 提交追问 */
  const handleSubmitFollowUp = useCallback(async () => {
    const question = followQuestion.trim();
    if (!question || !result || followLoading) return;

    const userMsg: FollowUpMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setFollowMessages((prev) => [...prev, userMsg]);
    setFollowQuestion('');
    setFollowLoading(true);

    try {
      const resp = await submitFollowUp(result.id, question);
      const payload = resp as unknown as Record<string, unknown>;
      const answerData = (payload.data ?? payload) as { answer?: string; question?: string; timestamp?: string };

      if (answerData?.answer) {
        const aiMsg: FollowUpMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: answerData.answer,
          timestamp: answerData.timestamp || new Date().toISOString(),
        };
        setFollowMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('返回数据为空');
      }
    } catch (err) {
      console.error('追问失败:', err);
      const errMsg: FollowUpMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: '抱歉，追问失败了，请稍后再试。',
        timestamp: new Date().toISOString(),
      };
      setFollowMessages((prev) => [...prev, errMsg]);
    } finally {
      setFollowLoading(false);
    }
  }, [followQuestion, result, followLoading]);

  /** 回车发送追问 */
  const handleFollowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmitFollowUp();
      }
    },
    [handleSubmitFollowUp]
  );

  /** 收藏操作 */
  const handleBookmark = useCallback(() => {
    if (!result?.id) return;
    try {
      const key = 'tianji_bookmarks';
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = list.indexOf(result.id);
      if (idx !== -1) {
        list.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(list));
        setBookmarked(false);
      } else {
        list.push(result.id);
        localStorage.setItem(key, JSON.stringify(list));
        setBookmarked(true);
      }
    } catch {
      // 静默失败
    }
  }, [result]);

  /** 生成完整报告 */
  const handleGenerateReport = useCallback(() => {
    if (!result) return;
    setReportLoading(true);
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      setReportLoading(false);
      return;
    }

    const systemLabel = SYSTEM_LABELS[result.system] || result.system;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>${systemLabel}分析报告 - 天机阁</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.8; color: #1a1a2e; background: linear-gradient(135deg, #f8f9ff 0%, #eef1f8 100%); min-height: 100vh; padding: 40px 20px; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0,75,170,0.1); }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #f0f4ff; }
          .header h1 { font-size: 28px; color: #004baa; margin-bottom: 10px; }
          .header p { color: #6b7280; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; color: #004baa; margin-bottom: 15px; padding-left: 15px; border-left: 4px solid #004baa; }
          .data-card { background: linear-gradient(135deg, #f8f9ff 0%, #eef1f8 100%); border-radius: 12px; padding: 20px; margin-bottom: 15px; }
          .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }
          .data-row:last-child { border-bottom: none; }
          .data-label { color: #6b7280; }
          .data-value { color: #1a1a2e; font-weight: 500; }
          .ai-content { background: linear-gradient(135deg, #004baa 0%, #003d8f 100%); color: white; border-radius: 16px; padding: 30px; }
          .ai-content h3 { font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
          .ai-content p { line-height: 2; opacity: 0.95; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; color: #9ca3af; font-size: 12px; }
          @media print { body { background: white; } .container { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${systemLabel}分析报告</h1>
            <p>生成时间：${new Date().toLocaleString('zh-CN')}</p>
          </div>

          ${result.data && typeof result.data === 'object' ? `
          <div class="section">
            <h2 class="section-title">基础信息</h2>
            <div class="data-card">
              ${Object.entries(result.data as Record<string, unknown>).map(([key, value]) => `
                <div class="data-row">
                  <span class="data-label">${getFieldLabel(key, result.system)}</span>
                  <span class="data-value">${String(value)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${aiInterpretation ? `
          <div class="section">
            <h2 class="section-title">AI 深度解读</h2>
            <div class="ai-content">
              <h3>🌟 AI 深度解读</h3>
              <p>${String(aiInterpretation).replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p>本报告由天机阁 AI 系统自动生成 · 仅供参考</p>
          </div>
        </div>
      </body>
      </html>
    `;

    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    setTimeout(() => setReportLoading(false), 500);
  }, [result, aiInterpretation]);

  /** 分享操作（复制当前 URL 到剪贴板） */
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板 API 不可用时静默失败 */
    }
  }, []);

  /* ---- 加载状态 ---- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" style={{ color: 'var(--color-gold)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            正在加载分析结果...
          </p>
        </div>
      </div>
    );
  }

  /* ---- 错误状态 ---- */
  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold" style={{ color: 'var(--color-error)' }}>
            {error || '未找到结果'}
          </p>
          {error === '暂无占卜记录，请先进行占卜' ? (
            <Link
              to="/bazi"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-text-inverse)',
              }}
            >
              <Sparkles size={16} />
              去占卜
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-text-inverse)',
              }}
            >
              <ChevronLeft size={16} />
              返回上页
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto px-4 pb-24 pt-6"
      style={{ maxWidth: 'var(--max-width)' }}
    >
      <BackgroundDecoration />
      <>
        {/* ====== 1. 头部信息区 ====== */}
        <section className="mb-8">
          {/* 返回按钮 + 面包屑导航 */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-sm font-medium shrink-0 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--color-primary)', background: 'var(--color-primary-bg)' }}
            >
              <ChevronLeft size={16} />
              <span>返回</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              <Link to="/" className="hover:underline" style={{ color: 'var(--color-text-tertiary)' }}>首页</Link>
              <ChevronRightIcon size={12} />
              <span style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>{SYSTEM_CATEGORIES[result.system]}</span>
              <ChevronRightIcon size={12} />
              <span style={{ color: 'var(--color-primary)', opacity: 0.7 }}>{SYSTEM_LABELS[result.system]}</span>
              <ChevronRightIcon size={12} />
              <span style={{ color: 'var(--color-text-secondary)' }}>分析结果</span>
            </div>
          </div>

          {/* 体系标签 + 标题 + 时间 */}
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap" style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                {SYSTEM_ICONS[result.system] || SYSTEM_ICONS.bazi}
                {SYSTEM_LABELS[result.system] || result.system}
              </span>
              <h1
                className="mt-4 text-2xl md:text-3xl font-bold leading-tight"
                style={{
                  color: 'var(--color-text)',
                  textWrap: 'balance',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                您的{SYSTEM_LABELS[result.system] || result.system}分析
              </h1>
              <p className="mt-2 text-sm flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <Clock size={14} />
                {formatTime(result.createdAt)}
              </p>
            </div>
            <div className="hidden sm:block">
              <SunIcon />
            </div>
          </div>

          {/* 综合评分（带环形进度图） */}
          {scoreNum !== undefined && (
            <div
              className="flex items-center gap-6 p-6 rounded-xl"
              style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-md)' }}
            >
              <ProgressRing score={scoreNum} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                    {typeof scoreSummary === 'string' ? scoreSummary : '整体运势良好'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--state-success)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" className="mr-1">
                      <path d="M5 2l2 4 4.5.5-3 3 .5 4.5L5 12l-4 2 .5-4.5-3-3 4.5-.5z" fill="currentColor" />
                    </svg>
                    优+
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  命主壬水得令，运势平稳上升，宜稳中求进。
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${scoreNum}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }} />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>本月运势</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ====== 2. 基础结论区（结构化数据） ====== */}
        {result.data && typeof result.data === 'object' && (
          <section
            className="mb-8 p-6 md:p-8 rounded-xl"
            style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                分析结果
              </h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.3">
                <path d="M12 2L15 8.5L22 9.5L17 14.5L18 22L12 18.5L6 22L7 14.5L2 9.5L9 8.5L12 2Z" stroke="var(--color-primary)" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <DataSection data={result.data as Record<string, unknown>} system={result.system} />
          </section>
        )}

        {/* ====== 3. 详细分析区（Tab 切换） ====== */}
        <section
          className="mb-8 p-6 md:p-8 rounded-xl"
          style={{ background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              详细分析
            </h2>
            <svg width="60" height="12" viewBox="0 0 60 12" fill="none" opacity="0.2">
              <path d="M0 6c10-6 20 6 30 0s20 6 30 0" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Tab 列表 */}
          <div
            className="flex flex-nowrap overflow-x-auto gap-6 mb-6 pb-3"
            style={{ borderBottom: '1px solid var(--color-border-light)' }}
          >
            {ANALYSIS_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn text-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  }}
                >
                  {TAB_ICONS[tab.key]}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 内容区 */}
          {activeTab === 'personality' && (
            <div>
              {interpretationSections.personality ? (
                <div className="flex gap-6">
                  <TabContentDecoration />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <MarkdownText text={interpretationSections.personality} theme="light" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <KeywordTag label="智慧" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15 8.5L22 9.5L17 14.5L18 22L12 18.5L6 22L7 14.5L2 9.5L9 8.5L12 2Z"/></svg>} />
                      <KeywordTag label="果断" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>} />
                      <KeywordTag label="适应力强" icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>} />
                    </div>
                  </div>
                </div>
              ) : aiInterpretation ? (
                <div className="flex gap-6">
                  <TabContentDecoration />
                  <div className="flex-1 min-w-0 text-sm">
                    <MarkdownText text={String(aiInterpretation)} theme="light" />
                  </div>
                </div>
              ) : (
                <TabPlaceholder
                  icon={<Sparkles size={40} style={{ color: 'var(--color-border)' }} />}
                  title="性格特征"
                />
              )}
            </div>
          )}
          {activeTab === 'career' && (
            interpretationSections.career ? (
              <div className="flex gap-6">
                <TabContentDecoration />
                <div className="flex-1 min-w-0 text-sm">
                  <MarkdownText text={interpretationSections.career} theme="light" />
                </div>
              </div>
            ) : (
              <TabPlaceholder
                icon={<FileText size={40} style={{ color: 'var(--color-border)' }} />}
                title="事业方向"
              />
            )
          )}
          {activeTab === 'love' && (
            interpretationSections.love ? (
              <div className="flex gap-6">
                <TabContentDecoration />
                <div className="flex-1 min-w-0 text-sm">
                  <MarkdownText text={interpretationSections.love} theme="light" />
                </div>
              </div>
            ) : (
              <TabPlaceholder
                icon={<Heart size={40} style={{ color: 'var(--color-border)' }} />}
                title="感情婚姻"
              />
            )
          )}
          {activeTab === 'health' && (
            interpretationSections.health ? (
              <div className="flex gap-6">
                <TabContentDecoration />
                <div className="flex-1 min-w-0 text-sm">
                  <MarkdownText text={interpretationSections.health} theme="light" />
                </div>
              </div>
            ) : (
              <TabPlaceholder
                icon={<Sparkles size={40} style={{ color: 'var(--color-border)' }} />}
                title="健康提醒"
              />
            )
          )}
          {activeTab === 'fortune' && (
            interpretationSections.fortune ? (
              <div className="flex gap-6">
                <TabContentDecoration />
                <div className="flex-1 min-w-0 text-sm">
                  <MarkdownText text={interpretationSections.fortune} theme="light" />
                </div>
              </div>
            ) : (
              <TabPlaceholder
                icon={<Clock size={40} style={{ color: 'var(--color-border)' }} />}
                title="大运流年"
              />
            )
          )}
        </section>

        {/* ====== 4. AI 深度解读区 ====== */}
        {aiInterpretation && (
          <section
            className="mb-8 p-6 md:p-8 rounded-xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(200, 168, 78, 0.2) 0%, transparent 70%)' }} />
              <svg className="absolute -top-5 -right-5 w-32 h-32 opacity-10" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="1" fill="none" />
                <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="40" cy="40" r="20" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-light)" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-inverse)' }}>
                  AI 深度解读
                </h2>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                  Powered by AI
                </span>
              </div>
              {/* 分隔线 */}
              <div
                className="mb-6"
                style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
              />

            {/* 解读文本（Markdown 渲染 + 增强） */}
            <EnhancedAIInterpretation 
              interpretation={String(aiInterpretation)} 
              data={result.data as Record<string, unknown> || {}}
            />

            {/* 追问消息列表 */}
            {followMessages.length > 0 && (
              <div className="mb-6 space-y-4">
                <div
                  className="mb-3"
                  style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                />
                {followMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex gap-3"
                    style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    {msg.role === 'ai' && (
                      <div
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                      >
                        <Sparkles size={14} style={{ color: 'var(--color-gold-light)' }} />
                      </div>
                    )}
                    <div
                      className="max-w-[80%] px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: msg.role === 'user'
                          ? 'var(--color-gold)'
                          : 'rgba(255,255,255,0.08)',
                        color: msg.role === 'user'
                          ? 'var(--color-primary-darker)'
                          : 'rgba(255,255,255,0.92)',
                        borderTopRightRadius: msg.role === 'user' ? '4px' : undefined,
                        borderTopLeftRadius: msg.role === 'ai' ? '4px' : undefined,
                      }}
                    >
                      {msg.role === 'ai' ? (
                        <MarkdownText text={msg.content} theme="dark" />
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-gold)' }}
                      >
                        <span className="text-xs font-bold" style={{ color: 'var(--color-primary-darker)' }}>
                          我
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {/* AI 加载中 */}
                {followLoading && (
                  <div className="flex gap-3">
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      <Sparkles size={14} style={{ color: 'var(--color-gold-light)' }} />
                    </div>
                    <div
                      className="px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.08)', borderTopLeftRadius: '4px' }}
                    >
                      <Loader2 size={18} className="animate-spin" style={{ color: 'var(--color-gold-light)' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* 追问输入框 */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 min-w-0 flex items-center px-4 py-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <input
                  type="text"
                  value={followQuestion}
                  onChange={(e) => setFollowQuestion(e.target.value)}
                  onKeyDown={handleFollowKeyDown}
                  placeholder="继续追问..."
                  disabled={followLoading}
                  className="bg-transparent outline-none text-sm flex-1 min-w-0"
                  style={{ color: 'var(--color-text-inverse)', fontFamily: 'var(--font-body)' }}
                />
              </div>
              <button
                onClick={handleSubmitFollowUp}
                disabled={!followQuestion.trim() || followLoading}
                className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all"
                style={{
                  background: (!followQuestion.trim() || followLoading)
                    ? 'rgba(255,255,255,0.15)'
                    : 'var(--color-gold)',
                  color: (!followQuestion.trim() || followLoading)
                    ? 'rgba(255,255,255,0.4)'
                    : 'var(--color-primary-darker)',
                  cursor: (!followQuestion.trim() || followLoading) ? 'not-allowed' : 'pointer',
                }}
              >
                {followLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            </div>
          </section>
        )}
      </>

      {/* ====== 5. 操作栏（固定底部） ====== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'var(--color-bg-elevated)',
          borderTop: '1px solid var(--color-border-light)',
          boxShadow: '0 -2px 12px rgba(0,20,50,0.06)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-center gap-4 md:gap-8 px-6 py-3"
          style={{ maxWidth: 'var(--max-width)' }}
        >
          {/* 收藏结果 */}
          <button
            onClick={handleBookmark}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all shrink-0"
            style={{
              color: bookmarked ? 'var(--color-error)' : 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Heart size={20} fill={bookmarked ? 'currentColor' : 'none'} />
            <span className="text-xs whitespace-nowrap">
              {bookmarked ? '已收藏' : '收藏结果'}
            </span>
          </button>
          {/* 分享卡片 */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors shrink-0"
            style={{
              color: copied ? 'var(--state-success)' : 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Share2 size={20} />
            <span className="text-xs whitespace-nowrap">{copied ? '已复制' : '分享卡片'}</span>
          </button>
          {/* 查看完整报告 */}
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors shrink-0"
            style={{
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: reportLoading ? 'wait' : 'pointer',
            }}
          >
            {reportLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <FileText size={20} />
            )}
            <span className="text-xs whitespace-nowrap">完整报告</span>
          </button>
          {/* 重新占卜 */}
          {systemRoute && (
            <Link
              to={systemRoute}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors shrink-0"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <RefreshCw size={20} />
              <span className="text-xs whitespace-nowrap">重新占卜</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
