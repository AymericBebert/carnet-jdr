import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {toCharacter} from '../../character/character.model';
import {ConfigTestingModule} from '../../testing/config-testing.module';
import {UpdaterTestingModule} from '../../testing/updater-testing.module';
import {SpellsChoiceComponent} from './spells-choice.component';

describe('SpellsChoiceComponent', () => {
  let component: SpellsChoiceComponent;
  let fixture: ComponentFixture<SpellsChoiceComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SpellsChoiceComponent,
        ConfigTestingModule,
        UpdaterTestingModule,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {data: of({character: toCharacter({})})}},
      ],
    });

    fixture = TestBed.createComponent(SpellsChoiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
