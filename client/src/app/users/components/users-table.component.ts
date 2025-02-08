import { CommonModule } from "@angular/common";
import { Component, ModelSignal, model, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ControlsModule } from "src/app/_forms/controls.module";
import BaseTable from "src/app/_models/base/components/extensions/baseTable";
import TableInputSignals from "src/app/_models/base/components/interfaces/tableInputSignals";
import { View, CatalogMode } from "src/app/_models/base/types";
import { User } from "src/app/_models/users/user";
import { userCells } from "src/app/_models/users/userConstants";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserParams } from "src/app/_models/users/userParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { UsersService } from "src/app/users/users.config";
import { TableMenuComponent } from "src/app/_shared/components/table-menu.component";
import { UserTableCellComponent } from "src/app/users/components/user-table-cell.component";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer' },
  selector: 'table[usersTable]',
  templateUrl: './users-table.component.html',
  standalone: true,
  imports: [
    TablesModule,
    ControlsModule,
    RouterModule,
    FontAwesomeModule,
    CdkModule,
    MaterialModule,
    CommonModule,
    TableMenuComponent,
    UserTableCellComponent,
  ],
})
export class UsersTableComponent extends BaseTable<User, UserParams, UserFiltersForm, UsersService> implements OnDestroy, TableInputSignals<User, UserParams> {
  item: ModelSignal<User | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<UserParams> = model.required();
  data: ModelSignal<User[]> = model.required();

  constructor() {
    super(UsersService, User, { tableCells: userCells });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
