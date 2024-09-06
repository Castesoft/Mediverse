import { Component, HostBinding, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { firstValueFrom, skip, Subject, takeUntil } from 'rxjs';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { AccountService } from 'src/app/_services/account.service';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlTextareaComponent } from 'src/app/_forms/control-textarea.component';
import { TabDirective, TabsetComponent } from "ngx-bootstrap/tabs";
import { CommonModule } from '@angular/common';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { DoctorClinic } from 'src/app/_models/account';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ClinicSelectorModalComponent } from '../clinic-selector-modal/clinic-selector-modal.component';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, FaIconComponent, BootstrapModule,
    PatientSelectTypeaheadComponent, PatientSelectDisplayCardComponent, PrescriptionProductsTableComponent,
    EventSelectDisplayCardComponent, EventSelectTypeaheadComponent, ControlTextareaComponent, CommonModule,
    UserProfilePictureComponent,
    TooltipModule
  ],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent implements OnInit, OnDestroy {
  accountService = inject(AccountService);
  private prescriptionsService = inject(PrescriptionsService);
  private productsService = inject(ProductsService);
  private confirmService = inject(ConfirmService);
  private patientsService = inject(UsersService);
  private eventsService = inject(EventsService);
  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);
  icons = inject(IconsService);
  fb = inject(FormBuilder);
  router = inject(Router);
  private bsModalService = inject(BsModalService);

  @HostBinding('class') get hostClass() {
    if (this.view() === 'page') return 'pt-9 pb-9';
    else return '';
  }

  id = input.required<number | null>();
  componentId = input<string>();
  use = input.required<FormUse>();
  view = input.required<View>();
  key = input<string>();
  style = input<FormControlStyles>('solid');
  _key = createId();

  item = input<Prescription>();
  mainClinic: DoctorClinic | undefined = undefined;
  selectedClinic: DoctorClinic | undefined = undefined;

  prescription: Prescription = {
    id: 0,
    exchangeAmount: 1,
    notes: '',
    items: [],
    isSelected: false,
    isCollapsed: true,
    createdAt: new Date(),
    logoUrl: ''
  }

  patient?: User;
  selectedPatientKey = createId();

  products: Product[] = [];
  selectedProductsKey = createId();

  event?: Event;
  selectedEventKey = createId();

  activeTab?: TabDirective;

  isSubmitted = false;

  formGroup: FormGroup = this.fb.group({
    notes: ['', [Validators.required]]
  });

  @ViewChild("memberTabs", { static: false }) memberTabs?: TabsetComponent;

  doctorName = 'John Doe';
  doctorSpecialty = 'General Practitioner';
  doctorAddress = '123 Medical St, City, Country';
  doctorPhone = '(123) 456-7890';
  currentDate = new Date();

  ngOnInit() {
    this.mainClinic = this.accountService.current()?.doctorClinics.find(x => x.isMain);
    this.selectedClinic = this.mainClinic;

    if (this.use() !== 'create' && this.item()) {
      this.prescription = this.item()!;
      this.patient = this.item()?.patient;
      this.event = this.item()?.event;
      this.formGroup.get('notes')?.setValue(this.item()?.notes);

      this.subscribeToRouteQueryParams();
    }

    if (this.use() !== 'detail') {
      this.subscribeToSelectedPatient();
      this.subscribeToSelectedProducts();
      this.subscribeToSelectedEvent();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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


  private subscribeToRouteQueryParams = () => {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params) => {
        if (params["tab"]) {
          this.selectTab(params["tab"]);
        } else {
          this.selectTab("patient");
        }
      }
    });
  };

  private selectTab = (id: string) => {
    if (this.memberTabs) {
      console.log(id);
      const tab = this.memberTabs.tabs.find((x) => x.id === id);
      if (tab) {
        tab.active = true;
      }
    }
  };

  onTabActivated = (data: TabDirective) => {
    this.activeTab = data;
    console.log(this.activeTab.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: data.id },
      queryParamsHandling: "merge"
    });
  };

  selectProduct(product: PrescriptionItem) {
    if (product.itemId === 0 && this.prescription.items.findIndex(item => item.itemId === 0) === -1) {
      this.prescription.items.push(product);
    } else {
      const emtpyIndex = this.prescription.items.findIndex(item => item.itemId === 0);
      this.prescription.items[emtpyIndex] = product;
    }
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
        prescriptionItems: this.prescription.items.filter(item => item.itemId !== 0).map((item) => {
          return {
            instructions: item.instructions,
            dosage: item.dosage,
            notes: item.notes,
            productId: item.itemId || null,
            quantity: item.quantity
          }
        }),
        clinicId: this.selectedClinic?.id || null
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
          this.router.navigate(['/home/prescriptions', this.prescription.id], { queryParams: { edited: true } });
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  openClinicSelector() {
    const clinicSelectorModalRef = this.bsModalService.show(ClinicSelectorModalComponent, {
      initialState: {
        title: 'Seleccionar Clínica',
        onClinicSelected: (clinic: DoctorClinic) => {
          this.selectedClinic = clinic;
        }
      },
    });
  }
}
