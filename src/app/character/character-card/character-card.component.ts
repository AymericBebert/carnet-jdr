import {NgOptimizedImage} from '@angular/common';
import {Component, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CharacterHeader} from '../character.model';


@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  imports: [
    MatIconModule,
    NgOptimizedImage,
  ],
})
export class CharacterCardComponent {
  public readonly character = input.required<CharacterHeader>();
}
