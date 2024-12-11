import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { Clinic } from "src/app/_models/clinics/clinic";
import { clinicColumns, clinicDictionary } from "src/app/_models/clinics/clinicConstants";
import { ClinicFiltersForm } from "src/app/_models/clinics/clinicFiltersForm";
import { ClinicParams } from "src/app/_models/clinics/clinicParams";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Component({
  selector: 'clinics-catalog-modal',
  template: `
  @defer {
    <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
    <mat-dialog-content>
    <div
      clinicsCatalog
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
  imports: [ClinicsCatalogComponent, MaterialModule, CdkModule,],
})
export class ClinicsCatalogModalComponent {
  data = inject<CatalogDialog<Clinic, ClinicParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class ClinicsService extends ServiceHelper<Clinic, ClinicParams, ClinicFiltersForm> {
  constructor() {
    super(ClinicParams, 'clinics',  clinicDictionary, clinicColumns);
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      ClinicsCatalogModalComponent,
      CatalogDialog<Clinic, ClinicParams>
    >(ClinicsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new ClinicParams(key),
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
    item: Clinic | null = null,
    key: string | null = null,
    use: FormUse = 'detail',
    view: View,
    title: string | null = null
  )
  {
  if (view === 'modal') {
    this.matDialog.open<
      ClinicDetailModalComponent,
      DetailDialog<Clinic>
    >(ClinicDetailModalComponent, {
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

  getClinicsByZipcode(zipcode: string) {
    return this.http.get<ZipcodeClinicOption[]>(`${this.baseUrl}zipcodes/${zipcode}`);
  }
}
