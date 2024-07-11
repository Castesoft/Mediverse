import { Component, OnInit, Input, inject, input, OnDestroy } from "@angular/core";
import { CatalogMode, Role } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {CdkModule} from "src/app/_shared/cdk.module";
import {MaterialModule} from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { User, UserParams } from "src/app/_models/user";
import { Subscription } from "rxjs";
import { GuidService } from "src/app/_services/guid.service";
import { UsersService } from "src/app/_services/users.service";
import {UserTableCellComponent, UserTableHasAccountCellComponent, UserTableSexCellComponent} from "src/app/users/components/user-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_users', },
  selector: 'table[usersTable]',
  standalone: true,
  templateUrl: './users-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, NgClass, FormsModule, RouterModule, DecimalPipe, BsDropdownModule, UserTableCellComponent, DatePipe,
    UserTableSexCellComponent, UserTableHasAccountCellComponent, MaterialModule, CdkModule,
  ],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  service = inject(UsersService);
  icons = inject(IconsService);

  @Input() data: User[] = [];
  key = input.required<string>();
  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  role = input.required<Role>();

  sortAscending = false;
  columns = this.service.columns;
  devMode = false;
  params!: UserParams;

  subscriptions: Subscription[] = [];

  cuid: string;
  constructor(guid: GuidService) {
    this.cuid = guid.gen();
  }

  ngOnInit(): void {
    const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
