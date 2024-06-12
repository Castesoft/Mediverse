import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  host: { 'class': 'd-flex align-items-center ms-1 ms-lg-2 dropdown', id: 'themeDropdown'},
  selector: '[themeDropdown]',
  templateUrl: './theme-dropdown.component.html'
})
export class ThemeDropdownComponent implements OnInit {

  selected = '';

  constructor(
    public theme: ThemeService
  ) {

  }

  ngOnInit(): void {
    this.theme.selected.subscribe({
      next: theme => {
        this.selected = theme;
      }
    })
  }

}
