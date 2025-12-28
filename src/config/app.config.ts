import {InjectionToken} from '@angular/core';

export interface AppConfig {
  version: string;
}

export function appConfigFactory(): AppConfig {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const appConstants: AppConfig = (window as any).APP_CONFIG || {};
  return {
    version: appConstants.version || 'dev',
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
