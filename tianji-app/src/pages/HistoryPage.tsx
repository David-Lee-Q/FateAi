import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History, Trash2, ScrollText, Star, ChevronRight,
  CircleDot, Layers, Orbit, Sparkles as SparklesIcon, Moon, Flower2, Hexagon, Brain,
} from 'lucide-react';

/* ============ 历史记录数据 ============ */
interface HistoryRecord {
  id: string;
  system: string;
  systemColor: string;
  systemBg: string;
  icon: string;
  summary: string;
  time: string;
  favorited: boolean;
}

const MOCK_HISTORY: HistoryRecord[] = [
  { id: '1', system: '八字排盘', systemColor: 'var(--color-primary)', systemBg: 'var(--color-primary-bg-strong)', icon: 'circle-dot', summary: '壬水日主生于午月，甲辰年偏印坐库分析', time: '2026-07-09 14:32', favorited: true },
  { id: '2', system: '塔罗牌阵', systemColor: '#8b5cf6', systemBg: 'rgba(139, 92, 246, 0.1)', icon: 'layers', summary: '凯尔特十字牌阵 — 事业方向指引', time: '2026-07-08 20:15', favorited: false },
  { id: '3', system: '紫微斗数', systemColor: 'var(--color-gold-dark)', systemBg: 'rgba(200, 168, 78, 0.1)', icon: 'orbit', summary: '命盘十二宫分析 — 事业宫紫微星坐守', time: '2026-07-07 10:48', favorited: true },
  { id: '4', system: '星座运势', systemColor: '#38bdf8', systemBg: 'rgba(56, 189, 248, 0.1)', icon: 'sparkles', summary: '天蝎座本周运势 — 综合运势评分 82', time: '2026-07-06 08:30', favorited: false },
  { id: '5', system: '梅花易数', systemColor: '#22c55e', systemBg: 'rgba(34, 197, 94, 0.1)', icon: 'flower-2', summary: '占问项目合作前景 — 火水未济变火风鼎', time: '2026-07-05 16:22', favorited: false },
  { id: '6', system: '六爻排卦', systemColor: '#fb923c', systemBg: 'rgba(251, 146, 60, 0.1)', icon: 'hexagon', summary: '天水讼卦变天火同人 — 诉讼纠纷问运', time: '2026-07-04 11:05', favorited: false },
  { id: '7', system: 'AI 洞察', systemColor: 'var(--color-primary)', systemBg: 'linear-gradient(135deg, rgba(0,75,170,0.12), rgba(200,168,78,0.08))', icon: 'brain', summary: '综合运势报告 — 八字+塔罗+星座交叉分析', time: '2026-07-03 09:18', favorited: true },
  { id: '8', system: '解梦分析', systemColor: '#a855f7', systemBg: 'rgba(168, 85, 247, 0.1)', icon: 'moon', summary: '梦见大水漫延 — 民俗周公解梦分析', time: '2026-07-02 07:45', favorited: false },
];

/* ============ 图标映射 ============ */
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

/* ============ 历史记录页面 ============ */
export default function HistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(MOCK_HISTORY);
  const [filterSystem, setFilterSystem] = useState('all');

  /** 筛选后的记录 */
  const filteredRecords = filterSystem === 'all'
    ? records
    : records.filter((r) => {
        if (filterSystem === 'eastern') return ['八字排盘', '紫微斗数', '梅花易数', '六爻排卦'].includes(r.system);
        if (filterSystem === 'western') return ['塔罗牌阵', '星座运势'].includes(r.system);
        if (filterSystem === 'folk') return ['解梦分析'].includes(r.system);
        if (filterSystem === 'ai') return ['AI 洞察'].includes(r.system);
        return true;
      });

  /** 切换收藏 */
  const toggleFavorite = (id: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, favorited: !r.favorited } : r));
  };

  /** 删除记录 */
  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  /** 清空全部 */
  const clearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      setRecords([]);
    }
  };

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
            查看和管理你的占卜记录
          </p>
        </div>
      </section>

      {/* 主体内容 */}
      <section>
        <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>

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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>暂无占卜记录</h3>
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 24, color: 'var(--color-text-tertiary)' }}>你的每一次占卜都会在这里留下记录</p>
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
                <button onClick={() => navigate(`/result/${record.system}/${record.id}`)} title="查看详情" style={{
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
              color: 'var(--state-error)', background: 'rgba(196, 58, 58, 0.06)',
              border: '1px solid rgba(196, 58, 58, 0.2)', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              <Trash2 size={16} /> 清空全部记录
            </button>
          </section>
        )}
        </div>
      </section>
    </div>
  );
}
