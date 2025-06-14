import {Component, forwardRef, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {SpellCardComponent} from '../spell-card/spell-card.component';
import {Spell} from '../spell.model';

export interface SpellDialogData {
  spell: Spell;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './spell-dialog.component.html',
  styleUrls: ['./spell-dialog.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    forwardRef(() => SpellCardComponent),
  ],
})
export class SpellDialogComponent {
  protected readonly data = inject<SpellDialogData>(MAT_DIALOG_DATA);
}
