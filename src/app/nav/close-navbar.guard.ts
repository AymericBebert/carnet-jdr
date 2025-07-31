import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChildFn, CanDeactivateFn, RouterStateSnapshot} from '@angular/router';
import {NavService} from './nav.service';

/**
 * Guard that checks if the navbar is open when navigating back in history.
 * If the navbar is open, it closes the navbar and prevents navigation.
 */
export const closeNavbarChildGuard: CanActivateChildFn = (
  _childRoute: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  return closeNavbarIfNeeded();
};

/**
 * Guard that checks if the navbar is open when navigating back in history.
 * If the navbar is open, it closes the navbar and prevents navigation.
 */
export const closeNavbarGuard: CanDeactivateFn<unknown> = (_component: unknown) => {
  return closeNavbarIfNeeded();
};

function closeNavbarIfNeeded(): boolean {
  console.log('closeNavbarIfNeeded');

  const navService = inject(NavService);
  console.log(navService.sideNav);

  if (!navService.pinSideNav() && navService.sideNav?.opened) {
    console.log('closing sideNav and prevent navigation');
    void navService.sideNav.close();
    return false;
  }

  return true;
}
