import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthAsideComponent } from 'src/app/auth/components/auth-aside.component';
import { BottomLinksComponent } from 'src/app/auth/components/bottom-links.component';
import { PasswordResetFormComponent } from 'src/app/auth/components/password-reset-form.component';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { SignUpBasicFormComponent } from 'src/app/auth/components/sign-up-basic-form.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

// @Component({
//   host: { class: 'd-flex flex-column flex-root h-100' },
//   selector: 'sign-up-basic-route',
//   template: `
//     <div class="d-flex flex-column flex-lg-row flex-column-fluid">
//       <div
//         aside
//         class="d-flex flex-column flex-lg-row-auto bg-primary w-xl-600px positon-xl-relative"
//       ></div>
//       <div class="d-flex flex-column flex-lg-row-fluid py-10">
//         <div class="d-flex flex-center flex-column flex-column-fluid">
//           <div class="w-lg-600px p-10 p-lg-15 mx-auto">
//             <div signUpBasicForm></div>
//           </div>
//         </div>
//         <div
//           class="d-flex flex-center flex-wrap fs-6 p-5 pb-0"
//           bottomLinks
//         ></div>
//       </div>
//     </div>
//   `,
//   standalone: true,
//   imports: [SignUpBasicFormComponent, BottomLinksComponent, AsideComponent],
// })
// export class SignUpBasicComponent {}

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'sign-up-coming-soon-route',
  template: ` <p>coming-soon works!</p> `,
  standalone: true,
})
export class ComingSoonComponent {}

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'sign-up-free-trial-route',
  template: ` <p>free-trial works!</p> `,
  standalone: true,
})
export class FreeTrialComponent {}

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'sign-up-multi-steps-route',
  template: ` <p>multi-steps works!</p> `,
  standalone: true,
})
export class MultiStepsComponent {}

@Component({
  selector: 'sign-in-basic-route',
  host: { class: 'd-flex flex-column flex-root h-100' },
  template: `
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <div
        authAside
        class="d-flex flex-column flex-lg-row-auto bg-primary w-xl-600px positon-xl-relative"
      ></div>
      <div class="d-flex flex-column flex-lg-row-fluid py-10">
        <div class="d-flex flex-center flex-column flex-column-fluid">
          <div class="w-lg-500px p-10 p-lg-15 mx-auto">
            <div signInBasicForm></div>
          </div>
        </div>
        <div
          class="d-flex flex-center flex-wrap fs-6 p-5 pb-0"
          bottomLinks
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [BottomLinksComponent, SignInBasicFormComponent, AuthAsideComponent],
})
export class SignInBasicComponent {}

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'password-reset-route',
  template: `
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <div
        aside
        class="d-flex flex-column flex-lg-row-auto bg-primary w-xl-600px positon-xl-relative"
      ></div>

      <div class="d-flex flex-column flex-lg-row-fluid py-10">
        <div class="d-flex flex-center flex-column flex-column-fluid">
          <div class="w-lg-500px p-10 p-lg-15 mx-auto">
            <div passwordResetForm></div>
          </div>
        </div>

        <div
          class="d-flex flex-center flex-wrap fs-6 p-5 pb-0"
          bottomLinks
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [BottomLinksComponent, PasswordResetFormComponent, AuthAsideComponent],
})
export class PasswordResetComponent {}

@Component({
  selector: 'auth-route',
  template: `
  <div class="container-lg container-fluid">
  <h3>Sign in</h3>
  <ol>
    <li>
      <a routerLink="/auth/sign-in/basic">Basic</a>
    </li>
    <li>
      <a routerLink="/auth/sign-in/password-reset">Password reset</a>
    </li>
    <li>
      <a routerLink="/auth/sign-in/new-password">New password</a>
    </li>
  </ol>
  <h3>Sign up</h3>
  <ol>
    <li>
      <a routerLink="/auth/sign-up/basic">Basic</a>
    </li>
    <li>
      <a routerLink="/auth/sign-up/multi-steps">Multi steps</a>
    </li>
    <li>
      <a routerLink="/auth/sign-up/free-trial">Free trial</a>
    </li>
    <li>
      <a routerLink="/auth/sign-up/coming-soon">Coming soon</a>
    </li>
  </ol>
</div>
  `,
  standalone: false,
})
export class AuthComponent { }

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SignUpComponent },
    // { path: 'multi-steps', component: MultiStepsComponent },
    // { path: 'free-trial', component: FreeTrialComponent },
    // { path: 'coming-soon', component: ComingSoonComponent },
  ])],
  exports: [RouterModule],
})class SignUpRoutingModule {}

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SignInBasicComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'new-password', component: NewPasswordComponent },
  ])],
  exports: [RouterModule],
})class SignInRoutingModule {}

@NgModule({
  imports: [RouterModule.forChild([
    { path: '',
      redirectTo: 'sign-in',
      pathMatch: 'full'
    },
    { path: 'sign-in', loadChildren: () => SignInModule, title: 'Iniciar sesión en Mediverse', },
    { path: 'sign-up', loadChildren: () => SignUpModule, title: 'Registrarse en Mediverse', },
  ])],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

@NgModule({ imports: [
  SignUpRoutingModule,
  SignUpComponent,
  MultiStepsComponent,
  FreeTrialComponent,
  ComingSoonComponent,
]})class SignUpModule {}

@NgModule({ imports: [
  SignInRoutingModule,
  SignInBasicComponent,
  PasswordResetComponent,
  NewPasswordComponent,
]})class SignInModule {}

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    AuthRoutingModule,
  ]
})
export class AuthModule { }
