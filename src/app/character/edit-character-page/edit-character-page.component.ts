import {Component, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {CharacterFormComponent} from '../character-form/character-form.component';
import {Character, CharacterEditDto, toCharacter, toCharacterEditDto} from '../character.model';
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
export class EditCharacterPageComponent implements OnInit, OnDestroy {
  private readonly navService = inject(NavService);
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = signal<Character | null>(null);

  protected readonly form = new FormControl<CharacterEditDto | null>(null, Validators.required);

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const char: Character = toCharacter(data.character);
        this.character.set(char);
        this.form.setValue(toCharacterEditDto(char));
        this.navService.mainTitle.set(`Modifier ${char.name}`);
      });

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        switch (btn) {
          case 'delete':
            void this.delete();
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.navService.mainTitle.set('');
  }

  protected async save(): Promise<void> {
    const formValue = this.form.getRawValue();
    const character = this.character();
    if (this.form.invalid || !formValue || !character) {
      return;
    }
    await this.characterService.updateCharacter(character.id, formValue);
    void this.router.navigate(['../..', 'character', character.id], {relativeTo: this.activatedRoute});
  }

  private async delete(): Promise<void> {
    const character = this.character();
    if (!character) {
      return;
    }
    const deleted = await this.characterService.deleteCharacter(character);
    if (deleted) {
      void this.router.navigate(['../..'], {relativeTo: this.activatedRoute});
    }
  }
}
