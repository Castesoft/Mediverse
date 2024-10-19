import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  current: BehaviorSubject<string> = new BehaviorSubject<string>('');
  effective$: Observable<string> = this.current.pipe(
    map(() => this.getEffectiveTheme())
  );

  constructor() {
    this.init();
  }

  init() {
    const storedTheme = localStorage.getItem('theme');
    const isDarkModePreferred = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (storedTheme) {
      this.set(storedTheme);
    } else {
      this.set(isDarkModePreferred ? 'dark' : 'light');
    }
  }

  set(theme: string): void {
    if (theme === 'auto') {
      this.setMediaQueryListener();
      this.current.next('auto');
      localStorage.setItem('theme', 'auto');
    } else {
      this.updateThemeClass(theme);
      this.current.next(theme);
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
    this.current.next(autoTheme);
  }

  private updateThemeClass(theme: string): void {
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

  private getEffectiveTheme(): string {
    if (this.current.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return this.current.value;
  }

  cycle(): void {
    const currentTheme = this.current.value;
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
