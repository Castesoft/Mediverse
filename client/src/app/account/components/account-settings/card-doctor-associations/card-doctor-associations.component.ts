import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { createId } from "@paralleldrive/cuid2";
import { CatalogMode, View } from 'src/app/_models/base/types';
import { AccountService } from "src/app/_services/account.service";
import { MatDialog } from "@angular/material/dialog";
import {
  NurseAssociateFormComponent
} from "src/app/nurses/components/nurse-associate-form/nurse-associate-form.component";
import { DoctorAssociationParams } from 'src/app/_models/doctorAssociations/doctorAssociationParams';
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";
import {
  DoctorAssociationsService
} from "src/app/account/components/account-doctor-associations/doctor-associations.config";
import {
  DoctorAssociationsCatalogComponent
} from "src/app/account/components/account-doctor-associations/doctors-associations-catalog/doctors-associations-catalog.component";
import { Account } from "src/app/_models/account/account";

type AssociationViewType = 'doctorView' | 'nurseView';

@Component({
  selector: 'app-card-doctor-associations',
  templateUrl: './card-doctor-associations.component.html',
  imports: [ DoctorAssociationsCatalogComponent ],
})
export class CardDoctorAssociationsComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly doctorAssociationsService: DoctorAssociationsService = inject(DoctorAssociationsService);
  private readonly dialog: MatDialog = inject(MatDialog);

  activeTab: WritableSignal<AssociationViewType> = signal('doctorView');

  catalogParams: WritableSignal<DoctorAssociationParams>;
  catalogKey: WritableSignal<string> = signal(createId());

  doctorAssociationItem: WritableSignal<DoctorAssociation | null> = signal(null);
  doctorAssociationView: WritableSignal<View> = signal('inline');
  doctorAssociationMode: WritableSignal<CatalogMode> = signal('view');
  doctorAssociationIsCompact: WritableSignal<boolean> = signal(true);
  doctorAssociationEmbedded: WritableSignal<boolean> = signal(true);

  canViewAsDoctor: boolean = false;
  canViewAsNurse: boolean = false;

  constructor() {
    this.catalogParams = signal(new DoctorAssociationParams(this.catalogKey()));
  }

  ngOnInit(): void {
    const account: Account | null = this.accountService.current();
    if (!account || !account.id) {
      console.error("Account ID not available for associations card.");
      return;
    }

    this.canViewAsDoctor = this.accountService.hasRole([ 'Doctor' ]);
    this.canViewAsNurse = this.accountService.hasRole([ 'Nurse' ]);

    if (this.canViewAsDoctor) {
      this.selectTab('doctorView');
    } else if (this.canViewAsNurse) {
      this.selectTab('nurseView');
    }
  }

  selectTab(tab: AssociationViewType): void {
    this.activeTab.set(tab);
    const account: Account | null = this.accountService.current();
    if (!account || !account.id) return;

    const newKey = createId();
    this.catalogKey.set(newKey);

    if (tab === 'doctorView') {
      this.catalogParams.set(new DoctorAssociationParams(newKey, {
        doctorId: account.id,
      }));
    } else {
      this.catalogParams.set(new DoctorAssociationParams(newKey, {
        nurseId: account.id,
      }));
    }
  }

  requestAddAssociation(): void {
    console.log("Requesting add association (Invite Nurse)");
    this.dialog.open(NurseAssociateFormComponent, {
      width: '500px',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log("Association modal closed with result:", result);
        this.doctorAssociationsService.loadPagedList(this.catalogKey(), this.catalogParams()).subscribe();
      }
    });
  }
}
