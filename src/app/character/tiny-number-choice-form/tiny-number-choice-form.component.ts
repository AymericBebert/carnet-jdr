import {Component, forwardRef, input, signal} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {CharacterEditDto} from '../character.model';

@Component({
  selector: 'app-tiny-number-choice-form',
  templateUrl: './tiny-number-choice-form.component.html',
  styleUrls: ['./tiny-number-choice-form.component.scss'],
  imports: [],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => TinyNumberChoiceFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => TinyNumberChoiceFormComponent)},
  ],
})
export class TinyNumberChoiceFormComponent implements ControlValueAccessor, Validator {
  public readonly min = input<number | null>(null);
  public readonly max = input<number | null>(null);

  protected readonly value = signal<number>(0);
  protected readonly isDisabled = signal<boolean>(false);

  writeValue(obj: number): void {
    this.value.set(obj);
  }

  registerOnChange(fn: (_: CharacterEditDto) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }

  protected changeByAmount(amount: number): void {
    let value = this.value();
    const min = this.min();
    const max = this.max();
    if (min !== null && value + amount < min) {
      value = min;
    } else if (max !== null && value + amount > max) {
      value = max;
    } else {
      value += amount;
    }
    this.value.set(value);
    this.onChange(value);
  }

  private onChange: (_: number) => void = (_: number) => void 0;

  private onTouched: () => void = () => void 0;
}
