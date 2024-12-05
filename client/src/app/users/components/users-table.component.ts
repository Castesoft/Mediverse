import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject, model, input, effect } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { Subject } from "rxjs";
import { CatalogMode, View } from "src/app/_models/base/types";
import { User } from "src/app/_models/users/user";
import { UserParams } from "src/app/_models/users/userParams";
import { IconsService } from "src/app/_services/icons.service";
import { UsersService } from "../users.config";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableHeaderComponent } from "src/app/_shared/table/table-header.component";
import { UserTableCellComponent, UserTableSexCellComponent, UserTableHasAccountCellComponent } from "src/app/users/components/user-table-cell.component";
import { TableRow } from "src/app/_models/tables/tableRow";
import { DevService } from "src/app/_services/dev.service";
import { PartialCellsOf } from "src/app/_models/tables/tableCellItem";
import { userCells } from "src/app/_models/users/userConstants";

@Component({
  host: { class: 'table align-middle table-row-dashed fs-6 gy-5 dataTable', id: 'kt_table_users', },
  selector: 'table[usersTable]',
  standalone: true,
  templateUrl: './users-table.component.html',
  imports: [FontAwesomeModule, TableHeaderComponent, FormsModule, RouterModule, BsDropdownModule, UserTableCellComponent, CommonModule,
    UserTableSexCellComponent, UserTableHasAccountCellComponent, MaterialModule, CdkModule,
  ],
})
export class UsersTableComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  service = inject(UsersService);
  icons = inject(IconsService);
  dev = inject(DevService);

  data = input.required<User[]>();
  isCompact = model.required<boolean>();
  mode = model.required<CatalogMode>();
  key = model.required<string | null>();
  view = model.required<View>();

  sortAscending = false;
  params!: UserParams;
  cuid = createId();
  selected = false;
  row: TableRow<User> = new TableRow<User>(new User());

  cells: PartialCellsOf<User> = userCells;

  constructor() {
    effect(() => {
      this.params = new UserParams(this.key());
      this.service.param$(this.key(), this.mode()).subscribe({
        next: (params) => {
          this.params = params;
        },
      });
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
