/**
 * 姓名测试服务（五格剖象法）
 * 根据姓名笔画分析五格、三才配置
 * 当前为模拟数据实现，后续可接入完整康熙笔画字典
 */

import type { NametestResult } from '../types';

/** 五格含义对照 */
const WUGE_MEANINGS: Record<number, string> = {
  1: '大吉，万物开泰，最大吉数。',
  2: '不吉，动摇不安，一荣一枯。',
  3: '大吉，如意吉祥，阴阳和合。',
  4: '凶，万事休止，吉凶参半。',
  5: '大吉，福禄长寿，阴阳和合。',
  6: '大吉，安稳余庆，吉人天相。',
  7: '吉，精力旺盛，刚毅果断。',
  8: '吉，坚刚志强，突破万难。',
  9: '凶，虽抱奇才，有才无运。',
  10: '凶，万事终局，零暗不止。',
  11: '大吉，旱苗逢雨，挽回吉运。',
  12: '凶，薄弱无力，外观平静。',
  13: '大吉，智慧出众，奇才横溢。',
  14: '凶，浮沉不定，因祸得福。',
  15: '大吉，福寿圆满，富贵荣誉。',
  16: '大吉，贵人相助，厚望成就。',
  17: '半吉，突破万难，有贵人助。',
  18: '大吉，有志竟成，内外有运。',
  19: '凶，多难困苦，有智有谋。',
  20: '凶，非业破运，灾难不绝。',
  21: '大吉，明月光照，独立权威。',
  22: '凶，秋草逢霜，百事不如。',
  23: '大吉，旭日东升，壮丽壮观。',
  24: '大吉，金钱丰盈，白手起家。',
  25: '大吉，英俊刚毅，资性聪敏。',
};

/** 三才配置含义 */
const SANCAI_MEANINGS: Record<string, string> = {
  '木木木': '三才皆木，生机旺盛，富有创造力，但需注意过刚易折。',
  '木木火': '木生火旺，才华横溢，热情洋溢，贵人运强。',
  '木木土': '木克土重，需防身体劳损，宜修心养性。',
  '火火火': '三才皆火，热情如火，运势旺盛，但需防急躁。',
  '火土金': '火生土、土生金，五行相生，运势顺遂。',
  '土土土': '三才皆土，稳重踏实，根基深厚，但变化较少。',
  '金金金': '三才皆金，刚毅果断，执行力强，但需防过于固执。',
  '水水水': '三才皆水，智慧灵秀，适应力强，但需防优柔寡断。',
};

/** 简化版汉字笔画映射（实际应使用康熙字典笔画） */
function getStrokeCount(char: string): number {
  // 简化：用字符编码模拟笔画，实际应使用康熙字典
  const commonStrokes: Record<string, number> = {
    '王': 4, '李': 7, '张': 7, '刘': 6, '陈': 7, '杨': 7, '赵': 7, '黄': 11,
    '周': 8, '吴': 7, '徐': 10, '孙': 6, '胡': 9, '朱': 6, '高': 10, '林': 8,
    '何': 7, '郭': 8, '马': 3, '罗': 8, '梁': 11, '宋': 7, '郑': 8, '谢': 12,
    '韩': 9, '唐': 10, '冯': 5, '于': 3, '董': 12, '萧': 11, '程': 12, '曹': 11,
    '袁': 6, '邓': 4, '许': 6, '傅': 12, '沈': 7, '曾': 12, '彭': 12, '吕': 6,
    '苏': 7, '卢': 5, '蒋': 12, '蔡': 14, '贾': 10, '丁': 2, '魏': 17, '薛': 16,
    '明': 8, '华': 6, '金': 8, '文': 4, '志': 7, '国': 8, '建': 9, '伟': 11,
    '海': 10, '平': 5, '东': 5, '德': 15, '强': 12, '军': 6, '成': 6, '安': 6,
    '辉': 12, '庆': 6, '刚': 6, '龙': 5, '飞': 3, '鹏': 13, '博': 12, '宇': 6,
    '浩': 11, '天': 4, '云': 4, '杰': 8, '涛': 10, '勇': 9, '敏': 11, '静': 14,
    '丽': 7, '芳': 7, '秀': 7, '美': 9, '婷': 12, '雪': 11, '慧': 15, '雅': 12,
    '红': 6, '玉': 5, '玲': 9, '桂': 10, '春': 9, '兰': 5, '凤': 4, '娇': 9,
  };
  return commonStrokes[char] || (char.charCodeAt(0) % 20 + 3);
}

