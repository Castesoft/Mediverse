import {
  Component,
  DestroyRef,
  inject,
  Injectable,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import BaseDetail from 'src/app/_models/base/components/extensions/baseDetail';
import CatalogDialog from 'src/app/_models/base/components/types/catalogDialog';
import DetailDialog from 'src/app/_models/base/components/types/detailDialog';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { DetailInputSignals } from 'src/app/_models/forms/formComponentInterfaces';
import { FormUse } from 'src/app/_models/forms/formTypes';
import Nurse from 'src/app/_models/nurses/nurse';
import { NurseAssociationRequest, nurseColumns, nurseDictionary } from 'src/app/_models/nurses/nurseConstants';
import { NurseFiltersForm } from 'src/app/_models/nurses/nurseFiltersForm';
import { NurseParams } from 'src/app/_models/nurses/nurseParams';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { ServiceHelper } from 'src/app/_utils/serviceHelper/serviceHelper';
import { NursesCatalogComponent } from 'src/app/nurses/components/nurses-catalog.component';
import { NurseFormComponent } from 'src/app/nurses/nurse-form.component';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Account } from "src/app/_models/account/account";
import { Observable } from "rxjs";

@Component({
  selector: 'nurses-catalog-modal',
  template: `
    @defer {
      <div class="card">
        @if (data.title) {
          <div class="card-header">
            <div class="card-title">
              <h3>{{ data.title }}</h3>
            </div>
          </div>
        }
        <div class="card-body pt-0">
          <div
            nursesCatalog
            [embedded]="true"
            [(mode)]="data.mode"
            [(key)]="data.key"
            [(view)]="data.view"
            [(isCompact)]="data.isCompact"
            [(item)]="data.item"
            [(params)]="data.params"
          ></div>

          <div class="d-flex w-100 justify-content-end mt-6">
            @if (selectedNurseCount > 0) {
              <button class="btn btn-secondary btn-sm me-2" mat-dialog-close>Cancelar</button>
              <button class="btn btn-primary btn-sm" mat-dialog-close>Seleccionar {{ selectedNurseCount }}
                @if (selectedNurseCount > 1) {
                  especialistas
                } @else {
                  especialista
                }
              </button>
            } @else {
              <button class="btn btn-secondary btn-sm" mat-dialog-close>Cerrar</button>
            }
          </div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [ MaterialModule, CdkModule, NursesCatalogComponent, ],
})
export class NursesCatalogModalComponent implements OnInit {
  private readonly nurses: NursesService = inject(NursesService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  data: CatalogDialog<Nurse, NurseParams> = inject<CatalogDialog<Nurse, NurseParams>>(MAT_DIALOG_DATA);
  onConfirm: OutputEmitterRef<void> = output<void>();

  selectedNurseCount: number = 0;

  ngOnInit(): void {
    this.subscribeToSelectedNurses();
  }

  private subscribeToSelectedNurses(): void {
    this.nurses.multipleSelected$(this.data.key).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (selectedNurses: Nurse[]): number => this.selectedNurseCount = selectedNurses.length
    })
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
  imports: [ NurseFormComponent, ControlsModule, Forms2Module, ],
})
export class NurseDetailComponent
  extends BaseDetail<Nurse, NurseParams, NurseFiltersForm, NursesService>
  implements DetailInputSignals<Nurse> {
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
  imports: [ NurseDetailComponent, ModalWrapperModule, MaterialModule, CdkModule, ],
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

  associateOrInviteNurse(payload: NurseAssociationRequest): Observable<Account | { message: string }> {
    return this.http.post<Account | { message: string }>(`${this.baseUrl}associate`, payload);
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
}
