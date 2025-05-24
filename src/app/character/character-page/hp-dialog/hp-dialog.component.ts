import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

export interface HpDialogData {
  title: string;
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
    MatInputModule,
    FormsModule,
  ],
})
export class HpDialogComponent {
  protected readonly ref = inject<MatDialogRef<HpDialogComponent>>(MatDialogRef);
  protected readonly data = inject<HpDialogData>(MAT_DIALOG_DATA);

  public readonly score = signal<number | null>(this.data.initial ?? null);
}
