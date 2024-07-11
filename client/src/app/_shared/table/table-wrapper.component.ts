import { Component } from "@angular/core";

@Component({
    host: { class: 'dt-container dt-bootstrap5 dt-empty-footer', id: 'kt_table_users_wrapper', },
    selector: 'div[tableWrapper]',
    template: `<div class="table-responsive"><ng-content></ng-content></div>`,
    standalone: true,
})
export class TableWrapperComponent {}
