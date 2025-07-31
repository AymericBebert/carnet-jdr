import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CharacterCardComponent} from '../character/character-card/character-card.component';
import {CharacterHeader} from '../character/character.model';
import {CharacterService} from '../character/character.service';
import {NavButtonsService} from '../nav/nav-buttons.service';
import {SnackbarService} from '../service/snackbar.service';
import {UpDownButtonComponent} from '../utils/up-down-button/up-down-button.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CharacterCardComponent,
    UpDownButtonComponent,
  ],
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly characterService = inject(CharacterService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly snackbar = inject(SnackbarService);

  protected readonly characters = signal<CharacterHeader[]>([]);
  protected readonly isReordering = signal<boolean>(false);

  constructor() {
    this.route.data
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const chars: CharacterHeader[] = data.characters;
        this.characters.set(chars);
      });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed())
      .subscribe(btn => {
        switch (btn.id) {
          case 'swap_vert':
            this.isReordering.set(true);
            break;
        }
      });
  }

  public moveCharacter(i: number, offset: number): void {
    const characters = [...this.characters()];
    if (i < 0 || i >= characters.length || i + offset < 0 || i + offset >= characters.length) {
      return;
    }
    const [movedCharacter] = characters.splice(i, 1);
    characters.splice(i + offset, 0, movedCharacter);
    this.characters.set(characters);
  }

  public validateOrder(): void {
    this.isReordering.set(false);
    const characters = this.characters();
    this.characterService.updateCharacterOrder(characters.map(c => c.id))
      .then(newChars => {
        this.characters.set(newChars);
        this.snackbar.openOk('Personnages ré-ordonnés');
      })
      .catch(err => this.snackbar.openError('Erreur en ré-ordonnant les personnages', err));
  }
}
