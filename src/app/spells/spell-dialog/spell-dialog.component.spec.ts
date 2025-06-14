import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {spellsFr} from '../spells-fr';
import {SpellDialogComponent, SpellDialogData} from './spell-dialog.component';

describe('SpellDialogComponent', () => {
  let component: SpellDialogComponent;
  let fixture: ComponentFixture<SpellDialogComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        SpellDialogComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            spell: spellsFr[0],
          } satisfies SpellDialogData,
        },
      ],
    });

    fixture = TestBed.createComponent(SpellDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
