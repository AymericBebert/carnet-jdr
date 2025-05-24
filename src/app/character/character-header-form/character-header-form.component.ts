import {Component, DestroyRef, forwardRef, inject, OnInit, signal} from '@angular/core';
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
import {CharacterCardComponent} from '../character-card/character-card.component';
import {
  CharacterClass,
  characterClasses,
  CharacterHeader,
  NewCharacterDto,
  toCharacterHeader
} from '../character.model';

@Component({
  selector: 'app-character-header-form',
  templateUrl: './character-header-form.component.html',
  styleUrls: ['./character-header-form.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    CharacterCardComponent,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CharacterHeaderFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => CharacterHeaderFormComponent)},
  ],
})
export class CharacterHeaderFormComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly preview = signal<CharacterHeader>(toCharacterHeader({}));
  protected readonly characterClasses = characterClasses;

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    image: new FormControl<string>('', {nonNullable: true}),
    theme: new FormControl<number>(0, {nonNullable: true}),
    game: new FormControl<string>('', {nonNullable: true}),
    class: new FormControl<CharacterClass>('Barde', {nonNullable: true}),
    hpMax: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    spellSlots: new FormArray<FormControl<number>>(
      new Array(10).fill(0).map(() => new FormControl(0, {nonNullable: true}))
    ),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const newCharacterDto = this.computeNewCharacterDto();
      this.preview.set({id: '', ...newCharacterDto});
      this.onChange(newCharacterDto);
    });
  }

  writeValue(obj: NewCharacterDto): void {
    if (!obj) {
      return;
    }
    this.form.patchValue(obj, {emitEvent: false});
    this.preview.set({id: '', ...this.computeNewCharacterDto()});
  }

  registerOnChange(fn: (_: NewCharacterDto) => void): void {
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
      return {characterHeaderInvalid: true};
    }
    return null;
  }

  protected changeLvlSlots(lvl: number, change: number): void {
    const ctrl = this.form.controls.spellSlots.controls[lvl];
    ctrl.setValue(Math.max(0, ctrl.value + change));
  }

  private computeNewCharacterDto(): NewCharacterDto {
    const formValue = this.form.getRawValue();
    return {
      name: formValue.name,
      image: formValue.image,
      theme: formValue.theme,
      game: formValue.game,
      class: formValue.class,
      hp: formValue.hpMax,
      hpMax: formValue.hpMax,
      skillWithSlots: [],
      spellSlots: formValue.spellSlots,
    };
  }

  private onChange: (_: NewCharacterDto) => void = (_: NewCharacterDto) => void 0;

  private onTouched: () => void = () => void 0;
}
