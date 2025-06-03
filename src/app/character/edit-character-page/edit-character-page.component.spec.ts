import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {ConfigTestingModule} from '../../testing/config-testing.module';
import {UpdaterTestingModule} from '../../testing/updater-testing.module';
import {CharacterRootComponent} from '../character-root/character-root.component';
import {toCharacter} from '../character.model';
import {EditCharacterPageComponent} from './edit-character-page.component';

describe('EditCharacterPageComponent', () => {
  let component: EditCharacterPageComponent;
  let fixture: ComponentFixture<EditCharacterPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        EditCharacterPageComponent,
        ConfigTestingModule,
        UpdaterTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {data: of({character: toCharacter({})})}},
        CharacterRootComponent,
      ],
    });

    fixture = TestBed.createComponent(EditCharacterPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
