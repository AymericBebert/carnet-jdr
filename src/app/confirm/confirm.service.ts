import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {firstValueFrom, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {ConfirmDialogComponent, ConfirmDialogData} from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private readonly matDialog = inject(MatDialog);

  /**
   * Open a confirm dialog, and return the result as an observable
   * @param data The dialog content
   * @param filterTrue If true, only return true values
   */
  public confirm$(data: ConfirmDialogData = {}, filterTrue = false): Observable<boolean> {
    return this.matDialog.open(ConfirmDialogComponent, {data}).afterClosed().pipe(
      map(e => !!e),
      filter(e => !filterTrue || e),
    );
  }

  /**
   * Open a confirm dialog, and return the result as a promise
   * @param data The dialog content
   */
  public confirm(data: ConfirmDialogData = {}): Promise<boolean> {
    return firstValueFrom(this.confirm$(data, false));
  }
}
