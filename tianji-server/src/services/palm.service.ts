import { PalmResult, PalmInputParams } from '../types';
import { callAIWithImage } from './ai-interpreter';

const PALM_TYPES = ['金型手', '木型手', '水型手', '火型手', '土型手'];

const PALM_TYPE_DESC: Record<string, string> = {
  '金型手': '手掌方厚端庄，指节方正，整体给人坚实稳重的感觉。这类人做事踏实，意志坚定，适合从事实业或管理类工作。',
  '木型手': '手掌修长优美，指节较长，皮肤细腻。这类人思维敏捷，富有艺术气质，适合从事创意或学术类工作。',
  '水型手': '手掌圆润柔和，指节较短，整体丰满。这类人情感丰富，善于沟通，适合从事服务或艺术类工作。',
  '火型手': '手掌尖尖纤长，指节分明，线条流畅。这类人热情洋溢，行动力强，适合从事销售或创业类工作。',
  '土型手': '手掌浑厚宽大，指节粗壮，皮肤较厚。这类人稳重可靠，耐力十足，适合从事建筑或农业类工作。',
};

const WU_XING_MAP: Record<string, string> = {
  '金型手': '金',
  '木型手': '木',
  '水型手': '水',
  '火型手': '火',
  '土型手': '土',
};