/** 五格数理：将数字缩减到1-25之间 */
function wugeNumber(num: number): number {
  while (num > 25) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
  }
  return num;
}

/**
 * 姓名测试分析
 * @param surname 姓
 * @param givenName 名
 * @param gender 性别
 */
export function analyzeName(
  surname: string,
  givenName: string,
  gender: 'male' | 'female'
): NametestResult {
  // 计算笔画数
  const surnameStrokes = surname.split('').reduce((sum, c) => sum + getStrokeCount(c), 0);
  const givenNameStrokes = givenName.split('').reduce((sum, c) => sum + getStrokeCount(c), 0);
  const totalStrokes = surnameStrokes + givenNameStrokes;

  // 五格计算
  // 天格 = 姓笔画 + 1（单姓）或 姓两字笔画之和（复姓）
  const tianGe = wugeNumber(surnameStrokes + 1);
  // 人格 = 姓最后一字 + 名第一字
  const renGe = wugeNumber(surnameStrokes + (givenName.length > 0 ? getStrokeCount(givenName[0]) : 0));
  // 地格 = 名字笔画之和 + 1
  const diGe = wugeNumber(givenNameStrokes + 1);
  // 外格 = 总格 - 人格 + 1
  const waiGe = wugeNumber(totalStrokes - renGe + 1);
  // 总格 = 姓+名总笔画
  const zongGe = wugeNumber(totalStrokes);

  // 三才配置（根据天格、人格、地格的五行）
  const wuXingMap = (n: number): string => {
    if (n % 5 === 1 || n % 5 === 2) return '木';
    if (n % 5 === 3 || n % 5 === 4) return '火';
    if (n % 5 === 0 || n % 5 === 5) return '土';
    return '金';
  };
  const sanCai = `${wuXingMap(tianGe)}${wuXingMap(renGe)}${wuXingMap(diGe)}`;

  // 评分（基于五格吉凶综合计算）
  let score = 70;
  if ([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25].includes(tianGe)) score += 5;
  if ([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25].includes(renGe)) score += 10;
  if ([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25].includes(diGe)) score += 5;
  if ([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25].includes(zongGe)) score += 10;
  score = Math.min(99, score);

  const fullName = `${surname}${givenName}`;
  const sanCaiMeaning = SANCAI_MEANINGS[sanCai] || `${sanCai}配置，五行${sanCai.includes('木') || sanCai.includes('水') ? '相生为吉' : '基本平衡'}。`;

  const summary = `"${fullName}"姓名测试结果：`
    + `姓名笔画${totalStrokes}画，五格评分${score}分。`
    + `天格${tianGe}（${WUGE_MEANINGS[tianGe]?.slice(0, 10) || '中平'}），`
    + `人格${renGe}（${WUGE_MEANINGS[renGe]?.slice(0, 10) || '中平'}）。`
    + `三才配置${sanCai}，${sanCaiMeaning}`;

  return {
    summary,
    details: {
      fullName,
      surnameStrokes,
      givenNameStrokes,
      totalStrokes,
      wuGe: {
        tianGe: { number: tianGe, meaning: WUGE_MEANINGS[tianGe] || '中平运势' },
        renGe: { number: renGe, meaning: WUGE_MEANINGS[renGe] || '中平运势' },
        diGe: { number: diGe, meaning: WUGE_MEANINGS[diGe] || '中平运势' },
        waiGe: { number: waiGe, meaning: WUGE_MEANINGS[waiGe] || '中平运势' },
        zongGe: { number: zongGe, meaning: WUGE_MEANINGS[zongGe] || '中平运势' },
      },
      sanCai,
      sanCaiMeaning,
      score,
    },
  };
}
