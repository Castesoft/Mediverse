import { Component, OnInit, input } from "@angular/core";

@Component({
  host: { class: 'form-text', '[id]': 'id' },
  selector: 'help-block, div[helpBlock]',
  template: `@if(formText()) { {{ formText() }} }`,
  standalone: true,
})
export class HelpBlockComponent implements OnInit {
  formText = input.required<string | null>();
  controlName = input.required<string>();

  id!: string;

  ngOnInit(): void {
    this.id = `${this.controlName()}helpText`;
  }

}
