import { Component, effect, inject, input, model, OnInit, output, signal } from "@angular/core";
import { PopoverProps } from "src/app/_models/popover";
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TypeaheadMatch, TypeaheadModule } from "ngx-bootstrap/typeahead";
import { FormsService } from "src/app/_services/forms.service";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { OptionalSpanComponent } from "./helpers/optional-span.component";
import { NewBadgeComponent } from "./helpers/new-badge.component";
import { Observable } from "rxjs";
import { createId } from "@paralleldrive/cuid2";
import { ControlOrientation, SelectOption } from "src/app/_forms/form";
import { LegacyControlLabelComponent } from "src/app/_forms/helpers/control-label.component";

@Component({
  selector: "div[controlTypeahead]",
  templateUrl: "./control-typeahead.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, TypeaheadModule, CommonModule,
    InvalidFeedbackComponent, HelpBlockComponent, OptionalSpanComponent, NewBadgeComponent,
    LegacyControlLabelComponent
  ]
})
export class ControlTypeaheadComponent {
  service = inject(FormsService);

  control = model.required<AbstractControl<SelectOption | null | undefined | any, SelectOption | null | undefined | any>>();
  name = input.required<string>();

  id = model<string>();

  optionField = input<string>('name');
  groupField = input<string>();

  options = model.required<SelectOption[]>();

  optionsInScrollableView = input<number>(10);
  errors = input<{ [key: string]: string }>({});
  typeaheadOptionsLimit = input<number>(20);
  isInputGroupSpan = input<boolean>(false);
  hideIsOptional = input<boolean>(false);
  isReadonly = input<boolean>(false);
  autofocus = input<boolean>(false);
  submitted = input<boolean>(false);
  placeholder = input<string>("");
  isModal = input<boolean>(false);
  isNew = input<boolean>(false);
  type = input<string>("text");
  popoverProps = input<PopoverProps>();
  label = input<string>("");
  formText = input<string>();
  showLabel = input<boolean>(false);
  optional = input<boolean>(false);
  orientation = input<ControlOrientation>("block");

  onSelect = output<TypeaheadMatch>();
  onLoading = output<boolean>();

  selectedValue = signal<SelectOption | null>(null);

  parsedOptions: string[] | Observable<SelectOption[]> = [];
  isTypeaheadAsync = false;

  constructor() {
    effect(() => {
      this.setOptions();
      if (!this.id()) {
        this.id.set(`${this.name()}${createId()}`);
      }
    }, { allowSignalWrites: true });
  }

  private setOptions = () => {
    const optionsValue = this.options();
  };

  private isSelectOptionArray = (options: any): options is SelectOption[] => {
    return Array.isArray(options) && options.length > 0 && typeof options[0] === "object" && "code" in options[0] && "name" in options[0];
  };

  private isObservable = (options: any): options is Observable<any> => {
    return options instanceof Observable;
  };

  handleValueSelect = (event: any): void => {
    if (event) {
      this.onSelect.emit(event);
      this.handleSelectedValueChange(event.value);
    }
  };

  private handleSelectedValueChange = (value: SelectOption | null): void => {
    if (value) {
      this.selectedValue.set(value);
      if (this.control() && this.control()?.value !== value.name) {
        this.control().setValue(value.name, { emitEvent: false });
      }
    }
  };
}
