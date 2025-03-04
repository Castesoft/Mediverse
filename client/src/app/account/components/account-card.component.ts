import { LayoutModule } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, input, InputSignal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Account } from 'src/app/_models/account/account';
import { AccountService } from 'src/app/_services/account.service';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { PaymentNavigationService } from "src/app/payments/payment-navigation.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  host: { class: '', },
  selector: 'div[accountCard]',
  templateUrl: './account-card.component.html',
  standalone: true,
  imports: [ RouterModule, LayoutModule, ProfilePictureComponent ],
})
export class AccountCardComponent implements OnInit {
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;

  private readonly paymentNavigationService: PaymentNavigationService = inject(PaymentNavigationService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  readonly service: AccountService = inject(AccountService);
  readonly utilsService: UtilsService = inject(UtilsService);

  account: InputSignal<Account> = input.required<Account>();

  hoveringBanner: boolean = false;
  photoFile: any;
  photoUrl: any;
  currentPhotoUrl: any;

  activeSubscription: Subscription | null = null;

  ngOnInit() {
    this.currentPhotoUrl = this.account().bannerUrl;
    this.subscribeToActiveSubscription();
  }

  private subscribeToActiveSubscription() {
    this.service.activeSubscription$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (subscription: Subscription | null) => {
        this.activeSubscription = subscription;
      },
    });
  }

  onPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(this.photoFile);

      event.target.value = '';
    }
  }

  navigateToSubscriptionCheckoutPage(): void {
    this.paymentNavigationService.navigateToSubscriptionFlow(this.router.url)
      .catch((err: any) => console.error('Navigation error:', err));
  }

  onSaveBanner() {
    const formData = new FormData();

    formData.append('file', this.photoFile);

    this.service.setDoctorBanner(formData).subscribe({
      next: (_) => {
        this.photoUrl = undefined;
        this.photoFile = undefined;
        this.currentPhotoUrl = this.service.current()!.bannerUrl;
      },
    });
  }

  onCancel() {
    this.photoUrl = undefined;
    this.photoFile = undefined;
  }
}
