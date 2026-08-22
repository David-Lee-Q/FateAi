import { useEffect, useState } from 'react';
import {
  User, Sparkles, Star, Zap, ChevronRight, CalendarDays,
  Briefcase, Heart, Wallet, Rocket, Users, FileSignature,
  BookOpen, Home, Stethoscope, Dumbbell, Target,
  AlertCircle, ShieldAlert, Ban, CalendarX, Map,
  TrendingUp, Calendar, Clock, MessageSquarePlus,
  CalendarPlus, Bookmark, Loader2, GraduationCap,
  Plane, Handshake, Flame, Rabbit,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { getHistory } from '@/services/api';
import { scoreRecords, buildRealAdviceContent, WEEKDAYS, type ScoredRecord, type RealAdviceContent } from '@/services/insights';
import { DemoBanner, EmptyInsights } from '@/components/InsightsShared';
import type { FortuneResult } from '@/types';

/* ================================================================
   数据类型 & 模拟数据
   ================================================================ */

interface AdviceItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  evidenceHtml: React.ReactNode;
}

interface TimelineDay {
  dateTag: string;
  dateIcon?: React.ReactNode;
  advices: AdviceItem[];
}

interface PriorityItem {
  tags: { label: string; bg: string; color: string }[];
  title: string;
  desc: string;
  deadline: string;
}

interface PlanItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  periodTag: { label: string; bg: string; color: string };
  desc: string;
  matchPercent: string;
  matchColor: string;
  dateRange: string;
}

interface WarningItem {
  title: string;
  desc: string;
  riskPeriod: string;
}

/** 演示时间线日期标签（相对今天动态生成） */
function demoDateTag(idx: number): string {
  const d = new Date();
  d.setDate(d.getDate() + idx);
  const md = `${d.getMonth() + 1}月${d.getDate()}日`;
  if (idx === 0) return `${md} · 今天`;
  if (idx === 1) return `${md} · 明天`;
  if (idx === 2) return `${md} · 高峰日`;
  return `${md} · ${WEEKDAYS[d.getDay()]}`;
}

