/**
 * 风水罗盘分析服务
 * 根据建筑方位和类型分析风水布局
 * 当前为模拟数据实现，后续可接入完整算法
 */

import type { FengshuiResult } from '../types';

/** 方位中英映射 */
const DIRECTION_NAMES: Record<string, string> = {
  'N': '正北', 'NE': '东北', 'E': '正东', 'SE': '东南',
  'S': '正南', 'SW': '西南', 'W': '正西', 'NW': '西北',
};

/** 建筑类型中文名 */
const BUILDING_TYPE_NAMES: Record<string, string> = {
  'residential': '住宅',
  'commercial': '商业',
  'office': '办公',
};

/** 方位对应五行 */
const DIRECTION_WU_XING: Record<string, string> = {
  'N': '水', 'NE': '土', 'E': '木', 'SE': '木',
  'S': '火', 'SW': '土', 'W': '金', 'NW': '金',
};

/** 风水布局建议库 */
const FENGSHUI_ADVICE: Record<string, string[]> = {
  'residential': [
    '客厅宜宽敞明亮，保持通风良好',
    '卧室不宜正对大门，床头避免朝西',
    '厨房与卫生间不宜相邻',
    '阳台可摆放绿植增加生气',
  ],
  'commercial': [
    '收银台应位于财位，避免背门',
    '入口处应宽敞明亮，利于纳气',
    '货架摆放整齐有序，避免杂乱',
    '室内灯光充足柔和，营造舒适氛围',
  ],
  'office': [
    '办公桌宜坐实朝虚，背后有靠山',
    '会议室应选在公司吉位',
    '入口不宜正对走廊尽头',
    '财位宜放置发财树等绿植',
  ],
};

/**
 * 分析风水布局
 * @param direction 方位（N/NE/E/SE/S/SW/W/NW）
 * @param buildingType 建筑类型
 */
export function analyzeFengshui(
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW',
  buildingType: 'residential' | 'commercial' | 'office'
): FengshuiResult {
  const directionName = DIRECTION_NAMES[direction];
  const buildingName = BUILDING_TYPE_NAMES[buildingType];
  const wuXing = DIRECTION_WU_XING[direction];

  // 根据方位和建筑类型确定吉凶方位
  const allDirections = ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北'];
  const currentIdx = allDirections.indexOf(directionName);

  // 吉利方位：本方位 + 相生方位
  const favorableStart = (currentIdx + 2) % 8;
  const favorableAreas = [
    allDirections[currentIdx],
    allDirections[favorableStart],
    allDirections[(favorableStart + 3) % 8],
  ];

  // 不利方位
  const unfavorableAreas = allDirections.filter(d => !favorableAreas.includes(d));

  // 获取布局建议
  const layoutAdvice = FENGSHUI_ADVICE[buildingType] || FENGSHUI_ADVICE['residential'];

  const summary = `${buildingName}坐${directionName}向，五行属${wuXing}。`
    + `吉利方位：${favorableAreas.join('、')}。`
    + `建议：${layoutAdvice[0]}。`
    + `整体风水格局${favorableAreas.length >= 3 ? '良好' : '一般'}，适宜居住办公。`;

  return {
    summary,
    details: {
      direction: directionName,
      buildingType: buildingName,
      wuXing,
      favorableAreas,
      unfavorableAreas,
      layoutAdvice,
    },
  };
}
