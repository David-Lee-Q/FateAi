import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Clock, Sparkles, LayoutGrid, Flame,
  Trash2, X, ArrowRight, ChevronRight, Zap,
  Heart, Star, Award, Lightbulb, Scroll,
} from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';

/* ============ 工具数据 ============ */
interface ToolItem {
  name: string;
  path: string;
  category: string;
  desc: string;
  matchReason: string;
  badgeText: string;
  badgeType: 'gold' | 'blue';
  iconType: string;
}

const ALL_TOOLS: ToolItem[] = [
  { name: '周公解梦', path: '/dream', category: 'folk', desc: '输入梦境关键词，AI 智能解析梦境含义，古今梦境解读对照', matchReason: '梦境解析与"做梦"直接相关', badgeText: '最佳匹配', badgeType: 'gold', iconType: 'moon' },
  { name: '塔罗牌占卜', path: '/tarot', category: 'western', desc: '抽取塔罗牌，结合正逆位含义，解读潜意识与情绪状态', matchReason: '梦境常反映情绪与潜意识', badgeText: '也可用于情绪分析', badgeType: 'blue', iconType: 'tarot' },
  { name: '签诗抽签', path: '/drawlot', category: 'folk', desc: '线上抽签问卦，获取签诗解读，传统民俗智慧指引方向', matchReason: '梦境可关联签诗求卦', badgeText: '民俗参考', badgeType: 'blue', iconType: 'lantern' },
  { name: '手相算命', path: '/palm', category: 'folk', desc: '上传手掌照片，AI 分析三大主线与掌型特征，五行掌型解读', matchReason: '与求签同属民俗趣味类占卜工具', badgeText: '民俗趣味', badgeType: 'blue', iconType: 'lantern' },
  { name: '星座运势', path: '/zodiac', category: 'western', desc: '十二星座每日运势更新，涵盖爱情、事业、财运等维度', matchReason: '星座与梦境同样受天象影响', badgeText: '每日运势', badgeType: 'blue', iconType: 'zodiac' },
];

const HOT_SEARCHES = ['今日运势', '做梦了', '塔罗牌', '算卦', '八字', '桃花运', '抽签', '财运', '事业运', '感情运势', '本周运势', '蛇年运势'];

// 占卜系统与关键词映射
const SYSTEM_MAP: Record<string, string> = {
  '周公解梦': 'dream',
  '塔罗牌': 'tarot',
  '星座': 'zodiac',
  '八字': 'bazi',
  '紫微斗数': 'ziwei',
  '风水': 'fengshui',
  '抽签': 'drawlot',
  '手相': 'palm',
  '骰子': 'astrodice',
  '符文': 'rune',
  '生肖': 'shengxiao',
  '黄历': 'almanac',
  '月相': 'moonphase',
  '六爻': 'liuyao',
  '梅花': 'meihua',
  '奇门': 'qimen',
  '数字能量': 'numerology',
  '姓名': 'nametest',
};

/* ============ 样式 ============ */
const containerStyle: React.CSSProperties = {
  maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24,
};

const searchBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '2px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 9999, padding: '18px 24px 18px 56px',
  fontSize: 'var(--text-lg)', color: 'var(--color-text)',
  width: '100%', maxWidth: 720,
  fontFamily: 'var(--font-body)', outline: 'none',
};

const hotTagStyle: React.CSSProperties = {
  padding: '8px 18px', borderRadius: 9999,
  background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)',
  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
  backgroundClip: 'padding-box',
};

const historyItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '16px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
};

