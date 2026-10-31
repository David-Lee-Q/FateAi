/**
 * 姓名测试服务（五格剖象法）
 * 康熙笔画 + 标准五格公式（天格/人格/地格/外格/总格）+ 三才配置
 * 说明：内置常用字康熙笔画表；未收录字会标记 unresolved，五格结果为近似值
 */

import type { NametestResult } from '../types';

/** 康熙笔画（常用姓氏与名字用字，含繁简差异校正；未收录者会在结果中标记） */
const KANGXI_STROKES: Record<string, number> = {
  // 常见单姓
  王: 4, 李: 7, 张: 11, 刘: 15, 陈: 16, 杨: 13, 黄: 12, 赵: 14, 吴: 7, 周: 8,
  徐: 10, 孙: 10, 马: 10, 朱: 6, 胡: 11, 郭: 15, 何: 7, 高: 10, 林: 8, 罗: 20,
  郑: 19, 梁: 11, 谢: 17, 宋: 7, 唐: 10, 许: 11, 韩: 17, 冯: 12, 邓: 19, 曹: 11,
  彭: 12, 曾: 12, 萧: 18, 田: 5, 董: 15, 袁: 10, 潘: 16, 于: 3, 蒋: 17, 蔡: 17,
  余: 7, 杜: 7, 叶: 15, 程: 12, 苏: 22, 魏: 18, 吕: 7, 丁: 2, 任: 6, 沈: 8,
  姚: 9, 卢: 16, 姜: 9, 崔: 11, 钟: 17, 谭: 19, 陆: 16, 汪: 8, 范: 15, 金: 8,
  石: 5, 廖: 14, 贾: 13, 夏: 10, 韦: 9, 付: 5, 方: 4, 白: 5, 邹: 17, 孟: 8,
  熊: 14, 秦: 10, 邱: 12, 江: 7, 尹: 4, 薛: 19, 闫: 11, 段: 9, 雷: 13, 侯: 9,
  龙: 16, 史: 5, 陶: 16, 黎: 15, 贺: 12, 顾: 21, 毛: 4, 郝: 14, 龚: 22, 邵: 12,
  万: 15, 钱: 16, 严: 20, 覃: 12, 武: 8, 戴: 18, 莫: 13, 孔: 4, 向: 6, 汤: 13,
  // 常见名字用字
  明: 8, 华: 14, 文: 4, 志: 7, 国: 11, 建: 9, 伟: 11, 海: 11, 平: 5, 东: 8,
  德: 15, 强: 11, 军: 9, 成: 7, 安: 6, 辉: 15, 庆: 15, 刚: 10, 飞: 9, 鹏: 19,
  博: 12, 宇: 6, 浩: 11, 天: 4, 云: 12, 杰: 12, 涛: 18, 勇: 9, 敏: 11, 静: 16,
  丽: 19, 芳: 10, 秀: 7, 美: 9, 婷: 12, 雪: 11, 慧: 15, 雅: 12, 红: 9, 玉: 5,
  玲: 10, 桂: 10, 春: 9, 兰: 23, 凤: 14, 娇: 15, 心: 4, 怡: 9, 欣: 8, 悦: 11,
  思: 9, 雨: 8, 晨: 11, 阳: 17, 子: 3, 涵: 12, 轩: 10, 睿: 14, 泽: 17, 楠: 13,
  琳: 13, 佳: 8, 嘉: 14, 琪: 13, 鑫: 24, 昊: 8, 航: 10, 钧: 12, 铭: 14, 一: 1,
  三: 3, 五: 5, 九: 9, 百: 6, 千: 3, 祥: 11, 瑞: 14, 福: 14, 禄: 13, 寿: 14,
  喜: 12, 乐: 15, 康: 11, 健: 11, 宁: 14, 泰: 9, 和: 8, 顺: 12, 达: 16, 通: 14,
  远: 17, 进: 15, 超: 12, 立: 5, 新: 13, 正: 5, 中: 4, 大: 3, 小: 3, 光: 6,
  宗: 8, 祖: 10, 业: 13, 世: 5, 家: 10, 学: 16, 生: 5, 长: 8, 元: 4, 亨: 7,
  利: 7, 贞: 9, 仁: 4, 义: 13, 礼: 18, 智: 12, 信: 9, 忠: 8, 孝: 7, 廉: 13,
  勤: 13, 俭: 15, 诚: 14, 俊: 9, 凯: 8, 峰: 10, 磊: 15, 毅: 15, 鹤: 15, 麟: 23,
  曦: 20, 瑶: 15, 璇: 16, 珊: 10, 珂: 10, 瑾: 16, 璟: 17, 萌: 14, 萱: 15, 蕾: 19,
  薇: 19, 蕊: 18, 菲: 14, 莹: 15, 颖: 16, 倩: 10, 依: 8, 若: 11, 晴: 12, 语: 14,
  诗: 13, 书: 10, 画: 12, 琴: 13, 棋: 12, 墨: 15, 砚: 12, 竹: 6, 松: 8, 柏: 9,
  桐: 10, 楷: 13, 森: 12, 清: 12, 澈: 16, 溪: 14, 澜: 21, 晓: 16,
  // 复姓用字
  欧: 15, 司: 5, 上: 3, 官: 8, 诸: 16, 葛: 15, 皇: 9, 甫: 7, 令: 5, 狐: 9,
  慕: 15, 容: 10, 尉: 11, 迟: 19, 相: 9, 如: 6, 修: 10, 端: 14, 木: 4,
};

