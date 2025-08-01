import {Component, DestroyRef, effect, HostListener, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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

  private updatedSpellChoices: SpellChoices | null = null;
  private pristine = true;

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    const char = this.character();
    if (!char) return true;
    return this.pristine || JSON.stringify(char.spellChoices) === JSON.stringify(this.updatedSpellChoices);
  }

  constructor() {
    effect(() => {
      const char = this.character();
      if (!char) return;
      this.navService.mainTitle.set(`Sorts de ${char.name}`);
    });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        switch (btn.id) {
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
    if (character && this.updatedSpellChoices) {
      await this.characterService.updateCharacter(character.id, {spellChoices: this.updatedSpellChoices});
      this.pristine = true;
    }
    void this.router.navigate(['..'], {relativeTo: this.route});
  }

  protected setSpellChoices(spellChoices: SpellChoices): void {
    this.updatedSpellChoices = spellChoices;
    this.pristine = false;
  }
}
