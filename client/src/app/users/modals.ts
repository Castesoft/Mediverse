import { CdkDrag } from "@angular/cdk/drag-drop";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { Role } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { CatalogModal, DetailModal, FilterModal } from "src/app/_shared/table/table.module";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { UsersFilterFormComponent } from "src/app/users/components/users-filter-form.component";
import { UserDetailComponent } from "src/app/users/views";

@Component({
  standalone: true,
  selector: 'user-detail-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div userDetail [id]="data.id" [use]="data.use" [view]="data.view" [key]="data.key" [item]="data.item" [role]="data.role"></div>
      </mat-dialog-content>
    </div>
  `,
  imports: [UserDetailComponent, MatDialogTitle, MatDialogContent, CdkDrag ],
})
export class UserDetailModalComponent {
  data = inject<DetailModal<User> & { role: Role }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'users-filter-modal',
  template: `
    <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
    @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }
      <mat-dialog-content>
        <div usersFilterForm [formId]="data.formId" [key]="data.key" [role]="data.role"></div>
      </mat-dialog-content>
    </div>
  `,
  standalone: true,
  imports: [UsersFilterFormComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class UsersFilterModalComponent {
  data = inject<FilterModal & { role: Role }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'users-catalog-modal',
  template: `
      <div cdkDrag cdkDragRootElement=".cdk-overlay-pane">
      @if (data.title) { <h2 mat-dialog-title>{{data.title}}</h2> }

        <mat-dialog-content>
          <div usersCatalog [mode]="data.mode" [key]="data.key" [view]="data.view" [role]="data.role"></div>
        </mat-dialog-content>
      </div>
  `,
  standalone: true,
  imports: [UsersCatalogComponent, MatDialogTitle, MatDialogContent, CdkDrag, ],
})
export class UsersCatalogModalComponent {
  data = inject<CatalogModal>(MAT_DIALOG_DATA);
}
