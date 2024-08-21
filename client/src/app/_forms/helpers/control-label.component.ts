import { CommonModule } from "@angular/common";
import { Component, effect, HostBinding, inject, model } from "@angular/core";
import { Control } from "src/app/_forms/form";
import { NewBadgeComponent } from "src/app/_forms/helpers/new-badge.component";
import { OptionalSpanComponent } from "src/app/_forms/helpers/optional-span.component";
import { FormsService } from "src/app/_services/forms.service";

@Component({
  selector: 'label[controlLabel]',
  host: { class: '', },
  template: `
    {{ control().label }}
    {{ control().required ? '*' : null}}
    @if(control().optional){@if (service.isOptional(control().formControl) || !control().isReadonly) {
    <span optionalSpan></span>
    }}
    @if (control().isNew) {
    <span newBadge></span>
    }
    @if(isCheck) {
      <ng-content></ng-content>
    }
  `,
  standalone: true,
  imports: [ OptionalSpanComponent, NewBadgeComponent, CommonModule, ],
})
export class ControlLabelComponent {
  service = inject(FormsService);

  control = model.required<Control<Date | string | boolean>>();

  baseClass = '';
  isCheck = false;

  @HostBinding('class') get class() {
    return this.baseClass;
  }

  @HostBinding('for') get for() {
    return this.control().id;
  }

  constructor() {
    effect(() => {
      this.control().type === 'check' ? this.isCheck = true : this.isCheck = false;

      if (this.control().orientation === 'inline') {
        this.baseClass = 'col-form-label fw-semibold fs-6 text-nowrap';
      } else {
        this.baseClass = 'form-label fw-semibold fs-6';
      }

      if (this.control().type === 'check') {
        this.baseClass = 'form-check form-check-custom form-check-solid';
      }

      return this.baseClass;
    })
  }
}

