/**
 * 紫微斗数排盘服务
 * 基于 iztro（MIT）真实安星：十四主星、辅星、四化、十二宫、大限、五行局
 * 参考：https://github.com/SylarLong/iztro
 */

import { astro } from 'iztro';
import type { ZiweiResult } from '../types';

/** 时辰（24 小时制）→ iztro 时辰序号（0 早子时 … 12 晚子时） */
function hourToTimeIndex(hour: number): number {
  if (hour === 23) return 12;
  return Math.floor((hour + 1) / 2) % 12;
}

/** 宫名统一补「宫」：命宫保持，其余兄弟→兄弟宫 */
function normalizePalaceName(name: string): string {
  return name.endsWith('宫') ? name : `${name}宫`;
}

/** 星曜展示：名称 + 亮度 */
function formatStars(stars: Array<{ name: string; brightness?: string; mutagen?: string }>): string {
  if (stars.length === 0) return '空宫';
  return stars
    .map((s) => {
      const brightness = s.brightness ? `(${s.brightness})` : '';
      const mutagen = s.mutagen ? `化${s.mutagen}` : '';
      return `${s.name}${brightness}${mutagen}`;
    })
    .join(' ');
}

/**
 * 计算紫微斗数命盘
 * @param year 出生年（公历）
 * @param month 出生月（1-12）
 * @param day 出生日
 * @param hour 出生时（24 小时制）
 * @param gender 性别
 */
export function calculateZiwei(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female'
): ZiweiResult {
  const timeIndex = hourToTimeIndex(hour);
  const genderStr = gender === 'male' ? '男' : '女';
  const astrolabe = astro.bySolar(
    `${year}-${month}-${day}`,
    timeIndex,
    genderStr,
    true,
    'zh-CN'
  );

  // 十二宫：保持前端既有字段（palace/mainStar/stars），补充干支、四化、大限
  const twelvePalaces = astrolabe.palaces.map((p) => {
    const majors = p.majorStars.map((s) => ({
      name: s.name,
      brightness: s.brightness,
      mutagen: s.mutagen,
    }));
    const minors = p.minorStars.map((s) => ({
      name: s.name,
      brightness: s.brightness,
      mutagen: s.mutagen,
    }));
    const adjectives = p.adjectiveStars.map((s) => s.name);
    return {
      palace: normalizePalaceName(p.name),
      mainStar: formatStars(majors),
      stars: minors.length > 0 ? formatStars(minors) : adjectives.slice(0, 4).join(' '),
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: majors,
      minorStars: minors,
      adjectiveStars: adjectives,
      isBodyPalace: p.isBodyPalace,
      isOriginalPalace: p.isOriginalPalace,
      decadal: p.decadal
        ? {
            range: p.decadal.range,
            heavenlyStem: p.decadal.heavenlyStem,
            earthlyBranch: p.decadal.earthlyBranch,
          }
        : undefined,
      ages: p.ages,
    };
  });

  // 命宫（含身宫标记）
  const mingPalace = astrolabe.palaces.find((p) => p.name === '命宫');
  const mingGong = {
    palace: '命宫',
    star: mingPalace
      ? formatStars(
          mingPalace.majorStars.map((s) => ({
            name: s.name,
            brightness: s.brightness,
            mutagen: s.mutagen,
          }))
        )
      : '空宫',
    mainStar: mingPalace
      ? formatStars(
          mingPalace.majorStars.map((s) => ({
            name: s.name,
            brightness: s.brightness,
            mutagen: s.mutagen,
          }))
        )
      : '空宫',
    earthlyBranch: mingPalace?.earthlyBranch,
    heavenlyStem: mingPalace?.heavenlyStem,
  };

  // 生年四化：从各宫星曜的 mutagen 反查
  const siHua: Record<string, string> = {};
  for (const p of astrolabe.palaces) {
    for (const s of [...p.majorStars, ...p.minorStars]) {
      if (!s.mutagen) continue;
      const key = `化${s.mutagen}`;
      if (!siHua[key]) siHua[key] = s.name;
    }
  }

  // 大限 / 流年（按当前日期）
  const horoscope = astrolabe.horoscope(new Date());
  const decadal = horoscope.decadal;
  const yearly = horoscope.yearly;
  // 大限岁数区间来自该大限所在宫位的 decadal
  const decadalPalace = astrolabe.palaces[decadal.index];
  const decadalRange: [number, number] = decadalPalace?.decadal?.range ?? [0, 0];

  const palaceLine = twelvePalaces
    .map((p) => `${p.palace}(${p.heavenlyStem}${p.earthlyBranch})：${p.mainStar}`)
    .join('；');

  const summary =
    `${genderStr}命，公历${year}年${month}月${day}日（农历${astrolabe.lunarDate}），${astrolabe.chineseDate}。`
    + `五行局为${astrolabe.fiveElementsClass}，命主${astrolabe.soul}，身主${astrolabe.body}。`
    + `命宫主星${mingGong.mainStar}。`
    + `生年四化：${siHua['化禄'] || '—'}化禄、${siHua['化权'] || '—'}化权、`
    + `${siHua['化科'] || '—'}化科、${siHua['化忌'] || '—'}化忌。`
    + `当前大限${decadal.heavenlyStem}${decadal.earthlyBranch}（${decadalRange[0]}-${decadalRange[1]}岁），`
    + `流年${yearly.heavenlyStem}${yearly.earthlyBranch}。`;

  return {
    summary,
    details: {
      birthInfo:
        `${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}时（${genderStr}命）`
        + `｜农历${astrolabe.lunarDate}｜四柱${astrolabe.chineseDate}`,
      mingGong,
      twelvePalaces,
      siHua,
      wuXingJu: astrolabe.fiveElementsClass,
      soul: astrolabe.soul,
      body: astrolabe.body,
      sign: astrolabe.sign,
      zodiac: astrolabe.zodiac,
      palaceLine,
      horoscope: {
        decadal: {
          heavenlyStem: decadal.heavenlyStem,
          earthlyBranch: decadal.earthlyBranch,
          range: decadalRange,
        },
        yearly: {
          heavenlyStem: yearly.heavenlyStem,
          earthlyBranch: yearly.earthlyBranch,
          mutagen: yearly.mutagen,
        },
      },
    },
  };
}
