import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {SpellCardComponent} from '../../spells/spell-card/spell-card.component';
import {spellsFr} from '../../spells/spells-fr';
import {Spell} from '../../spells/spells.model';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {Character} from '../character.model';

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
  ],
})
export class CharacterPageComponent implements OnInit, OnDestroy {
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
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
        switch (btn) {
          case 'edit':
            if (char) {
              void this.router.navigate(['../..', 'edit-character', char.id], {relativeTo: this.route});
            }
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.navService.mainTitle.set('');
  }
}