/* ---- 时间线数据（7 天，演示内容） ---- */
const TIMELINE_DATA: TimelineDay[] = [
  {
    dateTag: '',
    dateIcon: <Star size={12} />,
    advices: [
      {
        icon: <Briefcase size={16} />,
        iconBg: 'rgba(26, 138, 92, 0.12)',
        iconColor: 'var(--color-success)',
        title: '上午处理重要邮件与汇报',
        desc: '今日水星与木星呈三分相，思维清晰、表达力强，适合沟通协调类工作。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 行星相位</strong>：水星巨蟹座与木星白羊座呈 120 度三分相，增强心智表达与商业判断力。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>八字 · 日主旺衰</strong>：今日庚午月丙火日主得禄，火旺有利于文书、沟通、教育类事务。
          </>
        ),
      },
      {
        icon: <Heart size={16} />,
        iconBg: 'rgba(200, 168, 78, 0.12)',
        iconColor: 'var(--color-gold)',
        title: '傍晚约朋友或伴侣散步',
        desc: '金星入驻交流宫，傍晚社交氛围温暖，适合增进感情联络。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 金星过宫</strong>：金星狮子座过第三宫（沟通宫），语言魅力增强，社交互动有利。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>紫微斗数 · 化科入命</strong>：天机化科，有利于人际交往、口碑建立。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    advices: [
      {
        icon: <Wallet size={16} />,
        iconBg: 'rgba(0, 75, 170, 0.15)',
        iconColor: 'var(--color-primary-lighter)',
        title: '适合梳理财务、制定预算计划',
        desc: '土星与冥王星和谐相位，适合处理结构性、长期性的财务规划。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>八字 · 食伤生财</strong>：辛丑日食神泄秀，利于理性分析与资源统筹。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 土星三分冥王</strong>：有利于深度财务分析和长期投资布局。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    dateIcon: <Zap size={12} />,
    advices: [
      {
        icon: <Rocket size={16} />,
        iconBg: 'rgba(26, 138, 92, 0.12)',
        iconColor: 'var(--color-success)',
        title: '启动新项目或提交关键方案',
        desc: '木星三分本命太阳达到精确相位，是本周最强运势窗口，适合开创性事务。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 木星精确三分</strong>：木星白羊座与太阳狮子座精确 120 度，扩展力与行动力同时达到峰值。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>紫微斗数 · 天机化科</strong>：天机星化科入迁移宫，外出、提案、出行均有利。
          </>
        ),
      },
      {
        icon: <Users size={16} />,
        iconBg: 'rgba(200, 168, 78, 0.12)',
        iconColor: 'var(--color-gold)',
        title: '参加社交活动，拓展人脉',
        desc: '木星扩展社交宫位能量，聚会中可能遇到有价值的贵人。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 十一宫激活</strong>：木星过十一宫（人际宫）三分本命太阳，社交运势上扬。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>八字 · 贵人星显</strong>：壬寅日天乙贵人临日，易得贵人助力。
          </>
        ),
      },
      {
        icon: <FileSignature size={16} />,
        iconBg: 'rgba(0, 75, 170, 0.15)',
        iconColor: 'var(--color-primary-lighter)',
        title: '签署合同或完成签约',
        desc: '木星护佑法律事务，文书签约类事项成功率显著提升。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 木星九宫</strong>：木星天然守护法律与契约事务，三分相时期特别有利。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>六爻 · 世应相生</strong>：壬寅日测签约得世应相生之卦，签约顺遂。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    advices: [
      {
        icon: <BookOpen size={16} />,
        iconBg: 'rgba(26, 138, 92, 0.12)',
        iconColor: 'var(--color-success)',
        title: '学习新技能或阅读专业书籍',
        desc: '水星进入学习宫，吸收能力增强，适合知识型任务。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 水星入三宫</strong>：水星回归守护的第三宫，学习效率达到高点。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>八字 · 印星得力</strong>：癸卯日偏印透出，利于学习思考、技艺提升。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    advices: [
      {
        icon: <Home size={16} />,
        iconBg: 'rgba(200, 168, 78, 0.12)',
        iconColor: 'var(--color-gold)',
        title: '整理家居环境、处理家务',
        desc: '月亮入驻第四宫（家庭宫），适合整理、收纳、家居装饰等事务。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 月亮入四宫</strong>：月亮回归本位，家庭事务运增强。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>风水 · 气场整理</strong>：甲辰日属木，木旺利于植物养护、空间疏通。
          </>
        ),
      },
      {
        icon: <Stethoscope size={16} />,
        iconBg: 'rgba(0, 75, 170, 0.15)',
        iconColor: 'var(--color-primary-lighter)',
        title: '安排体检或关注健康状况',
        desc: '六宫健康能量受月亮相位影响，适合健康管理类事务。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 六宫月亮</strong>：月亮六分六宫（健康宫），提醒关注身体信号。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>中医 · 五行养生</strong>：火日旺木，注意肝胆保养，宜早睡。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    advices: [
      {
        icon: <Dumbbell size={16} />,
        iconBg: 'rgba(200, 168, 78, 0.12)',
        iconColor: 'var(--color-gold)',
        title: '进行中等强度运动',
        desc: '火星能量平稳，适合跑步、游泳等有氧运动，提升体能。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 火星过一宫</strong>：火星恢复顺行，体能与行动力回升。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>八字 · 比肩帮身</strong>：丙午日比肩旺，适合运动竞技、体力消耗类活动。
          </>
        ),
      },
    ],
  },
  {
    dateTag: '',
    advices: [
      {
        icon: <Target size={16} />,
        iconBg: 'rgba(26, 138, 92, 0.12)',
        iconColor: 'var(--color-success)',
        title: '复盘本周成果，制定下周计划',
        desc: '周四土星能量增强，适合总结归档、规划下阶段目标。',
        evidenceHtml: (
          <>
            <strong style={{ color: 'var(--color-primary-lighter)' }}>西洋占星 · 土星十宫</strong>：土星过十宫（事业宫），规划与执行力增强。<br />
            <strong style={{ color: 'var(--color-primary-lighter)' }}>梅花易数 · 艮卦</strong>：丁未日得艮为山卦，宜止宜静、反思总结。
          </>
        ),
      },
    ],
  },
];

/* ---- 本周重点数据 ---- */
const PRIORITY_DATA: PriorityItem[] = [
  {
    tags: [
      { label: '紧急', bg: 'rgba(196, 58, 58, 0.15)', color: 'var(--color-error)' },
      { label: '事业', bg: 'rgba(200, 168, 78, 0.12)', color: 'var(--color-gold)' },
    ],
    title: '提交季度报告',
    desc: '木星三分相带来表达力提升，7 月 12 日前完成报告撰写与提交，成功率最高。拖延至周末运势回落期可能影响质量。',
    deadline: '建议截止：7月12日',
  },
  {
    tags: [
      { label: '重要', bg: 'rgba(200, 168, 78, 0.12)', color: 'var(--color-gold)' },
      { label: '感情', bg: 'rgba(0, 75, 170, 0.15)', color: 'var(--color-primary-lighter)' },
    ],
    title: '与重要的人深度沟通',
    desc: '金星与水星同时活跃于交流宫位，10-12 日是处理感情问题、进行重要对话的最佳窗口。真诚表达能化解积压矛盾。',
    deadline: '最佳时段：7月10日-12日',
  },
  {
    tags: [
      { label: '重要', bg: 'rgba(200, 168, 78, 0.12)', color: 'var(--color-gold)' },
      { label: '财运', bg: 'rgba(26, 138, 92, 0.12)', color: 'var(--color-success)' },
    ],
    title: '锁定投资机会',
    desc: '木星扩展财运宫能量，本周可能出现有价值的投资信号。土星三分冥王利于深度分析，建议结合理性判断果断行动。',
    deadline: '观察期：7月11日-14日',
  },
];

/* ---- 本月规划数据 ---- */
const PLAN_DATA: PlanItem[] = [
  {
    icon: <GraduationCap size={20} />,
    iconBg: 'rgba(26, 138, 92, 0.12)',
    iconColor: 'var(--color-success)',
    title: '启动专业认证考试准备',
    periodTag: { label: '上旬启动', bg: 'rgba(26, 138, 92, 0.1)', color: 'var(--color-success)' },
    desc: '7 月上旬水星能量活跃，学习效率处于月内高点。建议本月上旬完成考试报名、制定复习计划，中旬开始系统学习。',
    matchPercent: '匹配度 92%',
    matchColor: 'var(--color-success)',
    dateRange: '7月1日-15日',
  },
  {
    icon: <Home size={20} />,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '完成居家环境改造',
    periodTag: { label: '中旬执行', bg: 'rgba(200, 168, 78, 0.1)', color: 'var(--color-gold)' },
    desc: '月中月亮多次经过家庭宫，家居改造、装修、整理的运势较好。建议提前规划方案，中旬集中执行。',
    matchPercent: '匹配度 85%',
    matchColor: 'var(--color-success)',
    dateRange: '7月10日-20日',
  },
  {
    icon: <Plane size={20} />,
    iconBg: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
    title: '安排出差或旅行',
    periodTag: { label: '下旬适宜', bg: 'rgba(0, 75, 170, 0.1)', color: 'var(--color-primary-lighter)' },
    desc: '下旬木星进入第九宫（远行宫），出行的运势显著提升。差旅行程、商务考察或休闲旅行均有利，提前规划可享受优惠。',
    matchPercent: '匹配度 78%',
    matchColor: 'var(--color-warning)',
    dateRange: '7月20日-31日',
  },
  {
    icon: <Handshake size={20} />,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '拓展合作或寻找合伙人',
    periodTag: { label: '全月适宜', bg: 'rgba(200, 168, 78, 0.1)', color: 'var(--color-gold)' },
    desc: '木星整月过十一宫（人际宫），合作运势贯穿全月。上旬建立联系，中旬深入洽谈，下旬签约落地，节奏分明。',
    matchPercent: '匹配度 88%',
    matchColor: 'var(--color-success)',
    dateRange: '7月全月',
  },
];

/* ---- 避坑提醒数据 ---- */
const WARNING_DATA: WarningItem[] = [
  {
    title: '避免重大财务决策',
    desc: '7 月 14-16 日海王星与金星形成刑克相位，判断力易受情绪干扰。期间避免冲动消费、大额投资、借贷等决策。',
    riskPeriod: '高风险期：7月14日-16日',
  },
  {
    title: '谨慎处理人际冲突',
    desc: '火星与土星对冲期间，人际摩擦概率上升。7 月 18-20 日尽量避免争论、批评他人，或做出离职、分手等冲动决定。',
    riskPeriod: '高风险期：7月18日-20日',
  },
  {
    title: '注意饮食与作息规律',
    desc: '本月火象能量偏旺，丙火日主容易过度消耗。下旬火星换座后体力下降，需提前调整作息，避免熬夜与暴饮暴食。',
    riskPeriod: '需注意：7月下旬持续',
  },
];

/* ================================================================
   通用样式
   ================================================================ */

const containerStyle: React.CSSProperties = {
  maxWidth: 'var(--max-width)',
  margin: '0 auto',
  paddingLeft: 'var(--space-6)',
  paddingRight: 'var(--space-6)',
};

/* Section 头部样式 */
const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  marginBottom: 'var(--space-8)',
};

const sectionHeaderIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/* 命理标签（tag-pill）样式 */
const tagPillStyle = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 12px',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  whiteSpace: 'nowrap' as const,
  background: bg,
  color: color,
});

/* ================================================================
   子组件
   ================================================================ */

/** Section 标题区域 */
function SectionHeader({
  icon,
  iconBg,
  iconColor: _iconColor,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={sectionHeaderStyle}>
      <div style={{ ...sectionHeaderIconStyle, background: iconBg }}>{icon}</div>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(var(--text-xl), 2vw, var(--text-2xl))',
            color: 'var(--color-text-inverse)',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </h2>
        <p style={{ marginTop: 4, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** 单条建议卡片 */
function AdviceCard({ advice, isOpen, onToggle }: {
  advice: AdviceItem;
  id: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        transition: 'all var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.2)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 75, 170, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* 图标 */}
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: advice.iconBg,
            color: advice.iconColor,
          }}
        >
          {advice.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h5 style={{ fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {advice.title}
          </h5>
          <p style={{
            marginTop: 4,
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-relaxed)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {advice.desc}
          </p>
          {/* 展开/折叠按钮 */}
          <button
            onClick={onToggle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--color-primary-lighter)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: 8,
              fontFamily: 'var(--font-body)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-primary-lighter)'; }}
          >
            <ChevronRight
              size={14}
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-fast)',
              }}
            />
            <span>{isOpen ? '收起依据' : '查看命理依据'}</span>
          </button>
          {/* 命理依据内容 */}
          <div
            style={{
              marginTop: 8,
              maxHeight: isOpen ? 300 : 0,
              overflow: 'hidden',
              transition: 'max-height var(--transition-slow)',
            }}
          >
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3)',
                background: 'rgba(0, 75, 170, 0.06)',
                border: '1px solid rgba(0, 75, 170, 0.1)',
              }}
            >
              <p style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--leading-relaxed)',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {advice.evidenceHtml}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 时间线单日 */
