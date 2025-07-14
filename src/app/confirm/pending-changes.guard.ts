import {inject} from '@angular/core';
import {CanDeactivateFn} from '@angular/router';
import {ConfirmService} from './confirm.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

/**
 * Guard that checks if the user has pending changes, if so, it asks the user to confirm before exiting the page
 */
export const pendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component: ComponentCanDeactivate) => {
  if (!component.canDeactivate) {
    console.error('Component does not implement ComponentCanDeactivate', component);
    return true;
  }
  return component.canDeactivate() ?
    true :
    // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
    // when navigating away from your angular app, the browser will show a generic warning message
    inject(ConfirmService).confirm$({
      title: 'Quitter la page ?',
      description: 'Les modifications non enregistrées seront perdues',
      yesText: 'Quitter sans enregistrer',
      noText: 'Rester',
    });
};
