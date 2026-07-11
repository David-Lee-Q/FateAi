/**
 * 求签服务（观音灵签）
 * 随机抽取签号，返回签诗与解签
 * 当前为模拟数据实现
 */

import type { DrawlotResult } from '../types';

/** 签等级 */
const LOT_LEVELS = [
  { name: '上上签', desc: '大吉大利，诸事顺遂' },
  { name: '上签', desc: '吉利，运势渐入佳境' },
  { name: '中上签', desc: '偏吉，需积极把握' },
  { name: '中签', desc: '平稳，守成为宜' },
  { name: '中下签', desc: '偏凶，需谨慎行事' },
  { name: '下签', desc: '不利，宜静待时机' },
  { name: '下下签', desc: '大凶，凡事忍耐为上' },
];

/** 灵签签库（模拟 100 支签） */
const LOT_POOL: Array<{
  number: number;
  level: string;
  poem: string;
  interpretation: string;
  advice: string;
}> = [
  // 上上签
  { number: 1, level: '上上签', poem: '开天辟地作良缘，吉日良时万事全。匹马单枪独往来，一摸乾坤一少年。', interpretation: '此签为上上签，天地开泰，万事顺遂。凡事宜积极进取，大胆行动，必获成功。', advice: '适合开拓新事业、求婚、远行。把握当前大好时机。' },
  { number: 2, level: '上上签', poem: '天赐黄金与万金，不劳心力自然成。纵然不是龙王宝，也作人间富贵人。', interpretation: '此签为上上签，天赐良机，富贵自来。无需刻意追求，好运自然降临。', advice: '财运亨通，事业有成。贵人相助，诸事如意。' },
  { number: 3, level: '上签', poem: '千里行舟去不还，江边一望白云天。春风有意催人别，回首孤帆已远悬。', interpretation: '此签为上签，虽有离别之象，但前路光明。放下过去，拥抱未来。', advice: '出行顺利，感情虽有波折但终将圆满。静心等待好时机。' },
  { number: 4, level: '上签', poem: '月中丹桂逢春发，天上仙人赐宝来。运到自然花自发，何须苦问去与回。', interpretation: '此签为上签，如月中丹桂，时机将到。努力付出终有回报，不需焦虑。', advice: '学业有成，事业进步。保持耐心，好运将至。' },
  { number: 5, level: '上签', poem: '日出光辉照四方，前途坦荡任君行。贵人指引通明路，功名利禄自然成。', interpretation: '此签为上签，日出东方，光明在前。有贵人相助，前途一片光明。', advice: '适宜求职、创业、合作。贵人运强，大胆前行。' },
  // 中签
  { number: 50, level: '中签', poem: '枯木逢春花再开，旧时明月又重来。万事且宜守旧待，花开自有蜜蜂来。', interpretation: '此签为中签，枯木逢春之象。当前运势平稳，不宜急进，守成为佳。', advice: '保持现状，静待转机。不宜冒进，稳中求进。' },
  { number: 55, level: '中签', poem: '风平浪静好行船，不费功夫不费钱。若问前程归甚处，顺水推舟到岸边。', interpretation: '此签为中签，风平浪静，平稳前行。无需费力太多，顺其自然即可。', advice: '日常生活平静安宁，顺应自然，不要强求。' },
  { number: 60, level: '中签', poem: '云开月出正分明，不必忧疑不必惊。只要心存行善念，天堂地狱一念生。', interpretation: '此签为中签，云开月明之象。保持善念，自然逢凶化吉。', advice: '保持积极心态，行善积德。遇事不惊不惧。' },
  // 中下签
  { number: 70, level: '中下签', poem: '雨中灯影渐迷离，路远山高不辨时。待到云开风住后，自然光明照前途。', interpretation: '此签为中下签，风雨迷离，前路不明。当前困难是暂时的，雨过天晴即见光明。', advice: '暂缓重大决策，保守行事。困难终将过去。' },
  { number: 75, level: '中下签', poem: '暗室求灯灯不明，欲渡江河无舟行。但逢春风化雨后，自然云散见天明。', interpretation: '此签为中下签，暂处困境，看不到方向。但春天终会到来，坚持就是胜利。', advice: '忍耐等待，不宜轻举妄动。求助于贵人可渡过难关。' },
  // 下签
  { number: 90, level: '下签', poem: '花开花落自有时，月缺月圆亦有期。莫怨春风不我待，且看来年再争枝。', interpretation: '此签为下签，时运不济，万事不顺。需耐心等待下一轮好时机。', advice: '凡事忍耐为上，不宜强求。修身养性，蓄势待发。' },
  { number: 95, level: '下签', poem: '乌云蔽日暗无光，进退两难费思量。莫将真心轻托付，守口如瓶保平安。', interpretation: '此签为下签，运势低迷，需格外谨慎。谨言慎行，避免与人争执。', advice: '保守行事，避免投资和重大决定。注意身体健康。' },
  { number: 100, level: '下下签', poem: '船到江心补漏迟，进退维谷费心机。若能回头趁早转，犹可免受风波苦。', interpretation: '此签为下下签，危船之象。当前处境凶险，需尽早调整方向，回头是岸。', advice: '停止一切冒险行为，退一步海阔天空。凡事以安全为先。' },
];

/**
 * 求签（观音灵签）
 */
export function drawLot(): DrawlotResult {
  // 随机抽取一支签
  const lot = LOT_POOL[Math.floor(Math.random() * LOT_POOL.length)];

  const summary = `签号第${lot.number}签：${lot.level}。${lot.poem}。`
    + `${lot.interpretation}`;

  return {
    summary,
    details: {
      lotNumber: lot.number,
      level: lot.level,
      poem: lot.poem,
      interpretation: lot.interpretation,
      advice: lot.advice,
    },
  };
}
