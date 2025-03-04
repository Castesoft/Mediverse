import { Component, inject, input, InputSignal } from '@angular/core';
import { Subscription } from 'src/app/_models/subscriptions/subscription';
import { BsDropdownDirective, BsDropdownMenuDirective, BsDropdownToggleDirective } from "ngx-bootstrap/dropdown";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoSize } from "src/app/_models/photos/photoTypes";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import {
  SubscriptionCancelModalComponent
} from "src/app/subscriptions/components/subscription-cancel-modal/subscription-cancel-modal.component";

@Component({
  selector: 'div[doctorSubscriptionCard]',
  templateUrl: './doctor-subscription-card.component.html',
  styleUrls: [ './doctor-subscription-card.component.scss' ],
  imports: [
    BsDropdownDirective,
    BsDropdownToggleDirective,
    SymbolCellComponent,
    BsDropdownMenuDirective,
    CurrencyPipe,
    DatePipe
  ]
})
export class DoctorSubscriptionCardComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  private matDialog: MatDialog = inject(MatDialog);

  subscription: InputSignal<Subscription | null> = input.required();

  openCancelSubscriptionModal() {
    this.matDialog.open(SubscriptionCancelModalComponent,
      {
        data: {
          subscription: this.subscription()
        }
      });
  }
}
