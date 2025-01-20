import { Component, effect, inject, input, model } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { IconsService } from "src/app/_services/icons.service";
import { Control } from "src/app/_forms/form";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { LegacyControlLabelComponent } from "src/app/_forms/helpers/control-label.component";

@Component({
  host: { class: 'fw-semibold mb-0 w-100', },
  selector: '[controlDate2]',
  templateUrl: './control-date2.component.html',
  imports: [
    OptionalSpanComponent, ReactiveFormsModule, NewBadgeComponent,
    FaIconComponent,  InvalidFeedbackComponent, HelpBlockComponent, CommonModule, CdkModule, MaterialModule,
    LegacyControlLabelComponent,
   ],
  providers: [ DatePipe,],
  standalone: true,
})
export class ControlDate2Component {
  validation = inject(ValidationService);
  icons = inject(IconsService);
  private datePipe = inject(DatePipe);

  control = model.required<Control<Date>>();
  minMode = input<"day" | "month" | "year">("day");
  maxDate = input<Date | undefined>();

  constructor() {
    effect(() => {
      if (this.control().isReadonly) {
        // this.control().formControl.setValue(this.datePipe.transform(this.control().value, 'dd/MM/YYYY', '', 'es-MX'));
        this.control().formControl.updateValueAndValidity();
      }
    });
  }
}
