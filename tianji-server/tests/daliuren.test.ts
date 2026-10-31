import { describe, it, expect } from 'vitest';
import { Solar } from 'lunar-typescript';
import { calculateDaliuren } from '../src/services/daliuren.service';

const cast = (h: number) => calculateDaliuren(2026, 10, 31, h, 'male', new Date(2026, 9, 31, h));

describe('大六壬真实起课（月将加时）', () => {
  it('月将按中气确定：霜降后用卯将（太冲）', () => {
    const t = cast(12).time;
    expect(t.zhongqi).toBe('霜降');
    expect(t.yuejiang).toBe('卯');
    expect(t.yuejiangName).toBe('太冲');
  });

  it('天地盘：月将加占时（卯将加午时，位移 9 位）', () => {
    const d = cast(12);
    // 地盘午 → 天盘卯（月将加时）
    expect(d.tianpan['午']).toBe('卯');
    // 地盘支 + 9
    expect(d.tianpan['巳']).toBe('寅');
    expect(d.tianpan['寅']).toBe('亥');
    expect(d.tianpan['亥']).toBe('申');
  });

  it('四课由日干寄宫与日支上神推出', () => {
    const d = cast(12);
    // 戊日寄巳，日支寅
    expect(d.ke.ke1).toBe('寅'); // 巳上神
    expect(d.ke.ke2).toBe('亥'); // 寅上神
    expect(d.ke.ke3).toBe('亥'); // 日支寅上神
    expect(d.ke.ke4).toBe('申'); // 亥上神
  });

  it('无克取遥克：木克戊土，三传寅→亥→申', () => {
    const d = cast(12);
    expect(d.chuan.zongmen).toBe('遥克课');
    expect(d.chuan.chuan1).toBe('戊寅');
    expect(d.chuan.chuan2).toBe('乙亥');
    expect(d.chuan.chuan3).toBe('甲申');
    // 三传串联：初传之上神为中传
    expect(d.tianpan['寅']).toBe('亥');
    expect(d.tianpan['亥']).toBe('申');
  });

  it('旬空与遁干正确（戊寅日旬空申酉）', () => {
    const d = cast(12);
    const detail = d.chuan.detail!;
    expect(detail[2].zhi).toBe('申');
    expect(detail[2].kong).toBe(true);
    expect(detail[0].gan).toBe('戊');
    expect(detail[1].gan).toBe('乙');
  });

  it('十二天将齐全且按贵人顺逆布齐', () => {
    const d = cast(12);
    const list = Object.values(d.tianpan).map((z) => z);
    expect(new Set(list).size).toBe(12);
    // 昼占（午时），戊日昼贵丑
    expect(d.shen.guiZhi).toBe('丑');
    expect(d.shen.direction).toBe('顺行');
    expect(d.shen.shen1).toBe('腾蛇');
  });

  it('月将与占时同 → 伏吟课，天地盘相同', () => {
    const d = cast(6); // 卯时，卯将
    expect(d.chuan.zongmen).toBe('伏吟课');
    for (const z of Object.keys(d.dipan)) {
      expect(d.tianpan[z]).toBe(d.dipan[z]);
    }
  });

  it('月将与占时相冲 → 返吟课', () => {
    const d = cast(18); // 酉时，卯将
    expect(d.chuan.zongmen).toBe('返吟课');
  });

  it('日柱与 lunar-typescript 一致，且结果确定（无随机）', () => {
    const lunar = Solar.fromYmd(2026, 10, 31).getLunar();
    const a = cast(12);
    const b = cast(12);
    expect(a.interpretation).toContain(`${lunar.getDayInGanZhi()}日`);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(a)).not.toContain('[object Object]');
  });

  it('六亲以日干五行为我（戊土）', () => {
    const d = cast(12);
    const map = Object.fromEntries(d.liuqin.map((s) => s.split('：')));
    expect(map['寅']).toBe('官鬼'); // 木克土
    expect(map['亥']).toBe('妻财'); // 土克水
    expect(map['申']).toBe('子孙'); // 土生金
  });
});
