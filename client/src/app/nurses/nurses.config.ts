import { CommonModule } from '@angular/common';
import { Component, inject, ModelSignal, model, effect, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseDetail from 'src/app/_models/base/components/extensions/baseDetail';
import BaseForm from 'src/app/_models/base/components/extensions/baseForm';
import CatalogDialog from 'src/app/_models/base/components/types/catalogDialog';
import DetailDialog from 'src/app/_models/base/components/types/detailDialog';
import { View, CatalogMode } from 'src/app/_models/base/types';
import { DetailInputSignals, FormInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import Nurse from 'src/app/_models/nurses/nurse';
import { nurseDictionary, nurseColumns } from 'src/app/_models/nurses/nurseConstants';
import { NurseFiltersForm } from 'src/app/_models/nurses/nurseFiltersForm';
import { NurseForm } from 'src/app/_models/nurses/nurseForm';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { ServiceHelper } from 'src/app/_utils/serviceHelper/serviceHelper';
import { NursesCatalogComponent } from 'src/app/nurses/components/nurses-catalog.component';

@Component({
  selector: 'nurses-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      nursesCatalog
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
  imports: [NursesCatalogComponent, MaterialModule, CdkModule,],
})
export class NursesCatalogModalComponent {
  data = inject<CatalogDialog<Nurse, NurseParams>>(MAT_DIALOG_DATA);
}

@Component({
  selector: "[nurseForm]",
  templateUrl: './nurse-form.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ControlsModule, Forms2Module,]
})
export class NurseFormComponent
  extends BaseForm<Nurse, NurseParams, NurseFiltersForm, NurseForm, NursesService>
  implements FormInputSignals<Nurse>
{
  item: ModelSignal<Nurse | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(NursesService, NurseForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      const value = this.item();

      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }
}

@Component({
  selector: 'div[nurseDetail]',
  template: `
  <div container3 [type]="'inline'">
    <!-- <div detailHeader [(use)]="use" [(view)]="view" [(dictionary)]="service.dictionary" [id]="item() !== null ? item()!.id : null" (onDelete)="service.delete$(item()!)"></div> -->
  </div>
  <div nurseForm [(item)]="item" [(key)]="key" [(use)]="use" [(view)]="view"></div>
  `,
  standalone: true,
  imports: [NurseFormComponent, ControlsModule, Forms2Module,],
})
export class NurseDetailComponent
  extends BaseDetail<Nurse, NurseParams, NurseFiltersForm, NursesService>
  implements DetailInputSignals<Nurse>
{
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Nurse | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(NursesService);
  }

}

@Component({
  selector: 'nurse-detail-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      nurseDetail
      [(use)]="data.use"
      [(view)]="data.view"
      [(key)]="data.key"
      [(item)]="data.item"
      [(title)]="data.title"
    ></div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Cerrar</button>
  </mat-dialog-actions>
}
`,
  standalone: true,
  imports: [NurseDetailComponent, ModalWrapperModule, MaterialModule, CdkModule,],
})
export class NurseDetailModalComponent {
  data = inject<DetailDialog<Nurse>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class NursesService extends ServiceHelper<Nurse, NurseParams, NurseFiltersForm> {
  constructor() {
    super(NurseParams, 'nurses', nurseDictionary, nurseColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      NursesCatalogModalComponent,
      CatalogDialog<Nurse, NurseParams>
    >(NursesCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new NurseParams(key),
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
    item: Nurse | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      NurseDetailModalComponent,
      DetailDialog<Nurse>
    >(NurseDetailModalComponent, {
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
