import {Component, DestroyRef, forwardRef, inject, OnInit, signal} from '@angular/core';
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
  Validator,
  Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {UpDownButtonComponent} from '../../utils/up-down-button/up-down-button.component';
import {Ability, AbilityRefillTrigger, getNewAbility} from '../ability.model';

@Component({
  selector: 'app-character-abilities-form',
  templateUrl: './abilities-form.component.html',
  styleUrls: ['./abilities-form.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    UpDownButtonComponent,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => AbilitiesFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => AbilitiesFormComponent)},
  ],
})
export class AbilitiesFormComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly abilities = signal<Ability[]>([]);
  protected readonly isEditing = signal<number>(-1);
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly isReordering = signal<boolean>(false);

  protected readonly form = new FormGroup({
    id: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    image: new FormControl<string>('', {nonNullable: true}),
    description: new FormControl<string>('', {nonNullable: true}),
    details: new FormControl<string>('', {nonNullable: true}),
    maxSlots: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    refillWhen: new FormControl<AbilityRefillTrigger>('longRest', {nonNullable: true}),
    refillDie: new FormControl<number>(0, {nonNullable: true, validators: [Validators.min(0)]}),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const isEditing = this.isEditing();
      if (isEditing === -1) {
        return;
      }
      const abilities = [...this.abilities()];
      abilities[isEditing] = this.form.getRawValue();
      this.abilities.set(abilities);
      this.onChange(abilities);
    });
  }

  writeValue(obj: Ability[]): void {
    if (!obj) {
      return;
    }
    this.abilities.set(obj);
    this.isEditing.set(-1);
  }

  registerOnChange(fn: (_: Ability[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.isEditing() !== -1 && this.form.invalid) {
      return {abilitiesInvalid: true};
    }
    return null;
  }

  public addAbility(): void {
    const current = this.abilities();
    const newAbility = getNewAbility();
    this.isEditing.set(current.length);
    this.abilities.set([...current, newAbility]);
    this.form.setValue(newAbility);
  }

  public moveAbility(i: number, offset: number): void {
    const current = this.abilities();
    if (i + offset < 0 || i + offset >= current.length) {
      return; // Out of bounds
    }
    const updated = [...current];
    const movedAbility = updated.splice(i, 1)[0];
    updated.splice(i + offset, 0, movedAbility);
    this.abilities.set(updated);
    this.onChange(updated);
  }

  public editAbility(i: number): void {
    this.isEditing.set(i);
    this.form.setValue(this.abilities()[i], {emitEvent: false});
  }

  public deleteAbility(i: number): void {
    const current = this.abilities();
    const updated = [...current];
    updated.splice(i, 1);
    this.isEditing.set(-1);
    this.abilities.set(updated);
    this.onChange(updated);
  }

  private onChange: (_: Ability[]) => void = (_: Ability[]) => void 0;

  private onTouched: () => void = () => void 0;
}
