/**
 * 占卜路由
 * POST /api/fortune/query   - 提交占卜查询
 * GET  /api/fortune/result/:id - 获取结果
 * GET  /api/fortune/history   - 获取历史
 *
 * 支持 20 种占卜系统：bazi, tarot, zodiac, dream,
 *   ziwei, liuyao, meihua, qimen, fengshui, tieban,
 *   daliuren, numerology, astrodice, moonphase, rune,
 *   nametest, shengxiao, almanac, drawlot, palm
 * 另支持 AI 洞察系统：search, trend, report, compare
 */

import { Router, Request, Response } from 'express';
import { calculateBazi } from '../services/bazi.service';
import { performTarotReading } from '../services/tarot.service';
import { getZodiacByDate, generateZodiacFortune } from '../services/zodiac.service';
import { interpretDream } from '../services/dream.service';
import { calculateZiwei } from '../services/ziwei.service';
import { castLiuyao } from '../services/liuyao.service';
import { castMeihua } from '../services/meihua.service';
import { castQimen } from '../services/qimen.service';
import { analyzeFengshui } from '../services/fengshui.service';
import { calculateNumerology, calculateNumerologyFromValue } from '../services/numerology.service';
import { castAstrodice } from '../services/astrodice.service';
import { calculateMoonphase, calculateMoonphaseByPhase } from '../services/moonphase.service';
import { fnv1a } from '../utils/hash';
import { castRune } from '../services/rune.service';
import { analyzeName } from '../services/nametest.service';
import { getShengxiaoFortune } from '../services/shengxiao.service';
import { getDailyAlmanac } from '../services/almanac.service';
import { drawLot } from '../services/drawlot.service';
import { analyzePalm } from '../services/palm.service';
import { calculateTieban } from '../services/tieban.service';
import { calculateDaliuren } from '../services/daliuren.service';
import type {
  FortuneSystem, FortuneQueryRequest, FortuneResult,
  BaziInputParams, TarotInputParams, ZodiacInputParams, DreamInputParams,
  ZiweiInputParams, LiuyaoInputParams, MeihuaInputParams, QimenInputParams,
  FengshuiInputParams, NumerologyInputParams, AstrodiceInputParams,
  MoonphaseInputParams, RuneInputParams, NametestInputParams,
  ShengxiaoInputParams, AlmanacInputParams,
  PalmInputParams,
  TiebanInputParams,
  DaliurenInputParams,
  SearchResult, TrendResult, ReportResult, CompareResult,
} from '../types';
import { resultStorage } from '../utils/storage';
import { interpretFortune, followUpInterpret, askAiAdvice } from '../services/ai-interpreter';
import { getOptionalAuthUserId } from './auth';

const router = Router();

