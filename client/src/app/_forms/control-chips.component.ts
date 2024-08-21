import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, computed, effect, inject, model, Signal, signal, WritableSignal } from "@angular/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Control, SelectItem } from "src/app/_forms/form";
import { ControlLabelComponent } from "src/app/_forms/helpers/control-label.component";
import { HelpBlockComponent } from "src/app/_forms/helpers/help-block.component";
import { InputComponent } from "src/app/_forms/helpers/input.component";
import { InvalidFeedbackComponent } from "src/app/_forms/helpers/invalid-feedback.component";
import { FormsService } from "src/app/_services/forms.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: { class: 'w-100 text-body', },
  selector: 'div[controlChips]',
  template: `
  <mat-form-field [appearance]="'outline'" style="width: 100%;" class="hide-bottom">
      @if (control().showLabel) {
        <mat-label>{{control().label}}</mat-label>
      }
      <mat-chip-grid #chipGrid aria-label="Fruit selection">
      @for (item of control().value; track $index) {
        <mat-chip-row (removed)="remove(item)">
          {{item.value}}
          <button matChipRemove [attr.aria-label]="'remove ' + item.key">
            <mat-icon>cancel</mat-icon>
          </button>
        </mat-chip-row>
      }
    </mat-chip-grid>

      <input
        inputComponent
        #inputFruit
        [(control)]="control"
        [formControl]="$any(control().formControl)"
        [matChipInputFor]="chipGrid"
        [matAutocomplete]="auto"
        [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
        (matChipInputTokenEnd)="add($event)"
      />
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
      @for (item of unselectedItems; track item) {
        <mat-option [value]="item.value">{{item.value}}</mat-option>
      }
    </mat-autocomplete>
  </mat-form-field>

  @if (control().formControl.errors) {
    <div
      invalidFeedback
      [errors]="control().errors"
      [control]="control().formControl"
      [submitted]="control().submitted"
    ></div>
  }
  @if (control().helperText) {
    <div
      helpBlock
      [controlName]="control().name"
      [formText]="control().helperText"
    ></div>
  }
`,
  standalone: true,
  imports: [ ReactiveFormsModule, FormsModule, CdkModule, MaterialModule, HelpBlockComponent, InvalidFeedbackComponent, InputComponent, ControlLabelComponent, ],
})
export class ControlChipsComponent {
  service = inject(FormsService);

  control = model.required<Control<SelectItem[]>>();

  validation = false;
  get unselectedItems() {
    const selectedItems = this.control().value;
    if (selectedItems) {
      return this.control().options.filter(x => !selectedItems.find(y => y.value === x.value));
    }
    return this.control().options;
  }

  constructor() {
    effect(() => {
      this.service.mode$.subscribe({ next: validation => this.control.set(this.control().setValidation(validation)) });
    })
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {}

  remove(item: SelectItem): void {
    console.log('item on remove',item);

    if (item) {
      const value = this.control().value || [];
      const index = value.findIndex(x => x.value === item.value);
      if (index !== -1) {
        value.splice(index, 1); // Remove the item from the array
        this.control.set(this.control().setValue(value));
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('onControlChange', event.option);

    const item = this.control().options.find(x => x.value === event.option.value);
    if (item) {
      const value = this.control().value || [];
      if (value.find(x => x.value === item.value)) {
        return;
      } else
      this.control.set(this.control().setValue([ ...value, item ]));
    }
  }
}
