import {Component, DestroyRef, effect, HostListener, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentCanDeactivate} from '../../confirm/pending-changes.guard';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {CharacterFormComponent} from '../character-form/character-form.component';
import {CharacterRootComponent} from '../character-root/character-root.component';
import {CharacterEditDto, toCharacterEditDto} from '../character.model';
import {CharacterService} from '../character.service';

@Component({
  selector: 'app-edit-character-page',
  templateUrl: './edit-character-page.component.html',
  styleUrls: ['./edit-character-page.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    CharacterFormComponent,
  ],
})
export class EditCharacterPageComponent implements ComponentCanDeactivate {
  private readonly characterRoot = inject(CharacterRootComponent);
  private readonly characterService = inject(CharacterService);
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = this.characterRoot.character;

  protected readonly form = new FormControl<CharacterEditDto | null>(null, Validators.required);

  private readonly characterForm = viewChild(CharacterFormComponent);

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return this.form.pristine && (this.characterForm()?.pristine ?? true);
  }

  constructor() {
    effect(() => {
      const char = this.character();
      if (!char) return;
      this.form.setValue(toCharacterEditDto(char));
      this.navService.mainTitle.set(`Modifier ${char.name}`);
    });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        switch (btn) {
          case 'done':
            void this.save();
            break;
          case 'delete':
            void this.delete();
            break;
        }
      });

    this.destroyRef.onDestroy(() => {
      this.navService.mainTitle.set('');
    });
  }

  protected async save(): Promise<void> {
    this.characterForm()?.applyBeforeSaveActions();
    const formValue = this.form.getRawValue();
    const character = this.character();
    if (this.form.invalid || !formValue || !character) {
      return;
    }
    await this.characterService.updateCharacter(character.id, formValue);
    this.form.markAsPristine();
    void this.router.navigate(['..'], {relativeTo: this.route});
  }

  private async delete(): Promise<void> {
    const character = this.character();
    if (!character) {
      return;
    }
    const deleted = await this.characterService.deleteCharacter(character);
    if (deleted) {
      this.form.markAsPristine();
      void this.router.navigate(['../..'], {relativeTo: this.route});
    }
  }
}
