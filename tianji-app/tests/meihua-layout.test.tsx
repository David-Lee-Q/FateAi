import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import MeihuaLayout from '../src/pages/result/layouts/MeihuaLayout';

/** 与后端 castMeihua('number', 3, 1) 真实返回一致 */
const backendData = {
  method: '数字起卦法',
  methodDetail: '数字起卦：取数 3、1，上卦 3%8、下卦 1%8、动爻 (3+1)%6',
  upperGua: { name: '离', symbol: '☲', number: 3 },
  lowerGua: { name: '乾', symbol: '☰', number: 1 },
  mainGua: { name: '火天大有', symbol: '☲☰', bits: '111101', meaning: '大有所获，盛大丰盈', palace: '乾宫' },
  huGua: { name: '泽天夬', symbol: '☱☰', bits: '111110', meaning: '决断去疑，刚决柔退' },
  bianGua: { name: '山天大畜', symbol: '☶☰', bits: '111001', meaning: '大有蓄养，宜厚积薄发' },
  dongYao: 4,
  dongYaoDesc: '第4爻（上卦）动',
  tiYong: { ti: '乾（金）', yong: '离（火）', relation: '用克体', lucky: '凶', text: '用克体，人胜己，事多阻滞' },
  interpretation: '关于「这次合作能成吗」：本卦【火天大有】……',
};

describe('梅花易数布局渲染（真实起卦数据）', () => {
  afterEach(cleanup);

  it('展示本卦/互卦/变卦与卦义', () => {
    render(<MeihuaLayout data={backendData} system="meihua" />);

    expect(screen.getByText('本卦：火天大有')).toBeInTheDocument();
    expect(screen.getByText('互卦：泽天夬')).toBeInTheDocument();
    expect(screen.getByText('变卦：山天大畜')).toBeInTheDocument();
    expect(screen.getByText('大有所获，盛大丰盈')).toBeInTheDocument();
    expect(screen.getByText('决断去疑，刚决柔退')).toBeInTheDocument();
    expect(screen.getByText('大有蓄养，宜厚积薄发')).toBeInTheDocument();
  });

  it('展示动爻、体用关系与断语', () => {
    render(<MeihuaLayout data={backendData} system="meihua" />);

    expect(screen.getByText('第4爻（上卦）动')).toBeInTheDocument();
    expect(screen.getByText(/用克体 · 凶/)).toBeInTheDocument();
    expect(screen.getByText('乾（金）')).toBeInTheDocument();
    expect(screen.getByText('离（火）')).toBeInTheDocument();
    expect(screen.getByText('用克体，人胜己，事多阻滞')).toBeInTheDocument();
  });

  it('展示起卦算式', () => {
    render(<MeihuaLayout data={backendData} system="meihua" />);
    expect(screen.getByText(/数字起卦法：数字起卦：取数 3、1/)).toBeInTheDocument();
  });

  it('无 [object Object]', () => {
    render(<MeihuaLayout data={backendData} system="meihua" />);
    expect(screen.queryAllByText(/\[object Object\]/)).toHaveLength(0);
  });
});
