export function getRandomString(length: number, chars = 'abcdefghijklmnopqrstuvwxyz0123456789'): string {
  return Array(length).fill(0).reduce<string>(acc => acc + chars.charAt(Math.floor(Math.random() * chars.length)), '',);
}
