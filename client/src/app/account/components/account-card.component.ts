import { LayoutModule } from "@angular/cdk/layout";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Account } from "src/app/_models/account/account";
import { ProfilePictureComponent } from "../../users/components/profile-picture/profile-picture.component";
import { AccountService } from 'src/app/_services/account.service';

@Component({
  host: { class: '', },
  selector: 'div[accountCard]',
  // template: ``,
  templateUrl: './account-card.component.html',
  standalone: true,
  imports: [RouterModule, LayoutModule, ProfilePictureComponent],
})
export class AccountCardComponent implements OnInit {
  accountService = inject(AccountService);

  account = input.required<Account>();

  hoveringBanner = false;
  photoFile: any;
  photoUrl: any;
  currentPhotoUrl: any;

  ngOnInit() {
    this.currentPhotoUrl = this.account().bannerUrl;
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

  onSaveBanner() {
    const formData = new FormData();

    formData.append('file', this.photoFile);

    this.accountService.setDoctorBanner(formData).subscribe({
      next: (response) => {
        this.photoUrl = undefined;
        this.photoFile = undefined;
        this.currentPhotoUrl = this.accountService.current()!.bannerUrl;
      },
    });
  }

  onCancel() {
    this.photoUrl = undefined;
    this.photoFile = undefined;
  }
}
