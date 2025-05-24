export function removeUndefinedValues<R extends Record<string, any>>(obj: R): Partial<R> {
  return obj
    ? Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<R>
    : {};
}
