import { getSystemMeta } from '@/data/systemMeta';
import type { FortuneResult } from '@/types';

type AnyRecord = Record<string, unknown>;

function asRecord(v: unknown): AnyRecord | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as AnyRecord) : null;
}

function str(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v.replace(/\s+/g, ' ').trim().slice(0, max);
}

function formatDate(v: unknown): string {
  if (!v) return '';
  const d = new Date(v as string);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** 去掉 markdown 标记，取纯文本摘要 */
function plainText(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  const t = v.replace(/[#*`>-]/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

/** 按体系提取分享卡片的核心信息行 */
export function buildCoreLine(r: FortuneResult): string {
  const data = asRecord(r.data) ?? {};
  switch (r.system) {
    case 'bazi': {
      const pillars = [data.yearPillar, data.monthPillar, data.dayPillar, data.hourPillar]
        .map((v) => str(v, 4))
        .filter(Boolean);
      return pillars.length === 4 ? pillars.join('  ') : str(data.summary, 40);
    }
    case 'tarot': {
      const cards = Array.isArray(data.cards) ? (data.cards as unknown[]) : [];
      const names = cards
        .map((c) => {
          const card = asRecord(c);
          if (!card) return '';
          const reversed = String(card.isReversed).toLowerCase() === 'true';
          return `${str(card.name, 12)}${reversed ? '(逆)' : ''}`;
        })
        .filter(Boolean);
      return names.length ? `抽牌：${names.join('、')}` : str(data.question, 40);
    }
    default:
      return str(data.summary, 40) || plainText(r.interpretation, 40);
  }
}

/** 生成分享文本（含结果链接） */
export function buildShareText(r: FortuneResult, url?: string): string {
  const meta = getSystemMeta(r.system);
  const link = url ?? (typeof window !== 'undefined' ? `${window.location.origin}/result/${r.id}` : `/result/${r.id}`);
  return [
    `【天机 AI 占卜 · ${meta.name}】`,
    buildCoreLine(r),
    plainText(r.interpretation, 80),
    `查看完整结果：${link}`,
    `查询时间：${formatDate(r.createdAt)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** 复制到剪贴板（clipboard API 不可用时回退 execCommand） */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 继续走回退方案 */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

const CARD_W = 750;
const CARD_H = 1050;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    if (ctx.measureText(`${line}${ch}`).width > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** 用 Canvas 绘制分享卡片，返回 PNG dataURL */
export async function renderShareCard(r: FortuneResult): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 不可用');

  const meta = getSystemMeta(r.system);
  const core = buildCoreLine(r) || plainText(r.interpretation, 40);
  const excerpt = plainText(r.interpretation, 240);
  const link = typeof window !== 'undefined' ? `${window.location.origin}/result/${r.id}` : '';
  const time = formatDate(r.createdAt);

  // 背景
  ctx.fillStyle = '#faf7f1';
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = '#e8e0d0';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, CARD_W - 48, CARD_H - 48);
  ctx.strokeStyle = '#c8a84e';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, CARD_W - 72, CARD_H - 72);

  // 顶部品牌
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b8860b';
  ctx.font = '28px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('天 机 A I 占 卜', CARD_W / 2, 100);
  ctx.strokeStyle = '#d8c9a3';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 120, 128);
  ctx.lineTo(CARD_W / 2 + 120, 128);
  ctx.stroke();

  // 体系名称
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 48px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText(meta.name, CARD_W / 2, 200);

  // 核心信息行（最多两行）
  ctx.fillStyle = '#b45309';
  ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif';
  const coreLines = wrapText(ctx, core, CARD_W - 200).slice(0, 2);
  coreLines.forEach((l, i) => ctx.fillText(l, CARD_W / 2, 268 + i * 42));

  // 分割线
  ctx.strokeStyle = '#e8e0d0';
  ctx.beginPath();
  ctx.moveTo(90, 360);
  ctx.lineTo(CARD_W - 90, 360);
  ctx.stroke();

  // 解读正文
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4b5563';
  ctx.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif';
  const bodyLines = wrapText(ctx, excerpt, CARD_W - 180).slice(0, 12);
  bodyLines.forEach((l, i) => ctx.fillText(l, 90, 430 + i * 46));

  // 底部信息
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9ca3af';
  ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif';
  if (time) ctx.fillText(`查询时间：${time}`, CARD_W / 2, 1050 - 170);
  ctx.fillStyle = '#b8860b';
  ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.fillText('仅供娱乐参考', CARD_W / 2, 1050 - 130);
  if (link) {
    ctx.fillStyle = '#a8a29e';
    ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText(link.length > 46 ? `${link.slice(0, 46)}…` : link, CARD_W / 2, 1050 - 88);
  }

  return canvas.toDataURL('image/png');
}
