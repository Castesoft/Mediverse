import { Component, HostBinding, HostListener, inject, model, output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { DetailActions, View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";


@Component({
  selector: 'a[detailLink2]',
  templateUrl: './detail-link-2.component.html',
  standalone: true,
  imports: [ RouterModule, MaterialModule, CdkModule, ],
})
export class DetailLink2Component {
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  type = model.required<DetailActions>();
  use = model.required<FormUse>();
  dictionary = model.required<NamingSubject>();
  view = model.required<View>();
  id = model.required<number | null>();

  onDelete = output<void>();

  @HostBinding('class') get class() {
    switch (this.type()) {
      case 'edit':
        return 'btn btn-phoenix-secondary px-3 px-sm-5 me-2';
      case 'cancel':
        return 'btn btn-phoenix-secondary px-3 px-sm-5 me-2';
      case 'delete':
        return 'btn btn-phoenix-danger px-3 px-sm-5 me-2';
      case 'create':
        return 'btn btn-primary me-2';
    }
  }

  @HostBinding('href') get href() {
    switch (this.type()) {
      case 'edit':
        return this.dictionary().catalogRoute + '/' + this.id() + '/editar';
      case 'cancel':
        if (this.use() === 'create') {
          return this.dictionary().catalogRoute;
        }
        return this.dictionary().catalogRoute + '/' + this.id();
      case 'delete':
        return this.dictionary().catalogRoute + '/' + this.id();
      case 'create':
        return this.dictionary().createRoute!;
    }
  }

  @HostListener('click', [ '$event' ]) onClick(event: MouseEvent) {
    switch (this.type()) {
      case 'edit':
        this.view() === 'modal' ? this.use.set(FormUse.EDIT) : this.router.navigate([ this.dictionary().catalogRoute, this.id()!, 'editar' ]);
        break;
      case 'cancel':
        if (this.use() === 'create') {
          if (this.view() === 'page') {
            this.router.navigate([ this.dictionary().catalogRoute ]);
          } else if (this.view() === 'modal') {
            this.snackBar.open('Esto debe cerrar la pantalla modal', 'Cerrar', { duration: 2000 });
          }
        }
        if (this.use() === 'edit') {
          if (this.view() === 'modal') {
            this.use.set(FormUse.DETAIL);
          } else {
            this.router.navigate([ this.dictionary().catalogRoute, this.id()! ]);
          }
        }
        break;
      case 'delete':
        this.onDelete.emit();
        break;
      case 'create':
        this.view() === 'modal' ? this.use.set(FormUse.CREATE) : this.router.navigate([ this.dictionary().createRoute ]);
        break;
    }
    event.preventDefault();
  }
}
