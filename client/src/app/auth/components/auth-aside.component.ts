import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: '[authAside]',
  templateUrl: './auth-aside.component.html',
  standalone: true,
  imports: [ RouterModule, ],
})
export class AuthAsideComponent {
  utils = inject(UtilsService);
}
