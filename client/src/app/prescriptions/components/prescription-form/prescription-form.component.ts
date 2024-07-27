import { Component, HostBinding, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createId } from '@paralleldrive/cuid2';
import { Prescription, PrescriptionItem } from 'src/app/_models/prescription';
import { Product } from 'src/app/_models/product';
import { FormControlStyles, FormUse, View } from 'src/app/_models/types';
import { User } from 'src/app/_models/user';
import { Event } from 'src/app/_models/event';
import { EventsService } from 'src/app/_services/events.service';
import { ProductsService } from 'src/app/_services/products.service';
import { UsersService } from 'src/app/_services/users.service';
import { PatientSelectTypeaheadComponent } from 'src/app/_shared/components/patient-select-typeahead.component';
import { PatientSelectDisplayCardComponent } from 'src/app/patients/patient-select-display-card.component';
import { PrescriptionProductsTableComponent } from './prescription-products-table/prescription-products-table.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { EventSelectDisplayCardComponent } from 'src/app/events/event-select-display-card.component';
import { EventSelectTypeaheadComponent } from 'src/app/events/event-select-typeahead.component';
import { firstValueFrom, skip } from 'rxjs';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { AccountService } from 'src/app/_services/account.service';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { Router } from '@angular/router';
import { ControlTextareaComponent } from 'src/app/_forms/control-textarea.component';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, FaIconComponent, BootstrapModule,
    PatientSelectTypeaheadComponent, PatientSelectDisplayCardComponent, PrescriptionProductsTableComponent,
    EventSelectDisplayCardComponent, EventSelectTypeaheadComponent, ControlTextareaComponent
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent {
  public fb = inject( FormBuilder );
  private patientsService = inject(UsersService);
  private eventsService = inject(EventsService);
  private productsService = inject(ProductsService);
  private confirmService = inject(ConfirmService);
  private accountService = inject(AccountService);
  private prescriptionsService = inject(PrescriptionsService);
  router = inject(Router);
  icons = inject(IconsService);

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') return 'card-body pt-9 pb-9';
    else return '';
  }

  id = input.required<number | null>();
  use = input.required<FormUse>();
  view = input.required<View>();
  key = input<string>();
  style = input<FormControlStyles>('solid');
  _key = createId();

  item = input<Prescription>();

  prescription: Prescription = {
    id: 0,
    exchangeAmount: 1,
    notes: '',
    items: [],
    isSelected: false,
    isCollapsed: true,
    createdAt: new Date()
  }

  patient?: User;
  selectedPatientKey = createId();

  products: Product[] = [];
  selectedProductsKey = createId();

  event?: Event;
  selectedEventKey = createId();

  isSubmitted = false;

  formGroup: FormGroup = this.fb.group({
    notes: ['', [Validators.required]]
  });

  ngOnInit() {
    if (this.use() !== 'create' && this.item()) {
      this.prescription = this.item()!;
      this.patient = this.item()?.patient;
      this.event = this.item()?.event;
      this.formGroup.get('notes')?.setValue(this.item()?.notes);
    }

    if (this.use() !== 'detail') {
      this.subscribeToSelectedPatient();
      this.subscribeToSelectedProducts();
      this.subscribeToSelectedEvent();
    }
  }

  private subscribeToSelectedPatient = () => {
    this.patientsService.selected$(this.selectedPatientKey)
    .pipe(skip(this.use() === 'edit' ? 1 : 0))
    .subscribe({
      next: (patient) => {
        this.patient = patient;
        this.event = undefined;
      }
    });
  }

  private subscribeToSelectedEvent = () => {
    this.eventsService.selected$(this.selectedEventKey)
    .pipe(skip(this.use() === 'edit' ? 1 : 0))
    .subscribe({
      next: (event) => {
        this.patientsService.setSelected$(this.selectedPatientKey, event?.patient || undefined);
        this.event = event || undefined;
      }
    });
  }

  private subscribeToSelectedProducts = () => {
    this.productsService.multipleSelected$(this.selectedProductsKey)
    .pipe(skip(this.use() === 'edit' ? 1 : 0))
    .subscribe({
      next: (products) => {
        console.log(products)
        if (products) {
          this.products = products;
          this.prescription.items = products.map((product): PrescriptionItem => {
            return {
              instructions: "",
              notes: "",
              quantity: 1,
              createdAt: "",
              description: "",
              discount: 0,
              dosage: "",
              itemId: 0,
              lotNumber: "",
              manufacturer: "",
              name: "",
              price: 0,
              unit: ""
            };
          });
        }
      }
    });
  }

  selectProduct(product: PrescriptionItem) {
    this.prescription.items.push(product);
  }

  deleteProduct(product: PrescriptionItem) {
    this.prescription.items = this.prescription.items.filter(prescriptionItem => prescriptionItem.itemId !== product.itemId)
  }

  onSubmit = async () => {
    const authorized = await firstValueFrom(this.confirmService.confirm({
      btnCancelText: 'Cancelar',
      btnOkText: "Confirmar",
      message: "¿Está seguro de que desea guardar la receta?",
      title: "Favor de confirmar la operación"
    }));

    if (!authorized) return;

    if (this.use() === 'create') {
      const jsonPayload = {
        exchangeAmount: this.prescription.exchangeAmount,
        eventId: this.event?.id || null,
        patientId: this.patient?.id || null,
        notes: this.formGroup.get('notes')?.value,
        prescriptionItems: this.prescription.items.map((item) => {
          return {
            instructions: item.instructions,
            dosage: item.dosage,
            notes: item.notes,
            productId: item.itemId || null,
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
          this.router.navigate(['/home/prescriptions']);
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else if (this.use() === 'edit') {
      const jsonPayload = {
        notes: this.formGroup.get('notes')?.value,
      };

      this.prescriptionsService.update(this.prescription.id, jsonPayload).subscribe({
        next: (response) => {
          this.router.navigate(['/home/prescriptions', this.prescription.id], {queryParams: {edited: true}});
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
