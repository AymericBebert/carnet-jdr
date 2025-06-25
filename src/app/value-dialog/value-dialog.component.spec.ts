import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ValueDialogComponent, ValueDialogData} from './value-dialog.component';

describe('ValueDialogComponent', () => {
  let component: ValueDialogComponent;
  let fixture: ComponentFixture<ValueDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ValueDialogComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            label: 'Test label',
          } satisfies ValueDialogData,
        },
      ],
    });

    fixture = TestBed.createComponent(ValueDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
