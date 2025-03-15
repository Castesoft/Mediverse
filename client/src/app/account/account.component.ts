import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from 'src/app/_models/account/account';
import { SatisfactionSurvey } from 'src/app/_models/satisfactionSurvey';
import { AccountService } from 'src/app/_services/account.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SidebarService } from 'src/app/_services/sidebar.service';
import {
  SatisfactionSurveyModalComponent
} from 'src/app/account/components/satisfaction-survey-modal/satisfaction-survey-modal.component';
import { ScrollService } from "src/app/_services/scroll.service";

@Component({
  selector: 'account-main-route',
  templateUrl: './account.component.html',
  standalone: false,
})
export class AccountComponent implements OnInit {
  private readonly bsModalService: BsModalService = inject(BsModalService);
  readonly accountService: AccountService = inject(AccountService);
  readonly query: MobileQueryService = inject(MobileQueryService);
  readonly scrollService: ScrollService = inject(ScrollService);
  readonly sidebar: SidebarService = inject(SidebarService);

  isScrolled: boolean = false;
  headerStyles: { [key: string]: string } = {
    left: '0px',
    width: '100%'
  };

  @ViewChild('snav', { read: ElementRef }) drawerElement!: ElementRef;

  account: Account | null = null;
  label?: string;
  satisfactionSurveys: SatisfactionSurvey[] = [];

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

    this.subscribeToScrollService();

    this.account = this.accountService.current();
  }

  private subscribeToScrollService(): void {
    this.scrollService.isScrolled$.subscribe({
      next: (isScrolled) => {
        this.isScrolled = isScrolled;
        this.updateHeaderStyles();
      }
    });
  }

  updateHeaderStyles(): void {
    if (this.isScrolled) {
      const drawerWidth: any = this.drawerElement.nativeElement.getBoundingClientRect().width;
      this.headerStyles = {
        left: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        position: 'fixed'
      };
    } else {
      this.headerStyles = {
        left: '0px',
        width: '100%'
      };
    }
  }
}
