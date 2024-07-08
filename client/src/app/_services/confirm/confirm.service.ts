import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, map } from 'rxjs';
import { ConfirmComponent } from './confirm.component';
import { Modal } from '../../_models/modal';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private service = inject(BsModalService);

  bsModalRef?: BsModalRef<ConfirmComponent>;

  constructor() {
    this.service.config.class = 'modal-dialog-centered modal-dialog-scrollable';
    this.service.config = { class: 'modal-dialog-centered modal-dialog-scrollable' };
  }

  confirm(modal?: Modal): Observable<boolean> {

    const config = {
      class: 'modal-dialog-centered modal-dialog-scrollable',
      initialState: {
        modal
      }}

    this.bsModalRef = this.service.show(ConfirmComponent, config);

    return this.bsModalRef.onHidden!.pipe(map(() => this.bsModalRef!.content!.result));

  }
}
