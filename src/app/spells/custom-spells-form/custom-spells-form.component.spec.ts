import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CustomSpellsFormComponent} from './custom-spells-form.component';

describe('CustomSpellsFormComponent', () => {
  let component: CustomSpellsFormComponent;
  let fixture: ComponentFixture<CustomSpellsFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CustomSpellsFormComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(CustomSpellsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