/** 三才五行：按数理尾数（1,2木 3,4火 5,6土 7,8金 9,0水） */
function elementOfNumber(n: number): string {
  const last = n % 10;
  if (last === 1 || last === 2) return '木';
  if (last === 3 || last === 4) return '火';
  if (last === 5 || last === 6) return '土';
  if (last === 7 || last === 8) return '金';
  return '水';
}

/** 数理归一：超过 81 者减 80 */
function normalizeNumber(n: number): number {
  let v = n;
  while (v > 81) v -= 80;
  return v === 0 ? 81 : v;
}

/** 常用吉数（传统五格数理） */
const LUCKY_NUMBERS = new Set([
  1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33,
  35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81,
]);

/** 三才配置吉凶（简表：以相生为吉、相克为凶） */
const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

function sanCaiText(a: string, b: string, c: string): { text: string; lucky: boolean } {
  const rel = (x: string, y: string) => (x === y ? '同' : SHENG[x] === y ? '生' : KE[x] === y ? '克' : '被生');
  const r1 = rel(a, b);
  const r2 = rel(b, c);
  const lucky = r1 !== '克' && r2 !== '克';
  const desc = `${a}${b}${c}`;
  if (r1 === '克' || r2 === '克') return { text: `${desc}：三才相克，宜以名字补益、行事求稳`, lucky: false };
  if (r1 === '生' && r2 === '生') return { text: `${desc}：三才相生，基础稳固、进退有据`, lucky: true };
  return { text: `${desc}：三才和顺，平稳发展`, lucky: true };
}

export interface WugeDetail {
  number: number;
  element: string;
  lucky: boolean;
}

/**
 * 姓名测试分析
 * @param surname 姓（1-2 字）
 * @param givenName 名（1-3 字）
 * @param gender 性别
 */
