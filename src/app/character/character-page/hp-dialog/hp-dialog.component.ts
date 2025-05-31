import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

export interface HpDialogData {
  label: string;
  initial?: number | undefined;
}

@Component({
  selector: 'app-hp-dialog',
  templateUrl: './hp-dialog.component.html',
  styleUrls: ['./hp-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
  ],
})
export class HpDialogComponent {
  protected readonly ref = inject<MatDialogRef<HpDialogComponent, number | null>>(MatDialogRef);
  protected readonly data = inject<HpDialogData>(MAT_DIALOG_DATA);

  public readonly rawValue = signal<string>(this.data.initial?.toString() ?? '');

  public readonly value = computed<number>(() => {
    const rawValue = this.rawValue();

    // Sanitize by only keeping [0-9()×+−]
    const sanitized = rawValue.replace(/[^0-9()×+−]/g, '');

    const evaluated = this.shouldCompute(rawValue) ? this.compute(rawValue) : parseInt(sanitized, 10);
    return isNaN(evaluated) ? 0 : evaluated;
  });

  public readonly hint = computed<string>(() => {
    const rawValue = this.rawValue();
    const value = this.value();
    return this.shouldCompute(rawValue) ? `= ${value}` : '';
  });

  public press(key: string): void {
    this.rawValue.update(s => {
      if (key === 'backspace') {
        return s.slice(0, -1);
      } else {
        return s + key;
      }
    });
    // small haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  private shouldCompute(raw: string): boolean {
    // Check if the raw value contains any of the operators
    return /[×+−]/.test(raw);
  }

  private compute(raw: string): number {
    const operatorReplaced = raw
      .replace(/×/g, '*')
      .replace(/−/g, '-')
      .replace(/[+*-]$/, '');

    console.log('Computing:', operatorReplaced);

    try {
      // Using indirect eval and forcing strict mode can make the code much better
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return eval?.('"use strict";\n' + `(${operatorReplaced})`) ?? 0;
    } catch (e) {
      console.log(`Error evaluating ${operatorReplaced}:`, e);
      return 0;
    }
  }
}
