import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SpellChoiceFormComponent} from './spell-choice-form.component';

describe('SpellChoiceFormComponent', () => {
  let component: SpellChoiceFormComponent;
  let fixture: ComponentFixture<SpellChoiceFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SpellChoiceFormComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(SpellChoiceFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
