import { describe, it, expect } from 'vitest';
import { rateLimit } from '../src/middleware/rateLimit';

// 直接驱动中间件，模拟多次请求
function makeCtx(ip: string, path: string) {
  const req: any = { ip, path };
  let status = 0;
  let body: any = null;
  let nexted = false;
  const res: any = {
    status(code: number) { status = code; return this; },
    json(b: any) { body = b; return this; },
  };
  const next = () => { nexted = true; };
  return { req, res, next, get: () => ({ status, body, nexted }) };
}

describe('滑动窗口限流', () => {
  // 每个用例使用不同的 path 隔离桶
  let seq = 0;

  it('登录限流：窗口内第 6 次返回 429', () => {
    const limiter = rateLimit(60 * 1000, 5);
    const path = `/login/t${seq++}`;
    let last;
    for (let i = 0; i < 6; i++) {
      const ctx = makeCtx('1.1.1.1', path);
      limiter(ctx.req, ctx.res, ctx.next);
      last = ctx.get();
    }
    expect(last.status).toBe(429);
    expect(last.body.success).toBe(false);
    expect(last.body.message).toContain('操作过于频繁');
  });

  it('前 5 次放行（nexted=true）', () => {
    const limiter = rateLimit(60 * 1000, 5);
    const path = `/login/t${seq++}`;
    for (let i = 0; i < 5; i++) {
      const ctx = makeCtx('1.1.1.1', path);
      limiter(ctx.req, ctx.res, ctx.next);
      expect(ctx.get().nexted).toBe(true);
    }
  });

  it('注册限流：窗口内第 4 次返回 429', () => {
    const limiter = rateLimit(60 * 60 * 1000, 3);
    const path = `/register/t${seq++}`;
    let last;
    for (let i = 0; i < 4; i++) {
      const ctx = makeCtx('2.2.2.2', path);
      limiter(ctx.req, ctx.res, ctx.next);
      last = ctx.get();
    }
    expect(last.status).toBe(429);
  });

  it('不同 IP 互不影响', () => {
    const limiter = rateLimit(60 * 1000, 2);
    const path = `/login/t${seq++}`;
    for (let i = 0; i < 2; i++) {
      const a = makeCtx('3.3.3.3', path);
      limiter(a.req, a.res, a.next);
      expect(a.get().nexted).toBe(true);
    }
    const b = makeCtx('4.4.4.4', path);
    limiter(b.req, b.res, b.next);
    expect(b.get().nexted).toBe(true); // 不同 IP 不受 3.3.3.3 计数影响
  });

  it('窗口过期后计数重置', async () => {
    const limiter = rateLimit(50, 1); // 50ms 窗口
    const path = `/login/t${seq++}`;
    const first = makeCtx('5.5.5.5', path);
    limiter(first.req, first.res, first.next);
    expect(first.get().nexted).toBe(true);

    const blocked = makeCtx('5.5.5.5', path);
    limiter(blocked.req, blocked.res, blocked.next);
    expect(blocked.get().status).toBe(429);

    await new Promise((r) => setTimeout(r, 80));
    const after = makeCtx('5.5.5.5', path);
    limiter(after.req, after.res, after.next);
    expect(after.get().nexted).toBe(true); // 窗口已过期
  });
});
