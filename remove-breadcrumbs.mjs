/**
 * 批量删除所有前端页面的面包屑导航代码
 */
import fs from 'fs';
import path from 'path';

const pagesDir = 'C:/Users/19029667/AppData/Roaming/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a508cf5125dd7f80e43a9b4/tianji-app/src/pages';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 模式1: 带 aria-label 的面包屑 nav 块
  const p1 = /\s*<nav\s+[^>]*aria-label="面包屑[^"]*"[^>]*>[\s\S]*?<\/nav>/g;
  // 模式2: 普通面包屑（ChevronRight + 首页）
  const p2 = /\s*<(?:nav|div)\s[^>]*>\s*<Link\s+to="\/"[^>]*>首页<\/Link>\s*<ChevronRight[^/]*\/>\s*<span[^>]*>[^<]*<\/span>\s*<\/(?:nav|div)>/g;
  // 模式3: 面包屑包含 ChevronRight（更宽松）
  const p3 = /\s*<(?:nav|div)\s[^>]*>[\s\S]*?ChevronRight[\s\S]*?<\/(?:nav|div)>/g;

  let removed = 0;
  const before = content.length;

  for (const pattern of [p1, p2, p3]) {
    const matches = content.match(pattern);
    if (matches) {
      removed += matches.length;
      content = content.replace(pattern, '');
    }
  }

  if (content.length < before) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalRemoved += removed;
    console.log('[OK] ' + file + ': deleted ' + removed + ' breadcrumb(s)');
  }
}

console.log('\nDone: removed ' + totalRemoved + ' breadcrumbs total');
