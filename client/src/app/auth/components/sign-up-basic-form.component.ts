import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: '[signUpBasicForm]',
  templateUrl: './sign-up-basic-form.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class SignUpBasicFormComponent {
  utils = inject(UtilsService);
}
