import { useState } from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, Sparkles,
  CheckCircle, XCircle,
} from 'lucide-react';
import { Solar } from 'lunar-typescript';

/* ============ 运势等级配置 ============ */
type FortuneLevel = 'ji' | 'xiong' | 'ping';

const HOUR_TIMES = ['23-1', '1-3', '3-5', '5-7', '7-9', '9-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'];

interface DayFortune {
  day: number;
  level: FortuneLevel;
  summary: string;
  lunar: string;        // 农历日期（七月十）
  ganZhi: string;       // 干支（丙午年 丙申月 戊辰日）
  jiShen: string[];     // 吉神
  xiongSha: string[];   // 凶煞
  yi: string[];         // 宜
  ji: string[];         // 忌
  hours: { name: string; time: string; level: FortuneLevel }[]; // 十二时辰吉凶
}

/** 按当日真实黄历数据生成运势概要 */
function buildDaySummary(d: DayFortune): string {
  const xiuNote = d.level === 'xiong'
    ? '今日气运偏弱，大事可缓、以守为稳。'
    : d.level === 'ji'
      ? '今日气运上佳，宜主动推进重要事项。'
      : '今日气运平和，按部就班即可。';
  const yiNote = d.yi.length > 0
    ? `宜${d.yi.slice(0, 4).join('、')}等事，把握时机。`
    : '无特别宜事，可安排休整与筹划。';
  const jiNote = d.ji.length > 0
    ? `需避开${d.ji.slice(0, 3).join('、')}等事项。`
    : '无忌事限制，诸事可从。';
  const shenNote = d.jiShen.length > 0 ? `吉神${d.jiShen.slice(0, 3).join('、')}照临，添一分助力。` : '';
  const bestHour = d.hours.find((h) => h.level === 'ji');
  const hourNote = bestHour ? `建议择${bestHour.name}时（${bestHour.time}点）办理要事。` : '';
  return `${xiuNote}${yiNote}${jiNote}${shenNote}${hourNote}`;
}

/**
 * 生成月度黄历数据（基于 lunar-typescript 真实农历/黄历数据）
 * 日级吉凶：忌含"诸事不宜"为凶日；宿曜吉凶结合宜事数量定级
 */
