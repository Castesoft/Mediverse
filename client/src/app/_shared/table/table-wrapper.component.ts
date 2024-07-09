import { Component } from "@angular/core";

@Component({
    host: { class: 'table-responsive scrollbar mx-n1 px-1 d-flex border-top', },
    selector: 'table-wrapper, div[tableWrapper]',
    template: `<ng-content></ng-content>`,
    standalone: true,
})
export class TableWrapperComponent {}
