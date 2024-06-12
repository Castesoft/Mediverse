import { Component } from '@angular/core';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
  selector: '[signInBasicForm]',
  templateUrl: './sign-in-basic-form.component.html'
})
export class SignInBasicFormComponent {

  constructor(public utils: UtilsService) {

  }

}
