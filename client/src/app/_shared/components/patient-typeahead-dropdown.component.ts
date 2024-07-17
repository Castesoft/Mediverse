import {Component, computed, inject, input, model, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ControlTypeaheadComponent} from "src/app/_forms/control-typeahead.component";
import {PopoverModule} from "ngx-bootstrap/popover";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ErrorsAlertComponent} from "src/app/_forms/helpers/errors-alert.component";
import {finalize, map, Observable, Subject, takeUntil} from "rxjs";
import {UsersService} from "src/app/_services/users.service";
import {IconsService} from "src/app/_services/icons.service";
import {User, UserParams, UserSummary} from "src/app/_models/user";
import {TypeaheadComplexOption} from "src/app/_models/types";
import {createId} from "@paralleldrive/cuid2";
import {AlertModule} from "ngx-bootstrap/alert";
import {TypeaheadMatch} from "ngx-bootstrap/typeahead";
import {DatePipe, JsonPipe} from "@angular/common";

interface PatientTypeaheadOptions extends TypeaheadComplexOption {
  data: UserSummary,
}

@Component({
  selector: '[customerTypeaheadDropdown]',
  templateUrl: './patient-typeahead-dropdown.component.html',
  styleUrls: ['./patient-typeahead-dropdown.component.scss'],
  imports: [
    ControlTypeaheadComponent,
    FaIconComponent,
    PopoverModule,
    ReactiveFormsModule,
    ErrorsAlertComponent,
    AlertModule,
    JsonPipe,
    DatePipe
  ],
  standalone: true
})
export class PatientTypeaheadDropdownComponent implements OnInit, OnChanges {
  private ngUnsubscribe = new Subject<void>();
  service = inject(UsersService);
  icons = inject(IconsService);

  isUserSelected = computed(() => this.user() !== null);
  selectionErrors = input<string[]>([]);
  label = input<string>("Individuo");
  isDisabled = input.required<boolean>();
  popover = input<string | undefined>();
  user = model.required<User | null>();
  sex = input<string | undefined>();
  guid = input<string>(createId());

  submitted = false;
  loading = true;

  formGroup: FormGroup = new FormGroup({});
  userSummaries$: Observable<PatientTypeaheadOptions[]> = new Observable();
  users: UserSummary[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.loading = false;
    this.initForm();
    this.subscribeToSelectedUser();
    this.subscribeToFormValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isDisabled"]) {
      this.setInputDisabled(this.isDisabled());
    }
  }

  private subscribeToSelectedUser(): void {
    this.service.selected$(this.guid()).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (user) => {
        this.user.set(user || null);
        this.setInputStatusAndValue();
      }
    });
  }

  private initForm = (): void => {
    this.formGroup = new FormGroup({userTypeahead: new FormControl("", Validators.required)});
    this.setInputDisabled(this.isDisabled());
  };

  private subscribeToSummaries = (formValue: any) => {
    const userParams: UserParams = new UserParams(this.guid());

    userParams.search = formValue.userTypeahead;

    this.userSummaries$ = this.service.getSummaryByValue(this.guid(), userParams)
      .pipe(map((response: UserSummary[]) => {
        this.users = response;

        return response.map((user: UserSummary) => {
            return {name: user.fullName, value: user.id, data: user};
          }
        );
      }));
  };

  private setInputStatusAndValue = () => {
    if (this.isUserSelected()) {
      this.submitted = true;
      const newValue = this.user()?.fullName || "";
      const currentValue = this.formGroup.controls["userTypeahead"].value;

      if (newValue !== currentValue) {
        this.formGroup.controls["userTypeahead"].setValue(newValue);
        this.submitted = true;
      }
    } else {
      if (this.formGroup.controls["userTypeahead"].value !== "") {
        this.formGroup.controls["userTypeahead"].setValue("");
        this.submitted = false;
      }
    }
  };

  private subscribeToFormValueChanges = () => {
    this.formGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (formValue) => {
        this.subscribeToSummaries(formValue);
      }
    });
  };

  private setInputDisabled = (isDisabled: boolean): void => {
    if (!this.formGroup.controls["userTypeahead"]) return;

    if (isDisabled) {
      this.formGroup.controls["userTypeahead"].disable();
    } else {
      this.formGroup.controls["userTypeahead"].enable();
    }
  };

  onTypeaheadSelect = (data: TypeaheadMatch): void => {
    if (!data.item.value) return;

    this.loading = true;
    this.service.getById(data.item.value, "Patient")
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((user) => {
        this.service.setSelected$(this.guid(), user);
      });
  };

  onTypeaheadLoading = (loading: boolean) => this.loading = loading;
}
