import {Component, computed, inject, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {SettingsService} from '../../service/settings.service';
import {CharacterHeader} from '../character.model';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  imports: [
    MatIconModule,
  ],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[style.background-color]': 'backgroundColor()',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[style.border-color]': 'borderColor()',
  },
})
export class CharacterCardComponent {
  readonly settingsService = inject(SettingsService);

  public readonly character = input.required<CharacterHeader>();

  protected readonly backgroundColor = computed<string>(() => {
    const darkMode = this.settingsService.darkMode();
    const characterTheme = this.character().theme;
    // return `oklch(${darkMode ? '0.1' : '0.98'} 0.3 ${characterTheme / 100 * 360})`;
    return `hsl(${characterTheme / 100 * 360} 80% ${darkMode ? '10%' : '93%'})`;
  });

  protected readonly borderColor = computed<string>(() => {
    const darkMode = this.settingsService.darkMode();
    const characterTheme = this.character().theme;
    // return `oklch(${darkMode ? '0.1' : '0.9'} 0.2 ${characterTheme / 100 * 360})`;
    return `hsl(${characterTheme / 100 * 360} 80% ${darkMode ? '18%' : '88%'})`;
  });
}
