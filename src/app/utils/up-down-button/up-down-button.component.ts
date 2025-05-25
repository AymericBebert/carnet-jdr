import {Component, input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-up-down-button',
  templateUrl: './up-down-button.component.html',
  styleUrls: ['./up-down-button.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
})
export class UpDownButtonComponent {
  public readonly disableUp = input<boolean>(false);
  public readonly disableDown = input<boolean>(false);
  public readonly up = output<void>();
  public readonly down = output<void>();
}
