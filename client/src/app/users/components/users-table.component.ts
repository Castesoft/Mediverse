import { Component, OnInit, Input, inject, input, OnDestroy, model } from "@angular/core";
import { CatalogMode, Column, View } from "src/app/_models/types";
import { IconsService } from "src/app/_services/icons.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { DatePipe, DecimalPipe, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { UserParams } from "src/app/_models/users/userParams";
import { User } from "src/app/_models/users/user";
import { Subscription } from "rxjs";
import { UsersService } from "src/app/_services/users.service";
import { UserTableCellComponent, UserTableHasAccountCellComponent, UserTableSexCellComponent } from "src/app/users/components/user-table-cell.component";
import { createId } from "@paralleldrive/cuid2";

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
  key = model.required<string>();
  mode = model.required<CatalogMode>();
  showHeaders = input<boolean>(true);
  view = model.required<View>();

  sortAscending = false;
  columns?: Column[];
  devMode = false;
  params!: UserParams;

  subscriptions: Subscription[] = [];

  cuid: string = createId();
  constructor() {}

  ngOnInit(): void {
    // const paramsSubscription = this.service.param$(this.key()).subscribe({ next: params => this.params = params });
    // this.subscriptions.push(paramsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
