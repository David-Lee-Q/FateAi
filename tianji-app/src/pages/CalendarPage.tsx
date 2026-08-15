import { useState } from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, Sparkles,
  CheckCircle, XCircle,
} from 'lucide-react';

/* ============ 模拟农历数据 ============ */
const LUNAR_MAP: Record<string, string> = {
  '1-1': '六月初七', '1-2': '六月初八', '1-3': '六月初九', '1-4': '六月初十',
  '1-5': '六月十一', '1-6': '六月十二', '1-7': '六月十三', '1-8': '六月十四',
  '1-9': '六月十五', '1-10': '六月十六', '1-11': '六月十七', '1-12': '六月十八',
  '1-13': '六月十九', '1-14': '六月二十', '1-15': '六月廿一', '1-16': '六月廿二',
  '1-17': '六月廿三', '1-18': '六月廿四', '1-19': '六月廿五', '1-20': '六月廿六',
  '1-21': '六月廿七', '1-22': '六月廿八', '1-23': '六月廿九', '1-24': '七月初一',
  '1-25': '七月初二', '1-26': '七月初三', '1-27': '七月初四', '1-28': '七月初五',
  '1-29': '七月初六', '1-30': '七月初七', '1-31': '七月初八',
};

/* ============ 运势等级配置 ============ */
type FortuneLevel = 'ji' | 'xiong' | 'ping';

interface DayFortune {
  day: number;
  level: FortuneLevel;
  summary: string;
}

/** 生成月度运势数据 */
function generateMonthFortune(year: number, month: number): DayFortune[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const jiList = ['宜出行', '宜签约', '宜祈福', '宜纳财', '宜祭祀', '宜修造', '宜纳采', '宜栽种', '宜嫁娶', '宜入宅', '宜开光', '宜搬迁', '宜搬家'];
  const xiongList = ['忌动土', '忌嫁娶', '忌远行', '忌开市', '忌签约', '忌出行', '忌动土'];
  const fortunes: DayFortune[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const seed = (year * 367 + month * 31 + d * 7) % 100;
    let level: FortuneLevel;
    let summary: string;
    if (seed >= 60) {
      level = 'ji';
      summary = jiList[d % jiList.length];
    } else if (seed >= 30) {
      level = 'ping';
      summary = '平';
    } else {
      level = 'xiong';
      summary = xiongList[d % xiongList.length];
    }
    fortunes.push({ day: d, level, summary });
  }
  return fortunes;
}

/** 上月天数 */
function getPrevMonthDays(year: number, month: number): number {
  if (month === 1) return new Date(year - 1, 12, 0).getDate();
  return new Date(year, month - 1, 0).getDate();
}

/* ============ 样式常量 ============ */
const CSS = {
  contentContainer: {
    maxWidth: 1280,
    margin: '0 auto',
    paddingLeft: 24,
    paddingRight: 24,
  } as React.CSSProperties,
  breadcrumb: (_c: string) => ({
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--text-sm)',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
  }),
  monthNavBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 12,
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-elevated)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    background: 'var(--color-border)',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  } as React.CSSProperties,
  headerCell: {
    padding: '12px 8px',
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: 'var(--color-bg-inset)',
  } as React.CSSProperties,
  dayCell: (isOther: boolean, isToday: boolean, isSelected: boolean): React.CSSProperties => ({
    background: 'var(--color-bg-elevated)',
    padding: '8px 12px',
    minHeight: 100,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    position: 'relative',
    opacity: isOther ? 0.35 : 1,
    boxShadow: isSelected
      ? 'inset 0 0 0 2px var(--color-primary-light)'
      : isToday
        ? 'inset 0 0 0 2px var(--color-gold)'
        : 'none',
  } as React.CSSProperties),
  fortuneDot: (level: FortuneLevel) => ({
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: level === 'ji' ? 'var(--state-success)' : level === 'xiong' ? 'var(--state-error)' : 'var(--color-text-tertiary)',
  } as React.CSSProperties),
  detailPanel: {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 16,
    padding: 32,
    boxShadow: 'var(--shadow-lg)',
  } as React.CSSProperties,
  zeiriBox: {
    background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.1), rgba(200, 168, 78, 0.05))',
    border: '1px solid rgba(200, 168, 78, 0.2)',
    borderRadius: 16,
    padding: 32,
  } as React.CSSProperties,
};

