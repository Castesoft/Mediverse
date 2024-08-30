import { Component } from '@angular/core';
import { SearchGeneralComponent } from "../../search/components/search-general/search-general.component";
import { RouterLink } from '@angular/router';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    SearchGeneralComponent,
    RouterLink,
    SignInBasicFormComponent,
    CommonModule
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {}
