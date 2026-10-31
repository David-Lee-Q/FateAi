import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import LiuyaoLayout from '../src/pages/result/layouts/LiuyaoLayout';

/** 与后端 castLiuyao 真实返回结构一致（雷天大壮之雷风恒） */
const backendData = {
  question: '今年财运如何',
  originalGua: {
    name: '雷天大壮',
    symbol: '☳☰',
    upperGua: '震',
    lowerGua: '乾',
    lowerTrigram: '☰',
    upperTrigram: '☳',
    palace: '坤宫',
    palaceElement: '土',
  },
  changedGua: { name: '雷风恒', symbol: '☳☴', upperGua: '震', lowerGua: '巽', palace: '震宫' },
  sixLines: [
    { position: 1, ganZhi: '甲子', yinYang: '阳', isMoving: true, liuQin: '妻财', liuShen: '勾陈', element: '水', shiYing: '应', isKong: false, monthRelation: '克', dayRelation: '被生', changedGanZhi: '辛丑', changedLiuQin: '兄弟', changedRelation: '克' },
    { position: 2, ganZhi: '甲寅', yinYang: '阳', isMoving: false, liuQin: '官鬼', liuShen: '腾蛇', element: '木', shiYing: '', isKong: false, monthRelation: '被克', dayRelation: '同' },
    { position: 3, ganZhi: '甲辰', yinYang: '阳', isMoving: false, liuQin: '兄弟', liuShen: '白虎', element: '土', shiYing: '', isKong: false, monthRelation: '同', dayRelation: '克' },
    { position: 4, ganZhi: '庚午', yinYang: '阳', isMoving: false, liuQin: '父母', liuShen: '玄武', element: '火', shiYing: '世', isKong: false, monthRelation: '被生', dayRelation: '生' },
    { position: 5, ganZhi: '庚申', yinYang: '阴', isMoving: false, liuQin: '子孙', liuShen: '青龙', element: '金', shiYing: '', isKong: true, monthRelation: '生', dayRelation: '被克' },
    { position: 6, ganZhi: '庚戌', yinYang: '阴', isMoving: false, liuQin: '兄弟', liuShen: '朱雀', element: '土', shiYing: '', isKong: false, monthRelation: '同', dayRelation: '克' },
  ],
  worldResponse: { world: 4, response: 1 },
  naJia: ['甲子', '甲寅', '甲辰', '庚午', '庚申', '庚戌'],
  castInfo: {
    time: '2026年10月31日 08时',
    yearPillar: '丙午',
    monthPillar: '戊戌',
    dayPillar: '戊寅',
    monthBuild: '戌（土）',
    dayChen: '寅（木）',
    xunKong: '申酉',
    tosses: [9, 7, 7, 7, 7, 8],
  },
  yongShen: '妻财（求财）',
  movingCount: 1,
  shiYing: { shi: '4爻 父母庚午', ying: '1爻 妻财甲子' },
  liuQin: { '1爻': '勾陈 妻财(甲子)' },
};

describe('六爻布局渲染（真实纳甲排盘）', () => {
  afterEach(cleanup);

  it('展示卦名、卦宫、变卦、用神', () => {
    render(<LiuyaoLayout data={backendData} system="liuyao" />);

    expect(screen.getByText(/雷天大壮 · 坤宫土/)).toBeInTheDocument();
    expect(screen.getByText(/震上 乾下 · 变卦 雷风恒/)).toBeInTheDocument();
    expect(screen.getByText('用神：妻财（求财）')).toBeInTheDocument();
    expect(screen.getByText(/问：今年财运如何/)).toBeInTheDocument();
  });

  it('展示起卦四柱、月建日辰与旬空', () => {
    render(<LiuyaoLayout data={backendData} system="liuyao" />);

    expect(screen.getByText(/起卦：2026年10月31日 08时/)).toBeInTheDocument();
    expect(screen.getByText(/四柱：丙午 戊戌 戊寅/)).toBeInTheDocument();
    expect(screen.getByText(/月建：戌（土）/)).toBeInTheDocument();
    expect(screen.getByText(/日辰：寅（木）/)).toBeInTheDocument();
    expect(screen.getByText(/旬空：申酉/)).toBeInTheDocument();
  });

  it('六爻排盘表含六神/六亲/纳甲/世应/动变', () => {
    render(<LiuyaoLayout data={backendData} system="liuyao" />);

    for (const shen of ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']) {
      expect(screen.getByText(shen)).toBeInTheDocument();
    }
    for (const qin of ['父母', '兄弟', '子孙', '妻财', '官鬼']) {
      expect(screen.getAllByText(qin).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getByText('甲子')).toBeInTheDocument();
    expect(screen.getByText('庚戌')).toBeInTheDocument();
    expect(screen.getByText('世')).toBeInTheDocument();
    expect(screen.getByText('应')).toBeInTheDocument();
    expect(screen.getByText('动')).toBeInTheDocument();
  });

  it('动变化爻与世应摘要正确', () => {
    render(<LiuyaoLayout data={backendData} system="liuyao" />);

    expect(screen.getByText(/妻财甲子 动化 兄弟辛丑/)).toBeInTheDocument();
    expect(screen.getByText('4爻 父母庚午')).toBeInTheDocument();
    expect(screen.getByText('1爻 妻财甲子')).toBeInTheDocument();
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });

  it('静卦显示无动爻提示', () => {
    render(
      <LiuyaoLayout
        data={{
          ...backendData,
          movingCount: 0,
          sixLines: backendData.sixLines.map((l) => ({ ...l, isMoving: false })),
          changedGua: { name: '雷天大壮' },
        }}
        system="liuyao"
      />,
    );
    expect(screen.getByText(/六爻安静/)).toBeInTheDocument();
    expect(screen.getByText(/· 静卦/)).toBeInTheDocument();
  });
});
