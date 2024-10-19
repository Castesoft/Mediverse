import { Component, effect, HostBinding, inject, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewBadge3Component } from 'src/app/_forms/_new/_helper/new-badge-3.component';
import { OptionalSpan3Component } from 'src/app/_forms/_new/_helper/optional-span-3.component';
import { FormGroup2 } from 'src/app/_forms/form2';
import { SelectOptionPair } from 'src/app/_models/select-option-pair';
import { FormsService } from 'src/app/_services/forms.service';
import { IconsService } from 'src/app/_services/icons.service';

@Component({
  selector: 'label[groupLabel]',
  templateUrl: './group-label.component.html',
  standalone: true,
  imports: [OptionalSpan3Component, NewBadge3Component, FontAwesomeModule, ],
})
export class GroupLabelComponent {
  icons = inject(IconsService);
  service = inject(FormsService);

  group = model.required<FormGroup2<SelectOptionPair>>();

  constructor() {
    effect(() => {

    })
  }

  @HostBinding('class') get class() {
    return this.group().orientation === 'inline' ? 'col-form-label fw-semibold fs-8 text-nowrap d-flex' : 'form-label fw-semibold fs-8';
  }

  @HostBinding('for') get for() {
    return this.group().id;
  }

}
