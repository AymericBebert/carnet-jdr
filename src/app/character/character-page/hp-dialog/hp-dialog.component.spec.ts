import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HpDialogComponent, HpDialogData} from './hp-dialog.component';

describe('HpDialogComponent', () => {
  let component: HpDialogComponent;
  let fixture: ComponentFixture<HpDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HpDialogComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: MatDialogRef, useValue: {close: () => void 0}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            label: 'Test label',
          } satisfies HpDialogData,
        },
      ],
    });

    fixture = TestBed.createComponent(HpDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
