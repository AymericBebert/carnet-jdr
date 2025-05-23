import {Component, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ActivatedRoute, Router} from '@angular/router';
import {NavService} from '../../nav/nav.service';
import {CharacterHeaderFormComponent} from '../character-header-form/character-header-form.component';
import {Character, NewCharacterDto, toCharacter, toCharacterHeader} from '../character.model';
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
    CharacterHeaderFormComponent,
  ],
})
export class EditCharacterPageComponent implements OnInit, OnDestroy {
  private readonly navService = inject(NavService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly character = signal<Character | null>(null);

  protected readonly form = new FormControl<NewCharacterDto | null>(null, Validators.required);

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const char: Character = toCharacter(data.character);
        this.character.set(char);
        this.form.setValue(toCharacterHeader(char));
        this.navService.mainTitle.set(`Modifier ${char.name}`);
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
    void this.router.navigate(['../..'], {relativeTo: this.activatedRoute});
  }

  protected async delete(): Promise<void> {
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
