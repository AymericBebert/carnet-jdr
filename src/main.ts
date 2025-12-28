import {provideHttpClient, withFetch} from '@angular/common/http';
import {isDevMode, provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withRouterConfig} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {APP_CONFIG, appConfigFactory} from './config/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'})),
    provideHttpClient(withFetch()),
    {provide: APP_CONFIG, useFactory: appConfigFactory},
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}).catch((err) => console.error(err));
