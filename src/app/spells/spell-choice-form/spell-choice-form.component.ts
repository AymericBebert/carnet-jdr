import {Component, DestroyRef, forwardRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {SpellChoice} from '../spell.model';

@Component({
  selector: 'app-spell-choice-form',
  templateUrl: './spell-choice-form.component.html',
  styleUrls: ['./spell-choice-form.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatMenuModule,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => SpellChoiceFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => SpellChoiceFormComponent)},
  ],
})
export class SpellChoiceFormComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = new FormGroup({
    known: new FormControl<boolean>(false, {nonNullable: true}),
    prepared: new FormControl<boolean>(false, {nonNullable: true}),
    alwaysPrepared: new FormControl<boolean>(false, {nonNullable: true}),
    favorite: new FormControl<boolean>(false, {nonNullable: true}),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.onChange(this.form.getRawValue());
    });
  }

  writeValue(obj: SpellChoice): void {
    this.form.patchValue(obj || {});
  }

  registerOnChange(fn: (_: SpellChoice) => void): void {
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
      return {spellChoiceInvalid: true};
    }
    return null;
  }

  private onChange: (_: SpellChoice) => void = (_: SpellChoice) => void 0;

  private onTouched: () => void = () => void 0;
}
