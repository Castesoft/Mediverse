import { Component, inject } from '@angular/core';
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: false,
})
export class AuthComponent {
  authNavigation = inject(AuthNavigationService);
}
