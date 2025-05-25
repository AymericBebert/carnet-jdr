import {Component, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SlotsFormComponent} from '../../slots/slots-form/slots-form.component';
import {Ability} from '../ability.model';

@Component({
  selector: 'app-ability-card',
  templateUrl: './ability-card.component.html',
  styleUrls: ['./ability-card.component.scss'],
  imports: [
    SlotsFormComponent,
    FormsModule,
  ],
})
export class AbilityCardComponent {
  public readonly ability = input.required<Ability>();
  public readonly usage = input<number>(0);
  public readonly usageChange = output<number>();

  public readonly isOpen = signal<boolean>(false);
}
