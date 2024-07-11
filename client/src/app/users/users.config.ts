import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ResolveFn, Router, RouterModule, Routes } from "@angular/router";
import { Account } from "src/app/_models/account";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { GuidService } from "src/app/_services/guid.service";
import { UsersService } from "src/app/_services/users.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { UserDetailComponent, UserEditComponent, UserNewComponent } from "src/app/users/views";

@Component({
  selector: 'users-route',
  template: `<router-outlet></router-outlet>`,
})
export class UsersComponent implements OnInit {
  accountService = inject(AccountService);
  breadcrumbService = inject(BreadcrumbService);

  account: Account | null = null;
  label?: string;

  ngOnInit(): void {
    this.account = this.accountService.current();
    this.breadcrumbService.breadcrumb$.subscribe({
      next: breadcrumb => {
        this.label = breadcrumb;
      }
    });
  }
}

@Component({
  selector: 'users-catalog-route',
  template: `
  <div card>
    <div
      usersCatalog
      [isCompact]="isCompact"
      [mode]="mode"
      [key]="key"
      [view]="view"
      [role]="role"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, UsersCatalogComponent, LayoutModule,],
})
export class CatalogComponent implements OnInit {
  service = inject(UsersService);
  compact = inject(CompactTableService);
  guid = inject(GuidService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = this.guid.gen();
  section: Sections = 'users';
  role: Role = 'Patient';
  label: string;

  constructor() {
    this.label = this.service.namingDictionary.get(this.role)!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'user-detail-route',
  template: `
    @if (id && item) {
      <div
        userDetailView
        [id]="id"
        [use]="use"
        [view]="view"
        [item]="item"
        [key]="key"
        [role]="role"
      ></div>
    }
  `,
  standalone: true,
  imports: [RouterModule, UserDetailComponent, LayoutModule,],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item?: User;
  id?: number;
  use: FormUse = 'detail';
  view: View = 'page';
  label?: string;
  key?: string;
  section: Sections = 'users';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.fullName;
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
@Component({
  selector: 'user-edit-route',
  template: `
      @if (id && item) {
        <div
          userEditView
          [id]="id"
          [use]="use"
          [view]="view"
          [key]="key"
          [item]="item"
          [role]="role"
        ></div>
      }
  `,
  standalone: true,
  imports: [UserEditComponent, RouterModule, LayoutModule,],
})
export class EditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item?: User;
  id?: number;
  use: FormUse = 'edit';
  view: View = 'page';
  label?: string;
  key = undefined;
  section: Sections = 'users';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.id = +params.get('id')!;
      },
    });
    this.route.data.subscribe({
      next: (data) => {
        this.item = data['item'];
        if (this.item) this.label = this.item.fullName;
      },
    });
  }
}

@Component({
  selector: 'user-new-route',
  template: `<div userNewView [use]="use" [view]="view" [role]="role"
  ></div>`,
  standalone: true,
  imports: [UserNewComponent, RouterModule, LayoutModule,],
})
export class NewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Patient';
}

export const itemResolver: ResolveFn<User | null> = (route, state) => {
  const service = inject(UsersService);
  const id = +route.paramMap.get('id')!;
  return service.getById(id);
};

export const titleDetailResolver: ResolveFn<string> = (route, state) => {
  const service = inject(UsersService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const user = service.getCurrent();
  if (!user) return 'Detalle de paciente';
  const title = `Detalle de paciente - ${user.fullName}`;
  return title;
}

export const titleEditResolver: ResolveFn<string> = (route, state) => {
  const service = inject(UsersService);
  const id = +route.paramMap.get('id')!;
  service.getById(id).subscribe();
  const user = service.getCurrent();
  if (!user) return 'Editar paciente';
  const title = `Editar paciente - ${user.fullName}`;
  return title;
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Pacientes', data: { breadcrumb: 'Pacientes', },
      component: UsersComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: CatalogComponent, title: 'Catálogo de pacientes', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NewComponent, title: 'Crear nuevo paciente', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', title: titleDetailResolver, data: { breadcrumb: 'Detalle', },
          component: DetailComponent,
          resolve: { item: itemResolver },
        },
        {
          path: ':id/edit', title: titleEditResolver, data: { breadcrumb: 'Editar', },
          component: EditComponent,
          resolve: { item: itemResolver },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [ CommonModule, UsersRoutingModule, LayoutModule, ]
})
export class UsersModule { }
