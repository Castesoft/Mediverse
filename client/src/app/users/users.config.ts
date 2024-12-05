import { CommonModule } from "@angular/common";
import { Component, effect, inject, Injectable, NgModule } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { CatalogMode, View } from "src/app/_models/base/types";
import { BaseRouteCatalog, BaseRouteDetail, createItemResolver } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormUse } from "src/app/_models/forms/formTypes";
import { User } from "src/app/_models/users/user";
import { userDictionary, userColumns } from "src/app/_models/users/userConstants";
import { UserFiltersForm } from "src/app/_models/users/userFiltersForm";
import { UserParams } from "src/app/_models/users/userParams";
import { CdkModule } from "src/app/_shared/cdk.module";
import { LayoutModule } from "src/app/_shared/layout.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { CatalogModalType, DetailModalType } from "src/app/_shared/table/table.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { UserDetailModalComponent } from "src/app/users/components/user-detail-modal.component";
import { UserDetailComponent } from "src/app/users/components/user-detail.component";
import { UsersCatalogComponent } from "src/app/users/components/users-catalog.component";

@Component({
  selector: 'users-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      usersCatalog
      [(mode)]="data.mode"
      [(key)]="data.key"
      [(view)]="data.view"
      [(isCompact)]="data.isCompact"
      [(item)]="data.item"
      [(params)]="data.params"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [UsersCatalogComponent, MaterialModule, CdkModule,],
})
export class UsersCatalogModalComponent {
  data = inject<CatalogModalType<User, UserParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: "root",
})
export class UsersService extends ServiceHelper<User, UserParams, UserFiltersForm> {
  constructor() {
    super(UserParams, 'users', userDictionary, userColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      UsersCatalogModalComponent,
      CatalogModalType<User, UserParams>
    >(UsersCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new UserParams(key),
        view: view,
        title: this.dictionary.title,
        item: null,
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ "window" ]
    });
  };

  clickLink(
    item: User | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      UserDetailModalComponent,
      DetailModalType<User>
    >(UserDetailModalComponent, {
      data: {
        item: item,
        key: key,
        use: use,
        view: 'modal',
        title: this.getFormHeaderText(use, item),
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: [ 'window' ]
    });

  } else {
    switch (use) {
      case 'create':
        this.router.navigate([this.dictionary.createRoute]);
        break;
      case 'edit':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}/editar`]);
        break;
      case 'detail':
        this.router.navigate([`${this.dictionary.catalogRoute}/${item?.id}`]);
        break;
      }
    }
  }

}

@Component({
  selector: 'nurses-catalog-route',
  template: `
  <div usersCatalog [(item)]="item" [(view)]="view" [(key)]="key" [(mode)]="mode" [(params)]="params" [(isCompact)]="compact.isCompact"></div>
  `,
  standalone: true,
  imports: [ CommonModule, UsersCatalogComponent, ],
})
export class NursesCatalogComponent
  extends BaseRouteCatalog<User, UserParams, UserFiltersForm, UsersService>
{
  constructor() {
    super(UsersService, 'nurses');
    this.key.set(`${this.router.url}#nurses`);
  }
}

@Component({
  selector: 'patients-catalog-route',
  template: `
  <div usersCatalog [(item)]="item" [(view)]="view" [(key)]="key" [(mode)]="mode" [(params)]="params" [(isCompact)]="compact.isCompact"></div>
  `,
  standalone: true,
  imports: [ CommonModule, UsersCatalogComponent, ],
})
export class PatientsCatalogComponent
  extends BaseRouteCatalog<User, UserParams, UserFiltersForm, UsersService>
{
  constructor() {
    super(UsersService, 'patients');
    this.key.set(`${this.router.url}#patients`);
  }
}

@Component({
  selector: 'nurse-detail-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class NurseDetailComponent extends BaseRouteDetail<User> {
  constructor() {
    super('nurses', 'detail');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'patient-detail-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class PatientDetailComponent extends BaseRouteDetail<User> {
  constructor() {
    super('patients', 'detail');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'nurse-edit-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class NurseEditComponent extends BaseRouteDetail<User> {
  constructor() {
    super('nurses', 'edit');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'patient-edit-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class PatientEditComponent extends BaseRouteDetail<User> {
  constructor() {
    super('patients', 'edit');

    effect(() => {
      this.route.paramMap.subscribe({
        next: params => {
          if (params.has('id')) {
            this.id.set(+params.get('id')!);
          }
        },
      });
      this.route.data.subscribe({
        next: (data) => {
          this.item.set(data['item']);
        },
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'nurse-new-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class NurseNewComponent extends BaseRouteDetail<User> {
  constructor() {
    super('nurses', 'create');

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'patient-new-route',
  template: `<div userDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>`,
  standalone: true,
  imports: [ CommonModule, UserDetailComponent, ],
})
export class PatientNewComponent extends BaseRouteDetail<User> {
  constructor() {
    super('patients', 'create');

    effect(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation !== null) {
        const key = navigation?.extras?.state?.['key'];
        if (key) {
          this.key.set(key);
        }
      }
    });
  }
}

@Component({
  selector: 'nurses-route',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
})
export class NursesComponent {}

@Component({
  selector: 'patients-route',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
})
export class PatientsComponent {}

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
          resolve: { item: createItemResolver(UsersService), },
        },
        {
          path: ':id/edit', data: { breadcrumb: 'Editar', },
          component: NurseEditComponent,
          resolve: { item: createItemResolver(UsersService), },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class NursesRoutingModule {}

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
          resolve: { item: createItemResolver(UsersService), },
        },
        {
          path: ':id/edit', data: { breadcrumb: 'Editar', },
          component: PatientEditComponent,
          resolve: { item: createItemResolver(UsersService), },
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class PatientsRoutingModule {}

@NgModule({
  declarations: [ NursesComponent, ],
  imports: [ CommonModule, NursesRoutingModule, LayoutModule, ]
})
export class NursesModule {}

@NgModule({
  declarations: [ PatientsComponent, ],
  imports: [ CommonModule, PatientsRoutingModule, LayoutModule, ]
})
export class PatientsModule {}
