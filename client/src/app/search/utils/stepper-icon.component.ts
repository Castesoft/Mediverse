import { CommonModule } from "@angular/common";
import { Component, model } from "@angular/core";

@Component({
  host: { class: 'stepper-icon w-40px h-40px', },
  selector: 'div[stepperIcon]',
  templateUrl: './stepper-icon.component.html',
  standalone: true,
  imports: [ CommonModule, ],
})
export class StepperIconComponent {
  index = model.required<number>();
}
