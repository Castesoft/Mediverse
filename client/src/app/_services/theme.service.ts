import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('auto');

  constructor() {
    this.init();
  }

  init() {
    const storedTheme = localStorage.getItem('theme');
    const isDarkModePreferred = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (storedTheme !== null) {
      this.set(storedTheme as Theme);
    } else {
      this.set(isDarkModePreferred ? 'dark' : 'light');
    }
  }

  set(theme: Theme): void {
    if (theme === 'auto') {
      this.setMediaQueryListener();
      this.theme.set('auto');
      localStorage.setItem('theme', 'auto');
    } else {
      this.updateThemeClass(theme);
      this.theme.set(theme);
      localStorage.setItem('theme', theme);
    }
  }

  private setMediaQueryListener(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.updateAutoTheme(prefersDark.matches);
    prefersDark.addEventListener('change', (event) => {
      this.updateAutoTheme(event.matches);
    });
  }

  private updateAutoTheme(isDark: boolean): void {
    const autoTheme = isDark ? 'dark' : 'light';
    this.updateThemeClass(autoTheme);
    this.theme.set(autoTheme);
  }

  private updateThemeClass(theme: Theme): void {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    root.setAttribute('data-bs-theme', theme);
  }

  private getEffectiveTheme(): Theme {
    if (this.theme() === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return this.theme();
  }

  cycle(): void {
    const currentTheme = this.theme();
    if (currentTheme === 'light') {
      this.set('dark');
    } else if (currentTheme === 'dark') {
      this.set('auto');
    } else {
      this.set('light');
    }
  }

  toggle(): void {
    const currentTheme = this.getEffectiveTheme();
    if (currentTheme === 'dark') {
      this.set('light');
    } else {
      this.set('dark');
    }
  }
}