/* ============ 页面组件 ============ */
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<DayFortune | null>(null);
  const [zeiriQuery, setZeiriQuery] = useState('');

  const fortunes = generateMonthFortune(year, month);
  const firstDayWeek = new Date(year, month - 1, 1).getDay();
  const prevMonthDays = getPrevMonthDays(year, month);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  /** 切换月份 */
  const changeMonth = (offset: number) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
  };

  /** 点击日期 */
  const handleDayClick = (day: number) => {
    const fortune = fortunes.find((f) => f.day === day);
    if (fortune) setSelectedDay(fortune);
  };

  /** 构建日历格子（含上月补位和下月补位） */
  const calendarCells: { day: number; isCurrentMonth: boolean; fortune?: DayFortune }[] = [];

  // 上月补位
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  // 本月
  fortunes.forEach((f) => calendarCells.push({ day: f.day, isCurrentMonth: true, fortune: f }));
  // 下月补位
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  /** 十二时辰模拟数据 */
  const hourData = [
    { name: '子', time: '23-1', level: 'ji' as FortuneLevel },
    { name: '丑', time: '1-3', level: 'xiong' as FortuneLevel },
    { name: '寅', time: '3-5', level: 'ji' as FortuneLevel },
    { name: '卯', time: '5-7', level: 'ji' as FortuneLevel },
    { name: '辰', time: '7-9', level: 'xiong' as FortuneLevel },
    { name: '巳', time: '9-11', level: 'ji' as FortuneLevel },
    { name: '午', time: '11-13', level: 'xiong' as FortuneLevel },
    { name: '未', time: '13-15', level: 'ji' as FortuneLevel },
    { name: '申', time: '15-17', level: 'ji' as FortuneLevel },
    { name: '酉', time: '17-19', level: 'xiong' as FortuneLevel },
    { name: '戌', time: '19-21', level: 'ji' as FortuneLevel },
    { name: '亥', time: '21-23', level: 'xiong' as FortuneLevel },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* 页面头部 */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div style={CSS.contentContainer}>
          {/* 面包屑导航 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <a href="/" style={CSS.breadcrumb('var(--color-primary)')}>首页</a>
            <ChevronRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
            <span style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap' }}>老黄历</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CalendarDays size={20} color="#fff" />
                </div>
                <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.2, wordBreak: 'keep-all' }}>
                  老黄历
                </h1>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                农历 · 宜忌 · 择日 · 时辰
              </p>
            </div>
            {/* 月份切换 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => changeMonth(-1)} style={CSS.monthNavBtn}>
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text)', minWidth: 120, textAlign: 'center' }}>
                {year}年{month}月
              </span>
              <button onClick={() => changeMonth(1)} style={CSS.monthNavBtn}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 日历主体 */}
      <section style={{ paddingBottom: 32 }}>
        <div style={CSS.contentContainer}>
          <div style={CSS.calendarGrid}>
            {/* 星期表头 */}
            {weekdays.map((wd) => (
              <div key={wd} style={CSS.headerCell}>{wd}</div>
            ))}
            {/* 日历格子 */}
            {calendarCells.map((cell, idx) => {
              const isToday = cell.isCurrentMonth && cell.day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
              const isSelected = cell.fortune && selectedDay?.day === cell.fortune.day;

              return (
                <div
                  key={idx}
                  onClick={() => cell.isCurrentMonth && handleDayClick(cell.day)}
                  style={CSS.dayCell(!cell.isCurrentMonth, isToday, !!isSelected)}
                >
                  {cell.fortune ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: isToday ? 'var(--color-gold)' : 'var(--color-text)', lineHeight: 1 }}>
                          {cell.day}
                        </span>
                        <span style={CSS.fortuneDot(cell.fortune.level)} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {LUNAR_MAP[`${month}-${cell.day}`] || ''}
                      </span>
                      <span style={{
                        fontSize: 10,
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: cell.fortune.level === 'ji' ? 'var(--state-success)' : cell.fortune.level === 'xiong' ? 'var(--state-error)' : 'var(--color-text-tertiary)',
                      }}>
                        {cell.fortune.summary}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1 }}>{cell.day}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 选中日期详情面板 */}
      {selectedDay && (
        <section style={{ paddingBottom: 32 }}>
          <div style={CSS.contentContainer}>
            <div style={CSS.detailPanel}>
              {/* 日期头部 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-3xl)', color: 'var(--color-gold)' }}>
                      {selectedDay.day}
                    </span>
                    <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', fontWeight: 500 }}>
                      {year}年{month}月{selectedDay.day}日
                    </span>
                    <span style={{ ...CSS.fortuneDot(selectedDay.level), width: 8, height: 8 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', flexWrap: 'wrap' }}>
                    <span>农历 {LUNAR_MAP[`${month}-${selectedDay.day}`] || '—'}</span>
                    <span style={{ color: 'var(--color-border)' }}>|</span>
                    <span>干支 丙午年 乙未月 庚辰日</span>
                  </div>
                </div>
                {/* 吉凶标签 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                    borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 600,
                    background: selectedDay.level === 'ji' ? 'rgba(26, 138, 92, 0.12)' : 'rgba(196, 58, 58, 0.12)',
                    color: selectedDay.level === 'ji' ? 'var(--state-success)' : 'var(--state-error)',
                    border: selectedDay.level === 'ji' ? '1px solid rgba(26, 138, 92, 0.2)' : '1px solid rgba(196, 58, 58, 0.2)',
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={CSS.fortuneDot(selectedDay.level)} />
                    {selectedDay.level === 'ji' ? '吉日' : '凶日'}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                    borderRadius: 8, fontSize: 'var(--text-xs)',
                    background: 'rgba(200, 168, 78, 0.1)', color: 'var(--color-gold)',
                    border: '1px solid rgba(200, 168, 78, 0.2)', whiteSpace: 'nowrap',
                  }}>
                    <Sparkles size={12} /> 天德合
                  </span>
                </div>
              </div>

              {/* 宜忌双列 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 24 }}>
                {/* 今日宜 */}
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-light)', letterSpacing: '0.04em' }}>
                    今日宜
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedDay.level === 'ji' ? (
                      ['搬家', '出行', '纳财', '签约'].map((item) => (
                        <span key={item} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                          borderRadius: 8, fontSize: 'var(--text-sm)',
                          background: 'rgba(26, 138, 92, 0.1)', color: 'var(--state-success)',
                          border: '1px solid rgba(26, 138, 92, 0.2)', whiteSpace: 'nowrap',
                        }}>
                          <CheckCircle size={14} /> {item}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>无特别宜事</span>
                    )}
                  </div>
                </div>
                {/* 今日忌 */}
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-light)', letterSpacing: '0.04em' }}>
                    今日忌
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['动土', '开仓', '安葬'].map((item) => (
                      <span key={item} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                        borderRadius: 8, fontSize: 'var(--text-sm)',
                        background: 'rgba(196, 58, 58, 0.1)', color: 'var(--state-error)',
                        border: '1px solid rgba(196, 58, 58, 0.2)', whiteSpace: 'nowrap',
                      }}>
                        <XCircle size={14} /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 吉神凶神 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-light)', letterSpacing: '0.04em' }}>
                  吉神凶神
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                  {[
                    { name: '天德', isJi: true }, { name: '月德', isJi: true },
                    { name: '天恩', isJi: true }, { name: '驿马', isJi: true },
                    { name: '五虚', isJi: false }, { name: '劫煞', isJi: false },
                  ].map((shen) => (
                    <div key={shen.name} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                      borderRadius: 8, fontSize: 'var(--text-sm)',
                      background: 'var(--color-bg-inset)', color: 'var(--color-text-secondary)',
                    }}>
                      <span style={{ width: 4, height: 16, borderRadius: 2, background: shen.isJi ? 'var(--state-success)' : 'var(--state-error)' }} />
                      <span>{shen.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 十二时辰吉凶 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-light)', letterSpacing: '0.04em' }}>
                  十二时辰吉凶
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                  {hourData.map((h) => (
                    <div key={h.name} style={{
                      flexShrink: 0, width: 72, padding: '8px 12px', borderRadius: 8,
                      textAlign: 'center', fontSize: 'var(--text-xs)',
                      border: `1px solid ${h.level === 'ji' ? 'rgba(26, 138, 92, 0.3)' : 'rgba(196, 58, 58, 0.3)'}`,
                      background: h.level === 'ji' ? 'rgba(26, 138, 92, 0.06)' : 'rgba(196, 58, 58, 0.06)',
                    }}>
                      <div style={{ fontWeight: 600, color: h.level === 'ji' ? 'var(--state-success)' : 'var(--state-error)', marginBottom: 2 }}>{h.name}</div>
                      <div style={{ color: 'var(--color-text-tertiary)', fontSize: 10 }}>{h.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 个人运势概要 */}
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--color-border-light)', letterSpacing: '0.04em' }}>
                  个人运势概要
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-bg-inset))',
                  border: '1px solid rgba(0, 75, 170, 0.2)', borderRadius: 12, padding: 24,
                }}>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                    今日天德合日，五行土金相生，整体运势较佳。事业方面有贵人暗中助力，适合推进重要项目；财运平稳上升，正财可期。感情方面需注意沟通方式，避免因小事产生争执。健康无碍，可适当户外活动。建议上午9至11点（巳时）进行重要会晤或签约。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI 择日推荐 */}
      <section style={{ paddingBottom: 64 }}>
        <div style={CSS.contentContainer}>
          <div style={CSS.zeiriBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>AI 择日推荐</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>输入活动类型，AI 推荐近期最佳日期</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={zeiriQuery}
                onChange={(e) => setZeiriQuery(e.target.value)}
                placeholder="输入活动类型，如搬家、签约、出行..."
                style={{
                  flex: 1, minWidth: 200,
                  background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '12px 16px', fontSize: 'var(--text-base)',
                  color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none',
                }}
              />
              <button style={{
                background: 'var(--color-gold)', color: 'var(--color-primary-darker)',
                fontWeight: 600, borderRadius: 12, padding: '12px 24px', fontSize: 'var(--text-sm)',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              }}>
                <Sparkles size={16} /> AI 推荐吉日
              </button>
            </div>
            {/* 推荐结果预览 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {[
                { date: '7月16日', desc: '宜签约' },
                { date: '7月21日', desc: '宜嫁娶' },
                { date: '7月26日', desc: '宜纳财' },
              ].map((item) => (
                <div key={item.date} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8,
                  background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
                }}>
                  <span style={CSS.fortuneDot('ji')} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    {item.date} <span style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
