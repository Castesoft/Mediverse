declare var google: any;
import { Component, inject, model, ModelSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  TermsAndConditionsModalComponent
} from '../../terms-and-conditions-modal/terms-and-conditions-modal.component';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";

@Component({
  selector: 'app-register-patient-form',
  templateUrl: './register-patient-form.component.html',
  styleUrls: [ './register-patient-form.component.scss' ],
  imports: [ RouterLink, ReactiveFormsModule, Forms2Module, ],
})
export class RegisterPatientFormComponent implements OnInit {
  form: ModelSignal<PatientRegisterForm> = model.required<PatientRegisterForm>();
  isSubmitting: ModelSignal<boolean> = model.required();
  fromWrapper: WritableSignal<boolean> = signal(false);

  private bsModalService: BsModalService = inject(BsModalService);
  authNavigation = inject(AuthNavigationService);

  ngOnInit() {
    const btnContainer: HTMLElement | null = document.getElementById('google-btn-signup');
    if (btnContainer) {
      google.accounts.id.renderButton(btnContainer, {
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
        locale: 'es',
        width: 700,
        height: 200
      });
    }
  }

  openTermsAndConditionsModal() {
    this.bsModalService.show(TermsAndConditionsModalComponent);
  }
}
