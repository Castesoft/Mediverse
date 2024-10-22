import { Component, inject, OnInit, viewChild } from "@angular/core";
import { CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { UsersService } from "src/app/_services/users.service";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { UsersFilterFormComponent } from "src/app/users/components/users-filter-form.component";
import { UserDetailComponent, UserEditComponent, UserNewComponent } from "src/app/users/views";

@Component({
  selector: 'user-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          userEditView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="undefined"
          [item]="item"
          [role]="role"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [UserEditComponent, ModalWrapperModule],
})
export class UserEditModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  item!: User;
  role!: Role;
}

@Component({
  selector: 'user-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          userDetailView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="key"
          [item]="item"
          [role]="role"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [UserDetailComponent, ModalWrapperModule],
})
export class UserDetailModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: User;
  role!: Role;
}

@Component({
  selector: 'user-new-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div userNewView [use]="use" [view]="'modal'" [role]="role"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [UserNewComponent, ModalWrapperModule],
})
export class UserNewModalComponent {
  use!: FormUse;
  title?: string;
  role!: Role;
}

@Component({
  selector: 'users-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div usersFilterForm [key]="key" [formId]="formId" [role]="role"></div>
      </div>
      <div
        modalFooterFilters
        [formId]="formId"
        (onReset)="onReset()"
        (onSubmit)="onSubmit()"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [UsersFilterFormComponent, ModalWrapperModule],
})
export class UsersFilterModalComponent implements OnInit {
  service = inject(UsersService);

  formId!: string;
  key!: string;
  role!: Role;
  title?: string;

  form = viewChild.required(UsersFilterFormComponent);

  onReset = () =>
    {
      // this.form()!.service.resetForm(this.key, this.form()!.form);

    }
  onSubmit = () => this.form()!.onSubmit();

  ngOnInit(): void {
    // this.formId = this.form().form.id;
  }
}

@Component({
  selector: 'users-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            usersCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [role]="role"
            [key]="key"
            [view]="view"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [UsersCatalogComponent, ModalWrapperModule],
})
export class UsersCatalogModalComponent {
  key!: string;
  role!: Role;
  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
}
