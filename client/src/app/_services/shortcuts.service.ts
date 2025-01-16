import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DevService } from 'src/app/_services/dev.service';
import { SidebarService } from 'src/app/_services/sidebar.service';
import { ThemeService } from 'src/app/_services/theme.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly validation = inject(ValidationService);
  private readonly dev = inject(DevService);
  private readonly sidebar = inject(SidebarService);

  /**
   * Dictionary of shortcuts,
   * Key: e.g. "ctrl+p", "ctrl+shift+l", etc.
   * Value: the callback function to invoke
   */
  private shortcuts: Record<string, () => void> = {};

  constructor() {
    this.listenToKeyboardEvents();
    this.initializeDefaultShortcuts();
  }

  /**
   * Register a shortcut or multiple shortcuts for the same callback.
   * @param key - single key string, or an array of key strings
   * @param callback - function to run when key is pressed
   */
  registerShortcut(key: string | string[], callback: () => void): void {
    if (Array.isArray(key)) {
      // Register each key in the array
      key.forEach(k => {
        this.shortcuts[this.normalizeShortcutKey(k)] = callback;
      });
    } else {
      // Register single key
      this.shortcuts[this.normalizeShortcutKey(key)] = callback;
    }
  }

  /**
   * Remove a shortcut by its key.
   * @param key - the key combo to remove
   */
  unregisterShortcut(key: string): void {
    delete this.shortcuts[this.normalizeShortcutKey(key)];
  }

  /**
   * Converts e.g. "Ctrl+P" -> "ctrl+p"
   */
  private normalizeShortcutKey(key: string): string {
    return key.toLowerCase();
  }

  /**
   * Extracts the pressed combination from a KeyboardEvent,
   * also normalized to lowercase
   */
  private getPressedCombination(event: KeyboardEvent): string {
    let combo = '';
    if (event.ctrlKey) { combo += 'ctrl+'; }
    if (event.shiftKey) { combo += 'shift+'; }
    if (event.altKey) { combo += 'alt+'; }
    // Convert the actual pressed key to lowercase
    combo += event.key.toLowerCase();
    return combo;
  }

  /**
   * Global listener for `keydown` events.
   * Checks if there is a registered shortcut for the pressed combination.
   */
  private listenToKeyboardEvents(): void {
    window.addEventListener('keydown', event => {
      const combo = this.getPressedCombination(event);
      const shortcutCallback = this.shortcuts[combo];
      if (shortcutCallback) {
        event.preventDefault();
        shortcutCallback();
      }
    });
  }

  /**
   * Register all default shortcuts.
   * You can keep them in an array or directly inline them here.
   */
  private initializeDefaultShortcuts(): void {
    this.registerShortcut('ctrl+,', this.showSettingsModal);
    this.registerShortcut([ 'ctrl+p', 'ctrl+P' ], this.focusOnSearchBar);
    this.registerShortcut([ 'ctrl+m', 'ctrl+M' ], this.toggleTheme);
    this.registerShortcut([ 'ctrl+b', 'ctrl+B' ], this.toggleSidebar);
    this.registerShortcut([ 'ctrl+h', 'ctrl+H' ], this.navigateToHome);
    this.registerShortcut([ 'ctrl+i', 'ctrl+I' ], this.navigateToAdmin);
    this.registerShortcut([ 'ctrl+k', 'ctrl+K' ], this.showShortcutsModal);
    this.registerShortcut([ 'ctrl+shift+l', 'ctrl+shift+L' ], this.logout);
    this.registerShortcut([ 'ctrl+alt+l', 'ctrl+alt+L' ], this.navigateToLogin);
    this.registerShortcut([ 'ctrl+alt+f', 'ctrl+alt+F' ], this.toggleFormsValidationMode);
    this.registerShortcut([ 'ctrl+alt+d', 'ctrl+alt+D' ], this.toggleDevMode);
    this.registerShortcut([ 'ctrl+alt+t', 'ctrl+alt+T' ], this.toggleCompactTableMode);
  }

  // ==============
  // ACTION METHODS
  // ==============

  private showSettingsModal = () => {
    // TODO: implement showing the modal
  };

  private focusOnSearchBar = () => {
    // TODO: implement focusing on search bar
  };

  private toggleTheme = () => {
    this.theme.cycle();
  };

  private toggleSidebar = () => {
    this.sidebar.toggle();
  };

  private navigateToHome = () => {
    // Navigate or handle home route
  };

  private navigateToAdmin = async () => {
    return this.router.navigate([ '/admin' ]);
  };

  private showShortcutsModal = () => {
    // TODO: implement showing shortcuts modal
  };

  private logout = () => {
    // TODO: implement logout
  };

  private navigateToLogin = () => {
    this.router.navigate([ '/auth/login' ], { queryParams: { returnUrl: this.router.url } });
  };

  private toggleFormsValidationMode = () => {
    this.validation.toggle();
  };

  private toggleDevMode = () => {
    this.dev.toggle();
  };

  private toggleCompactTableMode = () => {
    // TODO: implement toggling compact table mode
  };
}