/* ============ 搜索页面 ============ */
export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { addHistory, deleteHistory, clearHistory, getFormattedHistory } = useSearchHistory();
  const [formattedHistory, setFormattedHistory] = useState<Array<{id: string; text: string; time: string; system?: string}>>([]);

  // 格式化历史记录
  useEffect(() => {
    setFormattedHistory(getFormattedHistory());
  }, [getFormattedHistory, addHistory, deleteHistory, clearHistory]);

  /** 过滤工具 */
  const filteredTools = query.trim()
    ? ALL_TOOLS.filter((t) => t.name.includes(query) || t.desc.includes(query))
    : [];

  /** 识别搜索关键词对应的系统 */
  const detectSystem = (text: string): string | undefined => {
    for (const [keyword, system] of Object.entries(SYSTEM_MAP)) {
      if (text.includes(keyword)) return system;
    }
    return undefined;
  };

  /** 添加搜索历史并跳转到对应工具 */
  const handleToolClick = (tool: ToolItem) => {
    const toolName = tool.name.replace(/占卜|算命/g, '');
    addHistory(tool.name, tool.path.replace('/', ''));
    navigate(tool.path);
  };

  /** 处理热门搜索点击 */
  const handleHotSearch = (tag: string) => {
    setQuery(tag);
    const system = detectSystem(tag);
    addHistory(tag, system);
    // 如果匹配到系统，跳转到对应页面
    if (system) {
      navigate(`/${system}`);
    }
  };

  /** 处理历史记录点击 */
  const handleHistoryClick = (item: typeof formattedHistory[0]) => {
    setQuery(item.text);
    if (item.system) {
      navigate(`/${item.system}`);
    }
  };

  return (
    <div>
      {/* 搜索主区域：搜索框 + 工具推荐 */}
      <section style={{ padding: '80px 0 64px', background: 'linear-gradient(180deg, #001a40 0%, #0a0e1a 100%)' }}>
        <div style={containerStyle}>
          {/* 标题区域 */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(0, 75, 170, 0.15)', marginBottom: 20 }}>
              <Sparkles size={28} color="#004baa" />
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#f0f0f0', fontFamily: "'Noto Serif SC', serif", marginBottom: 12, letterSpacing: '-0.02em' }}>发现智慧工具</h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(232,212,139,0.8)', lineHeight: 1.75 }}>搜索周公解梦、塔罗牌、星座运势等民俗智慧工具</p>
          </div>

          {/* 搜索框 */}
          <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto 48px' }}>
            <Search size={20} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索工具，如：周公解梦、塔罗牌..."
              style={searchBoxStyle}
            />
          </div>

          {/* 工具卡片网格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                onClick={() => handleToolClick(tool)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,75,170,0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,75,170,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 徽章 + 箭头 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 500,
                    background: tool.badgeType === 'gold' ? 'rgba(200,168,78,0.15)' : 'rgba(0,75,170,0.12)',
                    color: tool.badgeType === 'gold' ? '#c8a84e' : '#4a90d9',
                  }}>
                    {tool.badgeType === 'gold' && <Award size={12} />}
                    {tool.badgeText}
                  </span>
                  <ChevronRight size={16} color="var(--color-text-tertiary)" />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>{tool.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{tool.desc}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-lighter)' }}>{tool.matchReason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门搜索标签云 */}
      <section style={{ padding: '64px 0', background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200, 168, 78, 0.12)' }}>
              <Flame size={16} color="var(--color-gold)" />
            </div>
            <h2 style={{ fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>热门搜索</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {HOT_SEARCHES.map((tag) => (
              <button key={tag} onClick={() => handleHotSearch(tag)} style={hotTagStyle}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 搜索历史记录 */}
      <section style={{ padding: '64px 0', background: '#0d1220', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 75, 170, 0.12)' }}>
                <Clock size={16} color="var(--color-primary-lighter)" />
              </div>
              <h2 style={{ fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>搜索历史</h2>
            </div>
            <button onClick={clearHistory} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>
              清空全部
            </button>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 16, padding: '16px 24px' }}>
            {formattedHistory.length === 0 && (
              <p style={{ textAlign: 'center', padding: 16, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>暂无搜索历史</p>
            )}
            {formattedHistory.map((item) => (
              <div key={item.id} style={historyItemStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                  <Clock size={14} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
                  <span onClick={() => handleHistoryClick(item)} style={{ cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.text}
                  </span>
                  <span style={{ flexShrink: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{item.time}</span>
                </div>
                <button onClick={() => deleteHistory(item.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  background: 'none', border: 'none', color: 'var(--color-text-tertiary)',
                  cursor: 'pointer', flexShrink: 0,
                }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
