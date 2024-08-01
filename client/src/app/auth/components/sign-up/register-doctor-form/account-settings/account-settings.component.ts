import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [ReactiveFormsModule, InputControlComponent, ControlCheckComponent, RouterLink],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  public controlContainer = inject(ControlContainer);

  submitted = input.required<boolean>();
  myForm!: FormGroup;

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;
  }
}
