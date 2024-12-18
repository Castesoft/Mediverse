import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, model, effect } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { HelpBlockComponent } from 'src/app/_forms/helpers/help-block.component';
import { InputComponent } from 'src/app/_forms/helpers/input.component';
import { InvalidFeedbackComponent } from 'src/app/_forms/helpers/invalid-feedback.component';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { Control } from 'src/app/_models/forms/deprecated/control';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
  host: { class: 'w-100 text-body' },
  selector: 'div[controlChips]',
  template: `
    <mat-form-field
      [appearance]="'outline'"
      style="width: 100%;"
      class="hide-bottom"
    >
      @if (control().showLabel) {
      <mat-label>{{ control().label }}</mat-label>
      }
      <mat-chip-grid #chipGrid aria-label="Fruit selection">
        @for (item of control().value; track $index) {
        <mat-chip-row (removed)="remove(item)">
          {{ item.name }}
          <button matChipRemove [attr.aria-label]="'remove ' + item.name">
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
      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="selected($event)"
      >
        @for (item of unselectedItems; track item) {
        <mat-option [value]="item.name">{{ item.name }}</mat-option>
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
    } @if (control().helperText) {
    <div
      helpBlock
      [controlName]="control().name"
      [formText]="control().helperText"
    ></div>
    }
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CdkModule,
    MaterialModule,
    HelpBlockComponent,
    InvalidFeedbackComponent,
    InputComponent,
  ],
})
export class ControlChipsComponent {
  validation = inject(ValidationService);

  control = model.required<Control<SelectOption[]>>();

  get unselectedItems() {
    const selectedItems = this.control().value;
    if (selectedItems) {
      return this.control().options.filter(
        (x) => !selectedItems.find((y) => y.name === x.name)
      );
    }
    return this.control().options;
  }

  constructor() {
    effect(() => {
      this.control.set(this.control().setValidation(this.validation.active()));
    });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {}

  remove(item: SelectOption): void {
    console.log('item on remove', item);

    if (item) {
      const value = this.control().value || [];
      const index = value.findIndex((x) => x.name === item.name);
      if (index !== -1) {
        value.splice(index, 1); // Remove the item from the array
        this.control.set(this.control().setValue(value));
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('onControlChange', event.option);

    const item = this.control().options.find(
      (x) => x.name === event.option.value
    );
    if (item) {
      const value = this.control().value || [];
      if (value.find((x) => x.name === item.name)) {
        return;
      } else this.control.set(this.control().setValue([...value, item]));
    }
  }
}
