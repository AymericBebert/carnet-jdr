import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';
import {Character} from '../character.model';
import {CharacterService} from '../character.service';

@Component({
  selector: 'app-character-root',
  templateUrl: './character-root.component.html',
  styleUrls: ['./character-root.component.scss'],
  imports: [
    RouterOutlet,
  ],
})
export class CharacterRootComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly characterService = inject(CharacterService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly character = signal<Character | null>(null);

  constructor() {
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const char: Character = data.character;
        this.character.set(char);
      });

    this.characterService.characterUpdated$
      .pipe(
        filter(updatedCharacterId => {
          const char = this.character();
          return !!char && char.id === updatedCharacterId;
        }),
        switchMap(updatedCharacterId => this.characterService.getCharacter(updatedCharacterId)),
        takeUntilDestroyed(),
      )
      .subscribe(updatedCharacter => {
        this.character.set(updatedCharacter);
      });

    this.destroyRef.onDestroy(() => {
      this.character.set(null);
    });
  }
}
