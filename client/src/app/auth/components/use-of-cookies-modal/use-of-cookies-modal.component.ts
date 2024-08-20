import { Component } from '@angular/core';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';

@Component({
  selector: 'app-use-of-cookies-modal',
  standalone: true,
  imports: [ModalWrapperModule],
  templateUrl: './use-of-cookies-modal.component.html',
  styleUrl: './use-of-cookies-modal.component.scss'
})
export class UseOfCookiesModalComponent {

}
