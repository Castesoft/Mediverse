import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isBrowser = false;
  selected: BehaviorSubject<string> = new BehaviorSubject<string>('');
  effectiveTheme$: Observable<string> = this.selected.pipe(
    map(() => this.getEffectiveTheme())
  );

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.init();
  }

  init() {
    if (this.isBrowser) {
      const storedTheme = localStorage.getItem('theme');
      const currentTheme = document.documentElement.getAttribute('data-bs-theme')!;
      if (storedTheme) {
        if (storedTheme === 'auto') {
          this.setMediaQueryListener();
          this.selected.next('auto');
        } else {
          this.set(storedTheme);
        }
      } else if (currentTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const autoTheme = prefersDark ? 'dark' : 'light';
        this.set(autoTheme);
      } else {
        this.set(currentTheme);
      }
    }
  }

  set(theme: string): void {
    if (this.isBrowser) {
      if (theme === 'auto') {
        this.setMediaQueryListener();
        this.selected.next('auto');
        localStorage.setItem('theme', 'auto');
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
        this.selected.next(theme);
        localStorage.setItem('theme', theme);
      }
    }
  }

  private setMediaQueryListener(): void {
    if (this.isBrowser) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.updateAutoTheme(prefersDark.matches);
      prefersDark.addEventListener('change', (event) => {
        this.updateAutoTheme(event.matches);
      });
    }
  }

  private updateAutoTheme(isDark: boolean): void {
    if (this.isBrowser) {
      const autoTheme = isDark ? 'dark' : 'light';
      this.updateThemeClass(autoTheme);
      this.selected.next(autoTheme);
    }
  }

  private updateThemeClass(theme: string): void {
    if (this.isBrowser) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }

  private getEffectiveTheme(): string {
    if (!this.isBrowser) return '';
    if (this.selected.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return this.selected.value;
  }

  cycle(): void {
    if (this.isBrowser) {
      const currentTheme = this.selected.value;
      if (currentTheme === 'light') {
        this.set('dark');
      } else if (currentTheme === 'dark') {
        this.set('auto');
      } else {
        this.set('light');
      }
    }
  }
}
