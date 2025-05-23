import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideExperimentalZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {EMPTY} from 'rxjs';
import {NewCharacterPageComponent} from './new-character-page.component';

describe('NewCharacterPageComponent', () => {
  let component: NewCharacterPageComponent;
  let fixture: ComponentFixture<NewCharacterPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NewCharacterPageComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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
