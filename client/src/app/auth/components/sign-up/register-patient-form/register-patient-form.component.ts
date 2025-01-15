declare var google: any;
import { Component, inject, model, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  TermsAndConditionsModalComponent
} from '../../terms-and-conditions-modal/terms-and-conditions-modal.component';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';

@Component({
  selector: 'app-register-patient-form',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, Forms2Module, ],
  templateUrl: './register-patient-form.component.html',
})
export class RegisterPatientFormComponent {
  form = model.required<PatientRegisterForm>();

  fromWrapper = signal(false);

  private bsModalService = inject(BsModalService);

  ngOnInit() {
    google.accounts.id.renderButton(document.getElementById('google-btn-signup'), {
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      locale: 'es',
      width: document.getElementById('google-btn-signup')!.offsetWidth.toFixed(0).toString() > '400' ? document.getElementById('google-btn-signup')!.offsetWidth.toFixed(0).toString() : '400',
      height: '80'
    });
  }

  openTermsAndConditionsModal() {
    this.bsModalService.show(TermsAndConditionsModalComponent);
  }
}
