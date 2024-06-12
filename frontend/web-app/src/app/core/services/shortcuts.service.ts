import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {
  private shortcuts: { [key: string]: () => void } = {};
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isBrowser && this.listenToKeyboardEvents();
  }

  private listenToKeyboardEvents() {
    window.addEventListener('keydown', (event) => {
      const key = this.getKey(event);
      if (this.shortcuts[key]) {
        event.preventDefault();
        this.shortcuts[key]();
      }
    });
  }

  private getKey(event: KeyboardEvent): string {
    let key = '';
    if (event.ctrlKey) key += 'Ctrl+';
    if (event.shiftKey) key += 'Shift+';
    if (event.altKey) key += 'Alt+';
    key += event.key;
    return key;
  }

  registerShortcut(key: string, callback: () => void) {
    this.shortcuts[key] = callback;
  }

  unregisterShortcut(key: string) {
    delete this.shortcuts[key];
  }

  logShortcuts = () => console.log(this.shortcuts);
}
