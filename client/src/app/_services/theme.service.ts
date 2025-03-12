import { Injectable, signal, WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('auto');
  effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    this.init();
  }

  init() {
    const storedTheme: string | null = localStorage.getItem('theme');
    const isDarkModePreferred: boolean = window.matchMedia(
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
      // For auto, set up the media query listener
      this.setMediaQueryListener();
      this.theme.set('auto');
      // Compute effective theme from OS preference
      const autoEffective = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      this.effectiveTheme.set(autoEffective);
      localStorage.setItem('theme', 'auto');
      // Update DOM classes using the computed effective theme
      this.updateThemeClass(autoEffective);
    } else {
      // For light/dark, update both signals and DOM immediately
      this.updateThemeClass(theme);
      this.theme.set(theme);
      this.effectiveTheme.set(theme);
      localStorage.setItem('theme', theme);
    }
  }

  private setMediaQueryListener(): void {
    const prefersDark: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    // Update the effective theme based on the initial match
    this.updateAutoTheme(prefersDark.matches);
    // Listen for changes in the OS color scheme
    prefersDark.addEventListener('change', (event) => {
      this.updateAutoTheme(event.matches);
    });
  }

  private updateAutoTheme(isDark: boolean): void {
    const autoTheme: 'dark' | 'light' = isDark ? 'dark' : 'light';
    this.updateThemeClass(autoTheme);
    this.effectiveTheme.set(autoTheme);
  }

  private updateThemeClass(theme: 'light' | 'dark'): void {
    const root: HTMLElement = document.documentElement;
    const body: HTMLElement = document.body;
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

  private getEffectiveTheme(): 'light' | 'dark' {
    return this.effectiveTheme();
  }

  cycle(): void {

    console.log('cycle');


    const currentTheme: Theme = this.theme();
    if (currentTheme === 'light') {
      this.set('dark');
    } else if (currentTheme === 'dark') {
      this.set('auto');
    } else {
      this.set('light');
    }
  }

  toggle(): void {
    const currentTheme: Theme = this.getEffectiveTheme();
    if (currentTheme === 'dark') {
      this.set('light');
    } else {
      this.set('dark');
    }
  }
}
