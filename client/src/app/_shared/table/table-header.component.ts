import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CatalogMode, Column, SortOptions } from 'src/app/_models/types';
import {
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import { EnvService } from 'src/app/_services/env.service';
import { IconsService } from 'src/app/_services/icons.service';
import { NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GuidService } from 'src/app/_services/guid.service';

@Component({
  selector: 'thead[tableHeader]',
  templateUrl: './table-header.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ NgClass, FontAwesomeModule ]
})
export class TableHeaderComponent implements OnInit, OnChanges {
  private devService = inject(EnvService);
  icons = inject(IconsService);
  private guid = inject(GuidService);

  // inputs
  // required
  columns = input.required<Column[]>();
  mode = input.required<CatalogMode>();
  show = input<boolean>(true);

  // optional
  sortable = input<boolean>(true);
  showActions = input<boolean>(true);
  params = input<any>();

  // outputs
  onParamsChange = output<SortOptions>();
  onSelectAll = output<boolean>();

  isDev = false;
  cuid: string;
  constructor() {
    this.cuid = this.guid.gen();
    // console.log('cuid', this.cuid);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes', changes);
  }

  ngOnInit(): void {
    this.devService.mode$.subscribe({ next: mode => this.isDev = mode });
  }

  getIcon(columnName: string) {
    if (this.params().sort === columnName && this.params().isSortAscending) {
      return faSortUp;
    } else if (
      this.params().sort === columnName &&
      !this.params().isSortAscending
    ) {
      return faSortDown;
    } else {
      return faSort;
    }
  }

  selectAllItems(event: Event) {
    const input = event.target as EventTarget as HTMLInputElement;
    this.onSelectAll.emit(input.checked);
  }

  onClick = (name: string) => {
    if (name === this.params().sort && !this.params().isSortAscending) {
      this.onParamsChange.emit(new SortOptions(undefined));
    } else {
      this.onParamsChange.emit(new SortOptions(name, !this.params().isSortAscending));
    }
  };
}
