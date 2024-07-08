import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { ShortcutsService } from '../../services/shortcuts.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  host: { 'class': 'd-flex align-items-stretch me-1'},
  selector: '[headerSearch]',
  templateUrl: './header-search.component.html'
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild(BsDropdownDirective, { static: false }) dropdown!: BsDropdownDirective;
  searchForm: FormGroup = new FormGroup({});
  searchUrl = 'https://www.google.com/search?q=';

  get showResults(): boolean { return this.searchForm.get('searchTerm')?.value.length > 0; }
  mode: 'preferences' | 'advanced' | 'results' | 'recent' = 'recent';
  state: 'loading' | 'empty' | 'filled' = 'empty';

  constructor(
    private fb: FormBuilder,
    private shortcuts: ShortcutsService,
  ) {}

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
          this.dropdown.show();
        }
      });

      searchTerm.valueChanges.pipe(
          debounceTime(1000),
          distinctUntilChanged(),
        ).subscribe(() => {
          if (searchTerm.value.length > 0) {
            this.mode = 'results';
            this.state = 'loading';
            setTimeout(() => {
              this.state = 'filled';
            }, 1000);
          }
        }
      )

    }
  }

  focusOnInput = () => {
    this.searchInput.nativeElement.focus();
    this.dropdown.show();
  }

  listenForShortcuts() {
    this.shortcuts.registerShortcut('Ctrl+p', this.focusOnInput);
    this.shortcuts.registerShortcut('Ctrl+P', this.focusOnInput);
  }

}
