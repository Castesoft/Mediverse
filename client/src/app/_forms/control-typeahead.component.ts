import {
  Component,
  ElementRef,
  inject,
  input, output,
  Renderer2,
  Self,
  ViewEncapsulation
} from "@angular/core";
import {PopoverProps} from "src/app/_models/popover";
import {NgControl, FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgClass, KeyValuePipe, NgTemplateOutlet, NgIf} from "@angular/common";
import {TypeaheadMatch, TypeaheadModule} from "ngx-bootstrap/typeahead";
import {FormsService} from "src/app/_services/forms.service";
import {HelpBlockComponent} from "src/app/_forms/helpers/help-block.component";
import {InvalidFeedbackComponent} from "src/app/_forms/helpers/invalid-feedback.component";
import {OptionalSpanComponent} from "./helpers/optional-span.component";
import {NewBadgeComponent} from "./helpers/new-badge.component";
import {Observable} from "rxjs";

@Component({
  selector: "[controlTypeahead]",
  templateUrl: "./control-typeahead.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, KeyValuePipe, TypeaheadModule, NgTemplateOutlet, NgIf, InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent],
  styles: '::ng-deep .dropdown-menu { width: 100%;}'
})
export class ControlTypeaheadComponent {
  service = inject(FormsService);

  typeaheadOptionField = input<string | undefined>(undefined);
  typeaheadOptions = input<string[] | Observable<any>>([]);
  errors = input<{ [key: string]: string }>({});
  isInputGroupSpan = input<boolean>(false);
  isTypeaheadAsync = input<boolean>(false);
  hideIsOptional = input<boolean>(false);
  isReadonly = input<boolean>(false);
  autofocus = input<boolean>(false);
  submitted = input<boolean>(false);
  placeholder = input<string>("");
  isNew = input<boolean>(false);
  type = input<string>("text");
  popoverProps = input<PopoverProps>();
  typeaheadItemTemplate = input<any>();
  label = input<string>("");
  formText = input<string>();
  id = input<string>();

  onSelect = output<TypeaheadMatch>();
  onLoading = output<boolean>();
  onInputFocus = output();

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get controlName(): string {
    return this.ngControl.name ? this.ngControl.name.toString() : "defaultName";
  }

  constructor(@Self() public ngControl: NgControl, private renderer: Renderer2, private el: ElementRef) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