/** 生成唯一ID */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * POST /api/fortune/query
 * 提交占卜查询（参数：system, inputParams）
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { system, inputParams } = req.body as FortuneQueryRequest;

    // 参数校验
    if (!system || !inputParams) {
      res.status(400).json({ success: false, message: '缺少必要参数：system 和 inputParams' });
      return;
    }

    const validSystems: FortuneSystem[] = [
      'bazi', 'tarot', 'zodiac', 'dream',
      'ziwei', 'liuyao', 'meihua', 'qimen', 'tieban', 'daliuren', 'fengshui',
      'numerology', 'astrodice', 'moonphase', 'rune',
      'nametest', 'shengxiao', 'almanac', 'drawlot', 'palm',
      'report', 'compare', 'search', 'trend',
    ];
    if (!validSystems.includes(system)) {
      res.status(400).json({ success: false, message: `不支持的占卜系统：${system}` });
      return;
    }

    // 根据系统类型分发处理
    let data: FortuneResult['data'];

    switch (system) {
      // ========== 已有系统 ==========
      case 'bazi': {
        const params = inputParams as unknown as BaziInputParams;
        const { year, month, day, hour, gender, province, city } = params;
        if (!year || !month || !day || hour === undefined || !gender) {
          res.status(400).json({ success: false, message: '八字排盘需要：year, month, day, hour, gender' });
          return;
        }
        data = calculateBazi(year, month, day, hour, gender, city, province);
        break;
      }

      case 'tarot': {
        const params = inputParams as unknown as TarotInputParams;
        const spread = params.spread || 'three';
        data = performTarotReading(spread, params.question);
        break;
      }

      case 'zodiac': {
        const params = inputParams as unknown as ZodiacInputParams;
        if (!params.birthDate) {
          res.status(400).json({ success: false, message: '星座运势需要：birthDate (YYYY-MM-DD)' });
          return;
        }
        const sign = getZodiacByDate(params.birthDate);
        data = generateZodiacFortune(sign, params.type || 'daily');
        break;
      }

      case 'dream': {
        const params = inputParams as unknown as DreamInputParams;
        const desc = params.description?.trim() || '';
        const hasKeywords = Array.isArray(params.keywords) && params.keywords.length > 0;
        const hasDescription = desc.length > 0;
        if (!hasKeywords && !hasDescription) {
          res.status(400).json({ success: false, message: '解梦需要：keywords 或 description（至少填一项）' });
          return;
        }
        const keywords = hasKeywords ? [...params.keywords] : [];
        if (hasDescription && !keywords.includes(desc)) {
          keywords.push(desc);
        }
        data = interpretDream(keywords);
        break;
      }

      // ========== 东方命理系统 ==========
      case 'ziwei': {
        const params = inputParams as unknown as ZiweiInputParams;
        const { year, month, day, hour, gender } = params;
        if (!year || !month || !day || hour === undefined || !gender) {
          res.status(400).json({ success: false, message: '紫微斗数需要：year, month, day, hour, gender' });
          return;
        }
        data = calculateZiwei(year, month, day, hour, gender);
        break;
      }

      case 'liuyao': {
        const params = inputParams as unknown as LiuyaoInputParams;
        if (!params.question) {
          res.status(400).json({ success: false, message: '六爻卦象需要：question' });
          return;
        }
        data = castLiuyao(params.question);
        break;
      }

      case 'meihua': {
        const params = inputParams as unknown as MeihuaInputParams;
        if (!params.method) {
          res.status(400).json({ success: false, message: '梅花易数需要：method（number/time）' });
          return;
        }
        data = castMeihua(params.method, params.num1, params.num2, params.question);
        break;
      }

      case 'qimen': {
        const params = inputParams as unknown as QimenInputParams;
        const { year, month, day, hour } = params;
        if (!year || !month || !day || hour === undefined) {
          res.status(400).json({ success: false, message: '奇门遁甲需要：year, month, day, hour' });
          return;
        }
        data = castQimen(year, month, day, hour, params.question);
        break;
      }

      case 'tieban': {
        const params = inputParams as unknown as TiebanInputParams;
        const { year, month, day, hour, gender } = params;
        if (!year || !month || !day || hour === undefined || !gender) {
          res.status(400).json({ success: false, message: '铁板神数需要：year, month, day, hour, gender' });
          return;
        }
        data = calculateTieban(year, month, day, hour, gender);
        break;
      }

      case 'daliuren': {
        const params = inputParams as unknown as DaliurenInputParams;
        const { year, month, day, hour, gender } = params;
        if (!year || !month || !day || hour === undefined || !gender) {
          res.status(400).json({ success: false, message: '大六壬需要：year, month, day, hour, gender' });
          return;
        }
        data = calculateDaliuren(year, month, day, hour, gender);
        break;
      }

      case 'fengshui': {
        const params = inputParams as unknown as FengshuiInputParams;
        if (!params.direction || !params.buildingType) {
          res.status(400).json({ success: false, message: '风水罗盘需要：direction, buildingType' });
          return;
        }
        data = analyzeFengshui(params.direction, params.buildingType);
        break;
      }

      // ========== 西方占卜系统 ==========
      case 'numerology': {
        const params = inputParams as unknown as { birthDate?: string; type?: string; value?: string };
        const birthDate = params.birthDate || (params.type === 'life-path' ? params.value : undefined);
        if (birthDate && /^\d{4}-\d{1,2}-\d{1,2}$/.test(birthDate)) {
          data = calculateNumerology(birthDate);
        } else if (params.value && String(params.value).trim()) {
          data = calculateNumerologyFromValue(String(params.value), params.type);
        } else {
          res.status(400).json({ success: false, message: '数字能量需要：birthDate (YYYY-MM-DD) 或 value' });
          return;
        }
        break;
      }

      case 'astrodice': {
        const params = inputParams as unknown as AstrodiceInputParams;
        data = castAstrodice(params.question);
        break;
      }

      case 'moonphase': {
        const params = inputParams as unknown as MoonphaseInputParams;
        if (params.birthDate) {
          data = calculateMoonphase(params.birthDate);
        } else if (params.phase) {
          data = calculateMoonphaseByPhase(params.phase, params.question);
        } else {
          res.status(400).json({ success: false, message: '月相占卜需要：birthDate (YYYY-MM-DD) 或 phase' });
          return;
        }
        break;
      }

      case 'rune': {
        const params = inputParams as unknown as RuneInputParams;
        const spread = (params.spread || params.spreadType || 'single') as 'single' | 'three' | 'odin';
        data = castRune(spread, params.question);
        break;
      }

      // ========== 民俗趣味系统 ==========
      case 'nametest': {
        const params = inputParams as unknown as NametestInputParams;
        if (!params.surname || !params.givenName || !params.gender) {
          res.status(400).json({ success: false, message: '姓名测试需要：surname, givenName, gender' });
          return;
        }
        data = analyzeName(params.surname, params.givenName, params.gender);
        break;
      }

      case 'shengxiao': {
        const params = inputParams as unknown as ShengxiaoInputParams;
        if (!params.animal) {
          res.status(400).json({ success: false, message: '生肖运势需要：animal' });
          return;
        }
        data = getShengxiaoFortune(params.animal, params.birthYear, params.type);
        break;
      }

      case 'almanac': {
        const params = inputParams as unknown as AlmanacInputParams;
        if (!params.date) {
          res.status(400).json({ success: false, message: '每日黄历需要：date (YYYY-MM-DD)' });
          return;
        }
        data = getDailyAlmanac(params.date);
        break;
      }

      case 'drawlot': {
        // 求签无需参数
        data = drawLot();
        break;
      }

      case 'palm': {
        const params = inputParams as unknown as PalmInputParams;
        if (!params.image) {
          res.status(400).json({ success: false, message: '手相算命需要上传手掌照片' });
          return;
        }
        data = await analyzePalm(params);
        break;
      }

      // ========== 综合功能 ==========
      case 'search': {
        const params = inputParams as { keyword: string };
        const keyword = params.keyword || '';
        data = {
          keyword,
          results: keyword ? [
            { title: `${keyword}相关解读`, type: 'bazi', desc: '八字命理中与此相关的分析...' },
            { title: `${keyword}星象指引`, type: 'zodiac', desc: '星座运势中与此相关的提示...' },
            { title: `${keyword}塔罗启示`, type: 'tarot', desc: '塔罗牌中与此相关的象征意义...' },
          ] : [],
          totalCount: keyword ? 3 : 0,
        } as SearchResult;
        break;
      }

      case 'trend': {
        const params = inputParams as { source: string; dimension: string; days: number };
        const safeDays = Math.min(90, Math.max(1, Math.floor(params.days) || 7));
        const points = Array.from({ length: safeDays }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (safeDays - 1 - i));
          return {
            date: d.toISOString().split('T')[0],
            score: Math.floor(Math.random() * 30) + 60,
          };
        });
        data = {
          system: params.source || 'bazi',
          dimension: params.dimension || 'overall',
          days: safeDays,
          data: points,
          summary: '近期运势总体平稳，有小幅波动。',
        } as TrendResult;
        break;
      }

      case 'report': {
        // 综合报告：接收 birthDate + gender，调用多个系统生成综合结果
        const params = inputParams as { birthDate: string; gender: string; systems?: string[] };
        if (!params.birthDate || !params.gender) {
          res.status(400).json({ success: false, message: '综合报告需要：birthDate, gender' });
          return;
        }
        // 调用八字 + 星座生成综合报告
        const baziData = calculateBazi(
          new Date(params.birthDate).getFullYear(),
          new Date(params.birthDate).getMonth() + 1,
          new Date(params.birthDate).getDate(),
          12, // 默认午时
          params.gender as 'male' | 'female'
        );
        const zodiacSign = getZodiacByDate(params.birthDate);
        const zodiacData = generateZodiacFortune(zodiacSign, 'monthly');

        data = {
          summary: '综合运势分析报告',
          details: {
            bazi: baziData,
            zodiac: zodiacData,
            generatedAt: new Date().toISOString(),
          },
        } as ReportResult;
        break;
      }

      case 'compare': {
        const params = inputParams as {
          person1?: { birthDate: string; gender: string };
          person2?: { birthDate: string; gender: string };
          question?: string;
          systems?: string[];
        };
        const hasPersons = !!(params.person1?.birthDate && params.person2?.birthDate);
        const hasSystems = Array.isArray(params.systems) && params.systems.length >= 2;
        if (!hasPersons && !hasSystems) {
          res.status(400).json({
            success: false,
            message: '多维对比需要：person1.birthDate + person2.birthDate，或 systems（至少 2 个体系）',
          });
          return;
        }

        if (hasPersons) {
          // 两人运势匹配度
          const score = Math.floor(Math.random() * 30) + 60; // 60-90分
          data = {
            summary: `两人运势匹配度：${score}分`,
            details: {
              score,
              dimensions: {
                baziMatch: Math.floor(Math.random() * 30) + 60,
                zodiacMatch: Math.floor(Math.random() * 30) + 60,
                elementMatch: Math.floor(Math.random() * 30) + 60,
                overallMatch: score,
              },
              advice: score >= 80 ? '两人运势高度匹配，相处融洽。' : '两人运势较为互补，需多沟通理解。',
            },
          } as CompareResult;
        } else {
          // 多体系对比：对同一问题在多个体系下的能量评分
          const q = (params.question || '').trim() || '综合运势';
          const seed = fnv1a(`${q}::${params.systems!.sort().join(',')}`);
          const scores: Record<string, number> = {};
          for (const s of params.systems!) {
            scores[s] = 55 + (fnv1a(`${q}::${s}`) % 40); // 55-94
          }
          const avg = Math.round(
            Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
          );
          const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
          data = {
            summary: `围绕「${q}」的 ${params.systems!.length} 个体系对比，整体能量 ${avg} 分，${top[0]} 体系信号最强（${top[1]} 分）。`,
            details: {
              score: avg,
              dimensions: {
                baziMatch: scores.bazi ?? avg,
                zodiacMatch: scores.zodiac ?? avg,
                elementMatch: scores.numerology ?? avg,
                overallMatch: avg,
              },
              advice: `综合来看「${q}」整体趋于平稳，${top[0]} 体系给出的提示值得重点关注。`,
              systems: params.systems!,
              systemScores: scores,
              question: q,
            },
          } as CompareResult;
        }
        break;
      }

      default:
        res.status(400).json({ success: false, message: `未知的占卜系统：${system}` });
        return;
    }

    // ====== AI 解读：异步调用 LLM 生成自然语言解读 ======
    let aiText = '';
    try {
      aiText = await interpretFortune(system, data as unknown as Record<string, unknown>, inputParams as Record<string, unknown>);
      // 将 AI 解读附加到 result.data 中（兼容两种字段名），并注入用户问题供结果页展示
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const record = data as unknown as Record<string, unknown>;
        record.aiInterpretation = aiText;
        record.interpretation = aiText;
        const rawInput = inputParams as Record<string, unknown>;
        if (typeof rawInput.question === 'string' && rawInput.question) {
          record.question = rawInput.question;
        }
      }
    } catch (aiError) {
      // AI 调用失败不阻塞结果返回，打印日志即可
      console.warn('AI 解读生成失败（将使用默认解读）:', aiError);
    }

    // 保存结果（登录用户绑定 userId，匿名查询为 null）
    const result: FortuneResult = {
      id: generateId(),
      system,
      createdAt: new Date().toISOString(),
      status: 'completed',
      userId: getOptionalAuthUserId(req),
      interpretation: aiText,
      input: inputParams as unknown as Record<string, unknown>,
      data,
    };
    resultStorage.set(result.id, result);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('占卜查询异常:', error);
    res.status(500).json({ success: false, message: '服务内部错误，请稍后重试' });
  }
});

