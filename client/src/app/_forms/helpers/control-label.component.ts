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
  `,
  standalone: true,
  imports: [ OptionalSpanComponent, NewBadgeComponent, CommonModule, ],
})
export class ControlLabelComponent {
  service = inject(FormsService);

  control = model.required<Control<Date | string | boolean>>();

  baseClass = '';

  @HostBinding('class') get class() {
    return this.baseClass;
  }

  @HostBinding('for') get for() {
    return this.control().id;
  }

  constructor() {
    effect(() => {
      if (this.control().orientation === 'inline') {
        this.baseClass = 'col-form-label fw-semibold  text-nowrap';
      } else {
        this.baseClass = 'form-label fw-semibold ';
      }

      if (this.control().type === 'check') {
        this.baseClass = 'form-check-label';
      }

      return this.baseClass;
    })
  }
}

