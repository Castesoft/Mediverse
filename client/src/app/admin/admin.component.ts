import { Component, inject, OnDestroy } from '@angular/core';
import { ShortcutsService } from "src/app/_services/shortcuts.service";

@Component({
  selector: 'div[adminRoute]',
  template: `
    <nav mainSidebar>
      <router-outlet></router-outlet>
    </nav>
  `,
  standalone: false,
})
export class AdminComponent implements OnDestroy {
  private shortcuts = inject(ShortcutsService);

  ngOnDestroy(): void {
    this.shortcuts.unregisterShortcut('Ctrl+p');
    this.shortcuts.unregisterShortcut('Ctrl+P');
  }
}