/**
 * GET /api/fortune/result/:id
 * 根据 ID 获取占卜结果
 */
router.get('/result/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = resultStorage.get(id);

  if (!result) {
    res.status(404).json({ success: false, message: '未找到该查询结果' });
    return;
  }

  res.json({ success: true, data: result });
});

/**
 * GET /api/fortune/history?limit=20
 * 获取历史查询记录
 * - 携带有效 Bearer token：仅返回该用户自己的记录
 * - 匿名请求：返回全局记录（演示数据）
 */
router.get('/history', (req: Request, res: Response) => {
  const limitParam = parseInt(String(req.query.limit || '20'), 10);
  const limit = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 20, 1), 200);

  const userId = getOptionalAuthUserId(req);
  const history = userId
    ? resultStorage.getHistoryForUser(userId, limit)
    : resultStorage.getHistory(limit);

  // data 保持数组（兼容既有调用方），mine 标记是否为当前用户自己的记录
  res.json({ success: true, data: history, mine: Boolean(userId) });
});

/**
 * POST /api/fortune/followup
 * AI 追问：基于已有结果进行追问解读
 * 参数：resultId（结果ID）、question（追问问题）
 */
router.post('/followup', async (req: Request, res: Response) => {
  try {
    const { resultId, question } = req.body as { resultId?: string; question?: string };

    // 参数校验
    if (!resultId || !question || !question.trim()) {
      res.status(400).json({ success: false, message: '缺少必要参数：resultId 和 question' });
      return;
    }

    // 查找原始结果
    const originalResult = resultStorage.get(resultId);
    if (!originalResult) {
      res.status(404).json({ success: false, message: '未找到原始查询结果' });
      return;
    }

    // 从结果中提取 AI 解读文本作为上下文
    const data = originalResult.data as unknown as Record<string, unknown> | undefined;
    let previousResult = '';

    if (data) {
      // 优先使用 aiInterpretation 字段
      if (typeof data.aiInterpretation === 'string') {
        previousResult = data.aiInterpretation;
      }
      // 其次尝试 interpretation
      else if (typeof data.interpretation === 'string') {
        previousResult = data.interpretation;
      }
      // 再次尝试 ai_analysis
      else if (typeof data.ai_analysis === 'string') {
        previousResult = data.ai_analysis;
      }
      // 都没有则使用 summary
      else if (typeof data.summary === 'string') {
        previousResult = data.summary;
      }
      // 兜底：将整个数据 JSON 序列化
      else {
        previousResult = JSON.stringify(data, null, 2);
      }
    }

    // 调用 AI 追问解读
    const aiText = await followUpInterpret(
      originalResult.system,
      previousResult,
      question.trim()
    );

    res.json({
      success: true,
      data: {
        answer: aiText,
        question: question.trim(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI 追问异常:', error);
    res.status(500).json({ success: false, message: '追问失败，请稍后重试' });
  }
});

/**
 * POST /api/fortune/ai-chat
 * 个性化建议自定义提问：AI 跨体系综合分析
 * 参数：question（必填，≤500 字）、context（可选背景）
 */
router.post('/ai-chat', async (req, res) => {
  try {
    const { question, context } = req.body as { question?: string; context?: string };
    const q = (question || '').trim();
    if (!q) {
      res.status(400).json({ success: false, message: '提问内容不能为空' });
      return;
    }
    if (q.length > 500) {
      res.status(400).json({ success: false, message: '提问过长（最多 500 字）' });
      return;
    }
    const answer = await askAiAdvice(q, context?.trim() || undefined);
    res.json({
      success: true,
      data: { answer, question: q, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('AI 建议提问异常:', error);
    res.status(500).json({ success: false, message: 'AI 分析失败，请稍后重试' });
  }
});

export default router;
