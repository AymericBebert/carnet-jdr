import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {toCharacter} from '../character.model';
import {CharacterRootComponent} from './character-root.component';

describe('CharacterRootComponent', () => {
  let component: CharacterRootComponent;
  let fixture: ComponentFixture<CharacterRootComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CharacterRootComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {data: of({character: toCharacter({})})}},
      ],
    });

    fixture = TestBed.createComponent(CharacterRootComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
