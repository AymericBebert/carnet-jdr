import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {toCharacter} from '../character.model';
import {CharacterCardComponent} from './character-card.component';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CharacterCardComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    });

    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('character', toCharacter({}));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
