import { Component } from "@angular/core";


@Component({
  host: { class: 'dataTables_wrapper dt-bootstrap4 no-footer', id: 'kt_table_users_wrapper', },
  selector: 'div[tableWrapper]',
  template: `
    <div class="table-responsive">
      <ng-content></ng-content>
    </div>
    <ng-content select="[pager]"></ng-content>
  `,
  standalone: true,
})
export class TableWrapperComponent {
}
