import { Component } from "@angular/core";

@Component({
  host: { class: 'text-muted ms-1', },
  selector: 'optional-span, span[optionalSpan]',
  template: `(opcional)`,
  standalone: true,
})
export class OptionalSpanComponent {}
