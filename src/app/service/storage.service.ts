import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage: Storage;

  constructor() {
    try {
      if (localStorage !== null) {
        this.storage = localStorage;
        return;
      }
    } catch {
      console.warn('Could not access localStorage, trying sessionStorage');
    }

    try {
      if (sessionStorage !== null) {
        this.storage = sessionStorage;
        return;
      }
    } catch {
      console.warn('Could not access sessionStorage, using VolatileStorage');
    }

    this.storage = new VolatileStorage();
  }

  public setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }
}

class VolatileStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}
