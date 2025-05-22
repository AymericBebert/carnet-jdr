import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
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
  ],
})
export class NewCharacterPageComponent {
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    image: new FormControl<string>('', {nonNullable: true}),
    theme: new FormControl<string>('', {nonNullable: true}),
    game: new FormControl<string>('', {nonNullable: true}),
    hpMax: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
  });

  protected async create(): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.getRawValue();
    await this.characterService.createCharacter({
      name: formValue.name,
      image: formValue.image,
      theme: formValue.theme,
      game: formValue.game,
      hp: formValue.hpMax,
      hpMax: formValue.hpMax,
    });
    void this.router.navigate(['..']);
  }
}
