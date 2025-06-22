import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FilterableSpellsListComponent} from './filterable-spells-list.component';

describe('FilterableSpellsListComponent', () => {
  let component: FilterableSpellsListComponent;
  let fixture: ComponentFixture<FilterableSpellsListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        FilterableSpellsListComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(FilterableSpellsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
