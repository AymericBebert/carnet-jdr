import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProfilePictureFormComponent} from './profile-picture-form.component';

describe('ProfilePictureFormComponent', () => {
  let component: ProfilePictureFormComponent;
  let fixture: ComponentFixture<ProfilePictureFormComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ProfilePictureFormComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(ProfilePictureFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
