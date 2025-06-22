import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {CharacterRootComponent} from '../../character/character-root/character-root.component';
import {CharacterService} from '../../character/character.service';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {FilterableSpellsListComponent} from '../filterable-spells-list/filterable-spells-list.component';
import {SpellChoices} from '../spell.model';

@Component({
  selector: 'app-spells-choice',
  templateUrl: './spells-choice.component.html',
  styleUrls: ['./spells-choice.component.scss'],
  imports: [
    FilterableSpellsListComponent,
  ],
})
export class SpellsChoiceComponent {
  private readonly characterRoot = inject(CharacterRootComponent);
  private readonly characterService = inject(CharacterService);
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = this.characterRoot.character;
  private readonly character$ = toObservable(this.character);

  private readonly updatedSpellChoices = signal<SpellChoices | null>(null);

  constructor() {
    this.character$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(char => {
      if (!char) return;
      this.navService.mainTitle.set(`Sorts de ${char.name}`);
    });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
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
    const updatedSpellChoices = this.updatedSpellChoices();
    if (character && updatedSpellChoices) {
      await this.characterService.updateCharacter(character.id, {spellChoices: updatedSpellChoices});
    }
    void this.router.navigate(['..'], {relativeTo: this.route});
  }

  protected setSpellChoices(spellChoices: SpellChoices): void {
    this.updatedSpellChoices.set(spellChoices);
  }
}
