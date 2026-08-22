import type { Request, Response, NextFunction } from 'express';

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/** 定期清理过期桶，防止内存增长 */
setInterval(() => {
  const now = Date.now();
  const maxWindow = 60 * 60 * 1000;
  for (const [key, b] of buckets) {
    b.timestamps = b.timestamps.filter((t) => now - t < maxWindow);
    if (b.timestamps.length === 0) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref();

/**
 * 滑动窗口限流：每个 IP 在 windowMs 内最多 max 次
 * 按 路径 + IP 维度计数
 */
export function rateLimit(windowMs: number, max: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.path}:${req.ip}`;
    const now = Date.now();
    const b = buckets.get(key) || { timestamps: [] };
    b.timestamps = b.timestamps.filter((t) => now - t < windowMs);

    if (b.timestamps.length >= max) {
      const retryMs = windowMs - (now - b.timestamps[0]);
      const retrySec = Math.max(1, Math.ceil(retryMs / 1000));
      res.status(429).json({ success: false, message: `操作过于频繁，请 ${retrySec} 秒后重试` });
      return;
    }

    b.timestamps.push(now);
    buckets.set(key, b);
    next();
  };
}
