import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AbilityCardComponent} from '../../ability/ability-card/ability-card.component';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {SlotsFormComponent} from '../../slots/slots-form/slots-form.component';
import {SpellCardComponent} from '../../spells/spell-card/spell-card.component';
import {spellsFr} from '../../spells/spells-fr';
import {Spell} from '../../spells/spells.model';
import {cleanForFilename} from '../../utils/clean-for-filename';
import {downloadJson} from '../../utils/download-as-file';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {Character} from '../character.model';
import {CharacterService} from '../character.service';
import {HpDialogComponent, HpDialogData} from './hp-dialog/hp-dialog.component';

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
  ],
})
export class CharacterPageComponent implements OnInit, OnDestroy {
  private readonly characterService = inject(CharacterService);
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly matDialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = signal<Character | null>(null);

  protected readonly availableSpells = computed<SpellsInLevel[]>(() => {
    const char = this.character();
    if (!char) {
      return [];
    }
    const available = spellsFr
      .filter(s => char.spellSlots[s.level])
      .filter(s => s.classes.includes(char.class));
    return char.spellSlots.map((slots, level) => {
      return {
        level,
        slots: level === 0 ? 0 : slots,
        spells: available.filter(s => s.level === level),
      };
    }).filter(s => s.spells.length > 0);
  });

  protected readonly testSpell = spellsFr.find(spell => spell.id === 'dissipation-de-la-magie')!;

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const char: Character = data.character;
        this.character.set(char);
        this.navService.mainTitle.set(char.name);
      });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        const char = this.character();
        if (!char) return;
        switch (btn) {
          case 'edit':
            void this.router.navigate(['../..', 'edit-character', char.id], {relativeTo: this.route});
            break;
          case 'menu_book':
            console.log('TODO edit spells');
            break;
          case 'download':
            downloadJson(char, cleanForFilename(char.name) + '.json');
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.navService.mainTitle.set('');
  }

  changeHp(title: string, label: string, negative: boolean, temp: boolean): void {
    this.matDialog.open<HpDialogComponent, HpDialogData, number>(
      HpDialogComponent,
      {
        data: {
          title,
          label,
          ...temp ? {initial: this.character()?.hpTemp || undefined} : {},
        },
        autoFocus: 'input',
        position: {top: '20vh'},
      },
    ).afterClosed().pipe(
      filter(hp => hp != null),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(hp => {
      const char = this.character();
      if (!char) {
        return;
      }
      let hpChange = negative ? -hp : hp;
      if (temp) {
        hpChange = hp - char.hpTemp;
        this.characterService.updateCharacter(char.id, {
          hpTemp: hp,
          hp: char.hp + hpChange,
        })
          .then(updatedChar => this.character.set(updatedChar))
          .catch(err => console.error('Error updating character temp HP:', err));
      } else {
        const newHp = Math.min(char.hpMax + char.hpTemp, char.hp + hpChange);
        this.characterService.updateCharacter(char.id, {
          hp: newHp,
        })
          .then(updatedChar => this.character.set(updatedChar))
          .catch(err => console.error('Error updating character HP:', err));
      }
    });
  }
}
