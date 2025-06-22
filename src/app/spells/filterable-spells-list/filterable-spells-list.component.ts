import {AsyncPipe} from '@angular/common';
import {Component, DestroyRef, inject, input, output} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {BehaviorSubject, combineLatest, startWith} from 'rxjs';
import {Character, CharacterClass, characterClasses, toCharacter} from '../../character/character.model';
import {ConfirmService} from '../../confirm/confirm.service';
import {SpellCardComponent} from '../spell-card/spell-card.component';
import {SpellChoiceFormComponent} from '../spell-choice-form/spell-choice-form.component';
import {Spell, SpellChoice, SpellChoices, SpellFilter, toSpellChoice} from '../spell.model';
import {SpellService} from '../spell.service';
import {spellsFr} from '../spells-fr';

interface SpellAndChoice {
  spell: Spell;
  choice: FormControl<SpellChoice>;
}

interface SpellsInLevel {
  level: number;
  spells: SpellAndChoice[];
}

@Component({
  selector: 'app-filterable-spells-list',
  templateUrl: './filterable-spells-list.component.html',
  styleUrls: ['./filterable-spells-list.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SpellCardComponent,
    MatCheckboxModule,
    MatMenuModule,
    SpellChoiceFormComponent,
    AsyncPipe,
    FormsModule,
    MatSelectModule,
  ],
})
export class FilterableSpellsListComponent {
  private readonly spellService = inject(SpellService);
  private readonly confirm = inject(ConfirmService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly character = input<Character | null>(null);
  public readonly spellChoices = output<SpellChoices>();

  private readonly character$ = toObservable(this.character);

  protected readonly characterClasses = characterClasses;

  protected readonly filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    level: new FormControl<number[] | null>(null),
    classes: new FormControl<CharacterClass[] | null>(null),
    known: new FormControl<boolean | null>(null),
    prepared: new FormControl<boolean | null>(null),
    favorite: new FormControl<boolean | null>(null),
  });

  protected readonly filteredSpellsInLevels$ = new BehaviorSubject<SpellsInLevel[]>([]);

  private readonly spellChoicesForm = new FormGroup<Record<string, FormControl<SpellChoice>>>(
    Object.fromEntries(spellsFr.map(s => [s.id, new FormControl(toSpellChoice({}), {nonNullable: true})]))
  );

  protected readonly globalChoiceForms = new Array(10).fill(null).map(
    () => new FormControl<SpellChoice<boolean | null>>(toSpellChoice({}), {nonNullable: true})
  );
  private lastWrittenGlobalChoices: SpellChoice<boolean | null>[] = this.globalChoiceForms.map(gc => gc.value);

  constructor() {
    combineLatest([
      this.filterForm.valueChanges,
      this.character$,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(([_, char]) => {
      if (!char) {
        char = toCharacter({spellSlots: new Array(10).fill(1)});
      }
      this.updateFilteredSpellsInLevels(this.getSpellFilter(), char);
    });

    this.character$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(char => {
      if (!char) return;
      this.spellChoicesForm.patchValue(char.spellChoices, {emitEvent: false});

      this.filterForm.patchValue({
        name: null,
        level: null,
        classes: char.class ? [char.class] : null,
        known: null,
        prepared: null,
        favorite: null,
      });
    });

    combineLatest([
      this.filteredSpellsInLevels$,
      this.spellChoicesForm.valueChanges.pipe(startWith(null)),
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(([spellsInLevels, _]) => {
      this.updateGlobalChoices(spellsInLevels, this.spellChoicesForm.getRawValue());
    });

    for (let level = 0; level < this.globalChoiceForms.length; level++) {
      const globalChoice = this.globalChoiceForms[level];
      globalChoice.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe($event => void this.setGlobalChoice(level, $event));
    }

    this.spellChoicesForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const formValue: SpellChoices = this.spellChoicesForm.getRawValue();
      const notAllFalseValues: SpellChoices = Object.fromEntries(Object.entries(formValue).filter(
        ([_, value]) => Object.values(value).some(v => v)
      ));
      this.spellChoices.emit(notAllFalseValues);
    });
  }

  private updateFilteredSpellsInLevels(filter: SpellFilter, char: Character): void {
    const spells = this.spellService.getSpells(filter, char.spellChoices);
    const spellAndChoices = spells.map<SpellAndChoice>(s => ({
      spell: s,
      choice: this.spellChoicesForm.controls[s.id],
    }));
    const spellsInLevels = char.spellSlots
      .map<SpellsInLevel>((_, level) => ({
        level,
        spells: spellAndChoices.filter(s => s.spell.level === level),
      }))
      .filter((s) => s.spells.length > 0);
    this.filteredSpellsInLevels$.next(spellsInLevels);
  }

  private updateGlobalChoices(spellsInLevels: SpellsInLevel[], spellChoices: SpellChoices): void {
    for (const {level, spells} of spellsInLevels) {
      const choices: SpellChoice<Set<boolean | null>> = {
        known: new Set(),
        prepared: new Set(),
        alwaysPrepared: new Set(),
        favorite: new Set(),
      };
      for (const spellAndChoice of spells) {
        const choice = spellChoices[spellAndChoice.spell.id];
        choices.known.add(choice.known);
        choices.prepared.add(choice.prepared);
        choices.alwaysPrepared.add(choice.alwaysPrepared);
        choices.favorite.add(choice.favorite);
      }
      this.lastWrittenGlobalChoices[level] = {
        known: this.levelValuesToChecked(choices.known),
        prepared: this.levelValuesToChecked(choices.prepared),
        alwaysPrepared: this.levelValuesToChecked(choices.alwaysPrepared),
        favorite: this.levelValuesToChecked(choices.favorite),
      };
      this.globalChoiceForms[level].setValue(this.lastWrittenGlobalChoices[level]);
    }
  }

  private levelValuesToChecked(values: Set<boolean | null>): boolean | null {
    if (values.size === 1) {
      return values.values().next().value ?? null;
    }
    return null;
  }

  private async setGlobalChoice(level: number, newSpellChoice: SpellChoice<boolean | null>): Promise<void> {
    const lastWrittenChoice = this.lastWrittenGlobalChoices[level];

    // Get back the key that differs from the last written choice
    const keyThatDiffer = Object.entries(newSpellChoice).find(
      ([key, choices]) => choices != null && choices !== lastWrittenChoice[key as keyof SpellChoice]
    )?.[0] as keyof SpellChoice | undefined;
    if (keyThatDiffer === undefined) return;

    const newValue = newSpellChoice[keyThatDiffer] as boolean;

    // Confirm the change with the user
    const keyDisplayMap: Record<keyof SpellChoice, string> = {
      known: 'Connu',
      prepared: 'Préparé',
      alwaysPrepared: 'Toujours préparé',
      favorite: 'Favori',
    };
    const keyDisplay = keyDisplayMap[keyThatDiffer];
    const confirmed = await this.confirm.confirm({
      title: `Passer "${keyDisplay}" à "${newValue ? 'oui' : 'non'}"`,
      // eslint-disable-next-line no-irregular-whitespace
      description: `Voulez-vous vraiment modifier "${keyDisplay}" pour tous les sorts affichés de ce niveau ?`,
    });
    if (!confirmed) {
      this.globalChoiceForms[level].setValue(this.lastWrittenGlobalChoices[level]);
      return;
    }

    // Change confirmed, update the choices
    this.lastWrittenGlobalChoices[level] = this.globalChoiceForms[level].value;

    const spellsInLevel = this.filteredSpellsInLevels$.value.find(l => l.level === level);
    if (spellsInLevel === undefined) return;

    for (const spellAndChoice of spellsInLevel.spells) {
      spellAndChoice.choice.setValue({
        ...spellAndChoice.choice.value,
        [keyThatDiffer]: newValue,
      }, {emitEvent: false});
    }
    this.spellChoicesForm.updateValueAndValidity();
  }

  private getSpellFilter(): SpellFilter {
    const filter = this.filterForm.getRawValue();
    return {
      name: filter.name?.trim() || null,
      level: filter.level?.length ? filter.level : null,
      classes: filter.classes?.length ? filter.classes : null,
      known: filter.known ?? null,
      prepared: filter.prepared ?? null,
      favorite: filter.favorite ?? null,
    };
  }
}
