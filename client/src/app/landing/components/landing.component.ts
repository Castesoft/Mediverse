import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { CommonModule } from '@angular/common';
import { Search } from "src/app/_models/search/search";
import { SearchFormComponent } from 'src/app/search/components/search-form.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    SignInBasicFormComponent,
    CommonModule,
    SearchFormComponent,
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent {}
