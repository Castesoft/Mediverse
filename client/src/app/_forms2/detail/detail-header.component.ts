import { Component, inject, model, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { FormHeaderComponent } from "src/app/_forms2/detail/form-header.component";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { DetailActions, View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  host: { class: 'row align-items-center justify-content-between g-3 mb-2 pt-2', },
  selector: 'div[detailHeader]',
  templateUrl: './detail-header.component.html',
  standalone: true,
  imports: [ MatButtonModule, MatIconModule, RouterModule, FormHeaderComponent, ],
})
export class DetailHeaderComponent {
  router = inject(Router);
  matSnackbar = inject(MatSnackBar);

  use = model.required<FormUse>();
  view = model.required<View>();
  id = model.required<number | null>();
  dictionary = model.required<NamingSubject>();
  title = model<string>();

  onDelete = output<void>();

  onClick(type: DetailActions) {
    switch (type) {
      case 'edit':
        if (this.view() === 'modal') {
          this.use.set(FormUse.EDIT);
        } else {
          this.router.navigate([ this.dictionary().catalogRoute, this.id()!, 'editar' ], { queryParamsHandling: 'merge', })
        }
        break;
      case 'cancel':
        if (this.use() === 'create') {
          if (this.view() === 'page') {
            this.router.navigate([ this.dictionary().catalogRoute ], { queryParamsHandling: 'merge', });
          } else if (this.view() === 'modal') {
            // this.bsModalService.hide();
            this.matSnackbar.open('Debe cerrar el modal', 'Cerrar', { duration: 5000, });
          }
        }
        if (this.use() === 'edit') {
          if (this.view() === 'modal') {
            this.use.set(FormUse.DETAIL);
          } else {
            this.router.navigate([ this.dictionary().catalogRoute, this.id()! ], { queryParamsHandling: 'merge', });
          }
        }
        break;
      case 'delete':
        this.onDelete.emit();
        break;
      case 'create':
        if (this.view() === 'modal') {
          this.use.set(FormUse.CREATE);
        } else {
          this.router.navigate([ this.dictionary().createRoute ], { queryParamsHandling: 'merge', });
        }
        break;
    }
  }

  protected readonly FormUse = FormUse;
}