const LINE_TYPES = ['长', '短', '深', '浅', '清晰', '断续', '分叉', '环抱', '中断'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLineInterpretation(lineName: string, lineType: string, gender: string): string {
  const genderSpecific = gender === '男' 
    ? '男性通常在事业上有较强的进取心，'
    : '女性通常在人际关系中更加细腻敏感，';

  const lineSpecifics: Record<string, Record<string, string>> = {
    '生命线': {
      '长': `${genderSpecific}生命线较长表示精力充沛，寿命较长，身体素质较好。年轻时运势平稳，晚年有福。`,
      '短': `${genderSpecific}生命线较短表示精力有限，需要注意身体健康。适合从事稳定工作，不宜过度操劳。`,
      '深': `${genderSpecific}生命线清晰深刻表示生命力旺盛，意志坚定，能够克服困难。`,
      '浅': `${genderSpecific}生命线较浅表示体质较弱，需要加强锻炼和保养。`,
      '清晰': `${genderSpecific}生命线清晰表示健康状况良好，抵抗力强。`,
      '断续': `${genderSpecific}生命线断续表示人生有起伏，需要注意健康管理。`,
      '分叉': `${genderSpecific}生命线分叉表示可能经历人生转折点，需要把握机遇。`,
      '环抱': `${genderSpecific}生命线呈环抱状表示人缘较好，晚年运势佳。`,
      '中断': `${genderSpecific}生命线中断表示需要注意健康风险，建议定期体检。`,
    },
    '感情线': {
      '长': `${genderSpecific}感情线较长表示感情丰富，善于表达，容易获得异性的青睐。`,
      '短': `${genderSpecific}感情线较短表示对感情较为理性，不会轻易陷入感情。`,
      '深': `${genderSpecific}感情线深刻表示对感情认真执着，一旦投入便会全心付出。`,
      '浅': `${genderSpecific}感情线较浅表示对感情较为淡漠或理性，不会轻易动情。`,
      '清晰': `${genderSpecific}感情线清晰表示感情顺利，婚姻幸福。`,
      '断续': `${genderSpecific}感情线断续表示感情经历较多波折，需要谨慎选择伴侣。`,
      '分叉': `${genderSpecific}感情线分叉表示可能经历多次感情，或有多段恋情。`,
      '环抱': `${genderSpecific}感情线环抱表示对感情专一，婚姻稳定。`,
      '中断': `${genderSpecific}感情线中断表示可能在感情上受到伤害，需要谨慎。`,
    },
    '智慧线': {
      '长': `${genderSpecific}智慧线较长表示思维敏捷，记忆力好，学习能力强。适合从事脑力劳动。`,
      '短': `${genderSpecific}智慧线较短表示思维直接，行动力强，不喜欢想太多。`,
      '深': `${genderSpecific}智慧线深刻表示思考深入，善于分析问题，有独立见解。`,
      '浅': `${genderSpecific}智慧线较浅表示思维灵活但不深入，需要多加思考再做决定。`,
      '清晰': `${genderSpecific}智慧线清晰表示头脑清晰，判断准确，做事有条理。`,
      '断续': `${genderSpecific}智慧线断续表示思维跳跃，容易分心，需要培养专注力。`,
      '分叉': `${genderSpecific}智慧线分叉表示思维发散，创造力强，适合创意工作。`,
      '环抱': `${genderSpecific}智慧线环抱表示思考全面，能够顾及多方面因素。`,
      '中断': `${genderSpecific}智慧线中断表示可能在学习或工作中遇到瓶颈，需要突破。`,
    },
  };

  return lineSpecifics[lineName]?.[lineType] || `${lineName}${lineType}表示具有一定的特质，建议结合整体手相分析。`;
}

function generatePalmSummary(
  palmType: string,
  wuXing: string,
  gender: string,
  lifeType: string,
  heartType: string,
  mindType: string
): string {
  const genderIntro = gender === '男' ? '男性' : '女性';
  
  const palmTypeEmoji: Record<string, string> = {
    '金型手': '🪶',
    '木型手': '🌿',
    '水型手': '💧',
    '火型手': '🔥',
    '土型手': '🏔️',
  };

  const summary = `${genderIntro}属于${palmType}，五行属${wuXing}。${PALM_TYPE_DESC[palmType]}`;

  const linesAnalysis: string[] = [];
  if (lifeType === '深' || lifeType === '长') {
    linesAnalysis.push('生命线较为理想，生命力旺盛；');
  } else if (lifeType === '短' || lifeType === '浅') {
    linesAnalysis.push('生命线提示需注意健康保养；');
  }

  if (heartType === '长' || heartType === '深') {
    linesAnalysis.push('感情线丰富，对感情认真；');
  } else if (heartType === '短' || heartType === '浅') {
    linesAnalysis.push('感情线较为理性，对感情有主见；');
  }

  if (mindType === '长' || mindType === '深') {
    linesAnalysis.push('智慧线发达，思维敏捷。');
  } else if (mindType === '短' || mindType === '浅') {
    linesAnalysis.push('智慧线提示需加强思考深度。');
  }

  return summary + ' ' + linesAnalysis.join('');
}

/** 视觉模型提示词：要求返回严格 JSON */
function palmVisionPrompt(genderText: string): string {
  return `你是资深手相师。请仔细观察这张手掌照片，分析其手型与三大主线（生命线、感情线、智慧线）。性别参考：${genderText}。
请仅输出一个 JSON 对象（不要任何多余文字或代码块标记），字段如下：
{
  "palmType": "金型手|木型手|水型手|火型手|土型手 之一",
  "palmTypeDesc": "对该手型的一句中文描述（20-50字）",
  "summary": "整体手相概述（40-100字，客观专业）",
  "lines": {
    "life":  { "type": "长|短|深|浅|清晰|断续|分叉|环抱|中断 之一", "description": "生命线形态描述（15-40字）", "interpretation": "生命线含义解读（20-60字）" },
    "heart": { "type": "同上", "description": "感情线形态描述（15-40字）", "interpretation": "感情线含义解读（20-60字）" },
    "mind":  { "type": "同上", "description": "智慧线形态描述（15-40字）", "interpretation": "智慧线含义解读（20-60字）" }
  }
}`;
}

/** 解析并校验视觉模型返回的 JSON，格式不符返回 null */
export function parsePalmAIJson(text: string): {
  palmType: string;
  palmTypeDesc: string;
  wuXing: string;
  summary: string;
  lines: { life: { type: string; description: string; interpretation: string }; heart: { type: string; description: string; interpretation: string }; mind: { type: string; description: string; interpretation: string } };
} | null {
  try {
    // 去除可能的 ```json 代码块包裹
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first < 0 || last <= first) return null;
    const obj = JSON.parse(cleaned.slice(first, last + 1)) as Record<string, unknown>;

    const palmType = typeof obj.palmType === 'string' && PALM_TYPES.includes(obj.palmType) ? obj.palmType : null;
    if (!palmType) return null;

    const rawLines = obj.lines as Record<string, Record<string, string>> | undefined;
    const pickLine = (key: 'life' | 'heart' | 'mind') => {
      const l = rawLines?.[key];
      if (!l || typeof l.type !== 'string' || typeof l.description !== 'string' || typeof l.interpretation !== 'string') return null;
      return { type: l.type, description: l.description, interpretation: l.interpretation };
    };
    const life = pickLine('life');
    const heart = pickLine('heart');
    const mind = pickLine('mind');
    if (!life || !heart || !mind) return null;

    const summary = typeof obj.summary === 'string' && obj.summary.trim() ? obj.summary.trim() : null;
    if (!summary) return null;

    return {
      palmType,
      palmTypeDesc: typeof obj.palmTypeDesc === 'string' && obj.palmTypeDesc.trim() ? obj.palmTypeDesc.trim() : PALM_TYPE_DESC[palmType],
      wuXing: WU_XING_MAP[palmType],
      summary,
      lines: { life, heart, mind },
    };
  } catch {
    return null;
  }
}

