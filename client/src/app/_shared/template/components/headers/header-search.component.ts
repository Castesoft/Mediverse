import { Component, OnInit, OnDestroy, inject, viewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ShortcutsService } from 'src/app/_services/shortcuts.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';


@Component({
  host: { 'class': 'd-flex align-items-stretch me-1' },
  selector: '[headerSearch]',
  // template: ``,
  templateUrl: './header-search.component.html',
  standalone: true,
  imports: [BootstrapModule, RouterModule, ReactiveFormsModule,],
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private shortcuts = inject(ShortcutsService);

  searchInput = viewChild.required<ElementRef>('searchInput');
  dropdown = viewChild.required<BsDropdownDirective>('dropdown');

  searchForm: FormGroup = new FormGroup({});
  searchUrl = 'https://www.google.com/search?q=';

  get showResults(): boolean { return this.searchForm.get('searchTerm')?.value.length > 0; }
  mode: 'preferences' | 'advanced' | 'results' | 'recent' = 'recent';
  state: 'loading' | 'empty' | 'filled' = 'empty';

  ngOnInit(): void {
    this.initForm();
    this.listenForShortcuts();
  }

  ngOnDestroy(): void {
    this.shortcuts.unregisterShortcut('Ctrl+p');
    this.shortcuts.unregisterShortcut('Ctrl+P');
  }

  initForm() {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    const searchTerm = this.searchForm.get('searchTerm');

    if (searchTerm) {
      searchTerm.valueChanges.subscribe(value => {
        this.searchUrl = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
        if (searchTerm.value > 0) {
          this.dropdown().show();
        }
      });

      searchTerm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(() => {
        if (searchTerm.value.length > 0) {
          this.mode = 'results';
          this.state = 'loading';
          setTimeout(() => {
            this.state = 'filled';
          }, 1000);
        }
      }
      );

    }
  }

  focusOnInput = () => {
    this.searchInput().nativeElement.focus();
    this.dropdown().show();
  };

  listenForShortcuts() {
    this.shortcuts.registerShortcut('Ctrl+p', this.focusOnInput);
    this.shortcuts.registerShortcut('Ctrl+P', this.focusOnInput);
  }

}
