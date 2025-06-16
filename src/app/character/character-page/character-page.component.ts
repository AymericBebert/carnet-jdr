import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AbilityCardComponent} from '../../ability/ability-card/ability-card.component';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {StorageService} from '../../service/storage.service';
import {SlotsFormComponent} from '../../slots/slots-form/slots-form.component';
import {SpellCardComponent} from '../../spells/spell-card/spell-card.component';
import {Spell, SpellChoice, SpellFilter} from '../../spells/spell.model';
import {SpellService} from '../../spells/spell.service';
import {cleanForFilename} from '../../utils/clean-for-filename';
import {downloadJson} from '../../utils/download-as-file';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {CharacterRootComponent} from '../character-root/character-root.component';
import {CharacterClass} from '../character.model';
import {CharacterService} from '../character.service';
import {HpDialogComponent, HpDialogData, HpDialogResult} from './hp-dialog/hp-dialog.component';
import {SleepDialogComponent, SleepDialogData, SleepDialogResult} from './sleep-dialog/sleep-dialog.component';

interface SpellsInLevel {
  level: number;
  slots: number;
  spells: Spell[];
}

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CharacterCardComponent,
    SpellCardComponent,
    AbilityCardComponent,
    SlotsFormComponent,
    FormsModule,
  ],
})
export class CharacterPageComponent {
  private readonly characterRoot = inject(CharacterRootComponent);
  private readonly characterService = inject(CharacterService);
  private readonly spellService = inject(SpellService);
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly storage = inject(StorageService);
  private readonly matDialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = this.characterRoot.character;
  private readonly character$ = toObservable(this.character);

  protected readonly filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    level: new FormControl<number[] | null>(null),
    classes: new FormControl<CharacterClass[] | null>(null),
    known: new FormControl<boolean | null>(true),
    prepared: new FormControl<boolean | null>(null),
    favorite: new FormControl<boolean | null>(null),
    concentrating: new FormControl<boolean | null>(null),
  });

  protected readonly availableSpells = signal<SpellsInLevel[]>([]);

  constructor() {
    this.character$
      .pipe(takeUntilDestroyed())
      .subscribe(char => {
        if (!char) return;
        this.navService.mainTitle.set(char.name);
        this.filterForm.patchValue(this.loadSpellFilter(char.id));
      });

    combineLatest([
      this.character$,
      this.filterForm.valueChanges,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([char, _]) => {
        if (!char) return;
        const spellFilter = this.getSpellFilter();
        this.storeSpellFilter(char.id, spellFilter);
        const available = this.spellService.getSpells(spellFilter, char.spellChoices);
        const availableSpells = char.spellSlots.map((slots, level) => {
          return {
            level,
            slots: level === 0 ? 0 : slots,
            spells: available.filter(s => s.level === level),
          };
        }).filter(s => s.spells.length > 0);
        this.availableSpells.set(availableSpells);
      });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed())
      .subscribe(btn => {
        const char = this.character();
        if (!char) return;
        switch (btn) {
          case 'edit':
            void this.router.navigate(['edit'], {relativeTo: this.route});
            break;
          case 'menu_book':
            void this.router.navigate(['spells'], {relativeTo: this.route});
            break;
          case 'download':
            downloadJson(char, cleanForFilename(char.name) + '.json');
            break;
        }
      });

    this.destroyRef.onDestroy(() => {
      this.navService.mainTitle.set('');
    });
  }

  protected changeHp(label: string, negative: boolean, temp: boolean): void {
    this.matDialog.open<HpDialogComponent, HpDialogData, HpDialogResult>(
      HpDialogComponent,
      {
        data: {
          label,
          ...temp ? {initial: this.character()?.hpTemp || undefined} : {},
        },
        autoFocus: '__nope__',
      },
    ).afterClosed().pipe(
      filter(hp => hp != null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(hp => {
      const char = this.character();
      if (!char) return;
      let hpChange = negative ? -hp : hp;
      if (temp) {
        hpChange = hp - char.hpTemp;
        this.characterService.updateCharacter(char.id, {hpTemp: hp, hp: char.hp + hpChange})
          .catch(err => console.error('Error updating character temp HP:', err));
      } else {
        const newHp = Math.min(char.hpMax + char.hpTemp, char.hp + hpChange);
        this.characterService.updateCharacter(char.id, {hp: newHp})
          .catch(err => console.error('Error updating character HP:', err));
      }
    });
  }

  protected sleep(): void {
    const char0 = this.character();
    if (!char0) return;
    this.matDialog.open<SleepDialogComponent, SleepDialogData, SleepDialogResult>(
      SleepDialogComponent,
      {
        data: {
          character: char0,
        },
        autoFocus: '__nope__',
      },
    ).afterClosed().pipe(
      filter(characterUpdates => characterUpdates != null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(characterUpdates => {
      const char = this.character();
      if (!char || char.id !== char0.id) return;
      this.characterService.updateCharacter(char.id, characterUpdates)
        .catch(err => console.error('Error updating character after sleep:', err));
    });
  }

  protected setAbilityUsage(abilityId: string, usage: number): void {
    const char = this.character();
    if (!char) return;
    const abilityUsage = {...char.abilityUsage, [abilityId]: usage};
    this.characterService.updateCharacter(char.id, {abilityUsage})
      .catch(err => console.error('Error updating character ability usage:', err));
  }

  protected setSpellSlotBurns(spellLevel: number, nbBurnt: number): void {
    const char = this.character();
    if (!char) return;
    const spellSlotBurns = [...char.spellSlotBurns];
    spellSlotBurns[spellLevel] = nbBurnt;
    this.characterService.updateCharacter(char.id, {spellSlotBurns})
      .catch(err => console.error('Error updating character spell slot burns:', err));
  }

  protected setSpellChoice(spellId: string, choice: SpellChoice): void {
    const currentChar = this.character();
    if (!currentChar) return;
    const spellChoices = currentChar.spellChoices || {};
    const newChoices = {...spellChoices, [spellId]: choice};
    this.characterService.updateCharacter(currentChar.id, {spellChoices: newChoices})
      .catch(err => console.error('Error updating character spell choices:', err));
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
      concentrating: filter.concentrating ?? null,
    };
  }

  private storeSpellFilter(charId: string, filter: SpellFilter): void {
    const filterString = JSON.stringify(filter);
    this.storage.setItem(`spellFilter.${charId}`, filterString);
  }

  private loadSpellFilter(charId: string): SpellFilter {
    const filterString = this.storage.getItem(`spellFilter.${charId}`);
    if (filterString) {
      try {
        return JSON.parse(filterString) as SpellFilter;
      } catch (e) {
        console.error('Error parsing spell filter from storage:', e);
      }
    }
    return {};
  }
}
