import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ThemePalette} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  subTitle?: string;
  description?: string;
  yesText?: string;
  yesColor?: ThemePalette;
  noText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
  }
}
