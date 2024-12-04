/*

    K E Y B O A R D   S H O R T C U T S

    U T I L S

    Ctrl + , --> Show settings modal
    Ctrl + p --> Focus on search bar
    Ctrl + m --> Toggle theme
    Ctrl + b --> Toggle sidebar
    Ctrl + h --> Navigate to admin route '/admin'
    Ctrl + i --> Navigate to root route '/'
    Ctrl + k --> Show shortcuts modal

    A U T H

    Ctrl + Shift + l --> Perform Logout
    Ctrl + Alt + l --> Navigate to Login

    S E T T I N G S

    Ctrl + Alt + f --> Toggle forms validation mode
    Ctrl + Alt + d --> Toggle dev mode
    Ctrl + Alt + t --> Toggle compact table mode

    */

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DevService } from 'src/app/_services/dev.service';
import { ThemeService } from 'src/app/_services/theme.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsService {
  private router = inject(Router);
  private theme = inject(ThemeService);
  private validation = inject(ValidationService);
  private dev = inject(DevService);
  // private sidebar = inject(SidebarService);

  private shortcuts: { [key: string]: () => void } = {};

  add = (key: string, callback: () => void) => this.shortcuts[key] = callback;
  remove = (key: string) => delete this.shortcuts[key];
  log = () => console.log(this.shortcuts);

  constructor() {
    console.log('ShortcutsService initialized');


    this.listenToKeyboardEvents();

    this.add('Ctrl+,', this.showSettingsModal.bind(this));
    this.add('Ctrl+p', this.focusOnSearchBar.bind(this));this.add('Ctrl+P', this.focusOnSearchBar.bind(this));
    this.add('Ctrl+m', this.toggleTheme.bind(this));this.add('Ctrl+M', this.toggleTheme.bind(this));
    this.add('Ctrl+b', this.toggleSidebar.bind(this));this.add('Ctrl+B', this.toggleSidebar.bind(this));
    this.add('Ctrl+h', this.navigateToHome.bind(this));this.add('Ctrl+H', this.navigateToHome.bind(this));
    this.add('Ctrl+i', () => this.navigateToAdmin());this.add('Ctrl+I', () => this.navigateToAdmin());
    this.add('Ctrl+k', this.showShortcutsModal.bind(this));this.add('Ctrl+K', this.showShortcutsModal.bind(this));
    this.add('Ctrl+Shift+l', this.logout.bind(this)); this.add('Ctrl+Shift+L', this.logout.bind(this));
    this.add('Ctrl+Alt+l',this.navigateToLogin.bind(this)); this.add('Ctrl+Alt+L',this.navigateToLogin.bind(this));
    this.add('Ctrl+Alt+f', this.toggleFormsValidationMode.bind(this));this.add('Ctrl+Alt+F', this.toggleFormsValidationMode.bind(this));
    this.add('Ctrl+Alt+d', this.toggleDevMode.bind(this));this.add('Ctrl+Alt+D', this.toggleDevMode.bind(this));
    this.add('Ctrl+Alt+t', this.toggleCompactTableMode.bind(this));this.add('Ctrl+Alt+T', this.toggleCompactTableMode.bind(this));
  }

  registerShortcut(key: string, callback: () => void) {
    this.shortcuts[key] = callback;
  }

  unregisterShortcut(key: string) {
    delete this.shortcuts[key];
  }

  private listenToKeyboardEvents() {
    window.addEventListener('keydown', event => {
      const key = this.getKey(event);
      if (this.shortcuts[key]) {
        event.preventDefault();
        this.shortcuts[key]();
      }
    });
  }

  private getKey = (event: KeyboardEvent): string => {
    let key = '';
    if (event.ctrlKey) key += 'Ctrl+';
    if (event.shiftKey) key += 'Shift+';
    if (event.altKey) key += 'Alt+';
    key += event.key;
    return key;
  }

  showSettingsModal = () => {}
  focusOnSearchBar = () => undefined;
  toggleTheme = () => this.theme.cycle();
  toggleSidebar() {
    // this.sidebar.toggle();
  }
  navigateToHome = () => undefined;
  navigateToAdmin = () => this.router.navigate(['/admin'])
  showShortcutsModal = () => {}
  logout = () => {}
  navigateToLogin = () => this.router.navigate(['/auth/login'], {queryParams: { returnUrl: this.router.url }});
  toggleFormsValidationMode() {
    this.validation.toggle();
  }
  toggleDevMode() {
    this.dev.toggle();
  }
  toggleCompactTableMode = () => {}
}
