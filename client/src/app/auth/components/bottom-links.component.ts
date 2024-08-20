import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PrivacyPoliciesModalComponent } from './privacy-policies-modal/privacy-policies-modal.component';
import { TermsAndConditionsModalComponent } from './terms-and-conditions-modal/terms-and-conditions-modal.component';
import { UseOfCookiesModalComponent } from './use-of-cookies-modal/use-of-cookies-modal.component';

@Component({
  selector: '[bottomLinks]',
  template: `
    <div class="d-flex flex-center fw-semibold fs-6">
      <a
        (click)="openTermsAndConditionsModal()"
        class="text-muted text-hover-primary px-2"
        style="cursor: pointer"
        >Términos y condiciones</a
      >

      <a
        (click)="openPrivacyPoliciesModal()"
        class="text-muted text-hover-primary px-2"
        style="cursor: pointer"
        >Política de privacidad</a
      >

      <a
        (click)="openUseOfCookiesModal()"
        class="text-muted text-hover-primary px-2"
        style="cursor: pointer"
        >Uso de cookies</a
      >
    </div>
  `,
  standalone: true,
  imports: [ RouterModule,  ],
})
export class BottomLinksComponent {
  private bsModalService = inject(BsModalService);

  openTermsAndConditionsModal() {
    this.bsModalService.show(TermsAndConditionsModalComponent);
  }

  openPrivacyPoliciesModal() {
    this.bsModalService.show(PrivacyPoliciesModalComponent);
  }

  openUseOfCookiesModal() {
    this.bsModalService.show(UseOfCookiesModalComponent);
  }
}
