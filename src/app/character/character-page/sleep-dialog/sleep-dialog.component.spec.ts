import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {toCharacter} from '../../character.model';
import {SleepDialogComponent, SleepDialogData} from './sleep-dialog.component';

describe('SleepDialogComponent', () => {
  let component: SleepDialogComponent;
  let fixture: ComponentFixture<SleepDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        SleepDialogComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            character: toCharacter({}),
          } satisfies SleepDialogData,
        },
      ],
    });

    fixture = TestBed.createComponent(SleepDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
