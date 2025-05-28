import {Component, input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {IconRitualComponent} from '../../icons/icon-ritual.component';
import {Spell, SpellChoice, toSpellChoice} from '../spell.model';

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
  public readonly spellChoice = input<SpellChoice>(toSpellChoice({}));

  public readonly isOpen = signal<boolean>(false);
}
