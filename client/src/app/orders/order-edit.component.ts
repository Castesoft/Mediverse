import { Component, inject, input, OnDestroy, OnInit } from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { Order } from "src/app/_models/order";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { InputControlComponent } from "src/app/_forms/input-control.component";
import { ControlSelectComponent } from "src/app/_forms/control-select.component";
import { OrdersService } from "src/app/_services/orders.service";
import { parseOrderDeliveryStatus, parseOrderStatus, reverseParseOrderDeliveryStatus, reverseParseOrderStatus } from "src/app/orders/orders-util";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: '[orderEditView]',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    FaIconComponent,
    InputControlComponent,
    ReactiveFormsModule,
    ControlSelectComponent
  ]
})
export class OrderEditComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private toastr = inject(ToastrService);
  service = inject(OrdersService);
  icons = inject(IconsService);

  key = input.required<string | undefined>();
  use = input.required<FormUse>();
  item = input.required<Order>();
  id = input.required<number>();
  view = input.required<View>();
  role = input.required<Role>();

  formGroup: FormGroup = new FormGroup({});

  readonly statusSelectOptions = [
    {
      name: 'Pendiente',
    },
    {
      name: 'Completado',
    },
    {
      name: 'Cancelado',
    }
  ]

  readonly deliveryStatusSelectOptions = [
    {
      name: 'Procesando',
    },
    {
      name: 'Enviado',
    },
    {
      name: 'Entregado',
    },
    {
      name: 'Cancelado',
    }
  ];

  ngOnInit(): void {
    this.initForm();
    this.patchForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initForm = () => {
    this.formGroup = new FormGroup({
      status: new FormControl("", Validators.required),
      deliveryStatus: new FormControl("", Validators.required),
    });
  }

  private patchForm = () => {
    this.formGroup.patchValue({
      status: parseOrderStatus(this.item().status!),
      deliveryStatus: parseOrderDeliveryStatus(this.item().deliveryStatus!),
    });
  }

  onSubmit = () => {
    const jsonPayload = {
      status: reverseParseOrderStatus(this.formGroup.value.status),
      deliveryStatus: reverseParseOrderDeliveryStatus(this.formGroup.value.deliveryStatus)
    }

    this.service.update(this.id(), jsonPayload).subscribe({
      next: () => {
        this.toastr.success('Pedido actualizado');
      }
    });
  }
}
