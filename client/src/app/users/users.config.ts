import { CommonModule } from "@angular/common";
import { NgModule, signal } from "@angular/core";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { createId } from "@paralleldrive/cuid2";
import { Account } from "src/app/_models/account";
import { CatalogMode, FormUse, Role, Sections, View } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { BreadcrumbService } from "src/app/_services/breadcrumb.service";
import { CompactTableService } from "src/app/_services/compact-table.service";
import { UsersService } from "src/app/_services/users.service";
import { LayoutModule } from "src/app/_shared/layout.module";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";
import { UserDetailComponent, UserEditComponent, UserNewComponent } from "src/app/users/views";

@Component({
  selector: 'patients-route',
  template: `<router-outlet></router-outlet>`,
})
export class PatientsComponent implements OnInit {
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
  selector: 'patients-catalog-route',
  template: `
  <div card>
    <div
      usersCatalog
      [mode]="mode"
      [(key)]="key"
      [(view)]="view"
      [(role)]="role"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, UsersCatalogComponent, LayoutModule,],
})
class PatientsCatalogComponent implements OnInit {
  service = inject(UsersService);
  compact = inject(CompactTableService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = createId();
  section: Sections = 'users';
  role: Role = 'Patient';

  constructor() {
    // this.label = this.service.namingDictionary.get(this.role)!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'patient-detail-route',
  template: `
      <div userDetail
        [(use)]="use"
        [(view)]="view"
        [(item)]="item"
        [(key)]="key"
        [(role)]="role"
      ></div>
  `,
  standalone: true,
  imports: [RouterModule, UserDetailComponent, LayoutModule,],
})
class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item = signal<User | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);

  section: Sections = 'users';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key.set(navigation?.extras?.state?.['key']);
  }
}
@Component({
  selector: 'patient-edit-route',
  template: `
        <div
          userDetail
          [(use)]="use"
          [(view)]="view"
          [(key)]="key"
          [(item)]="item"
          [(role)]="role"
        ></div>
  `,
  standalone: true,
  imports: [UserDetailComponent, RouterModule, LayoutModule,],
})
class PatientEditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item = signal<User | null>(null);
  use = signal<FormUse>('edit');
  view = signal<View>('page');
  key = signal<string | null>(null);

  section: Sections = 'users';
  role: Role = 'Patient';

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }
}

@Component({
  selector: 'patient-new-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(role)]="role" [(item)]="item" [(key)]="key"></div>`,
  standalone: true,
  imports: [UserDetailComponent, RouterModule, LayoutModule,],
})
class PatientNewComponent {
  item = signal<User | null>(null);
  use = signal<FormUse>('create');
  view = signal<View>('page');
  key = signal<string | null>(null);

  role = signal<Role>('Patient');
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Pacientes', data: { breadcrumb: 'Pacientes', },
      component: PatientsComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: PatientsCatalogComponent, title: 'Catálogo de pacientes', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: PatientNewComponent, title: 'Crear nuevo paciente', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: PatientDetailComponent,
        },
        {
          path: ':id/edit', data: { breadcrumb: 'Editar', },
          component: PatientEditComponent,
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }

@NgModule({
  declarations: [
    PatientsComponent,
  ],
  imports: [ CommonModule, PatientsRoutingModule, LayoutModule, ]
})
export class PatientsModule { }

// nurses

@Component({
  selector: 'nurses-route',
  template: `<router-outlet></router-outlet>`,
})
export class NursesComponent implements OnInit {
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
  selector: 'nurses-catalog-route',
  template: `
  <div card>
    <div
      usersCatalog
      [mode]="mode"
      [(key)]="key"
      [(view)]="view"
      [(role)]="role"
    ></div>
  </div>
  `,
  standalone: true,
  imports: [RouterModule, UsersCatalogComponent, LayoutModule,],
})
class NursesCatalogComponent implements OnInit {
  service = inject(UsersService);
  compact = inject(CompactTableService);

  isCompact = false;
  view: View = 'page';
  mode: CatalogMode = 'view';
  key = createId();
  section: Sections = 'users';
  role: Role = 'Nurse';

  constructor() {
    // this.label = this.service.namingDictionary.get(this.role)!.title;
  }

  ngOnInit(): void {
    this.compact.mode$.subscribe({ next: (mode) => (this.isCompact = mode) });
  }
}

@Component({
  selector: 'nurse-detail-route',
  template: `
      <div
        userDetail
        [(use)]="use"
        [(view)]="view"
        [(item)]="item"
        [(key)]="key"
        [(role)]="role"
      ></div>
  `,
  standalone: true,
  imports: [RouterModule, UserDetailComponent, LayoutModule,],
})
class NurseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item = signal<User | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);

  section: Sections = 'users';
  role: Role = 'Nurse';

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
    const navigation = this.router.getCurrentNavigation();
    this.key.set(navigation?.extras?.state?.['key']);
  }
}
@Component({
  selector: 'nurse-edit-route',
  template: `
        <div
          userDetail
          [(use)]="use"
          [(view)]="view"
          [(key)]="key"
          [(item)]="item"
          [(role)]="role"
        ></div>
  `,
  standalone: true,
  imports: [UserDetailComponent, RouterModule, LayoutModule,],
})
class NurseEditComponent implements OnInit {
  private route = inject(ActivatedRoute);

  item = signal<User | null>(null);
  use = signal<FormUse>('detail');
  view = signal<View>('page');
  key = signal<string | null>(null);

  section: Sections = 'users';
  role = signal<Role>('Nurse');

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }
}

@Component({
  selector: 'nurse-new-route',
  template: `<div userNewView [(use)]="use" [(view)]="view" [(role)]="role"
  ></div>`,
  standalone: true,
  imports: [UserNewComponent, RouterModule, LayoutModule,],
})
class NurseNewComponent {
  use: FormUse = 'create';
  view: View = 'page';
  role: Role = 'Nurse';
}

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '', title: 'Enfermeros', data: { breadcrumb: 'Enfermeros', },
      component: NursesComponent, runGuardsAndResolvers: 'always',
      children: [
        { path: '', component: NursesCatalogComponent, title: 'Catálogo de enfermeros', data: { breadcrumb: 'Catálogo', }, },
        { path: 'create', component: NurseNewComponent, title: 'Crear nuevo enfermero', data: { breadcrumb: 'Nuevo', }, },
        {
          path: ':id', data: { breadcrumb: 'Detalle', },
          component: NurseDetailComponent,
        },
        {
          path: ':id/edit', data: { breadcrumb: 'Editar', },
          component: NurseEditComponent,
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class NursesRoutingModule { }

@NgModule({
  declarations: [ NursesComponent, ],
  imports: [ CommonModule, NursesRoutingModule, LayoutModule, ]
})
export class NursesModule { }
