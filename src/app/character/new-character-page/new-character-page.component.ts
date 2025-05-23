import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {CharacterHeaderFormComponent} from '../character-header-form/character-header-form.component';
import {NewCharacterDto} from '../character.model';
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
    CharacterHeaderFormComponent,
  ],
})
export class NewCharacterPageComponent {
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);

  protected readonly form = new FormControl<NewCharacterDto | null>(null, Validators.required);

  protected async create(): Promise<void> {
    const formValue = this.form.getRawValue();
    if (this.form.invalid || !formValue) {
      return;
    }
    await this.characterService.createCharacter(formValue);
    void this.router.navigate(['..']);
  }
}
