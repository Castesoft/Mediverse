import { Component, inject, input, OnInit } from "@angular/core";
import { FormUse, Role, View } from "src/app/_models/types";
import { InputControlComponent } from "src/app/_forms/input-control.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UsersService } from "src/app/_services/users.service";
import { User } from "src/app/_models/user";
import { createId } from "@paralleldrive/cuid2";
import { Product } from "src/app/_models/product";
import { ProductsService } from "src/app/_services/products.service";
import { PatientSelectTypeaheadComponent } from "src/app/_shared/components/patient-select-typeahead.component";
import { PatientSelectDisplayCardComponent } from "src/app/patients/patient-select-display-card.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { PrescriptionProductsTableComponent } from "src/app/prescriptions/components/prescription-products-table.component";
import { Prescription, PrescriptionItem } from "src/app/_models/prescription";
import { EventsService } from "src/app/_services/events.service";
import { Event } from "src/app/_models/event";
import { EventSelectTypeaheadComponent } from "src/app/events/event-select-typeahead.component";
import { EventSelectDisplayCardComponent } from "src/app/events/event-select-display-card.component";
import { BootstrapModule } from "src/app/_shared/bootstrap.module";
import { ConfirmService } from "src/app/_services/confirm.service";
import { firstValueFrom } from "rxjs";
import { PrescriptionsService } from "src/app/_services/prescriptions.service";
import { AccountService } from "src/app/_services/account.service";

@Component({
  selector: '[prescriptionNewView]',
  templateUrl: 'prescription-new.component.html',
  standalone: true,
  imports: [
    InputControlComponent,
    ReactiveFormsModule,
    PatientSelectTypeaheadComponent,
    PatientSelectDisplayCardComponent,
    FaIconComponent,
    PrescriptionProductsTableComponent,
    EventSelectTypeaheadComponent,
    EventSelectDisplayCardComponent,
    BootstrapModule
  ]
})
export class PrescriptionNewComponent implements OnInit {
  private prescriptionsService = inject(PrescriptionsService);
  private productsService = inject(ProductsService);
  private confirmService = inject(ConfirmService);
  private accountService = inject(AccountService);
  private patientsService = inject(UsersService);
  private eventsService = inject(EventsService);
  icons = inject(IconsService);

  use = input.required<FormUse>();
  view = input.required<View>();
  role = input.required<Role>();

  prescription: Prescription = {
    id: 0,
    exchangeAmount: 1,
    notes: '',
    items: [],
    isSelected: false
  }

  patient?: User;
  selectedPatientKey = createId();

  products: Product[] = [];
  selectedProductsKey = createId();

  event?: Event;
  selectedEventKey = createId();

  formGroup: FormGroup = new FormGroup({});

  submitted = false;

  ngOnInit(): void {
    this.initForm();
    this.subscribeToSelectedPatient();
    this.subscribeToSelectedProducts();
    this.subscribeToSelectedEvent();
  }

  private initForm = () => {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
    });
  }

  private subscribeToSelectedPatient = () => {
    this.patientsService.selected$(this.selectedPatientKey).subscribe({
      next: (patient) => {
        this.patient = patient;
      }
    });
  }

  private subscribeToSelectedEvent = () => {
    this.eventsService.selected$(this.selectedEventKey).subscribe({
      next: (event) => {
        this.event = event || undefined;
        this.patientsService.setSelected$(this.selectedPatientKey, event?.patient || undefined);
      }
    });
  }

  private subscribeToSelectedProducts = () => {
    this.productsService.multipleSelected$(this.selectedProductsKey).subscribe({
      next: (products) => {
        if (products) {
          this.products = products;
          this.prescription.items = products.map((product): PrescriptionItem => {
            return {
              instructions: "",
              notes: "",
              quantity: 1,
              product: product
            };
          });

          console.log(this.prescription);
        }
      }
    });
  }

  onSubmit = async () => {
    const authorized = await firstValueFrom(this.confirmService.confirm({
      btnCancelText: 'Cancelar',
      btnOkText: "Confirmar",
      message: "¿Está seguro de que desea guardar la receta?",
      title: "Favor de confirmar la operación"
    }));

    if (!authorized) return;

    const jsonPayload = {
      exchangeAmount: this.prescription.exchangeAmount,
      eventId: this.event?.id || null,
      patientId: this.patient?.id || null,
      prescriptionItems: this.prescription.items.map((item) => {
        return {
          instructions: item.instructions,
          dosage: '',
          notes: item.notes,
          productId: item.product?.id || null,
          quantity: item.quantity
        }
      })
    };

    const doctorId = this.accountService.current()?.id;

    if (!doctorId) {
      console.error("Doctor ID not found");
      return;
    }

    this.prescriptionsService.create(jsonPayload, doctorId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
