import { Component } from "@angular/core";
import { BottomLinksComponent } from "src/app/auth/components/bottom-links.component";
import { PasswordResetFormComponent } from "src/app/auth/components/password-reset-form.component";
import { AuthAsideComponent } from "src/app/_shared/template/components/auth-aside.component";

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'password-reset-route',
  templateUrl: './password-reset.component.html',
  styleUrls: [ './password-reset.component.scss' ],
  imports: [ BottomLinksComponent, PasswordResetFormComponent, AuthAsideComponent ],
})
export class PasswordResetComponent {}
