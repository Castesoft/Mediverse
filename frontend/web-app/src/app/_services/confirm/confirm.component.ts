import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Modal } from '../../_models/modal';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  modal!: Modal;
  result = false;

  constructor(public bsModalRef: BsModalRef) {}
}
