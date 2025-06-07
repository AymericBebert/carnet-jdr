import {Component, computed, inject, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Character} from '../../character.model';
import {TinyNumberChoiceFormComponent} from '../../tiny-number-choice-form/tiny-number-choice-form.component';

export interface SleepDialogData {
  character: Character;
}

export type SleepDialogResult = Partial<Character>;

interface ToUpdateWithDie {
  name: string;
  die: string;
  result: number;
}

@Component({
  selector: 'app-hp-dialog',
  templateUrl: './sleep-dialog.component.html',
  styleUrls: ['./sleep-dialog.component.scss'],
  imports: [
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    TinyNumberChoiceFormComponent,
  ],
})
export class SleepDialogComponent {
  protected readonly ref = inject<MatDialogRef<SleepDialogComponent, SleepDialogResult>>(MatDialogRef);
  protected readonly data = inject<SleepDialogData>(MAT_DIALOG_DATA);

  protected readonly sleepType = model<'long' | 'short'>('long');

  public readonly toUpdate = computed<ToUpdateWithDie[]>(() => {
    const sleepType = this.sleepType();
    const char = this.data.character;
    const toUpdate: ToUpdateWithDie[] = [];
    for (const ability of char.abilities) {
      if (ability.refillWhen === 'longRestDie' && sleepType === 'long' ||
        ability.refillWhen === 'shortRestDie' && sleepType === 'short') {
        toUpdate.push({
          name: ability.name,
          die: `1d${ability.refillDie}`,
          result: 0,
        });
      }
    }
    return toUpdate;
  });

  public confirm(): void {
    const sleepType = this.sleepType();
    const char = this.data.character;
    const toUpdate: Partial<Character> = {};

    if (sleepType === 'long') {
      toUpdate.hp = char.hpMax;
      toUpdate.spellSlotBurns = char.spellSlots.map(() => 0);
    }

    const abilityUsage = {...char.abilityUsage};

    this.ref.close(toUpdate);
  }
}
