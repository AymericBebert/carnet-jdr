import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {toCharacter} from '../../character/character.model';
import {ConfigTestingModule} from '../../testing/config-testing.module';
import {UpdaterTestingModule} from '../../testing/updater-testing.module';
import {SpellsListPageComponent} from './spells-list-page.component';

describe('SpellsListPageComponent', () => {
  let component: SpellsListPageComponent;
  let fixture: ComponentFixture<SpellsListPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SpellsListPageComponent,
        ConfigTestingModule,
        UpdaterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {data: of({character: toCharacter({})})}},
      ],
    });

    fixture = TestBed.createComponent(SpellsListPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
