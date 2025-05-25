export function cleanForFilename(raw: string): string {
  return raw
    .replace(/[\s.:'"@/\\?]/g, '_')
    .replace(/_+/g, '_')
    .replace(/(^_+|_+$)/g, '');
}
