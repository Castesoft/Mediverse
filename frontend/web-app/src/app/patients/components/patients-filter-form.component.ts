import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject, takeUntil } from "rxjs";
import { ControlDateComponent } from "../../_forms/form-control-datepicker.component";
import { ControlMultiselectComponent } from "../../_forms/form-control-multiselect.component";
import { InputControlComponent } from "../../_forms/form-control.component";
import { ControlSwitchComponent } from "../../_forms/form-switch.component";
import { SearchDateRangeComponent } from "../../_forms/search-date-range.component";
import { SearchTextComponent } from "../../_forms/search-text.component";
import { FilterForm, PatientParams } from "../../_models/patient";
import { PatientsService } from "../../_services/data/patients.service";
import { IconsService } from "../../_services/icons.service";
import { datepickerConfig } from "../../_utils/util";
import { PatientsFilterModalComponent } from "./patients-filter-modal.component";

@Component({
  selector: '[filterForm]',
  templateUrl: './patients-filter-form.component.html',
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, BsDatepickerModule, SearchDateRangeComponent, SearchTextComponent,
    ControlSwitchComponent, InputControlComponent, FontAwesomeModule, CollapseModule, ControlMultiselectComponent,
    ControlDateComponent,
   ],
})
export class PatientsFilterFormComponent implements OnInit {
  modal: BsModalRef<PatientsFilterModalComponent> = new BsModalRef<PatientsFilterModalComponent>();

  filterForm = new FilterForm();
  params = new PatientParams();
  datepickerConfig = datepickerConfig;
  debug = true;
  isAdvancedFiltersCollapsed = true;

  private ngUnsubscribe = new Subject<void>();

  onSubmit = () => this.handleFormValueChange();

  constructor(public service: PatientsService, public icons: IconsService) { }

  ngOnInit(): void {
    this.service.params$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        this.params = params;
        this.filterForm.patchValue(params);
      });

    this.filterForm.formGroup.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.filterForm.formGroup;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateCreatedStart: dateRange.value[0],
      dateCreatedEnd: dateRange.value[1],
    });

    this.service.setParams(this.params);
  }

  onReset = () => {
    this.service.resetParams();
  }
}
