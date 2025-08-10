import {NgTemplateOutlet} from '@angular/common';
import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'app-spell-level-header',
  templateUrl: './spell-level-header.component.html',
  styleUrls: ['./spell-level-header.component.scss'],
  imports: [
    NgTemplateOutlet,
  ],
})
export class SpellLevelHeaderComponent {
  public readonly title = input.required();
  public readonly level = input(-1);
  public readonly theme = input(0);

  protected readonly gemColor = computed<string>(() => {
    return `hsl(${this.theme() / 100 * 360} 100% 50%)`;
  });
}
