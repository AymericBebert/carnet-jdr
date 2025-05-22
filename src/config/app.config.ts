import {InjectionToken} from '@angular/core';

export interface AppConfig {
  version: string;
  websiteUrl: string;
  debugSocket: boolean;
  debugHttp: boolean;
  tokenLength: number;
}

export function appConfigFactory(): AppConfig {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const appConstants: AppConfig = (window as any).APP_CONFIG || {};
  return {
    version: appConstants.version || 'untagged',
    websiteUrl: appConstants.websiteUrl || 'http://localhost:4700',
    debugSocket: appConstants.debugSocket || false,
    debugHttp: appConstants.debugHttp || false,
    tokenLength: appConstants.tokenLength || 8,
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export interface EnvironmentConfig {
  production: boolean;
}