export function analyzeName(
  surname: string,
  givenName: string,
  gender: 'male' | 'female'
): NametestResult {
  const surnameChars = surname.split('');
  const givenChars = givenName.split('');

  const unresolved: string[] = [];
  const strokeOf = (char: string): number => {
    const s = KANGXI_STROKES[char];
    if (typeof s === 'number') return s;
    unresolved.push(char);
    return 0;
  };

  const surnameStrokesArr = surnameChars.map(strokeOf);
  const givenStrokesArr = givenChars.map(strokeOf);
  const surnameStrokes = surnameStrokesArr.reduce((a, b) => a + b, 0);
  const givenNameStrokes = givenStrokesArr.reduce((a, b) => a + b, 0);
  const totalStrokes = surnameStrokes + givenNameStrokes;

  const isCompoundSurname = surnameChars.length >= 2;
  const isCompoundGiven = givenChars.length >= 2;

  // 天格：单姓 = 姓 + 1；复姓 = 姓两字笔画和
  const tianRaw = isCompoundSurname ? surnameStrokes : surnameStrokes + 1;
  // 人格：姓末字 + 名首字
  const renRaw = surnameStrokesArr[surnameStrokesArr.length - 1] + (givenStrokesArr[0] ?? 0);
  // 地格：单名 = 名 + 1；双名及以上 = 名笔画和
  const diRaw = isCompoundGiven ? givenNameStrokes : givenNameStrokes + 1;
  // 外格
  const waiRaw = (() => {
    if (!isCompoundSurname && !isCompoundGiven) return 2;
    if (!isCompoundSurname && isCompoundGiven) return (givenStrokesArr[givenStrokesArr.length - 1] ?? 0) + 1;
    if (isCompoundSurname && !isCompoundGiven) return (surnameStrokesArr[0] ?? 0) + 1;
    return (surnameStrokesArr[0] ?? 0) + (givenStrokesArr[givenStrokesArr.length - 1] ?? 0);
  })();
  // 总格
  const zongRaw = totalStrokes;

  const tianGe = normalizeNumber(tianRaw);
  const renGe = normalizeNumber(renRaw);
  const diGe = normalizeNumber(diRaw);
  const waiGe = normalizeNumber(waiRaw);
  const zongGe = normalizeNumber(zongRaw);

  const detail = (n: number): WugeDetail => ({
    number: n,
    element: elementOfNumber(n),
    lucky: LUCKY_NUMBERS.has(n),
  });

  const sanCai = `${elementOfNumber(tianGe)}${elementOfNumber(renGe)}${elementOfNumber(diGe)}`;
  const sanCaiInfo = sanCaiText(
    elementOfNumber(tianGe),
    elementOfNumber(renGe),
    elementOfNumber(diGe)
  );

  // 评分：人格/总格权重最高
  let score = 60;
  if (LUCKY_NUMBERS.has(renGe)) score += 15;
  if (LUCKY_NUMBERS.has(zongGe)) score += 12;
  if (LUCKY_NUMBERS.has(diGe)) score += 7;
  if (LUCKY_NUMBERS.has(tianGe)) score += 4;
  if (LUCKY_NUMBERS.has(waiGe)) score += 2;
  if (sanCaiInfo.lucky) score += 5;
  if (unresolved.length > 0) score = Math.min(score, 75);
  score = Math.max(40, Math.min(99, score));

  const fullName = `${surname}${givenName}`;
  const genderText = gender === 'male' ? '男' : '女';
  const unresolvedNote = unresolved.length > 0
    ? `（注：${unresolved.join('、')}未收录康熙笔画，五格为近似值）`
    : '';

  const summary =
    `「${fullName}」（${genderText}）五格测算${unresolvedNote}：`
    + `天格${tianGe}（${detail(tianGe).element}）、人格${renGe}（${detail(renGe).element}）、`
    + `地格${diGe}（${detail(diGe).element}）、外格${waiGe}、总格${zongGe}。`
    + `三才${sanCaiInfo.text}。综合评分${score}分。`;

  return {
    summary,
    details: {
      fullName,
      surnameStrokes,
      givenNameStrokes,
      totalStrokes,
      wuGe: {
        tianGe: { number: tianGe, meaning: `${detail(tianGe).element}·${detail(tianGe).lucky ? '吉' : '凶'}` },
        renGe: { number: renGe, meaning: `${detail(renGe).element}·${detail(renGe).lucky ? '吉' : '凶'}` },
        diGe: { number: diGe, meaning: `${detail(diGe).element}·${detail(diGe).lucky ? '吉' : '凶'}` },
        waiGe: { number: waiGe, meaning: `${detail(waiGe).element}·${detail(waiGe).lucky ? '吉' : '凶'}` },
        zongGe: { number: zongGe, meaning: `${detail(zongGe).element}·${detail(zongGe).lucky ? '吉' : '凶'}` },
      },
      sanCai,
      sanCaiMeaning: sanCaiInfo.text,
      score,
      unresolvedChars: unresolved,
      lucky: {
        numbers: [tianGe, renGe, diGe, waiGe, zongGe].filter((n) => LUCKY_NUMBERS.has(n)),
        elements: [elementOfNumber(tianGe), elementOfNumber(renGe), elementOfNumber(diGe)],
      },
    },
  };
}
