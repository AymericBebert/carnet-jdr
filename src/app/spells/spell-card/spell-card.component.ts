import {Component, HostListener, input, linkedSignal, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {IconRitualComponent} from '../../icons/icon-ritual.component';
import {InterceptLinksDirective} from '../../service/intercept-links.directive';
import {Spell, SpellChoice, toSpellChoice} from '../spell.model';

@Component({
  selector: 'app-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss'],
  imports: [
    IconRitualComponent,
    InterceptLinksDirective,
    MatButtonModule,
    MatIconModule,
    MatCheckbox,
    MatMenuModule,
  ],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.spell-open]': 'isOpen()',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.spell-keep-open]': 'keepOpen()',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class.concentration]': 'spell().concentration',
  },
})
export class SpellCardComponent {
  public readonly spell = input.required<Spell>();
  public readonly keepOpen = input<boolean>(false);
  public readonly showPrepared = input<boolean>(true);
  public readonly spellChoice = input<SpellChoice>();
  public readonly spellChoiceChange = output<SpellChoice>();

  protected readonly isOpen = linkedSignal<boolean>(() => this.keepOpen());

  @HostListener('click') onClick(): void {
    if (!this.keepOpen()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  public changeChoice(attribute: 'favorite' | 'prepared'): void {
    const currentChoice = this.spellChoice() || toSpellChoice({});
    const newChoice = {
      ...currentChoice,
      [attribute]: !currentChoice[attribute],
    };
    this.spellChoiceChange.emit(newChoice);
  }
}
