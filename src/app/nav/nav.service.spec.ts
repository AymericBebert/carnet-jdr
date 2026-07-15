import {provideZonelessChangeDetection} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ConfigTestingModule} from '../testing/config-testing.module';
import {UpdaterTestingModule} from '../testing/updater-testing.module';
import {NavService} from './nav.service';

describe('NavService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ConfigTestingModule,
      UpdaterTestingModule,
    ],
    providers: [
      provideZonelessChangeDetection(),
    ],
  }));

  it('should be created', () => {
    const service = TestBed.inject(NavService);
    expect(service).toBeTruthy();
  });
});
