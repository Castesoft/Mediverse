import { Component } from '@angular/core';
import { AuthAsideComponent } from 'src/app/_shared/template/components/auth-aside.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { NewPasswordFormComponent } from './new-password-form/new-password-form.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [AuthAsideComponent, BottomLinksComponent, NewPasswordFormComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {}
