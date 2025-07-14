import {Component, DestroyRef, forwardRef, inject, input, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {AbilitiesFormComponent} from '../../ability/abilities-form/abilities-form.component';
import {Ability} from '../../ability/ability.model';
import {CharacterCardComponent} from '../character-card/character-card.component';
import {
  CharacterClass,
  characterClasses,
  CharacterEditDto,
  CharacterHeader,
  toCharacterHeader
} from '../character.model';
import {ProfilePictureFormComponent} from '../profile-picture-form/profile-picture-form.component';
import {TinyNumberChoiceFormComponent} from '../tiny-number-choice-form/tiny-number-choice-form.component';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    CharacterCardComponent,
    AbilitiesFormComponent,
    TinyNumberChoiceFormComponent,
    ProfilePictureFormComponent,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CharacterFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => CharacterFormComponent)},
  ],
})
export class CharacterFormComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);
  private readonly beforeSaveActions: (() => void)[] = [];

  public readonly creationAid = input<boolean>(false);

  protected readonly preview = signal<CharacterHeader>(toCharacterHeader({}));
  protected readonly characterClasses = characterClasses;

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    image: new FormControl<string>('', {nonNullable: true}),
    theme: new FormControl<number>(0, {nonNullable: true}),
    game: new FormControl<string>('', {nonNullable: true}),
    class: new FormControl<CharacterClass>('Barde', {nonNullable: true}),
    hpMax: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    abilities: new FormControl<Ability[]>([], {nonNullable: true}),
    spellSlots: new FormArray<FormControl<number>>(
      new Array(10).fill(0).map(() => new FormControl(0, {nonNullable: true}))
    ),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const characterEditDto = this.computeCharacterEditDto();
      this.preview.set(toCharacterHeader(characterEditDto));
      this.onChange(characterEditDto);
    });
  }

  writeValue(obj: CharacterEditDto): void {
    if (!obj) {
      return;
    }
    this.form.patchValue(obj, {emitEvent: false});
    this.preview.set(toCharacterHeader(this.computeCharacterEditDto()));
  }

  registerOnChange(fn: (_: CharacterEditDto) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled && this.form.enabled) {
      this.form.disable();
    } else if (!isDisabled && this.form.disabled) {
      this.form.enable();
    }
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.form.invalid) {
      return {characterInvalid: true};
    }
    return null;
  }

  get pristine(): boolean {
    return this.beforeSaveActions.length === 0;
  }

  applyBeforeSaveActions(): void {
    this.beforeSaveActions.forEach(action => action());
  }

  addBeforeSaveAction(action: () => void): void {
    this.beforeSaveActions.push(action);
  }

  removeBeforeSaveAction(action: () => void): void {
    const index = this.beforeSaveActions.indexOf(action);
    if (index !== -1) {
      this.beforeSaveActions.splice(index, 1);
    }
  }

  private computeCharacterEditDto(): CharacterEditDto {
    const formValue = this.form.getRawValue();
    return {
      name: formValue.name,
      image: formValue.image,
      theme: formValue.theme,
      game: formValue.game,
      class: formValue.class,
      hpMax: formValue.hpMax,
      abilities: formValue.abilities,
      spellSlots: formValue.spellSlots,
    };
  }

  private onChange: (_: CharacterEditDto) => void = (_: CharacterEditDto) => void 0;

  private onTouched: () => void = () => void 0;
}
