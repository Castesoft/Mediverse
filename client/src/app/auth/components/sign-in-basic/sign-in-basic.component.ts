import { BottomLinksComponent } from "src/app/auth/components/bottom-links.component";
import { Component } from "@angular/core";
import { SignInBasicFormComponent } from "src/app/auth/components/sign-in-basic-form.component";
import { AuthAsideComponent } from "src/app/_shared/template/components/auth-aside.component";

@Component({
  selector: 'sign-in-basic-route',
  host: { class: 'd-flex flex-column flex-root h-100' },
  templateUrl: './sign-in-basic.component.html',
  styleUrls: [ './sign-in-basic.component.scss' ],
  imports: [ BottomLinksComponent, SignInBasicFormComponent, AuthAsideComponent ],
})
export class SignInBasicComponent {}
