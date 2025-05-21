import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly canShare = window.navigator !== null && window.navigator.share !== undefined;

  public shareOrCopy(title: string, text: string, url: string): void {
    if (this.canShare) {
      void window.navigator.share({title, text, url});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        this.snackBar.open(`Copié: ${url}`, '', {duration: 3000});
      });
    }
  }
}
