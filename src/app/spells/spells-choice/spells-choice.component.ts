import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {CharacterRootComponent} from '../../character/character-root/character-root.component';
import {CharacterClass} from '../../character/character.model';
import {CharacterService} from '../../character/character.service';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
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
  selector: 'app-spells-choice',
  templateUrl: './spells-choice.component.html',
  styleUrls: ['./spells-choice.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SpellCardComponent,
    MatCheckboxModule,
    MatMenuModule,
    SpellChoiceFormComponent,
  ],
})
export class SpellsChoiceComponent {
  private readonly characterRoot = inject(CharacterRootComponent);
  private readonly characterService = inject(CharacterService);
  private readonly spellService = inject(SpellService);
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = this.characterRoot.character;
  private readonly character$ = toObservable(this.character);

  private readonly form = new FormGroup<Record<string, FormControl<SpellChoice>>>(
    Object.fromEntries(spellsFr.map(s => [s.id, new FormControl(toSpellChoice({}), {nonNullable: true})]))
  );

  protected readonly filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    level: new FormControl<number[] | null>(null),
    classes: new FormControl<CharacterClass[] | null>(null),
    known: new FormControl<boolean>(false),
    prepared: new FormControl<boolean>(false),
    favorite: new FormControl<boolean>(false),
  });

  protected readonly availableSpells = signal<SpellsInLevel[]>([]);

  constructor() {
    combineLatest([
      this.character$,
      this.filterForm.valueChanges,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(([char, _]) => {
      if (!char) return;
      const filter: SpellFilter = this.filterForm.value;
      const spells = this.spellService.getSpells(filter, char.spellChoices);
      const spellAndChoices = spells.map<SpellAndChoice>(s => ({
        spell: s,
        choice: this.form.controls[s.id],
      }));
      const spellsInLevels = char.spellSlots
        .map<SpellsInLevel>((_, level) => ({
          level,
          spells: spellAndChoices.filter(s => s.spell.level === level),
        }))
        .filter((s) => s.spells.length > 0);
      this.availableSpells.set(spellsInLevels);
    });

    this.character$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(char => {
      if (!char) return;
      this.navService.mainTitle.set(`Sorts de ${char.name}`);

      this.form.patchValue(char.spellChoices);

      this.filterForm.patchValue({
        name: null,
        level: null,
        classes: char.class ? [char.class] : null,
        known: null,
        prepared: null,
        favorite: null,
      });
    });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        const char = this.character();
        if (!char) return;
        switch (btn) {
          case 'done':
            void this.save();
            break;
        }
      });

    this.destroyRef.onDestroy(() => {
      this.navService.mainTitle.set('');
    });
  }

  protected async save(): Promise<void> {
    const character = this.character();
    const formValue: SpellChoices = this.form.getRawValue();
    if (!character || this.form.invalid || !formValue || Object.keys(formValue).length === 0) {
      return;
    }
    const notAllFalseValues: SpellChoices = Object.fromEntries(Object.entries(formValue).filter(
      ([_, value]) => Object.values(value).some(v => v)
    ));
    await this.characterService.updateCharacter(character.id, {spellChoices: notAllFalseValues});
    void this.router.navigate(['..'], {relativeTo: this.route});
  }
}
