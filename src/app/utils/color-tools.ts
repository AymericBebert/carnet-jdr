/**
 * A very simple hash function that returns a number between 0 and 1.
 */
export function verySimpleHash(text: string): number {
  let h = 0xdeadbeef;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 2654435761);
  }
  return ((h ^ h >>> 16) >>> 0) / Math.pow(2, 32);
}

export function stringToColor(text: string, alpha: number = 1): string {
  const baseColor = `oklch(0.68 0.17 ${Math.round(verySimpleHash(text) * 360)})`;
  if (alpha === 1) {
    return baseColor;
  }
  return `color-mix(in oklch shorter hue, white 100%, ${baseColor} ${alpha * 100}%)`;
}
