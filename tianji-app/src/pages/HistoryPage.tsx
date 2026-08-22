import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History, Trash2, ScrollText, Star, ChevronRight,
  CircleDot, Layers, Orbit, Sparkles as SparklesIcon, Moon, Flower2, Hexagon, Brain,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { getHistory } from '@/services/api';
import type { FortuneResult } from '@/types';
import { DemoBanner } from '@/components/InsightsShared';
import { SYSTEM_META, FALLBACK_META } from '@/data/systemMeta';

/* ============ 历史记录数据 ============ */
interface HistoryRecord {
  id: string;
  system: string;
  systemKey: string;
  systemGroup: 'eastern' | 'western' | 'folk' | 'ai';
  systemColor: string;
  systemBg: string;
  icon: string;
  summary: string;
  time: string;
  favorited: boolean;
}

const FAV_KEY = 'tianji_history_favs';

function loadFavs(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveFavs(favs: Record<string, boolean>): void {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

/** 从查询结果中提取摘要 */
function extractSummary(data: unknown): string {
  const d = (data && typeof data === 'object' && !Array.isArray(data) ? data : {}) as Record<string, unknown>;
  const candidates = [d.summary, d.overallInterpretation, d.interpretation, d.aiInterpretation, d.advice];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      const t = c.replace(/\s+/g, ' ').trim();
      return t.length > 42 ? `${t.slice(0, 42)}…` : t;
    }
  }
  return '查看本次占卜详情';
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** 图标映射 */
const ICON_MAP: Record<string, React.ReactNode> = {
  'circle-dot': <CircleDot size={20} />,
  'layers': <Layers size={20} />,
  'orbit': <Orbit size={20} />,
  'sparkles': <SparklesIcon size={20} />,
  'flower-2': <Flower2 size={20} />,
  'hexagon': <Hexagon size={20} />,
  'brain': <Brain size={20} />,
  'moon': <Moon size={20} />,
};

/** 历史记录页面 */
export default function HistoryPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSystem, setFilterSystem] = useState('all');
  const [favs, setFavs] = useState<Record<string, boolean>>(loadFavs);

  const isDemo = !authLoading && !user;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const resp = await getHistory(100);
        if (cancelled) return;
        const list = (resp.data ?? []) as FortuneResult[];
        const mapped: HistoryRecord[] = list.map((r) => {
          const meta = SYSTEM_META[r.system] || FALLBACK_META;
          return {
            id: r.id,
            system: meta.name,
            systemKey: r.system,
            systemGroup: meta.group,
            systemColor: meta.color,
            systemBg: meta.bg,
            icon: meta.icon,
            summary: extractSummary(r.data),
            time: fmtTime(r.createdAt),
            favorited: Boolean(loadFavs()[r.id]),
          };
        });
        setRecords(mapped);
      } catch {
        if (!cancelled) setRecords([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  /** 筛选后的记录 */
  const filteredRecords = filterSystem === 'all'
    ? records
    : records.filter((r) => r.systemGroup === filterSystem);

  /** 切换收藏 */
  const toggleFavorite = (id: string) => {
    setFavs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveFavs(next);
      return next;
    });
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, favorited: !favs[id] } : r));
  };

  /** 删除记录 */
  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  /** 清空全部（二次确认，避免 iframe 环境 window.confirm 被拦截导致点击无响应） */
  const [confirmingClear, setConfirmingClear] = useState(false);
  const confirmTimer = useRef<number | null>(null);

  const clearAll = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
      confirmTimer.current = window.setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    setConfirmingClear(false);
    setRecords([]);
  };

  useEffect(() => () => {
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
  }, []);

  /** 收藏数 */
  const favoriteCount = records.filter((r) => r.favorited).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* 页面头部 */}
      <section style={{ paddingTop: 32, paddingBottom: 24, marginBottom: 24 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
          {/* 面包屑导航 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <a href="/" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textDecoration: 'none', whiteSpace: 'nowrap' }}>首页</a>
            <ChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <span style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap' }}>历史记录</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <History size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 8, wordBreak: 'keep-all' }}>
              历史记录
            </h1>
          </div>
          <p style={{ fontSize: 'clamp(var(--text-sm), 1.5vw, var(--text-base))', color: 'var(--color-text-secondary)' }}>
            {isDemo ? '查看演示占卜记录' : '查看和管理你的占卜记录'}
          </p>
        </div>
      </section>

      {/* 主体内容 */}
      <section>
        <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>

          {/* 演示数据横幅（仅未登录态） */}
          {isDemo && <DemoBanner />}

          {/* 加载中 */}
          {loading && (
            <div style={{ padding: '96px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--color-text-tertiary)' }}>
              <ScrollText size={32} className="animate-spin" style={{ animationDuration: '2s' }} />
              <span style={{ fontSize: 'var(--text-sm)' }}>正在加载记录…</span>
            </div>
          )}

          {!loading && (
            <>
          {/* 筛选栏 */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <select value={filterSystem} onChange={(e) => setFilterSystem(e.target.value)} style={{
                appearance: 'none', background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)', borderRadius: 8,
                padding: '8px 32px 8px 12px', fontSize: 'var(--text-sm)', fontWeight: 500,
                color: 'var(--color-text)', cursor: 'pointer',
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                backgroundSize: 16,
              }}>
                <option value="all">全部体系</option>
                <option value="eastern">东方命理</option>
                <option value="western">西方占卜</option>
                <option value="folk">民俗</option>
                <option value="ai">AI 洞察</option>
              </select>
            </div>
          </section>

          {/* 统计摘要 */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                <ScrollText size={16} color="var(--color-primary)" /> 共 <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{filteredRecords.length}</strong> 条记录
              </span>
              <span style={{ color: 'var(--color-border-light)' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                <Star size={16} color="var(--color-gold)" /> <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{favoriteCount}</strong> 条收藏
              </span>
            </div>
          </section>

          {/* 历史列表 */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {filteredRecords.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, background: 'var(--color-primary-bg)' }}>
                  <ScrollText size={40} color="var(--color-primary-lighter)" />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>{isDemo ? '暂无演示记录' : '暂无占卜记录'}</h3>
                <p style={{ fontSize: 'var(--text-sm)', marginBottom: 24, color: 'var(--color-text-tertiary)' }}>{isDemo ? '完成占卜后即可查看记录' : '你的每一次占卜都会在这里留下记录'}</p>
                <button onClick={() => navigate('/bazi')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', background: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>
                  <SparklesIcon size={16} /> 开始占卜
                </button>
              </div>
            )}
            {filteredRecords.map((record) => (
              <div key={record.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-light)', borderRadius: 12,
                transition: 'all 150ms ease',
              }}>
                {/* 左侧：体系图标+标签 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minWidth: 130 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: record.systemBg }}>
                    <span style={{ color: record.systemColor }}>{ICON_MAP[record.icon]}</span>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 4, fontSize: 'var(--text-xs)', fontWeight: 500, whiteSpace: 'nowrap', background: record.systemBg, color: record.systemColor }}>
                    {record.system}
                  </span>
                </div>
                {/* 中间：摘要+时间 */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text)' }}>{record.summary}</p>
                  <span style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', color: 'var(--color-text-tertiary)' }}>{record.time}</span>
                </div>
                {/* 右侧：操作 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {/* 收藏 */}
                  <button onClick={() => toggleFavorite(record.id)} title={record.favorited ? '取消收藏' : '收藏'} style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: record.favorited ? 'var(--color-gold)' : 'var(--color-text-tertiary)',
                  }}>
                    <Star size={16} fill={record.favorited ? 'currentColor' : 'none'} />
                  </button>
                  {/* 删除 */}
                  <button onClick={() => deleteRecord(record.id)} title="删除" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer', color: 'var(--color-text-tertiary)',
                  }}>
                    <Trash2 size={16} />
                  </button>
                  {/* 查看 */}
                  <button onClick={() => navigate(`/result/${record.systemKey}/${record.id}`)} title="查看详情" style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, fontSize: 'var(--text-sm)', fontWeight: 500,
                    color: 'var(--color-primary)', background: 'var(--color-primary-bg)',
                    border: '1px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    查看
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* 底部清空 */}
          {filteredRecords.length > 0 && (
            <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button onClick={clearAll} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 8, fontSize: 'var(--text-sm)', fontWeight: 500,
                color: confirmingClear ? '#fff' : 'var(--state-error)',
                background: confirmingClear ? 'var(--state-error)' : 'rgba(196, 58, 58, 0.06)',
                border: '1px solid rgba(196, 58, 58, 0.2)', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                <Trash2 size={16} /> {confirmingClear ? '再次点击确认清空' : '清空全部记录'}
              </button>
            </section>
          )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
