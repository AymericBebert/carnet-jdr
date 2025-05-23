import {Component, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {CharacterCardComponent} from '../character/character-card/character-card.component';
import {CharacterHeader} from '../character/character.model';
import {CharacterService} from '../character/character.service';
import {SnackbarService} from '../service/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CharacterCardComponent,
  ],
})
export class HomeComponent {
  private readonly characterService = inject(CharacterService);
  private readonly snackbar = inject(SnackbarService);

  protected characters = signal<CharacterHeader[]>([]);

  constructor() {
    this.characterService.listCharacters()
      .then(chars => this.characters.set(chars))
      .catch(err => this.snackbar.openError('Error loading characters', err));
  }
}
