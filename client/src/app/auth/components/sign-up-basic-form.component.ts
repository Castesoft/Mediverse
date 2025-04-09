import { Component, inject } from '@angular/core';
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";
import { RouterModule } from '@angular/router';

@Component({
  selector: '[signUpBasicForm]',
  templateUrl: './sign-up-basic-form.component.html',
  imports: [ RouterModule, ],
  standalone: true,
})
export class SignUpBasicFormComponent {
  authNavigation = inject(AuthNavigationService);
}
