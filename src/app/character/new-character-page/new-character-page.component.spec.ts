import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {ConfigTestingModule} from '../../testing/config-testing.module';
import {UpdaterTestingModule} from '../../testing/updater-testing.module';
import {NewCharacterPageComponent} from './new-character-page.component';

describe('NewCharacterPageComponent', () => {
  let component: NewCharacterPageComponent;
  let fixture: ComponentFixture<NewCharacterPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NewCharacterPageComponent,
        ConfigTestingModule,
        UpdaterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    });

    fixture = TestBed.createComponent(NewCharacterPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
