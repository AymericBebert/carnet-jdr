import {NgTemplateOutlet} from '@angular/common';
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-spell-level-header',
  templateUrl: './spell-level-header.component.html',
  styleUrls: ['./spell-level-header.component.scss'],
  imports: [
    NgTemplateOutlet
  ],
})
export class SpellLevelHeaderComponent {
  public readonly title = input.required();
  public readonly level = input(-1);
}