function generateMonthFortune(year: number, month: number): DayFortune[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const fortunes: DayFortune[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = Solar.fromYmd(year, month, d).getLunar();
    const times = lunar.getTimes();
    const yi = times.length > 0 ? [...times[0].getYi()] : [];
    const ji = times.length > 0 ? [...times[0].getJi()] : [];
    const allXiong = ji.includes('诸事不宜');
    const xiuLuck = lunar.getXiuLuck();

    let level: FortuneLevel;
    let summary: string;
    if (allXiong) {
      level = 'xiong';
      summary = '诸事不宜';
    } else if (xiuLuck === '吉' && yi.length >= 5) {
      level = 'ji';
      summary = `宜${yi[0] ?? '百事'}`;
    } else if (xiuLuck === '凶' && yi.length <= 3) {
      level = 'xiong';
      summary = `忌${ji[0] ?? '冒进'}`;
    } else {
      level = 'ping';
      summary = yi.length > 0 ? `宜${yi[0]}` : '平';
    }

    fortunes.push({
      day: d,
      level,
      summary,
      lunar: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      ganZhi: `${lunar.getYearInGanZhiByLiChun()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`,
      jiShen: lunar.getDayJiShen().slice(0, 4),
      xiongSha: lunar.getDayXiongSha().slice(0, 4),
      yi,
      ji,
      hours: times.slice(0, 12).map((t, i) => ({
        name: t.getZhi(),
        time: HOUR_TIMES[i],
        level: (t.getTianShenLuck() === '吉' ? 'ji' : 'xiong') as FortuneLevel,
      })),
    });
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
  const [zeiriResult, setZeiriResult] = useState<{ date: string; desc: string }[] | null>(null);

  const fortunes = generateMonthFortune(year, month);

  /** 择日：按活动类型在本月宜事中匹配（真实黄历数据） */
  const handleZeiriSearch = () => {
    const kw = zeiriQuery.trim();
    if (!kw) {
      setZeiriResult(null);
      return;
    }
    const matched = fortunes.filter((f) => f.yi.some((y) => y.includes(kw))).slice(0, 5);
    setZeiriResult(matched.map((f) => ({ date: `${month}月${f.day}日`, desc: `宜${f.yi.find((y) => y.includes(kw))}` })));
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const defaultZeiri = fortunes
    .filter((f) => f.level === 'ji' && (!isCurrentMonth || f.day >= today.getDate()))
    .slice(0, 3)
    .map((f) => ({ date: `${month}月${f.day}日`, desc: f.summary }));
  const zeiriDays = zeiriResult ?? defaultZeiri;
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
    setZeiriResult(null);
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
                        {cell.fortune?.lunar || ''}
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
                     <span>农历 {selectedDay.lunar || '—'}</span>
                     <span style={{ color: 'var(--color-border)' }}>|</span>
                     <span>干支 {selectedDay.ganZhi || '—'}</span>
                   </div>
                 </div>
                 {/* 吉凶标签 */}
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span style={{
                     display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                     borderRadius: 8, fontSize: 'var(--text-xs)', fontWeight: 600,
                     background: selectedDay.level === 'ji' ? 'rgba(26, 138, 92, 0.12)' : selectedDay.level === 'xiong' ? 'rgba(196, 58, 58, 0.12)' : 'rgba(200, 168, 78, 0.1)',
                     color: selectedDay.level === 'ji' ? 'var(--state-success)' : selectedDay.level === 'xiong' ? 'var(--state-error)' : 'var(--color-gold)',
                     border: selectedDay.level === 'ji' ? '1px solid rgba(26, 138, 92, 0.2)' : selectedDay.level === 'xiong' ? '1px solid rgba(196, 58, 58, 0.2)' : '1px solid rgba(200, 168, 78, 0.2)',
                     whiteSpace: 'nowrap',
                   }}>
                     <span style={CSS.fortuneDot(selectedDay.level)} />
                     {selectedDay.level === 'ji' ? '吉日' : selectedDay.level === 'xiong' ? '凶日' : '平日'}
                   </span>
                   {selectedDay.jiShen[0] && (
                     <span style={{
                       display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                       borderRadius: 8, fontSize: 'var(--text-xs)',
                       background: 'rgba(200, 168, 78, 0.1)', color: 'var(--color-gold)',
                       border: '1px solid rgba(200, 168, 78, 0.2)', whiteSpace: 'nowrap',
                     }}>
                       <Sparkles size={12} /> {selectedDay.jiShen[0]}
                     </span>
                   )}
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
                    {selectedDay.yi.length > 0 ? (
                      selectedDay.yi.slice(0, 8).map((item) => (
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
                    {selectedDay.ji.length > 0 ? (
                      selectedDay.ji.slice(0, 8).map((item) => (
                        <span key={item} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px',
                          borderRadius: 8, fontSize: 'var(--text-sm)',
                          background: 'rgba(196, 58, 58, 0.1)', color: 'var(--state-error)',
                          border: '1px solid rgba(196, 58, 58, 0.2)', whiteSpace: 'nowrap',
                        }}>
                          <XCircle size={14} /> {item}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>无特别忌事</span>
                    )}
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
                    ...selectedDay.jiShen.map((name) => ({ name, isJi: true })),
                    ...selectedDay.xiongSha.map((name) => ({ name, isJi: false })),
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
                  {selectedDay.hours.map((h) => (
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
                    {buildDaySummary(selectedDay)}
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
                onKeyDown={(e) => e.key === 'Enter' && handleZeiriSearch()}
                placeholder="输入活动类型，如搬家、签约、出行..."
                style={{
                  flex: 1, minWidth: 200,
                  background: 'var(--color-bg-inset)', border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '12px 16px', fontSize: 'var(--text-base)',
                  color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none',
                }}
              />
              <button
                onClick={handleZeiriSearch}
                style={{
                  background: 'var(--color-gold)', color: 'var(--color-primary-darker)',
                  fontWeight: 600, borderRadius: 12, padding: '12px 24px', fontSize: 'var(--text-sm)',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                }}
              >
                <Sparkles size={16} /> 推荐吉日
              </button>
            </div>
            {/* 推荐结果预览（基于本月真实黄历吉日） */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {zeiriDays.length === 0 ? (
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                  {zeiriResult ? `本月暂无宜"${zeiriQuery.trim()}"的吉日，可尝试下月` : '本月暂无可推荐吉日'}
                </span>
              ) : zeiriDays.map((item) => (
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
