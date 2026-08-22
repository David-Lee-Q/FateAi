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
import BaziLayout from './result/layouts/BaziLayout';
import ZiweiLayout from './result/layouts/ZiweiLayout';
import TarotLayout from './result/layouts/TarotLayout';
import PalmLayout from './result/layouts/PalmLayout';
import TiebanLayout from './result/layouts/TiebanLayout';
import DaliurenLayout from './result/layouts/DaliurenLayout';
import ZodiacLayout from './result/layouts/ZodiacLayout';
import LiuyaoLayout from './result/layouts/LiuyaoLayout';
import MeihuaLayout from './result/layouts/MeihuaLayout';
import QimenLayout from './result/layouts/QimenLayout';
import FengshuiLayout from './result/layouts/FengshuiLayout';
import NumerologyLayout from './result/layouts/NumerologyLayout';
import AstrodiceLayout from './result/layouts/AstrodiceLayout';
import MoonphaseLayout from './result/layouts/MoonphaseLayout';
import RuneLayout from './result/layouts/RuneLayout';
import NametestLayout from './result/layouts/NametestLayout';
import ShengxiaoLayout from './result/layouts/ShengxiaoLayout';
import AlmanacLayout from './result/layouts/AlmanacLayout';
import DrawlotLayout from './result/layouts/DrawlotLayout';
import ShareModal from '@/components/ShareModal';

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
}) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  // 检测是否为八字四柱数据
  const isBazi = system === 'bazi';
  const hasPillar = ['year', 'month', 'day', 'hour'].some(k => data[k] && typeof data[k] === 'object');

  // 八字布局
  if (isBazi && hasPillar) return <BaziLayout data={data} system={system} />;

  // 紫微斗数布局
  const isZiwei = system === 'ziwei';
  const hasMingGong = data.mingGong || data.命宫;
  const hasTwelvePalaces = data.twelvePalaces || data.十二宫位;
  if (isZiwei && (hasMingGong || hasTwelvePalaces)) return <ZiweiLayout data={data} system={system} />;

  // 塔罗牌布局
  if (Array.isArray(data.cards) && data.cards.length) return <TarotLayout data={data} system={system} />;

  // 手相布局
  const linesObj = (data.lines ?? {}) as Record<string, { description?: string; length?: string; status?: string }>;
  if (linesObj.life || linesObj.heart || linesObj.mind || data.handType) return <PalmLayout data={data} system={system} />;

  // 铁板神数布局
  if (data.mainCode !== undefined || data.mainNumber) return <TiebanLayout data={data} system={system} />;

  // 大六壬布局
  if (data.chuan || data.diPan || data.shen) return <DaliurenLayout data={data} system={system} />;

  // 星座布局
  if (system === 'zodiac') return <ZodiacLayout data={data} system={system} />;

  // 梦境解析布局
  if (Array.isArray(data.entries) && data.entries.length) {
    return <DreamLayout data={data} />;
  }

  // 六爻布局
  if (data.originalGua && typeof data.originalGua === 'object' && 'name' in (data.originalGua as object)) return <LiuyaoLayout data={data} system={system} />;

  // 梅花易数布局
  if (data.mainGua && typeof data.mainGua === 'object' && 'name' in (data.mainGua as object)) return <MeihuaLayout data={data} system={system} />;

  // 奇门遁甲布局
  if (data.juShu || data.tianPan) return <QimenLayout data={data} system={system} />;

  // 风水布局
  if (data.direction) return <FengshuiLayout data={data} system={system} />;

  // 数字能量布局
  if (data.lifePathNumber !== undefined) return <NumerologyLayout data={data} system={system} />;

  // 占星骰子布局
  if (data.dice1) return <AstrodiceLayout data={data} system={system} />;

  // 月相布局
  if (data.moonPhase) return <MoonphaseLayout data={data} system={system} />;

  // 符文布局
  if (Array.isArray(data.runes) && data.runes.length) return <RuneLayout data={data} system={system} />;

  // 姓名测试布局
  if (data.fullName) return <NametestLayout data={data} system={system} />;

  // 生肖布局
  if (data.animal || system === 'shengxiao') return <ShengxiaoLayout data={data} system={system} />;

  // 老黄历布局
  if (data.date) return <AlmanacLayout data={data} system={system} />;

  // 抽签布局
  if (data.lotNumber !== undefined) return <DrawlotLayout data={data} system={system} />;

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
  const [shareOpen, setShareOpen] = useState(false);
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

  /** 打开分享弹窗（图片卡片 / 复制文字 / 复制链接） */
  const handleShare = useCallback(() => {
    setShareOpen(true);
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
          className="mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 md:gap-x-8"
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
          {/* 分享 */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors shrink-0"
            style={{
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Share2 size={20} />
            <span className="text-xs whitespace-nowrap">分享</span>
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

      {result && (
        <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} result={result} />
      )}
    </div>
  );
}
