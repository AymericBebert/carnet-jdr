import {Component, input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {IconRitualComponent} from '../../icons/icon-ritual.component';
import {Spell} from '../spells.model';

@Component({
  selector: 'app-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss'],
  imports: [
    IconRitualComponent,
    MatIconModule,
  ],
})
export class SpellCardComponent {
  public readonly spell = input.required<Spell>();

  public readonly isOpen = signal<boolean>(false);
}
