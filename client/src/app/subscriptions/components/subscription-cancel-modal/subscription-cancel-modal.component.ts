import { Component, inject, OnInit } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IconsService } from "src/app/_services/icons.service";
import { StripeGatewayService } from "src/app/_services/stripe-gateway.service";
import { ControlCheckComponent } from "src/app/_forms/control-check.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ControlTextareaComponent } from "src/app/_forms/control-textarea.component";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-subscription-cancel-modal',
  templateUrl: './subscription-cancel-modal.component.html',
  styleUrls: [ './subscription-cancel-modal.component.scss' ],
  imports: [
    FaIconComponent,
    ControlCheckComponent,
    ReactiveFormsModule,
    ControlTextareaComponent
  ],
})
export class SubscriptionCancelModalComponent implements OnInit {
  private readonly matDialogRef: MatDialogRef<SubscriptionCancelModalComponent> = inject(MatDialogRef);
  private readonly stripeGatewayService: StripeGatewayService = inject(StripeGatewayService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  readonly icons: IconsService = inject(IconsService);

  data: { subscription: Subscription } = inject(MAT_DIALOG_DATA);
  showSuccessfulCancellationCard: boolean = false;
  cancellationForm: FormGroup = new FormGroup({});
  isSubmitting: boolean = false;

  cancellationReasons: { value: string, label: string }[] = [
    { value: 'tooExpensive', label: 'Demasiado caro' },
    { value: 'notEnoughUse', label: 'No estoy usando el servicio lo suficiente' },
    { value: 'foundAlternative', label: 'Encontré una alternativa que se ajusta mejor a mis necesidades' },
    { value: 'missingFeatures', label: 'Faltan funciones que necesito' },
    { value: 'technicalProblems', label: 'Problemas técnicos o de rendimiento' },
    { value: 'poorSupport', label: 'Soporte al cliente deficiente' },
    { value: 'otherReason', label: 'Otros (por favor especifica)' }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.cancellationForm = this.fb.group({
      tooExpensive: [ false ],
      notEnoughUse: [ false ],
      foundAlternative: [ false ],
      missingFeatures: [ false ],
      technicalProblems: [ false ],
      poorSupport: [ false ],
      otherReason: [ false ],
      feedback: [ null, [ Validators.maxLength(1500) ] ]
    });
  }

  handleClose() {
    this.matDialogRef.close();
  }

  handleSubscriptionCancellation() {
    this.isSubmitting = true;

    const subscriptionId = this.data.subscription.id;
    if (!subscriptionId) {
      console.error('Subscription ID is missing');
      this.isSubmitting = false;
      return;
    }

    this.stripeGatewayService.cancelSubscription(this.data.subscription.id!, this.cancellationForm.value)
      .subscribe({
        next: (result) => {
          console.log(result);
          this.showSuccessfulCancellationCard = true;
        },
        error: ((err: any) => {
          console.error(err);
          this.isSubmitting = false;
          this.toastr.error('Error al cancelar la suscripción');
        }),
        complete: () => {
          this.isSubmitting = false;
        }
      });

  }
}
