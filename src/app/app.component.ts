import {Component, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ActivatedRoute, NavigationEnd, NavigationExtras, Router, RouterModule} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../config/app.config';
import {IconBookComponent} from './icons/icon-book.component';
import {NavButtonsService} from './nav/nav-buttons.service';
import {NavService} from './nav/nav.service';
import {DeviceService} from './service/device.service';
import {SettingsService} from './service/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    IconBookComponent,
  ],
})
export class AppComponent {
  readonly matIconReg = inject(MatIconRegistry);
  readonly navService = inject(NavService);
  readonly navButtonsService = inject(NavButtonsService);
  readonly settingsService = inject(SettingsService);
  readonly deviceService = inject(DeviceService);
  private readonly config = inject<AppConfig>(APP_CONFIG);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly appVersion = this.config.version;

  readonly navDrawer = viewChild<MatSidenav | null>('drawer');

  constructor() {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
    this.navService.applyStoredPinSideNav();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.routeFarthestChild),
        filter(r => r.outlet === 'primary'),
        mergeMap(r => r.data),
        takeUntilDestroyed(),
      )
      .subscribe(data => {
        this.navService.showBackButton.set(data.hasBack as boolean || !!data.backRouterNavigate);
        this.navService.navButtons.set(data.navButtons as string[] || []);
        this.navService.navTools.set(data.navTools as { name: string, icon: string }[] || []);
        this.navButtonsService.setBackRouterLink(data.backRouterNavigate as string);
      });

    this.route.queryParamMap
      .pipe(
        map(params => params.has('sidenav')),
        takeUntilDestroyed(),
      )
      .subscribe(qpOpen => {
        const navDrawer = this.navDrawer();
        if (!this.navService.pinSideNav() && navDrawer) {
          // If the sidenav should not be open, close it
          if (navDrawer.opened && !qpOpen) {
            void navDrawer.close();
          }
          // If there is the sidenav query param but the sidenav is not open, remove the query param
          if (!navDrawer.opened && qpOpen) {
            void this.router.navigate([], this.removeSidenavQueryParam);
          }
        }
      });
  }

  protected openDrawer(): void {
    const navDrawer = this.navDrawer();
    if (navDrawer) {
      if (!this.deviceService.isHandset()) {
        this.navService.setPinSideNav(true);
      }
      if (!this.navService.pinSideNav()) {
        void this.router.navigate([], this.addSidenavQueryParam);
      }
      void navDrawer.open();
    }
  }

  protected closeDrawer(): void {
    if (this.navDrawer()?.opened && !this.navService.pinSideNav()) {
      history.back();
    }
  }

  protected drawerToolClicked(icon: string): void {
    this.navButtonsService.navButtonClicked(
      icon,
      this.navService.pinSideNav() ? undefined : this.removeSidenavQueryParam,
    );
  }

  private get addSidenavQueryParam(): NavigationExtras {
    return {queryParams: {sidenav: true}, queryParamsHandling: 'merge'};
  }

  private get removeSidenavQueryParam(): NavigationExtras {
    return {replaceUrl: true, queryParams: {sidenav: null}, queryParamsHandling: 'merge'};
  }

  private get routeFarthestChild(): ActivatedRoute {
    let route = this.route;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
