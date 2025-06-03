import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UpDownButtonComponent} from './up-down-button.component';

describe('UpDownButtonComponent', () => {
  let component: UpDownButtonComponent;
  let fixture: ComponentFixture<UpDownButtonComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        UpDownButtonComponent,
      ],
      declarations: [],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(UpDownButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
