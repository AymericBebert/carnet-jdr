import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {SnackbarService} from '../../service/snackbar.service';
import {openAndParseJsonFile} from '../../utils/open-local-json-file';
import {CharacterFormComponent} from '../character-form/character-form.component';
import {Character, CharacterEditDto, toCharacter} from '../character.model';
import {CharacterService} from '../character.service';

@Component({
  selector: 'app-new-character-page',
  templateUrl: './new-character-page.component.html',
  styleUrls: ['./new-character-page.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CharacterFormComponent,
  ],
})
export class NewCharacterPageComponent {
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormControl<CharacterEditDto | null>(null, Validators.required);

  constructor() {
    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed())
      .subscribe(btn => {
        switch (btn) {
          case 'done':
            void this.create();
            break;
          case 'upload':
            void this.importCharacter();
            break;
        }
      });

    this.navService.mainTitle.set('Nouveau perso');

    this.destroyRef.onDestroy(() => {
      this.navService.mainTitle.set('');
    });
  }

  protected async create(): Promise<void> {
    const formValue = this.form.getRawValue();
    if (this.form.invalid || !formValue) {
      this.snackbar.openWarning('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    await this.characterService.createCharacter(formValue);
    void this.router.navigate(['..']);
  }

  private async importCharacter(): Promise<void> {
    try {
      const character = toCharacter(await openAndParseJsonFile() as Character);
      await this.characterService.createCharacter(character);
      void this.router.navigate(['..']);
    } catch (error) {
      console.error('Error loading JSON file:', error);
    }
  }
}
