import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { InvitationAcceptAuthRequiredResponse, InvitationService } from 'src/app/_services/invitation.service';
import { AccountService } from 'src/app/_services/account.service';
import { AuthNavigationService } from 'src/app/_services/auth-navigation.service';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { MaterialModule } from 'src/app/_shared/material.module';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  InvitationDetailsComponent
} from "src/app/invitations/components/invitation-details/invitation-details.component";

type InvitationState = 'loading' | 'requires_auth' | 'success' | 'error' | 'idle' | 'requires_acceptance';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: [ './accept-invitation.component.scss' ],
  imports: [ CommonModule, RouterModule, MaterialModule, InvitationDetailsComponent ],
})
export class AcceptInvitationComponent implements OnInit {

  private authNavigation: AuthNavigationService = inject(AuthNavigationService);
  private invitationService: InvitationService = inject(InvitationService);
  private accountService: AccountService = inject(AccountService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastr: ToastrService = inject(ToastrService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  private routeSub: Subscription | null = null;
  private acceptSub: Subscription | null = null;

  currentState: WritableSignal<InvitationState> = signal('idle');
  message: WritableSignal<string | null> = signal(null);
  token: WritableSignal<string | null> = signal(null);

  readonly STATE_REQUIRES_ACCEPTANCE: InvitationState = 'requires_acceptance';
  readonly STATE_REQUIRES_AUTH: InvitationState = 'requires_auth';
  readonly STATE_LOADING: InvitationState = 'loading';
  readonly STATE_SUCCESS: InvitationState = 'success';
  readonly STATE_ERROR: InvitationState = 'error';

  ngOnInit(): void {
    this.currentState.set(this.STATE_LOADING);
    this.message.set('Validando invitación...');

    this.routeSub = this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const currentToken = params.get('token');
      this.token.set(currentToken);

      if (!currentToken) {
        this.handleErrorState('Token de invitación inválido o ausente en la URL.');
        return;
      }

      if (this.accountService.current()) {
        console.log("User logged in. Waiting for manual invitation acceptance.");
        this.currentState.set(this.STATE_REQUIRES_ACCEPTANCE);
        this.message.set('Estás a punto de unirte usando esta invitación.');
      } else {
        console.log("User not logged in. Requiring authentication.");
        const currentUrl = this.router.url;
        this.handleRequiresAuth(currentToken, currentUrl);
      }
    });
  }

  attemptAcceptInvitation(token: string): void {
    if (!token) {
      this.handleErrorState("No se proporcionó un token válido.");
      return;
    }

    this.currentState.set(this.STATE_LOADING);
    this.message.set('Procesando invitación...');

    this.acceptSub?.unsubscribe();

    this.acceptSub = this.invitationService.acceptInvitation(token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            const errMsg = error.error?.message || 'Tu sesión ha expirado o es inválida. Por favor, cierra sesión y vuelve a intentarlo.';
            this.handleErrorState(errMsg);
          } else {
            this.handleApiError(error);
          }
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if (this.isAuthRequiredResponse(response)) {
          this.handleRequiresAuth(response.token, this.router.url, response.message);
        } else {
          this.handleSuccessState(response.message);
        }
      });
  }

  private isAuthRequiredResponse(response: any): response is InvitationAcceptAuthRequiredResponse {
    return response && typeof response === 'object' && response.requiresAuthentication === true;
  }

  /**
   * Handles the state where authentication is required.
   * Redirects the user to the sign-in page, passing the invitation token
   * and the current full URL (as returnUrl) in query parameters.
   * @param token The invitation token.
   * @param returnUrl The URL to return to after successful login.
   * @param msg Optional message to display.
   */
  private handleRequiresAuth(token: string, returnUrl: string, msg?: string): void {
    this.currentState.set(this.STATE_REQUIRES_AUTH);
    this.message.set(msg || 'Necesitas iniciar sesión o registrarte para aceptar esta invitación.');

    console.log(`Authentication required. Redirecting to sign-in. Token: ${token}, Return URL: ${returnUrl}`);

    this.authNavigation.navigateToSignIn({
      invitationToken: token,
      returnUrl: returnUrl
    }).catch(err => {
      console.error("Failed to navigate to sign-in:", err);
      this.handleErrorState("No se pudo redirigir a la página de inicio de sesión.");
    });
  }

  private handleSuccessState(successMessage?: string): void {
    this.currentState.set(this.STATE_SUCCESS);
    const finalMessage = successMessage || '¡Invitación aceptada con éxito!';
    this.message.set(finalMessage);
    this.toastr.success(finalMessage);

    setTimeout(() => {
      this.authNavigation.navigateToAccount().catch(err => {
        console.error("Failed to navigate to account page:", err);

      });
    }, 3000);
  }

  handleAcceptClick(): void {
    const currentToken: string | null = this.token();
    if (currentToken) {
      this.attemptAcceptInvitation(currentToken);
    } else {
      this.handleErrorState("No se encontró el token para aceptar la invitación.");
    }
  }

  handleCancelClick(): void {
    this.toastr.info("Invitación rechazada.");
    this.goToHome();
  }

  private handleApiError(error: HttpErrorResponse): void {
    console.error("API Error accepting invitation:", error);
    let displayMessage = 'Ocurrió un error al procesar la invitación.';

    if (error.status === 404) {
      displayMessage = 'La invitación no fue encontrada o ya no es válida.';
    } else if (error.status === 409) {
      displayMessage = 'Esta invitación ya ha sido procesada anteriormente.';
    } else if (error.status === 400) {
      const badRequest = new BadRequest(error);
      if (badRequest.type === "ValidationError" && badRequest.validationErrors.length > 0) {
        displayMessage = `Error de validación: ${badRequest.validationErrors.join('. ')}`;
      } else {

        displayMessage = badRequest.message || 'Error en la solicitud. Verifique los datos de la invitación.';
      }
    } else if (error.status === 403) {
      displayMessage = error.error?.message || "No tienes permiso para aceptar esta invitación.";
    }

    this.handleErrorState(displayMessage);
  }

  private handleErrorState(errorMessage: string): void {
    this.currentState.set(this.STATE_ERROR);
    this.message.set(errorMessage);
    this.toastr.error(errorMessage);
  }

  goToHome(): void {
    this.router.navigate([ '/' ]).catch(console.error);
  }
}
