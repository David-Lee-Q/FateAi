/**
 * 梅花易数占卜服务
 * 先天八卦数起卦：年支+农历月+日 → 上卦，再加时支 → 下卦/动爻
 * 推演：本卦 → 互卦（2/3/4 与 3/4/5 爻）→ 变卦（动爻变），并判体用五行生克
 */

import { Solar } from 'lunar-typescript';
import { getShiChen, getYearPillar } from '../utils/lunar';
import {
  BITS_TO_TRIGRAM,
  HEXAGRAM_MEANINGS,
  NUMBER_TO_TRIGRAM,
  TRIGRAMS,
  hexagramOf,
  tiYongRelation,
  type Hexagram,
} from '../utils/bagua';
import type { MeihuaResult } from '../types';

const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 余数为 0 时取 8（八卦循环） */
function mod8(n: number): number {
  const r = n % 8;
  return r === 0 ? 8 : r;
}

/** 余数为 0 时取 6（六爻循环） */
function mod6(n: number): number {
  const r = n % 6;
  return r === 0 ? 6 : r;
}

/** 取农历月（闰月按本月计）与农历日 */
function lunarMonthDay(now: Date): { month: number; day: number; lunarText: string } {
  const solar = Solar.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lunar = solar.getLunar();
  const month = Math.abs(lunar.getMonth());
  const day = lunar.getDay();
  return { month, day, lunarText: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}` };
}

/** 由 6 位卦象生成展示结构 */
function guaInfo(bits: string) {
  const h = hexagramOf(bits) as Hexagram;
  const upper = TRIGRAMS[h.upper];
  const lower = TRIGRAMS[h.lower];
  return {
    name: h.name,
    symbol: `${upper.symbol}${lower.symbol}`,
    bits,
    upper: { name: upper.name, symbol: upper.symbol, element: upper.element },
    lower: { name: lower.name, symbol: lower.symbol, element: lower.element },
    palace: `${h.palace}宫`,
    meaning: HEXAGRAM_MEANINGS[h.name] || '',
  };
}

/**
 * 梅花易数起卦
 * @param method 起卦方式：number 数字起卦 / time 时间起卦
 * @param num1 第一个数字（数字起卦）
 * @param num2 第二个数字（数字起卦）
 * @param question 所问之事
 * @param now 起卦时间（默认当前，便于测试注入）
 */
export function castMeihua(
  method: 'number' | 'time',
  num1?: number,
  num2?: number,
  question?: string,
  now: Date = new Date()
): MeihuaResult {
  let upperNumber: number;
  let lowerNumber: number;
  let dongYao: number;
  let methodDetail: string;

  if (method === 'number') {
    const a = Number(num1 ?? 1);
    const b = Number(num2 ?? 1);
    upperNumber = mod8(a);
    lowerNumber = mod8(b);
    dongYao = mod6(a + b);
    methodDetail = `数字起卦：取数 ${a}、${b}，上卦 ${a}%8、下卦 ${b}%8、动爻 (${a}+${b})%6`;
  } else {
    const lunar = lunarMonthDay(now);
    const yearZhi = getYearPillar(now.getFullYear(), now.getMonth() + 1, now.getDate()).zhi;
    const n = DI_ZHI.indexOf(yearZhi) + 1; // 子=1
    const t = getShiChen(now.getHours()) + 1; // 子=1
    const base = n + lunar.month + lunar.day;
    upperNumber = mod8(base);
    lowerNumber = mod8(base + t);
    dongYao = mod6(base + t);
    methodDetail =
      `时间起卦：农历${lunar.lunarText}，年支${yearZhi}(${n})、月${lunar.month}、日${lunar.day}、时支(${t})；`
      + `上卦 (${n}+${lunar.month}+${lunar.day})%8=${upperNumber}，`
      + `下卦 (+${t})%8=${lowerNumber}，动爻 %6=${dongYao}`;
  }

  const upperName = NUMBER_TO_TRIGRAM[upperNumber];
  const lowerName = NUMBER_TO_TRIGRAM[lowerNumber];
  const mainBits = TRIGRAMS[lowerName].bits + TRIGRAMS[upperName].bits;
  const main = guaInfo(mainBits);

  // 互卦：2/3/4 爻为下互，3/4/5 爻为上互
  const huBits = mainBits.slice(1, 4) + mainBits.slice(2, 5);
  const hu = guaInfo(huBits);

  // 变卦：动爻阴阳互换
  const idx = dongYao - 1;
  const flipped = mainBits.split('');
  flipped[idx] = flipped[idx] === '1' ? '0' : '1';
  const bian = guaInfo(flipped.join(''));

  // 体用：动爻所在之卦为用，另一卦为体
  const movingInLower = dongYao <= 3;
  const tiName = movingInLower ? upperName : lowerName;
  const yongName = movingInLower ? lowerName : upperName;
  const tiElement = TRIGRAMS[tiName].element;
  const yongElement = TRIGRAMS[yongName].element;
  const relation = tiYongRelation(tiElement, yongElement);

  const questionText = question?.trim() || '';
  const interpretation =
    `${questionText ? `关于「${questionText}」：` : ''}`
    + `本卦【${main.name}】（${main.meaning}），第${dongYao}爻动，变卦【${bian.name}】（${bian.meaning}）。`
    + `互卦【${hu.name}】示中间过程。`
    + `体卦${tiName}（${tiElement}），用卦${yongName}（${yongElement}），`
    + `${relation.key}：${relation.text}。`;

  const summary =
    `梅花易数（${method === 'number' ? '数字起卦' : '时间起卦'}）得【${main.name}】之【${bian.name}】，`
    + `第${dongYao}爻动，互卦【${hu.name}】。`
    + `体${tiName}${tiElement}，用${yongName}${yongElement}，${relation.key}（${relation.lucky}）。`;

  return {
    summary,
    details: {
      method: method === 'number' ? '数字起卦法' : '时间起卦法',
      methodDetail,
      upperGua: { name: upperName, symbol: TRIGRAMS[upperName].symbol, number: upperNumber },
      lowerGua: { name: lowerName, symbol: TRIGRAMS[lowerName].symbol, number: lowerNumber },
      mainGua: {
        name: main.name,
        symbol: main.symbol,
        bits: main.bits,
        meaning: main.meaning,
        palace: main.palace,
      },
      huGua: { name: hu.name, symbol: hu.symbol, bits: hu.bits, meaning: hu.meaning },
      bianGua: { name: bian.name, symbol: bian.symbol, bits: bian.bits, meaning: bian.meaning },
      dongYao,
      dongYaoDesc: `第${dongYao}爻（${movingInLower ? '下卦' : '上卦'}）动`,
      tiYong: {
        ti: `${tiName}（${tiElement}）`,
        yong: `${yongName}（${yongElement}）`,
        relation: relation.key,
        lucky: relation.lucky,
        text: relation.text,
      },
      interpretation,
    },
  };
}
