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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CharacterClass, characterClasses} from '../../character/character.model';
import {UpDownButtonComponent} from '../../utils/up-down-button/up-down-button.component';
import {getNewSpell, Spell} from '../spell.model';

interface SpellForForm extends Spell {
  duration: string;
}

@Component({
  selector: 'app-custom-spells-form',
  templateUrl: './custom-spells-form.component.html',
  styleUrls: ['./custom-spells-form.component.scss'],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    UpDownButtonComponent,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => CustomSpellsFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => CustomSpellsFormComponent)},
  ],
})
export class CustomSpellsFormComponent implements OnInit, ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly spells = signal<Spell[]>([]);
  protected readonly isEditing = signal<number>(-1);
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly isReordering = signal<boolean>(false);

  protected readonly form = new FormGroup({
    id: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    name: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    vo: new FormControl<string>('', {nonNullable: true}),
    level: new FormControl<number>(0, {nonNullable: true}),
    school: new FormControl<string>('', {nonNullable: true}),
    incantation: new FormControl<string>('', {nonNullable: true}),
    duration: new FormControl<string>('', {nonNullable: true}),
    range: new FormControl<string>('', {nonNullable: true}),
    verbal: new FormControl<boolean>(false, {nonNullable: true}),
    somatic: new FormControl<boolean>(false, {nonNullable: true}),
    material: new FormControl<boolean>(false, {nonNullable: true}),
    concentration: new FormControl<boolean>(false, {nonNullable: true}),
    ritual: new FormControl<boolean>(false, {nonNullable: true}),
    description: new FormControl<string>('', {nonNullable: true}),
    source: new FormControl<string>('', {nonNullable: true}),
    classes: new FormControl<CharacterClass[]>([], {nonNullable: true, validators: Validators.required}),
    details: new FormControl<string>('', {nonNullable: true}),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const isEditing = this.isEditing();
      if (isEditing === -1) {
        return;
      }
      const spells = [...this.spells()];
      spells[isEditing] = this.innerToOuter(this.form.getRawValue());
      this.spells.set(spells);
      this.onChange(spells);
    });
  }

  writeValue(obj: Spell[]): void {
    if (!obj) {
      return;
    }
    this.spells.set(obj);
    this.isEditing.set(-1);
  }

  registerOnChange(fn: (_: Spell[]) => void): void {
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
      return {spellsInvalid: true};
    }
    return null;
  }

  public addSpell(): void {
    const current = this.spells();
    const newSpell = getNewSpell({source: 'Perso', classes: [...characterClasses]});
    this.isEditing.set(current.length);
    this.spells.set([...current, newSpell]);
    this.form.setValue(this.outerToInner(newSpell));
  }

  public moveSpell(i: number, offset: number): void {
    const current = this.spells();
    if (i + offset < 0 || i + offset >= current.length) {
      return; // Out of bounds
    }
    const updated = [...current];
    const movedSpell = updated.splice(i, 1)[0];
    updated.splice(i + offset, 0, movedSpell);
    this.spells.set(updated);
    this.onChange(updated);
  }

  public editSpell(i: number): void {
    this.isEditing.set(i);
    this.form.setValue(this.outerToInner(this.spells()[i]), {emitEvent: false});
  }

  public deleteSpell(i: number): void {
    const current = this.spells();
    const updated = [...current];
    updated.splice(i, 1);
    this.isEditing.set(-1);
    this.spells.set(updated);
    this.onChange(updated);
  }

  private onChange: (_: Spell[]) => void = (_: Spell[]) => void 0;

  private onTouched: () => void = () => void 0;

  private innerToOuter(spell: SpellForForm): Spell {
    const {duration, details, ...spellRest} = spell;
    let newDetails = `<div class="ecole">niveau ${spell.level}${spell.school ? ` - ${spell.school}` : ''}</div>`;
    if (spell.incantation) {
      newDetails += `<div class="t"><strong>Temps d’incantation</strong> : ${spell.incantation}</div>`;
    }
    if (spell.range) {
      newDetails += `<div class="r"><strong>Portée</strong> : ${spell.range}</div>`;
    }
    const components = [
      spell.verbal ? 'V' : '',
      spell.somatic ? 'S' : '',
      spell.material ? 'M' : '',
    ].filter(c => !!c).join(', ');
    if (components) {
      newDetails += `<div class="c"><strong>Composantes</strong> : ${components}</div>`;
    }
    if (duration) {
      newDetails += `<div class="d"><strong>Durée</strong> : ${duration}</div>`;
    }
    if (details) {
      newDetails += `<div class="description"><p>${details.replaceAll('\n', '</p><p>')}</p></div>`;
    }
    return {
      ...spellRest,
      details: newDetails,
    };
  }

  private outerToInner(spell: Spell): SpellForForm {
    const durationMatch = spell.details.match(/<div class="d"><strong>Durée<\/strong> : (.*?)<\/div>/);
    const detailsMatch = spell.details.match(/<div class="description"><p>(.*?)<\/p><\/div>/);
    return {
      ...spell,
      duration: durationMatch ? durationMatch[1] : '',
      details: detailsMatch ? detailsMatch[1].replaceAll('</p><p>', '\n') : spell.details,
    };
  }
}
