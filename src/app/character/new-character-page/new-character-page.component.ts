import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {NavService} from '../../nav/nav.service';
import {CharacterFormComponent} from '../character-form/character-form.component';
import {CharacterEditDto} from '../character.model';
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
export class NewCharacterPageComponent implements OnInit, OnDestroy {
  private readonly navService = inject(NavService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);

  protected readonly form = new FormControl<CharacterEditDto | null>(null, Validators.required);

  ngOnInit(): void {
    this.navService.mainTitle.set('Nouveau personnage');
  }

  ngOnDestroy(): void {
    this.navService.mainTitle.set('');
  }

  protected async create(): Promise<void> {
    const formValue = this.form.getRawValue();
    if (this.form.invalid || !formValue) {
      return;
    }
    await this.characterService.createCharacter(formValue);
    void this.router.navigate(['..']);
  }
}
