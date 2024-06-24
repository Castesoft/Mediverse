import { Component, OnInit, OnDestroy, ViewChild, input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../_models/pagination';
import { PatientsFilterModalComponent } from './patients-filter-modal.component';
import { CatalogMode } from '../../_models/types';
import { datepickerConfig } from '../../_utils/util';
import { ConfirmService } from '../../_services/confirm/confirm.service';
import { IconsService } from '../../_services/icons.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, DecimalPipe, LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchTextComponent } from '../../_forms/search-text.component';
import { SearchDateRangeComponent } from '../../_forms/search-date-range.component';
import { TablePagerComponent } from '../../_utils/table/table-pager.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PatientsTableComponent } from './patients-table.component';
import { patients } from '../../data/patients';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PatientsFilterModalService } from './patients-filter-modal.service';
import { TableHeaderComponent } from '../../_utils/table/table-header.component';
import { FilterForm, Patient, PatientParams } from '../../_models/patient';
import { PatientsService } from '../../_services/data/patients.service';

@Component({
  selector: '[patientsCatalogView]',
  templateUrl: './patients-catalog.component.html',
  standalone: true,
  imports: [ TableHeaderComponent, NgClass, FontAwesomeModule, LowerCasePipe, DecimalPipe, RouterModule, ReactiveFormsModule, SearchTextComponent,
    SearchDateRangeComponent, TablePagerComponent, AlertModule, PatientsTableComponent, TitleCasePipe, DatePipe, 
   ],
})
export class PatientsCatalogComponent implements OnInit, OnDestroy {
  private bsModalService = inject(BsModalService);
  private modalService = inject(PatientsFilterModalService);

  isCompact = input.required<boolean>();
  mode = input.required<CatalogMode>();

  modalRef: BsModalRef<PatientsFilterModalComponent> = new BsModalRef<PatientsFilterModalComponent>();
  
  data?: Patient[];
  params = new PatientParams();
  pagination?: Pagination;
  filterForm = new FilterForm();
  datepickerConfig = datepickerConfig;
  loading: boolean = true;
  private ngUnsubscribe = new Subject<void>();

  createRoute = `/admin/utilerias/${this.service.subjectRoute}/nuevo`;

  get selectedCount(): number { return this.data?.filter((item) => item.isSelected).length ?? 0; }
  get hasSelected(): boolean { return this.data?.some((item) => item.isSelected) ?? false; }
  get selectedIdsAsString(): string { return (this.data?.filter((item) => item.isSelected).map((item) => item.id).join(',') || ''); }

  onDelete = () => Patient.deleteItems(this.data ?? [], this.service, this.confirm, this.toastr);
  goToCreate = () => this.router.navigate([this.createRoute]);

  constructor(
    public router: Router,
    public service: PatientsService,
    private confirm: ConfirmService,
    public icons: IconsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.service.params$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.params = params;
        this.loadData(params);
        this.filterForm.patchValue(params);
      });

    this.filterForm.formGroup.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service.loading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: PatientParams) {
    this.service.getPagedList(params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.filterForm.formGroup;
    const { dateRange, search } = controls;

    this.params.updateFromPartial({
      ...value,
      dateCreatedStart: dateRange.value[0],
      dateCreatedEnd: dateRange.value[1],
    });

    this.service.setParams(this.params);
    this.filterForm.patchValue(this.params);
  };

  showFiltersModal = (): void => {
    this.modalRef = this.bsModalService.show(PatientsFilterModalComponent, this.modalService.getConfig(this.filterForm.id));
  }

  hideFiltersModal = (): void => {
    this.modalRef.hide();
  }
}
