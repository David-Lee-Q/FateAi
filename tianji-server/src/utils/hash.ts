/**
 * 稳定哈希工具
 * 用于将任意字符串映射为确定性的整数（FNV-1a），保证同一输入永远得到同一分值
 */

/** FNV-1a 32位哈希，返回 0 ~ 4294967295 的无符号整数 */
export function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * 将字符串映射为 1~9 的稳定数字
 * 优先使用字符串中的数字位求和缩减；无数字时回退到哈希取模
 */
export function stableDigit(str: string): number {
  const digits = str.replace(/\D/g, '');
  if (digits.length > 0) {
    let sum = digits.split('').reduce((s, d) => s + parseInt(d, 10), 0);
    while (sum > 9) {
      sum = String(sum).split('').reduce((a, b) => a + parseInt(b, 10), 0);
    }
    return sum;
  }
  return (fnv1a(str) % 9) + 1;
}
