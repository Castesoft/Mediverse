import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsideComponent } from '../aside.component';
import { BottomLinksComponent } from '../bottom-links.component';

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'sign-in-new-password-route',
  templateUrl: './new-password.component.html',
  standalone: true,
  imports: [ RouterModule, AsideComponent, BottomLinksComponent,  ],
})
export class NewPasswordComponent {

}
