import {Component, computed, DestroyRef, forwardRef, HostListener, inject, input, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {filter} from 'rxjs/operators';
import {getRandomString} from '../../utils/get-random-string';
import {ValueDialogComponent, ValueDialogData, ValueDialogResult} from '../../value-dialog/value-dialog.component';

interface DisplayedSlot {
  id: string;
  burnt: boolean;
}

@Component({
  selector: 'app-slots-form',
  templateUrl: './slots-form.component.html',
  styleUrls: ['./slots-form.component.scss'],
  imports: [
    MatIconModule,
    MatIconButton,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => SlotsFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => SlotsFormComponent)},
  ],
})
export class SlotsFormComponent implements ControlValueAccessor, Validator {
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public readonly maxSlots = input.required<number>();

  private readonly componentId = getRandomString(8);

  protected readonly isDisabled = signal<boolean>(false);

  protected readonly burntSlots = signal<number>(0);

  protected readonly slots = computed<DisplayedSlot[][] | null>(() => {
    const maxSlots = this.maxSlots();
    if (!maxSlots) {
      return [];
    }
    if (maxSlots > 10) {
      return null;
    }
    const burntSlots = this.burntSlots();
    const maxSlotsPerRow = 5;
    return Array.from({length: Math.ceil(maxSlots / maxSlotsPerRow)}, (_, i) =>
      Array.from({length: Math.min(maxSlotsPerRow, maxSlots - maxSlotsPerRow * i)}, (_, j) => {
        const index = i * maxSlotsPerRow + j;
        return {id: this.componentId + '-' + index, burnt: index < burntSlots};
      })
    );
  });

  private pressTimer: any;
  private clickInitiated = false;
  private isLongPress = false;
  private lastClickTime = 0;

  private touchStartX = 0;
  private touchStartY = 0;

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

  startPress(event?: TouchEvent): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    clearInterval(this.pressTimer);

    this.clickInitiated = true;

    // Record the initial touch position for scroll detection
    if (event?.touches?.length) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }

    this.pressTimer = setInterval(() => {
      this.isLongPress = true;
      this.clickInitiated = false;
      this.unBurnSlot();
    }, 500); // long press threshold (ms)
  }

  endPress(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    clearInterval(this.pressTimer);

    // Ignore unwanted cursor leave events, and double clicks
    const now = Date.now();
    if (!this.clickInitiated || (now - this.lastClickTime < 300)) {
      this.isLongPress = false;
      return;
    }
    this.lastClickTime = now;
    this.clickInitiated = false;

    if (!this.isLongPress) {
      this.burnSlot();
    }
    this.isLongPress = false;
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const moveX = event.touches[0].clientX;
      const moveY = event.touches[0].clientY;

      if (Math.abs(moveX - this.touchStartX) > 10 || Math.abs(moveY - this.touchStartY) > 10) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearInterval(this.pressTimer);
        this.clickInitiated = false;
      }
    }
  }

  protected changeUsage(label: string, negative: boolean): void {
    const maxSlots = this.maxSlots();
    const burntSlots = this.burntSlots();

    this.matDialog.open<ValueDialogComponent, ValueDialogData, ValueDialogResult>(
      ValueDialogComponent,
      {
        data: {
          label,
        },
        autoFocus: '__nope__',
      },
    ).afterClosed().pipe(
      filter(changeRes => changeRes != null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(changeRes => {
      const change = negative ? -changeRes : changeRes;
      this.burntSlots.set(Math.min(Math.max(burntSlots - change, 0), maxSlots));
      this.onChange(this.burntSlots());
    });
  }

  private burnSlot(): void {
    const currentBurntSlots = this.burntSlots();
    if (currentBurntSlots < this.maxSlots()) {
      this.burntSlots.set(currentBurntSlots + 1);
      this.onChange(this.burntSlots());
      const slotElement = document.getElementById(`${this.componentId}-${currentBurntSlots}`);
      if (slotElement) {
        slotElement.classList.add('burning');
        setTimeout(() => slotElement.classList.replace('burning', 'burnt'), 300);
      }
      this.burnHapticFeedback();
    }
  }

  private unBurnSlot(): void {
    const currentBurntSlots = this.burntSlots();
    if (currentBurntSlots > 0) {
      this.burntSlots.set(currentBurntSlots - 1);
      this.onChange(this.burntSlots());
      const slotElement = document.getElementById(`${this.componentId}-${currentBurntSlots - 1}`);
      if (slotElement) {
        slotElement.classList.add('filling');
        setTimeout(() => slotElement.classList.replace('filling', 'available'), 300);
      }
      this.unBurnHapticFeedback();
    }
  }

  private burnHapticFeedback(): void {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }

  private unBurnHapticFeedback(): void {
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }

  private onChange: (_: number) => void = (_: number) => void 0;

  private onTouched: () => void = () => void 0;
}
