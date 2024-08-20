import { Component } from '@angular/core';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';

@Component({
  selector: 'app-terms-and-conditions-modal',
  standalone: true,
  imports: [ModalWrapperModule],
  templateUrl: './terms-and-conditions-modal.component.html',
  styleUrl: './terms-and-conditions-modal.component.scss'
})
export class TermsAndConditionsModalComponent {

}
