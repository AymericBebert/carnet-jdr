import {Component, DestroyRef, ElementRef, forwardRef, inject, signal, viewChild} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {ImageCropperComponent} from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss'],
  imports: [
    ImageCropperComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => ProfilePictureFormComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => ProfilePictureFormComponent)},
  ],
})
export class ProfilePictureFormComponent implements ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly picture = signal<string>('');
  protected readonly isTakingPicture = signal<boolean>(false);
  protected readonly rawImageDataUri = signal<string | null>(null);
  protected readonly isDisabled = signal<boolean>(false);

  private videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private canvasElement = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');
  private stream: MediaStream | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopStream());
  }

  writeValue(obj: string): void {
    if (!obj) {
      return;
    }
    this.picture.set(obj);
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.rawImageDataUri.set(URL.createObjectURL(input.files[0]));
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          frameRate: {ideal: 30},
          width: {min: 256, ideal: 512, max: 1024},
          height: {min: 256, ideal: 512, max: 1024},
          aspectRatio: {ideal: 1},
        },
      });
      const video = this.videoElement();
      if (!video) {
        console.error('Video or canvas element not found');
        return;
      }
      this.rawImageDataUri.set(null);
      this.isTakingPicture.set(true);
      video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Error accessing the camera', err);
    }
  }

  takePicture(): void {
    const video = this.videoElement()?.nativeElement;
    const canvas = this.canvasElement()?.nativeElement;
    if (!video || !canvas) {
      console.error('Video or canvas element not found');
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Took picture:', canvas);
      this.rawImageDataUri.set(canvas.toDataURL('image/png', 0.95));
      this.isTakingPicture.set(false);
      this.stopStream();
    }
  }

  onImageCropped(croppedImage: string | null): void {
    if (croppedImage) {
      this.picture.set(croppedImage);
      this.onChange(croppedImage);
    }
    this.rawImageDataUri.set(null);
  }

  deletePicture(): void {
    this.picture.set('');
    this.onChange('');
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private onChange: (_: string) => void = (_: string) => void 0;

  private onTouched: () => void = () => void 0;
}
