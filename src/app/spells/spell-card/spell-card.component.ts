import {Component, input, signal} from '@angular/core';
import {Spell} from '../spells.model';

@Component({
  selector: 'app-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss'],
  imports: [],
})
export class SpellCardComponent {
  public readonly spell = input.required<Spell>();

  public readonly isOpen = signal<boolean>(false);
}
