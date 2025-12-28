import {FormControl, FormRecord} from '@angular/forms';

/**
 * Adapts a `FormRecord` to reflect the structure of the object.
 *
 * Adds or removes controls so that the `FormRecord` matches the keys of `obj`.
 * Please note that this function does not set the values of the controls; it only ensures the correct keys are present.
 *
 * @param formRecord The `FormRecord` to synchronize.
 * @param obj The source object.
 * @param createControl Function to create a new control.
 * @param extraOpts Additional options:
 *  - `adaptItem`: function to adapt each control.
 *  - `emitEvent`: whether to emit events (default is `true`, but it will emit for each control add/remove).
 */
export function adaptFormRecord<R, T extends FormControl<R>>(
  formRecord: FormRecord<T>,
  obj: Record<string, any>,
  createControl: () => T,
  extraOpts?: {
    adaptItem?: (form: T, obj: any, key: string) => void;
    emitEvent?: boolean;
  },
): void {
  obj = obj || {};
  const emitEvent = extraOpts?.emitEvent ?? true;
  Object.keys(obj).forEach(key => {
    if (!formRecord.contains(key)) {
      formRecord.addControl(key, createControl(), {emitEvent});
    }
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
