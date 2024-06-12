import { Component } from '@angular/core';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
  selector: '[signUpBasicForm]',
  templateUrl: './sign-up-basic-form.component.html'
})
export class SignUpBasicFormComponent {

  constructor(public utils: UtilsService) {

  }

}
