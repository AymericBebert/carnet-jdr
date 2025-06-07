import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TinyNumberChoiceFormComponent} from './tiny-number-choice-form.component';

describe('TinyNumberChoiceFormComponent', () => {
  let component: TinyNumberChoiceFormComponent;
  let fixture: ComponentFixture<TinyNumberChoiceFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TinyNumberChoiceFormComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(TinyNumberChoiceFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
