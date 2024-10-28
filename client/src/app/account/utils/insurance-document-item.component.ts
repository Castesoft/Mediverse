import { CommonModule } from "@angular/common";
import { Component, inject, model } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Document } from "src/app/_models/document";
import { FileSizePipe } from "src/app/_pipes/file-size.pipe";
import { AccountService } from "src/app/_services/account.service";

@Component({
  selector: 'div[insuranceDocumentItem]',
  host: { class: 'dataTables_wrapper dt-bootstrap4 no-footer', },
  templateUrl: './insurance-document-item.component.html',
  standalone: true,
  imports: [ CommonModule, RouterModule, FileSizePipe, ],
})
export class InsuranceDocumentItemComponent {
  service = inject(AccountService);

  item = model.required<Document>();

  constructor() {}

  onClickDelete() {
    if (this.item().id !== null) {
      this.service.deleteMedicalInsuranceDocument(this.item()!.id!);
    }
  }
}
