import {HttpErrorResponse} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';
import {EMPTY, MonoTypeOperatorFunction, of, OperatorFunction} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly matSnackbar = inject(MatSnackBar);

  private readonly success = 'Operation success!';
  private readonly failure = 'Operation failed';

  public simpleSnackTap<T>(okMessage = '',
                           errorMessage = '',
                           logMessage = false,
                           duration = 3000,
  ): MonoTypeOperatorFunction<T> {
    return tap({
      next: () => this.openOk(okMessage, logMessage, duration),
      error: err => this.openError(errorMessage || this.getErrorText(err) || this.failure, err, duration),
      complete: () => void 0,
    });
  }

  public simpleSnackTapOnError<T>(message = '', duration = 3000): MonoTypeOperatorFunction<T> {
    return tap({
      next: () => void 0,
      error: err => this.openError(message, err, duration),
      complete: () => void 0,
    });
  }

  public simpleSnackCatchError<T, R = T>(text?: string, returnValue?: R): OperatorFunction<T, T | R> {
    return catchError(err => {
      this.openError(text || this.getErrorText(err) || this.failure, err);
      return returnValue !== undefined ? of(returnValue) : EMPTY;
    });
  }

  public openOk(message = '',
                logMessage = false,
                duration = 3000,
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (logMessage) {
      console.log(message);
    }
    return this.matSnackbar.open(message || this.success, undefined, {
      panelClass: 'ok',
      duration
    });
  }

  public openWarning(message = '',
                     warnDetails: any = '',
                     duration = 5000,
  ): MatSnackBarRef<TextOnlySnackBar> {
    console.warn(message || this.failure, warnDetails);
    return this.matSnackbar.open(message || this.failure, undefined, {panelClass: 'warning', duration});
  }

  public openError(message = '',
                   errorDetails: any = '',
                   duration = 5000,
  ): MatSnackBarRef<TextOnlySnackBar> {
    console.error(message || this.failure, errorDetails);
    return this.matSnackbar.open(message || this.failure, undefined, {panelClass: 'error', duration});
  }

  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  private getErrorText(err: any): string {
    if (typeof err === 'string' && err) {
      return err;
    }
    if (err instanceof HttpErrorResponse) {
      if (err.error?.message) {
        return `[${err.status}] ${err.error.message}`;
      }
      if (err.message) {
        return `[${err.status}] ${err.message}`;
      }
    }
    if (err?.error?.message && typeof err.error.message === 'string') {
      return err.error.message as string;
    }
    if (err?.message && typeof err.message === 'string') {
      return err.message as string;
    }
    return '';
  }
}
