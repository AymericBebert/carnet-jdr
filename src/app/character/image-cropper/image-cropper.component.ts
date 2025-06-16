import {Component, effect, ElementRef, input, output, viewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
})
export class ImageCropperComponent {
  public readonly imageDataUri = input.required<string | null>();
  public readonly imageCropped = output<string | null>();

  private canvasElement = viewChild<ElementRef<HTMLCanvasElement>>('cropperCanvas');

  private sourceImage = new Image();

  private zoom = 1.0;
  private panX = 0;
  private panY = 0;

  protected readonly cropSize = 256;
  private readonly zoomStep = 0.05;
  private readonly panStep = 10;

  constructor() {
    this.sourceImage.onload = () => {
      this.resetToDefaultState();
      this.redrawCanvas();
    };

    effect(() => {
      this.sourceImage.src = this.imageDataUri() || '';
    });
  }

  zoomIn(): void {
    const oldZoom = this.zoom;
    this.zoom += this.zoomStep;

    this.compensatePanForZoom(oldZoom);
    this.redrawCanvas();
  }

  zoomOut(): void {
    const oldZoom = this.zoom;
    this.zoom = Math.max(0.1, this.zoom - this.zoomStep);

    this.compensatePanForZoom(oldZoom);
    this.redrawCanvas();
  }

  pan(dx: number, dy: number): void {
    this.panX += dx * this.panStep;
    this.panY += dy * this.panStep;
    this.redrawCanvas();
  }

  cropAndSave(): void {
    // Create a temporary canvas for the final cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.cropSize;
    tempCanvas.height = this.cropSize;
    const tempCtx = tempCanvas.getContext('2d')!;

    /*
     * Calculate the source rectangle (sx, sy, sWidth, sHeight) from the
     * original, full-resolution image that corresponds to what the user
     * has selected in the viewport.
    */

    // The top-left corner of the crop area in the source image's coordinate system
    const sx = -this.panX / this.zoom;
    const sy = -this.panY / this.zoom;

    // The width and height of the crop area in the source image's coordinate system
    const sWidth = this.cropSize / this.zoom;
    const sHeight = this.cropSize / this.zoom;

    // Draw the calculated portion of the source image onto our temporary canvas
    tempCtx.drawImage(
      this.sourceImage,
      sx, sy, sWidth, sHeight,  // Source rectangle
      0, 0, this.cropSize, this.cropSize // Destination rectangle
    );

    // Get the result as a data url
    this.imageCropped.emit(tempCanvas.toDataURL('image/png', 0.95));
  }

  cancel(): void {
    this.resetToDefaultState();
    this.redrawCanvas();
    this.imageCropped.emit(null);
  }

  /**
   * Resets the zoom and pan to fit the image within the canvas initially.
   */
  private resetToDefaultState(): void {
    this.panX = 0;
    this.panY = 0;

    // Default zoom to fit the image inside the crop area
    if (this.sourceImage.width > this.sourceImage.height) {
      this.zoom = this.cropSize / this.sourceImage.width;
    } else {
      this.zoom = this.cropSize / this.sourceImage.height;
    }

    // Center the image
    const scaledWidth = this.sourceImage.width * this.zoom;
    const scaledHeight = this.sourceImage.height * this.zoom;
    this.panX = (this.cropSize - scaledWidth) / 2;
    this.panY = (this.cropSize - scaledHeight) / 2;
  }

  /**
   * Redraws the canvas with the current image, zoom, and pan settings.
   */
  private redrawCanvas(): void {
    const canvas = this.canvasElement()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Calculate scaled dimensions
    const scaledWidth = this.sourceImage.width * this.zoom;
    const scaledHeight = this.sourceImage.height * this.zoom;

    // Draw the image with current pan and zoom
    ctx.drawImage(this.sourceImage, this.panX, this.panY, scaledWidth, scaledHeight);
    ctx.restore();
  }

  /**
   * Adjusts the pan values to keep the zoom centered on the canvas.
   * @param oldZoom The zoom level before the change.
   */
  private compensatePanForZoom(oldZoom: number): void {
    const center = this.cropSize / 2;
    const zoomRatio = this.zoom / oldZoom;

    // Find the point that was at the center of the canvas
    // and adjusts the pan to keep that same point at the center after zooming.
    this.panX = center - (center - this.panX) * zoomRatio;
    this.panY = center - (center - this.panY) * zoomRatio;
  }
}
