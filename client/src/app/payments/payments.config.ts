import { Component, inject, Injectable } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import CatalogDialog from "src/app/_models/base/components/types/catalogDialog";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { CatalogMode, View } from "src/app/_models/base/types";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { PaymentsCatalogComponent } from "src/app/payments/payments-catalog.component";
import { Payment } from "src/app/_models/payments/payment";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { PaymentFormComponent } from "src/app/payments/payment-form.component";
import { PaymentFiltersForm } from "src/app/_models/payments/paymentFiltersForm";
import { paymentColumns, paymentDictionary } from "src/app/_models/payments/paymentConstants";
import { PaymentMethod } from "src/app/_models/paymentMethod/paymentMethod";
import { BehaviorSubject, Observable, tap } from "rxjs";
import Event from "src/app/_models/events/event";
import { HttpParams } from "@angular/common/http";
import { PaymentConfirmationMethod } from "src/app/events/components/event-payment-modal/paymentConfirmationMethod";

@Component({
  selector: 'payments-catalog-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          paymentsCatalog
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
  imports: [ PaymentsCatalogComponent, MaterialModule, CdkModule, ],
})
export class PaymentsCatalogModalComponent {
  data: CatalogDialog<Payment, PaymentParams> = inject<CatalogDialog<Payment, PaymentParams>>(MAT_DIALOG_DATA);
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends ServiceHelper<Payment, PaymentParams, PaymentFiltersForm> {
  constructor() {
    super(PaymentParams, 'payments', paymentDictionary, paymentColumns);
  }

  private paymentMethodsSubject: BehaviorSubject<PaymentMethod[]> = new BehaviorSubject<PaymentMethod[]>([]);
  public paymentMethods$: Observable<PaymentMethod[]> = this.paymentMethodsSubject.asObservable();

  /**
   * Retrieves the available payment methods for a given user.
   * @param userId - The identifier for the user.
   * @returns An Observable of an array of PaymentMethod.
   */
  getMethodsForUser(userId: number): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}methods/${userId}`).pipe(
      tap((methods) => this.paymentMethodsSubject.next(methods))
    );
  }

  getAllMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}method-types/all`);
  }

  confirmPaymentForEvent(eventId: number, paymentMethod: PaymentConfirmationMethod): Observable<Event> {
    const httpParams = new HttpParams().set('selectedPaymentMethod', paymentMethod.toString());

    return this.http.put<Event>(`${this.baseUrl}confirm-payment/event/${eventId}`, {}, { params: httpParams });
  }

  showCatalogModal(event: MouseEvent, key: string, mode: CatalogMode, view: View): void {
    this.matDialog.open<
      PaymentsCatalogModalComponent,
      CatalogDialog<Payment, PaymentParams>
    >(PaymentsCatalogModalComponent, {
      data: {
        isCompact: true,
        key: key,
        mode: mode,
        params: new PaymentParams(key),
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

@Component({
  selector: 'payments-detail-modal',
  template: `
    @defer {
      <h2 mat-dialog-title cdkDrag cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle>{{ data.title }}</h2>
      <mat-dialog-content>
        <div
          paymentForm
          [(use)]="data.use"
          [(view)]="data.view"
          [(key)]="data.key"
          [(item)]="data.item"
        ></div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cerrar</button>
      </mat-dialog-actions>
    }
  `,
  standalone: true,
  imports: [ ModalWrapperModule, MaterialModule, CdkModule, PaymentFormComponent, ],
})
export class PaymentDetailModalComponent {
  data: DetailDialog<Payment> = inject<DetailDialog<Payment>>(MAT_DIALOG_DATA);
}
