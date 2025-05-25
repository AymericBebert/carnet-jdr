import {ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {NavButtonsService} from '../../nav/nav-buttons.service';
import {NavService} from '../../nav/nav.service';
import {openAndParseJsonFile} from '../../utils/open-local-json-file';
import {CharacterFormComponent} from '../character-form/character-form.component';
import {Character, CharacterEditDto, toCharacterEditDto} from '../character.model';
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
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormControl<CharacterEditDto | null>(null, Validators.required);

  ngOnInit(): void {
    this.navService.mainTitle.set('Nouveau personnage');

    this.navButtonsService.navButtonClicked$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(btn => {
        switch (btn) {
          case 'upload':
            void this.importCharacter();
            break;
        }
      });
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

  private async importCharacter(): Promise<void> {
    try {
      const data = toCharacterEditDto(await openAndParseJsonFile() as Character);
      this.form.setValue(data);
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error loading JSON file:', error);
    }
  }
}
