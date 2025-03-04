import { Component, OnInit, inject } from '@angular/core';
import { signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from 'src/app/_models/account/account';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import { AccountService } from 'src/app/_services/account.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SidebarService } from 'src/app/_services/sidebar.service';
import {
  SatisfactionSurveyModalComponent
} from 'src/app/account/components/satisfaction-survey-modal/satisfaction-survey-modal.component';

@Component({
  selector: 'account-main-route',
  templateUrl: './account.component.html',
  standalone: false,
})
export class AccountComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  accountService = inject(AccountService);
  sidebar = inject(SidebarService);
  readonly query: MobileQueryService = inject(MobileQueryService);

  account: Account | null = null;
  label?: string;
  satisfactionSurveys: SatisfactionSurvey[] = [];

  withPadding = signal(true);

  ngOnInit(): void {
    this.accountService.getSatisfactionSurveys().subscribe({
      next: surveys => {
        this.satisfactionSurveys = surveys;

        if (this.satisfactionSurveys.length > 0 && false) {
          this.bsModalService.show(SatisfactionSurveyModalComponent, {
            initialState: {
              satisfactionSurvey: this.satisfactionSurveys[0],
            },
          });

          this.bsModalService.onHide.subscribe(() => {
            this.satisfactionSurveys.shift();
            if (this.satisfactionSurveys.length > 0) {
              this.bsModalService.show(SatisfactionSurveyModalComponent, {
                initialState: {
                  satisfactionSurvey: this.satisfactionSurveys[0],
                },
              });
            }
          });
        }
      }
    });

    this.account = this.accountService.current();
  }
}
