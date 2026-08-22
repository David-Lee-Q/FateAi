/** 体系元信息（名称/配色/图标/分组），历史、分享等模块共用 */
export type SystemGroup = 'eastern' | 'western' | 'folk' | 'ai';

export interface SystemMeta {
  name: string;
  color: string;
  bg: string;
  icon: string;
  group: SystemGroup;
}

export const SYSTEM_META: Record<string, SystemMeta> = {
  bazi: { name: '八字命理', color: 'var(--color-primary)', bg: 'var(--color-primary-bg-strong)', icon: 'circle-dot', group: 'eastern' },
  ziwei: { name: '紫微斗数', color: 'var(--color-gold-dark)', bg: 'rgba(200, 168, 78, 0.1)', icon: 'orbit', group: 'eastern' },
  meihua: { name: '梅花易数', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', icon: 'flower-2', group: 'eastern' },
  liuyao: { name: '六爻占卜', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', icon: 'hexagon', group: 'eastern' },
  qimen: { name: '奇门遁甲', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: 'hexagon', group: 'eastern' },
  tieban: { name: '铁板神数', color: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', icon: 'circle-dot', group: 'eastern' },
  daliuren: { name: '大六壬', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', icon: 'orbit', group: 'eastern' },
  tarot: { name: '塔罗牌阵', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', icon: 'layers', group: 'western' },
  zodiac: { name: '星座运势', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', icon: 'sparkles', group: 'western' },
  numerology: { name: '数字能量', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', icon: 'sparkles', group: 'western' },
  astrodice: { name: '骰子占卜', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)', icon: 'circle-dot', group: 'western' },
  moonphase: { name: '月相占卜', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)', icon: 'moon', group: 'western' },
  rune: { name: '符文占卜', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', icon: 'flower-2', group: 'western' },
  dream: { name: '解梦分析', color: '#a855f7', bg: 'rgba(168, 85, 183, 0.1)', icon: 'moon', group: 'folk' },
  shengxiao: { name: '生肖运势', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', icon: 'sparkles', group: 'folk' },
  almanac: { name: '黄历宜忌', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)', icon: 'hexagon', group: 'folk' },
  drawlot: { name: '签诗抽签', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)', icon: 'flower-2', group: 'folk' },
  palm: { name: '手相算命', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', icon: 'circle-dot', group: 'folk' },
  fengshui: { name: '风水堪舆', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', icon: 'orbit', group: 'folk' },
  report: { name: 'AI 洞察', color: 'var(--color-primary)', bg: 'linear-gradient(135deg, rgba(0,75,170,0.12), rgba(200,168,78,0.08))', icon: 'brain', group: 'ai' },
  compare: { name: '对比分析', color: 'var(--color-primary)', bg: 'linear-gradient(135deg, rgba(0,75,170,0.12), rgba(200,168,78,0.08))', icon: 'brain', group: 'ai' },
  search: { name: '运势搜索', color: 'var(--color-primary)', bg: 'var(--color-primary-bg-strong)', icon: 'brain', group: 'ai' },
  trend: { name: '趋势分析', color: 'var(--color-primary)', bg: 'var(--color-primary-bg-strong)', icon: 'brain', group: 'ai' },
};

export const FALLBACK_META: SystemMeta = {
  name: '占卜记录',
  color: 'var(--color-primary)',
  bg: 'var(--color-primary-bg-strong)',
  icon: 'circle-dot',
  group: 'eastern',
};

export function getSystemMeta(system: string): SystemMeta {
  return SYSTEM_META[system] ?? FALLBACK_META;
}
