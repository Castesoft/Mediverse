import { Component } from '@angular/core';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';

@Component({
  selector: 'app-privacy-policies-modal',
  standalone: true,
  imports: [ModalWrapperModule],
  templateUrl: './privacy-policies-modal.component.html',
  styleUrl: './privacy-policies-modal.component.scss'
})
export class PrivacyPoliciesModalComponent {

}
