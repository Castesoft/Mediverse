import {Component, NgModule, inject, input, output, HostBinding, model} from "@angular/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {BsModalRef, ModalModule} from "ngx-bootstrap/modal";
import {BaseForm} from "src/app/_models/types";
import {IconsService} from "src/app/_services/icons.service";

@Component({
  host: {class: 'modal-content border',},
  selector: 'modal-content, div[modalContent]',
  template: `
    <ng-content></ng-content>`,
  imports: [ModalModule,],
  standalone: true,
})
export class ModalContentComponent {
}

@Component({
  host: {class: 'modal-header border-200 p-4',},
  selector: 'div[modalHeader]',
  template: `
    <h4 class="modal-title text-1000 fs-2 lh-sm">{{ title() }}</h4>
    <button class="btn p-1 text-900" type="button" aria-label="Close" (click)="modal.hide()">
      <fa-icon [icon]="icons.faTimes" class="fs--1"></fa-icon>
    </button>
  `,
  standalone: true,
  imports: [FontAwesomeModule,],
})
export class ModalHeaderComponent {
  icons = inject(IconsService);
  modal = inject(BsModalRef);

  title = input.required<string>();
}

@Component({
  host: {class: 'modal-body',},
  selector: 'div[modalBody]',
  template: `
    <ng-content></ng-content>`,
  standalone: true,
})
export class ModalBodyComponent {
  @HostBinding('class') get hostNormalPadding() {
    switch (this.type()) {
      case 'form':
        return 'p-9';
      case 'thin':
        return 'px-3 py-10';
      case 'normal':
        return 'py-10 px-lg-17';
      default:
        return 'p-6';
    }
  }

  type = input<'normal' | 'form' | 'thin'>('normal');
}

@Component({
  host: {class: 'modal-footer',},
  selector: 'div[modalFooter]',
  template: `
    <ng-content></ng-content>`,
  standalone: true,
})
export class ModalFooterComponent {
}

@Component({
  host: {class: 'modal-footer d-flex justify-content-end align-items-center px-4 pb-4 border-0 pt-3',},
  selector: 'div[modalFooterFilters]',
  template: `
    <button class="btn btn-sm btn-phoenix-primary px-4 fs--2 my-0" type="button" (click)="emitReset()">
      <fa-icon [icon]="icons.faArrowsRotate" class="me-2 fs--2"></fa-icon>
      Restablecer
    </button>
    <button class="btn btn-sm btn-primary px-9 fs--2 my-0" type="submit" [attr.form]="formId()" (click)="emitSubmit()">
      Aplicar
    </button>
  `,
  standalone: true,
  imports: [FontAwesomeModule,],
})
export class ModalFooterResetFilterButtonsComponent {
  icons = inject(IconsService);

  formId = input.required<string>();

  onReset = output<void>();
  onSubmit = output<void>();

  emitReset = (): void => this.onReset.emit();
  emitSubmit = (): void => this.onSubmit.emit();
}

@Component({
  host: {class: 'btn btn-primary', type: 'submit',},
  selector: 'button[submitBtn]',
  template: `
    <span class="indicator-label">Enviar</span>
    <span class="indicator-progress">Por favor espere...
      <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
    </span>
  `,
  standalone: true,
})
export class SubmitButtonComponent {}

@Component({
  host: {class: 'btn btn-light me-3', type: 'reset',},
  selector: 'button[resetBtn]',
  template: `Cancelar`,
  standalone: true,
})
export class ResetButtonComponent {
}

@NgModule({
  imports: [
    ModalContentComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalFooterResetFilterButtonsComponent,
    ResetButtonComponent,
    SubmitButtonComponent,
  ],
  exports: [
    ModalContentComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalFooterResetFilterButtonsComponent,
    ResetButtonComponent,
    SubmitButtonComponent,
  ],
})
export class ModalWrapperModule {
}
