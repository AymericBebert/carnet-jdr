import {FormControl, FormRecord} from '@angular/forms';

export function adaptFormRecord<R, T extends FormControl<R>>(
  formRecord: FormRecord<T>,
  obj: Record<string, any>,
  createItem: () => T,
  extraOpts?: {
    adaptItem?: (form: T, obj: any, key: string) => void;
    emitEvent?: boolean;
  },
): void {
  obj = obj || {};
  const emitEvent = extraOpts?.emitEvent ?? true;
  Object.keys(obj).forEach(key => {
    if (!formRecord.contains(key)) {
      formRecord.addControl(key, createItem(), {emitEvent});
    }
    formRecord.get(key)!.setValue(obj[key], {emitEvent});
  });
  Object.keys(formRecord.controls).forEach(key => {
    if (!Object.hasOwn(obj, key)) {
      formRecord.removeControl(key, {emitEvent});
    }
  });
  const adaptItem = extraOpts?.adaptItem;
  if (adaptItem) {
    Object.keys(obj).forEach(key => adaptItem(formRecord.get(key) as T, obj[key], key));
  }
}
