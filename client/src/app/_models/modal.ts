export class Modal {
  title = 'Confirmación';
  message = '¿Quieres continuar?';
  btnOkText = 'Ok';
  btnCancelText = 'Cancelar';

  constructor(title: string, message: string, btnOkText: string = 'Ok', btnCancelText: string = 'Cancelar') {
    this.title = title;
    this.message = message;
    this.btnOkText = btnOkText;
    this.btnCancelText = btnCancelText;
  }

}
