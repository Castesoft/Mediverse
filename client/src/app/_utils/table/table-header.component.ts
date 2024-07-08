import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  output,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CatalogMode, Column, SortOptions } from '../../_models/types';
import {
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnvService } from '../../_services/env.service';
import { GuidService } from '../../_services/guid.service';
import { IconsService } from '../../_services/icons.service';

@Component({
  selector: '[tableHeader]',
  templateUrl: './table-header.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ NgClass, FontAwesomeModule ]
})
export class TableHeaderComponent implements OnInit, OnChanges {
  private devService = inject(EnvService);
  public icons = inject(IconsService);
  private guid = inject(GuidService);

  // inputs
  // required
  columns = input.required<Column[]>();
  params = input.required<any>();
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();

  // optional
  sortable = input<boolean>(true);
  showActions = input<boolean>(true);

  // outputs
  onParamsChange = output<SortOptions>();
  onSelectAll = output<boolean>();

  isDev = false;
  cuid: string;

  constructor() {
    this.cuid = this.guid.gen();
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

  onClick = (name: string) => this.onParamsChange.emit(new SortOptions(name, !this.params().isSortAscending));
}
