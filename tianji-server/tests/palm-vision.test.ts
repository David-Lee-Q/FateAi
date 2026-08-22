import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock 视觉模型调用
vi.mock('../src/services/ai-interpreter', () => ({
  callAIWithImage: vi.fn(),
}));

import { analyzePalm, parsePalmAIJson } from '../src/services/palm.service';
import { callAIWithImage } from '../src/services/ai-interpreter';

const mockCall = vi.mocked(callAIWithImage);

const VALID_JSON = JSON.stringify({
  palmType: '水型手',
  palmTypeDesc: '手掌圆润柔和，指节较短',
  summary: '整体掌纹舒展，三大主线清晰，属感情细腻之相。',
  lines: {
    life: { type: '深', description: '生命线深刻连贯', interpretation: '生命力旺盛，体质较好。' },
    heart: { type: '长', description: '感情线延伸较长', interpretation: '感情丰富，善于表达。' },
    mind: { type: '清晰', description: '智慧线清晰笔直', interpretation: '思维敏捷，判断准确。' },
  },
});

beforeEach(() => {
  mockCall.mockReset();
});

describe('parsePalmAIJson', () => {
  it('解析合法 JSON', () => {
    const r = parsePalmAIJson(VALID_JSON);
    expect(r).toBeTruthy();
    expect(r!.palmType).toBe('水型手');
    expect(r!.wuXing).toBe('水');
    expect(r!.lines.life.type).toBe('深');
  });

  it('解析带 ```json 代码块包裹的 JSON', () => {
    const r = parsePalmAIJson('```json\n' + VALID_JSON + '\n```');
    expect(r).toBeTruthy();
    expect(r!.palmType).toBe('水型手');
  });

  it('非法 palmType 返回 null', () => {
    const bad = JSON.stringify({ ...JSON.parse(VALID_JSON), palmType: '石头手' });
    expect(parsePalmAIJson(bad)).toBeNull();
  });

  it('缺少 lines 字段返回 null', () => {
    const { lines, ...rest } = JSON.parse(VALID_JSON);
    expect(parsePalmAIJson(JSON.stringify(rest))).toBeNull();
  });

  it('非 JSON 文本返回 null', () => {
    expect(parsePalmAIJson('这是一段普通文字')).toBeNull();
  });
});

describe('analyzePalm 降级逻辑', () => {
  const img = 'data:image/png;base64,iVBORw0KGgo=';

  it('视觉模型可用且返回合法 JSON → mode=ai', async () => {
    mockCall.mockResolvedValue(VALID_JSON);
    const r = await analyzePalm({ gender: 'male', image: img });
    expect(r.details.mode).toBe('ai');
    expect(r.details.palmType).toBe('水型手');
    expect(mockCall).toHaveBeenCalledTimes(1);
  });

  it('视觉模型不可用（无 Key）→ mode=mock 降级', async () => {
    mockCall.mockResolvedValue(null);
    const r = await analyzePalm({ gender: 'female', image: img });
    expect(r.details.mode).toBe('mock');
    expect(r.details.gender).toBe('女');
    expect(r.details.lines.life.interpretation.length).toBeGreaterThan(0);
  });

  it('视觉模型返回非法 JSON → mode=mock 降级', async () => {
    mockCall.mockResolvedValue('无法识别');
    const r = await analyzePalm({ gender: 'male', image: img });
    expect(r.details.mode).toBe('mock');
  });

  it('非 data URL 图片（如 blob:）跳过视觉直接 mock', async () => {
    const r = await analyzePalm({ gender: 'male', image: 'blob:http://localhost/123' });
    expect(r.details.mode).toBe('mock');
    expect(mockCall).not.toHaveBeenCalled();
  });

  it('无图片抛错', async () => {
    await expect(analyzePalm({ gender: 'male', image: '' })).rejects.toThrow('请上传手掌照片');
  });
});
