import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NavButtonsService} from './nav-buttons.service';

describe('NavButtonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      provideZonelessChangeDetection(),
    ],
  }));

  it('should be created', () => {
    const service = TestBed.inject(NavButtonsService);
    expect(service).toBeTruthy();
  });
});
