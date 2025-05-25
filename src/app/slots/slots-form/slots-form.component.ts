import {Component, computed, forwardRef, HostListener, input, signal} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Component({
  selector: 'app-slots-form',
  templateUrl: './slots-form.component.html',
  styleUrls: ['./slots-form.component.scss'],
  imports: [],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => SlotsFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => SlotsFormComponent)},
  ],
})
export class SlotsFormComponent implements ControlValueAccessor, Validator {
  public readonly maxSlots = input.required<number>();

  protected readonly isDisabled = signal<boolean>(false);

  private readonly burntSlots = signal<number>(0);

  protected readonly slots = computed<boolean[][]>(() => {
    const maxSlots = this.maxSlots();
    const burntSlots = this.burntSlots();
    const maxSlotsPerRow = 5;
    return Array.from({length: Math.ceil(maxSlots / maxSlotsPerRow)}, (_, i) =>
      Array.from({length: Math.min(maxSlotsPerRow, maxSlots - maxSlotsPerRow * i)}, (_, j) => {
        return i * maxSlotsPerRow + j < burntSlots;
      })
    );
  });

  private pressTimer: any;
  private clickInitiated = false;
  private isLongPress = false;

  // disable right-click menu
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
  }

  writeValue(obj: number): void {
    this.burntSlots.set(obj);
  }

  registerOnChange(fn: (_: number) => void): void {
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

  startPress(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.clickInitiated = true;

    this.pressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.clickInitiated = false;
      this.unBurnSlot();
    }, 500); // long press threshold (ms)
  }

  endPress(_event: MouseEvent | TouchEvent): void {
    if (!this.clickInitiated) {
      this.isLongPress = false;
      return;
    }
    this.clickInitiated = false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    clearTimeout(this.pressTimer);

    if (!this.isLongPress) {
      this.burnSlot();
    }
    this.isLongPress = false;
  }

  private burnSlot(): void {
    const currentBurntSlots = this.burntSlots();
    if (currentBurntSlots < this.maxSlots()) {
      this.burntSlots.set(currentBurntSlots + 1);
      this.onChange(this.burntSlots());
      this.burnHapticFeedback();
    }
  }

  private unBurnSlot(): void {
    const currentBurntSlots = this.burntSlots();
    if (currentBurntSlots > 0) {
      this.burntSlots.set(currentBurntSlots - 1);
      this.onChange(this.burntSlots());
      void this.unBurnHapticFeedback();
    }
  }

  private burnHapticFeedback(): void {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }

  private async unBurnHapticFeedback(): Promise<void> {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    await new Promise(sleep => setTimeout(sleep, 50));
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  private onChange: (_: number) => void = (_: number) => void 0;

  private onTouched: () => void = () => void 0;
}
