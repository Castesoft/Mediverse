import { Component, inject } from '@angular/core';
import { AsideStepperComponent } from './aside-stepper/aside-stepper.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { FormActionsComponent } from './form-actions/form-actions.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [AsideStepperComponent, FormActionsComponent, BottomLinksComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  fb = inject(FormBuilder);

  currentStep = 1;

  steps = [
    { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' },
    { number: 2, title: 'Ajustes de Cuenta', subtitle: 'Configure su cuenta' },
    { number: 3, title: 'Detalles de Envío', subtitle: 'Configure sus detalles de envío' },
    { number: 4, title: 'Datos de Pago', subtitle: 'Provea sus datos de pago' },
    { number: 5, title: 'Completada', subtitle: 'Su cuenta ha sido creada' },
  ];

  step1Form:FormGroup = this.fb.group({
    full_name   : [ '', [Validators.required, Validators.minLength(3)] ],
  });
  
  patientForm: FormGroup = this.fb.group({
    step1: this.step1Form,
    // step2: this.step2Form,
    // step3: this.step3Form,
    // step4: this.step4Form,
    // step5: this.step5Form,
  });

  onSubmit() {
    // Submit form
    this.currentStep++;
  }
}
