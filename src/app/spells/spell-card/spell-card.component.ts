import {Component, HostListener, input, output, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {IconRitualComponent} from '../../icons/icon-ritual.component';
import {Spell, SpellChoice, toSpellChoice} from '../spell.model';

@Component({
  selector: 'app-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss'],
  imports: [
    IconRitualComponent,
    MatButtonModule,
    MatIconModule,
    MatCheckbox,
    MatMenuModule,
  ],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.spell-open]': 'isOpen()',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.concentration]': 'spell().concentration',
  },
})
export class SpellCardComponent {
  public readonly spell = input.required<Spell>();
  public readonly spellChoice = input<SpellChoice>(toSpellChoice({}));
  public readonly spellChoiceChange = output<SpellChoice>();

  protected readonly isOpen = signal<boolean>(false);

  @HostListener('click') onClick(): void {
    this.isOpen.set(!this.isOpen());
  }

  public changeChoice(attribute: 'favorite' | 'prepared'): void {
    const currentChoice = this.spellChoice();
    const newChoice = {
      ...currentChoice,
      [attribute]: !currentChoice[attribute],
    };
    this.spellChoiceChange.emit(newChoice);
  }
}
