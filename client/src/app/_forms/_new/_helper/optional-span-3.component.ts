import { Component } from "@angular/core";

@Component({
  host: { class: 'text-muted ms-1', },
  selector: 'span[optionalSpan3]',
  template: `(opcional)`,
  standalone: true,
})
export class OptionalSpan3Component {}
