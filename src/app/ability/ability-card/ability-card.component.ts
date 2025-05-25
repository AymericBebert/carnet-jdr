import {Component, input, signal} from '@angular/core';
import {Ability} from '../ability.model';

@Component({
  selector: 'app-ability-card',
  templateUrl: './ability-card.component.html',
  styleUrls: ['./ability-card.component.scss'],
  imports: [],
})
export class AbilityCardComponent {
  public readonly ability = input.required<Ability>();

  public readonly isOpen = signal<boolean>(false);
}
