import { Component } from '@angular/core';
import { AsideComponent } from '../aside.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { NewPasswordFormComponent } from './new-password-form/new-password-form.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [AsideComponent, BottomLinksComponent, NewPasswordFormComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {}
