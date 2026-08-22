import { useEffect, useState } from 'react';
import { X, ImageDown, ClipboardCopy, Link2, Loader2 } from 'lucide-react';
import type { FortuneResult } from '@/types';
import { buildShareText, copyToClipboard, renderShareCard } from '@/utils/share';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  result: FortuneResult;
}

type CopyKind = 'text' | 'link';

/** 占卜结果分享弹窗：生成图片卡片 / 复制文字 / 复制链接 */
export default function ShareModal({ open, onClose, result }: ShareModalProps) {
  const [cardImg, setCardImg] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<CopyKind | null>(null);

  useEffect(() => {
    if (!open) return;
    setCardImg(null);
    setGenerating(true);
    renderShareCard(result)
      .then(setCardImg)
      .catch(() => setCardImg(null))
      .finally(() => setGenerating(false));
  }, [open, result]);

  if (!open) return null;

  const shareUrl = `${window.location.origin}/result/${result.id}`;

  const handleCopy = async (kind: CopyKind) => {
    const text = kind === 'link' ? shareUrl : buildShareText(result);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleDownload = () => {
    if (!cardImg) return;
    const a = document.createElement('a');
    a.href = cardImg;
    a.download = `天机占卜-${result.system}-${result.id}.png`;
    a.click();
  };

  const btnBase =
    'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 shadow-2xl"
        style={{ background: 'var(--color-surface, #fff)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            分享结果
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-black/5"
            aria-label="关闭"
          >
            <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* 卡片预览 */}
        <div
          className="mb-4 flex items-center justify-center overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--color-border, #e5e7eb)', minHeight: 240, background: 'var(--color-bg, #f5f5f5)' }}
        >
          {generating && (
            <div className="flex flex-col items-center gap-2 py-16">
              <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-gold)' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                正在生成分享卡片…
              </span>
            </div>
          )}
          {!generating && cardImg && (
            <img src={cardImg} alt="分享卡片预览" className="max-h-72 w-auto" />
          )}
          {!generating && !cardImg && (
            <p className="px-6 py-16 text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              当前环境不支持生成图片，可复制文字或链接分享
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!cardImg}
            className={`${btnBase} flex-1 disabled:opacity-40`}
            style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse, #fff)' }}
          >
            <ImageDown size={16} />
            保存图片
          </button>
          <button
            onClick={() => handleCopy('text')}
            className={`${btnBase} flex-1`}
            style={{ background: 'var(--color-primary-bg, #eef2ff)', color: 'var(--color-primary)' }}
          >
            <ClipboardCopy size={16} />
            {copied === 'text' ? '已复制' : '复制文字'}
          </button>
          <button
            onClick={() => handleCopy('link')}
            className={`${btnBase} flex-1`}
            style={{ background: 'var(--color-primary-bg, #eef2ff)', color: 'var(--color-primary)' }}
          >
            <Link2 size={16} />
            {copied === 'link' ? '已复制' : '复制链接'}
          </button>
        </div>

        <p className="mt-3 text-center text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
          他人打开链接即可查看完整结果
        </p>
      </div>
    </div>
  );
}
