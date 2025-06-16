import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImageCropperComponent} from './image-cropper.component';

describe('ImageCropperComponent', () => {
  let component: ImageCropperComponent;
  let fixture: ComponentFixture<ImageCropperComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ImageCropperComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(ImageCropperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageDataUri', '');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