/** 模板模拟结果（AI 不可用时的降级） */
function buildMockPalm(genderText: string): { summary: string; details: Omit<PalmResult['details'], 'mode'> } {
  const palmType = randomFrom(PALM_TYPES);
  const wuXing = WU_XING_MAP[palmType];
  const palmTypeDesc = PALM_TYPE_DESC[palmType];

  const lifeType = randomFrom(LINE_TYPES);
  const heartType = randomFrom(LINE_TYPES);
  const mindType = randomFrom(LINE_TYPES);

  const lines = {
    life: {
      name: '生命线',
      type: lifeType,
      description: `生命线呈现${lifeType}特征，起点位于拇指与食指之间，呈弧形延伸至手腕。`,
      interpretation: generateLineInterpretation('生命线', lifeType, genderText),
    },
    heart: {
      name: '感情线',
      type: heartType,
      description: `感情线呈现${heartType}特征，起于小指下方，延伸至食指与中指之间。`,
      interpretation: generateLineInterpretation('感情线', heartType, genderText),
    },
    mind: {
      name: '智慧线',
      type: mindType,
      description: `智慧线呈现${mindType}特征，位于手掌中央，横跨生命线与感情线之间。`,
      interpretation: generateLineInterpretation('智慧线', mindType, genderText),
    },
  };

  const summary = generatePalmSummary(palmType, wuXing, genderText, lifeType, heartType, mindType);
  return { summary, details: { palmType, palmTypeDesc, wuXing, gender: genderText, lines } };
}

/** 手相算命服务
 * 优先调用视觉模型识别手掌照片生成真实解读；
 * 无 AI Key 或识别失败时降级为模板模拟（details.mode 标识来源）
 */
export async function analyzePalm(params: PalmInputParams): Promise<PalmResult> {
  const { gender, image } = params;

  if (!image) {
    throw new Error('请上传手掌照片');
  }

  const genderText = gender === 'male' ? '男' : '女';

  // 1. 视觉模型真实识别
  if (image.startsWith('data:image/')) {
    const aiText = await callAIWithImage(palmVisionPrompt(genderText), image);
    if (aiText) {
      const ai = parsePalmAIJson(aiText);
      if (ai) {
        return {
          summary: ai.summary,
          details: {
            palmType: ai.palmType,
            palmTypeDesc: ai.palmTypeDesc,
            wuXing: ai.wuXing,
            gender: genderText,
            lines: {
              life: { name: '生命线', ...ai.lines.life },
              heart: { name: '感情线', ...ai.lines.heart },
              mind: { name: '智慧线', ...ai.lines.mind },
            },
            mode: 'ai',
          },
        };
      }
    }
  }

  // 2. 降级：模板模拟
  const mock = buildMockPalm(genderText);
  return { summary: mock.summary, details: { ...mock.details, mode: 'mock' } };
}