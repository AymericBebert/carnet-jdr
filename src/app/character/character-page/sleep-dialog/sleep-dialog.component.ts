import {Component, computed, inject, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AbilityUsage} from '../../../ability/ability.model';
import {Character} from '../../character.model';
import {TinyNumberChoiceFormComponent} from '../../tiny-number-choice-form/tiny-number-choice-form.component';

export interface SleepDialogData {
  character: Character;
}

export type SleepDialogResult = Partial<Character>;

interface ToUpdateWithDie {
  id: string;
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
          id: ability.id,
          name: ability.name,
          die: `1d${ability.refillDie}`,
          result: 0,
        });
      }
    }
    return toUpdate;
  });

  public confirm(): void {
    const char = this.data.character;
    const sleepType = this.sleepType();
    const toUpdate = this.toUpdate();
    const abilityUsage = this.getCurrentSanitizedAbilityUsage(char);

    const updateToSend: Partial<Character> = {};

    if (sleepType === 'long') {
      updateToSend.hp = char.hpMax;
      updateToSend.spellSlotBurns = char.spellSlots.map(() => 0);
    }

    for (const ability of char.abilities) {
      if (ability.refillWhen === 'longRest' && sleepType === 'long' ||
        ability.refillWhen === 'shortRest' && sleepType === 'short') {
        abilityUsage[ability.id] = 0;
      }
      if (ability.refillWhen === 'longRestDie' && sleepType === 'long' ||
        ability.refillWhen === 'shortRestDie' && sleepType === 'short') {
        const refill = toUpdate.find(u => u.id === ability.id)?.result ?? 0;
        abilityUsage[ability.id] = Math.max(abilityUsage[ability.id] - refill, 0);
      }
    }

    updateToSend.abilityUsage = abilityUsage;

    this.ref.close(updateToSend);
  }

  private getCurrentSanitizedAbilityUsage(char: Character): AbilityUsage {
    const abilityUsage = {...char.abilityUsage};
    for (const [abilityId, abilityUsageValue] of Object.entries(abilityUsage)) {
      if (char.abilities.every(a => a.id !== abilityId)) {
        delete abilityUsage[abilityId];
      }
      if (isNaN(abilityUsageValue)) {
        abilityUsage[abilityId] = 0;
      }
    }
    return abilityUsage;
  }
}
