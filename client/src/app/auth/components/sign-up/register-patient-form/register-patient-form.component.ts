import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';

@Component({
  selector: 'app-register-patient-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, InputControlComponent, ControlCheckComponent],
  templateUrl: './register-patient-form.component.html',
  styleUrl: './register-patient-form.component.scss'
})
export class RegisterPatientFormComponent {
  public controlContainer = inject(ControlContainer);

  submitted = input.required<boolean>();
  myForm!: FormGroup;

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;
  }
}
