import { Component, inject, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import { AccountService } from 'src/app/_services/account.service';
import {
  SatisfactionSurveyModalComponent
} from 'src/app/account/components/satisfaction-survey-modal/satisfaction-survey-modal.component';

@Component({
  selector: 'account-main-route',
  templateUrl: './account.component.html',
  standalone: false,
})
export class AccountComponent implements OnInit {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  readonly accountService: AccountService = inject(AccountService);

  satisfactionSurveys: SatisfactionSurvey[] = [];

  ngOnInit(): void {
    this.accountService.getSatisfactionSurveys().subscribe({
      next: (surveys: SatisfactionSurvey[]) => {
        this.satisfactionSurveys = surveys;

        if (this.satisfactionSurveys.length > 0) {
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
  }
}
