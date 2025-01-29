import {
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  OnDestroy,
  Signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationService } from "src/app/_services/validation.service";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Subject } from "rxjs";
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { Forms2HelperModule } from "src/app/_forms2/helper/forms-2-helper.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MaterialModule } from "src/app/_shared/material.module";
import { CdkModule } from "src/app/_shared/cdk.module";
import { model, ModelSignal } from "@angular/core";

@Component({
  selector: "div[controlSelect3]",
  templateUrl: "./control-select-3.component.html",
  styleUrls: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Forms2HelperModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MaterialModule,
    CdkModule,
  ],
})
export class ControlSelect3Component implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  validation: ValidationService = inject(ValidationService);

  control: ModelSignal<FormControl2<SelectOption | null>> = model.required();
  fromWrapper: ModelSignal<boolean> = model.required<boolean>();

  root: Signal<FormGroup2<any>> = computed(() => this.control().root as FormGroup2<any>);

  class: string = "mb-0";

  @HostBinding("class")
  get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.fromWrapper()) {
        this.class = "mb-0 w-100";
      } else {
        this.class = "mb-0 col-auto px-0";
      }
    });
  }

  compareFn(option1: SelectOption | null, option2: SelectOption | null): boolean {
    return option1?.id === option2?.id;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