function TimelineDayItem({ day, dayIndex }: { day: TimelineDay; dayIndex: number }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: 40,
        paddingBottom: 'var(--space-8)',
      }}
    >
      {/* 竖线 */}
      <div style={{
        position: 'absolute',
        left: 15,
        top: 32,
        bottom: 0,
        width: 2,
        background: 'linear-gradient(180deg, rgba(0, 75, 170, 0.4), rgba(200, 168, 78, 0.2))',
      }} />
      {/* 圆点 */}
      <div style={{
        position: 'absolute',
        left: 6,
        top: 8,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
        border: '2px solid rgba(200, 168, 78, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-gold)' }} />
      </div>
      {/* 日期标签 */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0, 75, 170, 0.15)',
        color: 'var(--color-primary-lighter)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        marginBottom: 'var(--space-3)',
      }}>
        {day.dateIcon}
        {day.dateTag}
      </div>
      {/* 建议卡片列表（由父组件通过 context 传入展开状态） */}
      <TimelineDayAdvices day={day} dayIndex={dayIndex} />
    </div>
  );
}

/** 时间线建议列表（需要访问 openEvidence 状态） */
function TimelineDayAdvices({ day, dayIndex }: { day: TimelineDay; dayIndex: number }) {
  const [openEvidence, setOpenEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (key: string) => {
    setOpenEvidence((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {day.advices.map((advice, aIdx) => {
        const key = `${dayIndex}-${aIdx}`;
        return (
          <AdviceCard
            key={key}
            advice={advice}
            id={key}
            isOpen={!!openEvidence[key]}
            onToggle={() => toggleEvidence(key)}
          />
        );
      })}
    </div>
  );
}

/* ================================================================
   主页面组件
   ================================================================ */

/** 真实态建议卡片的图标循环（与演示配色一致） */
const REAL_ADVICE_ICONS: React.ReactNode[] = [
  <BookOpen size={16} key="book" />,
  <Star size={16} key="star" />,
  <Sparkles size={16} key="spark" />,
];
const REAL_ADVICE_BGS = [
  'rgba(26, 138, 92, 0.12)',
  'rgba(200, 168, 78, 0.12)',
  'rgba(0, 75, 170, 0.15)',
];
const REAL_ADVICE_COLORS = [
  'var(--color-success)',
  'var(--color-gold)',
  'var(--color-primary-lighter)',
];

/** 真实态重点事项标签配色 */
function realTagStyle(label: string): { bg: string; color: string } {
  if (label === '优势') return { bg: 'rgba(26, 138, 92, 0.12)', color: 'var(--color-success)' };
  if (label === '关注') return { bg: 'rgba(200, 122, 26, 0.12)', color: 'var(--color-warning)' };
  if (label === '常用') return { bg: 'rgba(0, 75, 170, 0.15)', color: 'var(--color-primary-lighter)' };
  return { bg: 'rgba(200, 168, 78, 0.12)', color: 'var(--color-gold)' };
}

/** 真实态月度规划图标（按 事业/感情/财运/健康 顺序） */
const PLAN_REAL_ICONS: { icon: React.ReactNode; iconBg: string; iconColor: string }[] = [
  { icon: <Briefcase size={20} />, iconBg: 'rgba(26, 138, 92, 0.12)', iconColor: 'var(--color-success)' },
  { icon: <Heart size={20} />, iconBg: 'rgba(200, 168, 78, 0.12)', iconColor: 'var(--color-gold)' },
  { icon: <Wallet size={20} />, iconBg: 'rgba(0, 75, 170, 0.15)', iconColor: 'var(--color-primary-lighter)' },
  { icon: <Stethoscope size={20} />, iconBg: 'rgba(26, 138, 92, 0.12)', iconColor: 'var(--color-success)' },
];

export default function AdvicePage() {
  const { user, loading: authLoading } = useAuth();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [records, setRecords] = useState<ScoredRecord[] | null>(null);

  const isDemo = !authLoading && !user;
  const isLoading = Boolean(user) && records === null;
  const isEmpty = Boolean(user) && records !== null && records.length === 0;

  // 登录态：拉取真实查询记录（与综合报告同一取数口径）
  useEffect(() => {
    if (!user) {
      setRecords(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const resp = await getHistory(200);
        if (cancelled) return;
        const list = (resp.data ?? []) as FortuneResult[];
        setRecords(scoreRecords(list));
      } catch {
        if (!cancelled) setRecords([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const real: RealAdviceContent | null =
    user && records !== null && records.length > 0 ? buildRealAdviceContent(records) : null;

  /* ---- 各区块数据源：未登录用演示数据，登录态用真实记录生成 ---- */
  const timelineDays: TimelineDay[] = real
    ? real.timeline.map((d) => ({
        dateTag: d.dateTag,
        dateIcon: d.latest ? <Star size={12} /> : d.highlight ? <Zap size={12} /> : undefined,
        advices: d.advices.map((a, i) => ({
          icon: REAL_ADVICE_ICONS[i % REAL_ADVICE_ICONS.length],
          iconBg: REAL_ADVICE_BGS[i % REAL_ADVICE_BGS.length],
          iconColor: REAL_ADVICE_COLORS[i % REAL_ADVICE_COLORS.length],
          title: a.title,
          desc: a.desc,
          evidenceHtml: <>{a.evidence}</>,
        })),
      }))
    : TIMELINE_DATA.map((d, idx) => ({ ...d, dateTag: demoDateTag(idx) }));

  const priorities: PriorityItem[] = real
    ? real.priorities.map((p) => ({
        tags: p.tags.map((label) => ({ label, ...realTagStyle(label) })),
        title: p.title,
        desc: p.desc,
        deadline: p.deadline,
      }))
    : PRIORITY_DATA;

  const plans: PlanItem[] = real
    ? real.plans.map((p, i) => {
        const pi = PLAN_REAL_ICONS[i % PLAN_REAL_ICONS.length];
        return {
          ...pi,
          title: p.title,
          periodTag: { label: p.periodLabel, bg: 'rgba(255, 255, 255, 0.06)', color: 'var(--color-text-secondary)' },
          desc: p.desc,
          matchPercent: `匹配度 ${p.match}%`,
          matchColor: p.match >= 65 ? 'var(--color-success)' : p.match >= 50 ? 'var(--color-warning)' : 'var(--color-error)',
          dateRange: p.dateRange,
        };
      })
    : PLAN_DATA;

  const warnings: WarningItem[] = real ? real.warnings : WARNING_DATA;

  /** 提交自定义建议请求 */
  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAiReply('');
    try {
      // TODO: 接入实际 API
      await new Promise((r) => setTimeout(r, 1500));
      setAiReply('已收到您的提问，AI 正在基于多个占卜体系为您综合分析。');
    } catch {
      setAiReply('抱歉，请求失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0a0e1a', minHeight: '100vh' }}>

      {/* ==================== 1. 标题区 ==================== */}
      <section style={{
        background: 'linear-gradient(180deg, #002060 0%, #0a0e1a 100%)',
        padding: 'calc(var(--navbar-height, 64px) + var(--space-12)) 0 var(--space-12)',
      }}>
        <div style={containerStyle}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 'var(--leading-tight)',
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              color: '#ffffff',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              marginBottom: 'var(--space-4)',
            }}>
              个性化建议
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: 560,
            }}>
              {isDemo ? '基于命理信息，生成可执行的行动建议 · 演示数据' : '基于你的真实查询记录，生成可执行的行动建议'}
            </p>
          </div>
        </div>
      </section>

      {/* 演示数据横幅（仅未登录态） */}
      {isDemo && (
        <div style={containerStyle}>
          <DemoBanner />
        </div>
      )}

      {/* 登录态：生成中 */}
      {!isDemo && isLoading && (
        <div style={{ ...containerStyle, padding: '96px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)',
          }}>
            <CalendarDays size={20} className="animate-spin" style={{ color: 'var(--color-gold)' }} />
            正在基于你的真实查询记录生成个性化建议…
          </div>
        </div>
      )}

      {/* 登录态：暂无查询记录 */}
      {!isDemo && isEmpty && (
        <div style={{ ...containerStyle, padding: 'var(--space-12) 0' }}>
          <EmptyInsights />
        </div>
      )}

      {(isDemo || real !== null) && (
      <>
      {/* ==================== 2. 用户命理概要卡片 ==================== */}
      <section style={{ background: '#0a0e1a', padding: '0 0 var(--space-16)' }}>
        <div style={containerStyle}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* 顶部金色装饰线 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
              opacity: 0.3,
            }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-6)' }}>
              {/* 头像 */}
              <div style={{
                flexShrink: 0,
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
              }}>
                <User size={28} color="#fff" />
              </div>
              {/* 姓名与基本信息 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontWeight: 600,
                  fontSize: 'var(--text-xl)',
                  color: 'var(--color-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {isDemo ? '张天明' : (user?.nickname || '我的档案')}
                </h3>
                <p style={{
                  marginTop: 4,
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-sm)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {isDemo ? '命理档案已生成' : real!.profile.subtitle}
                </p>
              </div>
              {/* 命理标签 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                {isDemo ? (
                  <>
                    <span style={tagPillStyle('rgba(0, 75, 170, 0.15)', 'var(--color-primary-lighter)')}>
                      <Rabbit size={14} />
                      <span>属兔</span>
                    </span>
                    <span style={tagPillStyle('rgba(200, 168, 78, 0.12)', 'var(--color-gold)')}>
                      <Sparkles size={14} />
                      <span>狮子座</span>
                    </span>
                    <span style={tagPillStyle('rgba(26, 138, 92, 0.12)', 'var(--color-success)')}>
                      <Flame size={14} />
                      <span>日主丙火</span>
                    </span>
                    <span style={tagPillStyle('rgba(200, 168, 78, 0.08)', 'var(--color-gold-light)')}>
                      <span>甲子年 · 庚午月</span>
                    </span>
                  </>
                ) : (
                  real!.profile.tags.map((t) => (
                    <span key={t} style={tagPillStyle('rgba(255, 255, 255, 0.06)', 'var(--color-text-secondary)')}>
                      <span>{t}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. 近 7 天行动建议（时间线） ==================== */}
      <section style={{ background: '#0d1220', padding: 'var(--space-16) 0' }}>
        <div style={containerStyle}>
          <SectionHeader
            icon={<CalendarDays size={20} color="var(--color-gold)" />}
            iconBg="rgba(200, 168, 78, 0.12)"
            iconColor="var(--color-gold)"
            title={isDemo ? '近 7 天行动建议' : '近期行动建议'}
            subtitle={isDemo ? '根据每日运势波动，精细安排日程' : real!.timelineSubtitle}
          />

          {/* 时间线列表 */}
          <div>
            {timelineDays.map((day, idx) => (
              <div key={idx} style={idx < timelineDays.length - 1 ? {} : { paddingBottom: 0 }}>
                <TimelineDayItem day={day} dayIndex={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. 本周重点区 ==================== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0' }}>
        <div style={containerStyle}>
          <SectionHeader
            icon={<AlertCircle size={20} color="var(--color-gold)" />}
            iconBg="rgba(200, 168, 78, 0.12)"
            iconColor="var(--color-gold)"
            title="本周重点"
            subtitle="高优先级事项，建议优先安排"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {priorities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 75, 170, 0.12), rgba(200, 168, 78, 0.06))',
                  border: '1px solid rgba(200, 168, 78, 0.25)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.4)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(200, 168, 78, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 装饰圆 */}
                <div style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200, 168, 78, 0.1), transparent 70%)',
                  pointerEvents: 'none',
                }} />
                {/* 标签 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} style={tagPillStyle(tag.bg, tag.color)}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                <h4 style={{
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text)',
                  fontSize: 'var(--text-base)',
                }}>
                  {item.title}
                </h4>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.desc}
                </p>
                {/* 截止日期 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <Clock size={14} color="var(--color-text-tertiary)" />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                    {item.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. 本月规划建议 ==================== */}
      <section style={{ background: '#0d1220', padding: 'var(--space-16) 0' }}>
        <div style={containerStyle}>
          <SectionHeader
            icon={<Map size={20} color="var(--color-primary-lighter)" />}
            iconBg="rgba(0, 75, 170, 0.15)"
            iconColor="var(--color-primary-lighter)"
            title="本月规划建议"
            subtitle={isDemo ? '基于七月整体运势走势，推荐启动或完成的事项' : '基于你的真实查询均分，推荐本月各维度的推进节奏'}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {plans.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 75, 170, 0.2)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 75, 170, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 头部：图标 + 标题 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.iconBg,
                    color: item.iconColor,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      fontSize: 'var(--text-base)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.title}
                    </h4>
                    <span style={{
                      ...tagPillStyle(item.periodTag.bg, item.periodTag.color),
                      marginTop: 4,
                      fontSize: 'var(--text-xs)',
                    }}>
                      {item.periodTag.label}
                    </span>
                  </div>
                </div>
                {/* 描述 */}
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.desc}
                </p>
                {/* 底部匹配度 & 时间段 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={14} color={item.matchColor} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {item.matchPercent}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--color-text-tertiary)" />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {item.dateRange}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. 避坑提醒区 ==================== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0' }}>
        <div style={containerStyle}>
          <SectionHeader
            icon={<ShieldAlert size={20} color="var(--color-error)" />}
            iconBg="rgba(196, 58, 58, 0.12)"
            iconColor="var(--color-error)"
            title="避坑提醒"
            subtitle="命理信号预警，以下事项需特别注意"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {warnings.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(196, 58, 58, 0.06)',
                  border: '1px solid rgba(196, 58, 58, 0.3)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* 红色左边框 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: 'var(--color-error)',
                  borderRadius: '4px 0 0 4px',
                }} />
                {/* 标题 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingLeft: 'var(--space-4)' }}>
                  <Ban size={18} color="var(--color-error)" style={{ flexShrink: 0 }} />
                  <h4 style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    fontSize: 'var(--text-base)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.title}
                  </h4>
                </div>
                {/* 内容 */}
                <div style={{ paddingLeft: 'var(--space-4)' }}>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.desc}
                  </p>
                  {/* 高风险期 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: '1px solid rgba(196, 58, 58, 0.15)',
                  }}>
                    <CalendarX size={14} color="var(--color-error)" />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {item.riskPeriod}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
      )}

      {/* ==================== 7. 自定义需求输入框 ==================== */}
      <section style={{ background: '#0d1220', padding: 'var(--space-16) 0 var(--space-20)' }}>
        <div style={containerStyle}>
          <SectionHeader
            icon={<MessageSquarePlus size={20} color="var(--color-gold)" />}
            iconBg="rgba(200, 168, 78, 0.12)"
            iconColor="var(--color-gold)"
            title="自定义需求"
            subtitle="告诉 AI 你的具体情况，获取更精准的建议"
          />

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            position: 'relative',
          }}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={'告诉 AI 你的具体需求，例如："下周有一个重要面试，应该在哪天安排？"、"本月适合搬家吗？"、"想和老板谈加薪，什么时机比较好？"'}
              rows={4}
              style={{
                width: '100%',
                minHeight: 100,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-5)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color var(--transition-base)',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(200, 168, 78, 0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            />
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginTop: 20,
            }}>
              <p style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--text-xs)',
                maxWidth: 480,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                AI 将结合你的命理信息（生肖、星座、八字日主等）与当前星象，生成针对性的行动建议。
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 22px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    border: 'none',
                    cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    opacity: loading || !question.trim() ? 0.5 : 1,
                    transition: 'all var(--transition-base)',
                  }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {loading ? 'AI 分析中...' : '获取建议'}
                </button>
              </div>
            </div>

            {/* AI 回复 */}
            {aiReply && (
              <div style={{
                marginTop: 24,
                padding: 20,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 75, 170, 0.06)',
                border: '1px solid rgba(0, 75, 170, 0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MessageSquarePlus size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>AI 综合建议</span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)' }}>
                  {aiReply}
                </p>
              </div>
            )}
          </div>

          {/* ==================== 8. 操作按钮区 ==================== */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginTop: 40,
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-sm)',
              maxWidth: 480,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              将建议同步到日历，或保存为 PDF 以便随时查看。
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 22px',
                borderRadius: 'var(--radius-lg)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 75, 170, 0.3)';
                e.currentTarget.style.color = 'var(--color-primary-lighter)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              >
                <CalendarPlus size={16} />
                设置日历提醒
              </button>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 22px',
                borderRadius: 'var(--radius-lg)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 75, 170, 0.3)';
                e.currentTarget.style.color = 'var(--color-primary-lighter)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              >
                <Bookmark size={16} />
                保存建议
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
