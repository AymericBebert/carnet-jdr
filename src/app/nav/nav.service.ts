import {effect, inject, Injectable, signal} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {filter} from 'rxjs/operators';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {DeviceService} from '../service/device.service';
import {StorageService} from '../storage/storage.service';
import {UpdaterService} from '../updater/updater.service';
import {NavButtonsService} from './nav-buttons.service';

interface NavTool {
  name: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private readonly navButtonsService = inject(NavButtonsService);
  private readonly deviceService = inject(DeviceService);
  private readonly storageService = inject(StorageService);
  private readonly updater = inject(UpdaterService);
  private readonly config = inject<AppConfig>(APP_CONFIG);

  public readonly mainTitle = signal<string>('');
  public readonly pinSideNav = signal<boolean>(false);
  public readonly showBackButton = signal<boolean>(false);
  public readonly navButtons = signal<string[]>([]);
  public readonly navTools = signal<NavTool[]>([]);

  /** The sidenav element, used to access the sidenav state. Set by the AppComponent */
  public sideNav: MatSidenav | null = null;

  public readonly notificationBadge = signal<string>('');
  public readonly displayUpdatesAvailable = signal<boolean>(false);
  public readonly displayUpdatesActivated = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.deviceService.isHandset()) {
        this.setPinSideNav(false);
      }
    });

    this.updater.updatesAvailable$.pipe(filter(a => a)).subscribe(() => {
      this.notificationBadge.set('1');
      this.displayUpdatesAvailable.set(true);
    });

    this.updater.updatesActivated$.pipe(filter(a => a)).subscribe(() => {
      this.notificationBadge.set('1');
      this.displayUpdatesActivated.set(true);
    });
  }

  public setBackRouterLink(backRouterNavigate: string): void {
    this.navButtonsService.setBackRouterLink(backRouterNavigate);
  }

  public backClicked(): void {
    this.navButtonsService.backClicked();
  }

  public navButtonClicked(buttonId: string): void {
    this.navButtonsService.navButtonClicked(buttonId);
  }

  public setPinSideNav(b: boolean): void {
    this.storageService.setItem('pinSideNav', JSON.stringify(b));
    this.pinSideNav.set(b);
    if (b) {
      document.getElementsByTagName('html').item(0)?.setAttribute('sidenav', 'pinned');
    } else {
      document.getElementsByTagName('html').item(0)?.removeAttribute('sidenav');
    }
  }

  public applyStoredPinSideNav(): void {
    const pinSideNavFromStorage = this.storageService.getItem('pinSideNav');
    if (pinSideNavFromStorage && JSON.parse(pinSideNavFromStorage)) {
      this.setPinSideNav(true);
    }
  }

  public update(): void {
    this.updater.update();
  }

  public checkForUpdates(): void {
    console.log('checkForUpdates clicked');
    console.log(`Current version: ${this.config.version}`);
    void this.clearRefreshPage(false);
  }

  public async clearRefreshPage(alwaysRefresh = true): Promise<void> {
    console.log('checkForUpdates clicked');

    const keys = await window.caches.keys();
    console.log('Cache keys:', keys);

    if (alwaysRefresh || keys.length > 0) {
      const deleted = await Promise.all(keys.map(key => caches.delete(key)));
      console.log('Deleted?:', deleted);

      if (alwaysRefresh || deleted.some(d => d)) {
        this.refreshPage();
      }
    }
  }

  public refreshPage(): void {
    console.log('Refreshing page...');
    location.reload();
  }
}
