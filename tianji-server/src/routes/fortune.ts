/**
 * 占卜路由
 * POST /api/fortune/query   - 提交占卜查询
 * GET  /api/fortune/result/:id - 获取结果
 * GET  /api/fortune/history   - 获取历史
 *
 * 支持 18 种占卜系统：bazi, tarot, zodiac, dream,
 *   ziwei, liuyao, meihua, qimen, fengshui,
 *   numerology, astrodice, moonphase, rune,
 *   nametest, shengxiao, almanac, drawlot, palm
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
import { calculateNumerology } from '../services/numerology.service';
import { castAstrodice } from '../services/astrodice.service';
import { calculateMoonphase } from '../services/moonphase.service';
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
} from '../types';
import { resultStorage } from '../utils/storage';
import { interpretFortune, followUpInterpret } from '../services/ai-interpreter';

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
      'report', 'compare',
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
        const { year, month, day, hour, gender } = params;
        if (!year || !month || !day || hour === undefined || !gender) {
          res.status(400).json({ success: false, message: '八字排盘需要：year, month, day, hour, gender' });
          return;
        }
        data = calculateBazi(year, month, day, hour, gender);
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
        // keywords 和 description 至少有一个
        const hasKeywords = Array.isArray(params.keywords) && params.keywords.length > 0;
        const hasDescription = params.description && params.description.trim().length > 0;
        if (!hasKeywords && !hasDescription) {
          res.status(400).json({ success: false, message: '解梦需要：keywords 或 description（至少填一项）' });
          return;
        }
        // 如果有 description，将其作为关键词加入
        const keywords = hasKeywords ? [...params.keywords] : [];
        if (hasDescription && !keywords.includes(params.description)) {
          keywords.push(params.description);
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
        const params = inputParams as unknown as NumerologyInputParams;
        if (!params.birthDate) {
          res.status(400).json({ success: false, message: '数字能量需要：birthDate (YYYY-MM-DD)' });
          return;
        }
        data = calculateNumerology(params.birthDate);
        break;
      }

      case 'astrodice': {
        const params = inputParams as unknown as AstrodiceInputParams;
        data = castAstrodice(params.question);
        break;
      }

      case 'moonphase': {
        const params = inputParams as unknown as MoonphaseInputParams;
        if (!params.birthDate) {
          res.status(400).json({ success: false, message: '月相占卜需要：birthDate (YYYY-MM-DD)' });
          return;
        }
        data = calculateMoonphase(params.birthDate);
        break;
      }

      case 'rune': {
        const params = inputParams as unknown as RuneInputParams;
        data = castRune(params.spread || 'single', params.question);
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
        } as unknown as FortuneResult['data'];
        break;
      }

      case 'compare': {
        // 多维对比：接收两组出生信息
        const params = inputParams as {
          person1: { birthDate: string; gender: string };
          person2: { birthDate: string; gender: string };
        };
        if (!params.person1?.birthDate || !params.person2?.birthDate) {
          res.status(400).json({ success: false, message: '多维对比需要：person1.birthDate, person2.birthDate' });
          return;
        }
        // 模拟配对评分
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
        } as unknown as FortuneResult['data'];
        break;
      }

      default:
        res.status(400).json({ success: false, message: `未知的占卜系统：${system}` });
        return;
    }

    // ====== AI 解读：异步调用 LLM 生成自然语言解读 ======
    try {
      const aiText = await interpretFortune(system, data as unknown as Record<string, unknown>, inputParams as Record<string, unknown>);
      // 将 AI 解读附加到 result.data 中
      if (data && typeof data === 'object') {
        (data as unknown as Record<string, unknown>).aiInterpretation = aiText;
      }
    } catch (aiError) {
      // AI 调用失败不阻塞结果返回，打印日志即可
      console.warn('AI 解读生成失败（将使用默认解读）:', aiError);
    }

    // 保存结果
    const result: FortuneResult = {
      id: generateId(),
      system,
      createdAt: new Date().toISOString(),
      status: 'completed',
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
 * GET /api/fortune/history
 * 获取历史查询记录（最近20条）
 */
router.get('/history', (_req: Request, res: Response) => {
  const history = resultStorage.getHistory(20);

  res.json({ success: true, data: history });
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

export default router;
