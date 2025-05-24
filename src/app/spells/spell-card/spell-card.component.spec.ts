import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {spellsFr} from '../spells-fr';
import {SpellCardComponent} from './spell-card.component';

describe('SpellCardComponent', () => {
  let component: SpellCardComponent;
  let fixture: ComponentFixture<SpellCardComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SpellCardComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    });

    fixture = TestBed.createComponent(SpellCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('spell', spellsFr[0]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
