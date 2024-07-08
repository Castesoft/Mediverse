import { Component } from '@angular/core';
import { UtilsService } from '../../core/services/utils.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: '[signUpBasicForm]',
  templateUrl: './sign-up-basic-form.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class SignUpBasicFormComponent {

  constructor(public utils: UtilsService) {

  }

}
