import {
  CdkContextMenuTrigger,
  CdkMenu,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuItemRadio,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

/**
 * @title Stepper header position
 */
@Component({
  selector: 'stepper-header-position-example',
  // templateUrl: 'stepper-header-position-example.html',
  template: `
    <mat-stepper headerPosition="bottom" #stepper>
      <mat-step [stepControl]="firstFormGroup">
        <form [formGroup]="firstFormGroup">
          <ng-template matStepLabel>Fill out your name</ng-template>
          <mat-form-field>
            <input
              matInput
              placeholder="Last name, First name"
              formControlName="firstCtrl"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step [stepControl]="secondFormGroup" optional>
        <form [formGroup]="secondFormGroup">
          <ng-template matStepLabel>Fill out your address</ng-template>
          <mat-form-field>
            <input
              matInput
              placeholder="Address"
              formControlName="secondCtrl"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Done</ng-template>
        You are now done.
        <div>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button (click)="stepper.reset()">Reset</button>
        </div>
      </mat-step>
    </mat-stepper>
  `,
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class StepperHeaderPositionExample {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}
}

/**
 * @title Stepper vertical
 */
@Component({
  selector: 'stepper-vertical-example',
  template: `
    <button mat-raised-button (click)="isLinear = !isLinear" id="toggle-linear">
      {{ !isLinear ? 'Enable linear mode' : 'Disable linear mode' }}
    </button>
    <mat-stepper orientation="vertical" [linear]="isLinear" #stepper>
      <mat-step [stepControl]="firstFormGroup">
        <form [formGroup]="firstFormGroup">
          <ng-template matStepLabel>Fill out your name</ng-template>
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input
              matInput
              placeholder="Last name, First name"
              formControlName="firstCtrl"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step [stepControl]="secondFormGroup">
        <form [formGroup]="secondFormGroup">
          <ng-template matStepLabel>Fill out your address</ng-template>
          <mat-form-field>
            <mat-label>Address</mat-label>
            <input
              matInput
              formControlName="secondCtrl"
              placeholder="Ex. 1 Main St, New York, NY"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Done</ng-template>
        <p>You are now done.</p>
        <div>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button (click)="stepper.reset()">Reset</button>
        </div>
      </mat-step>
    </mat-stepper>
  `,
  styles: `
    .mat-stepper-vertical {
      margin-top: 8px;
    }

    .mat-mdc-form-field {
      margin-top: 16px;
    }
  `,
  // templateUrl: 'stepper-vertical-example.html',
  // styleUrl: 'stepper-vertical-example.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class StepperVerticalExample {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) {}
}

/**
 * @title Stepper overview
 */
@Component({
  selector: 'stepper-overview-example',
  template: `
    <button mat-raised-button (click)="isLinear = !isLinear" id="toggle-linear">
      {{ !isLinear ? 'Enable linear mode' : 'Disable linear mode' }}
    </button>
    <mat-stepper [linear]="isLinear" #stepper>
      <mat-step [stepControl]="firstFormGroup">
        <form [formGroup]="firstFormGroup">
          <ng-template matStepLabel>Fill out your name</ng-template>
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input
              matInput
              placeholder="Last name, First name"
              formControlName="firstCtrl"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step [stepControl]="secondFormGroup" label="Fill out your address">
        <form [formGroup]="secondFormGroup">
          <mat-form-field>
            <mat-label>Address</mat-label>
            <input
              matInput
              formControlName="secondCtrl"
              placeholder="Ex. 1 Main St, New York, NY"
              required
            />
          </mat-form-field>
          <div>
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step>
        <ng-template matStepLabel>Done</ng-template>
        <p>You are now done.</p>
        <div>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button (click)="stepper.reset()">Reset</button>
        </div>
      </mat-step>
    </mat-stepper>
  `,
  styles: `
    .mat-stepper-horizontal {
      margin-top: 8px;
    }

    .mat-mdc-form-field {
      margin-top: 16px;
    }
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class StepperOverviewExample {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(private _formBuilder: FormBuilder) {}
}

/**
 * @title Flex-layout tables with toggle-able sticky headers, footers, and columns
 */
@Component({
  selector: 'table-sticky-complex-flex-example',
  styles: `
    .example-container {
      height: 400px;
      overflow: auto;
    }

    .mat-mdc-table-sticky {
      background: #59abfd;
      opacity: 1;
    }

    .example-sticky-toggle-group {
      margin: 8px;
    }

    .mat-column-filler {
      padding: 0 8px;
      font-size: 10px;
      text-align: center;
    }

    .mat-mdc-header-cell,
    .mat-mdc-footer-cell,
    .mat-mdc-cell {
      min-width: 80px;
      box-sizing: border-box;
    }

    .mat-mdc-header-row,
    .mat-mdc-footer-row,
    .mat-mdc-row {
      min-width: 1920px; /* 24 columns, 80px each */
    }

    .mat-mdc-table-sticky-border-elem-top {
      border-bottom: 2px solid midnightblue;
    }

    .mat-mdc-table-sticky-border-elem-right {
      border-left: 2px solid midnightblue;
    }

    .mat-mdc-table-sticky-border-elem-bottom {
      border-top: 2px solid midnightblue;
    }

    .mat-mdc-table-sticky-border-elem-left {
      border-right: 2px solid midnightblue;
    }
  `,
  template: `
    <div>
      <button mat-raised-button (click)="tables.push(tables.length)">
        Add table
      </button>
      <button mat-raised-button (click)="tables.pop()">Remove table</button>
    </div>

    <div>
      Sticky Headers:
      <mat-button-toggle-group
        multiple
        [value]="['header-1']"
        #stickyHeaders="matButtonToggleGroup"
        class="example-sticky-toggle-group"
      >
        <mat-button-toggle value="header-1"> Row 1 </mat-button-toggle>
        <mat-button-toggle value="header-2"> Row 2 </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <div>
      Sticky Footers:
      <mat-button-toggle-group
        multiple
        [value]="['footer-1']"
        #stickyFooters="matButtonToggleGroup"
        class="example-sticky-toggle-group"
      >
        <mat-button-toggle value="footer-1"> Row 1 </mat-button-toggle>
        <mat-button-toggle value="footer-2"> Row 2 </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <div>
      Sticky Columns:
      <mat-button-toggle-group
        multiple
        [value]="['position', 'symbol']"
        #stickyColumns="matButtonToggleGroup"
        class="example-sticky-toggle-group"
      >
        <mat-button-toggle value="position"> Position </mat-button-toggle>
        <mat-button-toggle value="name"> Name </mat-button-toggle>
        <mat-button-toggle value="weight"> Weight </mat-button-toggle>
        <mat-button-toggle value="symbol"> Symbol </mat-button-toggle>
      </mat-button-toggle-group>
    </div>

    <section class="example-container mat-elevation-z8" tabindex="0">
      @for (table of tables; track table) {
        <mat-table [dataSource]="dataSource">
          <ng-container
            matColumnDef="position"
            [sticky]="isSticky(stickyColumns, 'position')"
          >
            <mat-header-cell *matHeaderCellDef> Position </mat-header-cell>
            <mat-cell *matCellDef="let element">
              {{ element.position }}
            </mat-cell>
            <mat-footer-cell *matFooterCellDef>
              Position Footer
            </mat-footer-cell>
          </ng-container>

          <ng-container
            matColumnDef="name"
            [sticky]="isSticky(stickyColumns, 'name')"
          >
            <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>
            <mat-cell *matCellDef="let element"> {{ element.name }} </mat-cell>
            <mat-footer-cell *matFooterCellDef> Name Footer </mat-footer-cell>
          </ng-container>

          <ng-container
            matColumnDef="weight"
            [stickyEnd]="isSticky(stickyColumns, 'weight')"
          >
            <mat-header-cell *matHeaderCellDef> Weight </mat-header-cell>
            <mat-cell *matCellDef="let element">
              {{ element.weight }}
            </mat-cell>
            <mat-footer-cell *matFooterCellDef> Weight Footer </mat-footer-cell>
          </ng-container>

          <ng-container
            matColumnDef="symbol"
            [stickyEnd]="isSticky(stickyColumns, 'symbol')"
          >
            <mat-header-cell *matHeaderCellDef> Symbol </mat-header-cell>
            <mat-cell *matCellDef="let element">
              {{ element.symbol }}
            </mat-cell>
            <mat-footer-cell *matFooterCellDef> Symbol Footer </mat-footer-cell>
          </ng-container>

          <ng-container matColumnDef="filler">
            <mat-header-cell *matHeaderCellDef>
              Filler header cell
            </mat-header-cell>
            <mat-cell *matCellDef="let element"> Filler data cell </mat-cell>
            <mat-footer-cell *matFooterCellDef>
              Filler footer cell
            </mat-footer-cell>
          </ng-container>

          <mat-header-row
            *matHeaderRowDef="
              displayedColumns;
              sticky: isSticky(stickyHeaders, 'header-1')
            "
          ></mat-header-row>
          <mat-header-row
            *matHeaderRowDef="
              displayedColumns;
              sticky: isSticky(stickyHeaders, 'header-2')
            "
          ></mat-header-row>

          <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>

          <mat-footer-row
            *matFooterRowDef="
              displayedColumns;
              sticky: isSticky(stickyFooters, 'footer-1')
            "
          ></mat-footer-row>
          <mat-footer-row
            *matFooterRowDef="
              displayedColumns;
              sticky: isSticky(stickyFooters, 'footer-2')
            "
          ></mat-footer-row>
        </mat-table>
      }
    </section>
  `,
  standalone: true,
  imports: [MatButtonModule, MatButtonToggleModule, MatTableModule],
})
export class TableStickyComplexFlexExample {
  displayedColumns: string[] = [];
  dataSource = ELEMENT_DATA;

  tables = [0];

  constructor() {
    this.displayedColumns.length = 24;
    this.displayedColumns.fill('filler');

    // The first two columns should be position and name; the last two columns: weight, symbol
    this.displayedColumns[0] = 'position';
    this.displayedColumns[1] = 'name';
    this.displayedColumns[22] = 'weight';
    this.displayedColumns[23] = 'symbol';
  }

  /** Whether the button toggle group contains the id as an active value. */
  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

/** @title Context menu. */
@Component({
  selector: 'cdk-menu-context-example',
  exportAs: 'cdkMenuContextExample',
  styles: `
    .example-menu {
      display: inline-flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 280px;
      background-color: rgb(255, 255, 255);
      padding: 6px 0;
    }

    .example-menu-item {
      background-color: transparent;
      cursor: pointer;
      border: none;

      user-select: none;
      min-width: 64px;
      line-height: 36px;
      padding: 0 16px;

      display: flex;
      align-items: center;
      flex-direction: row;
      flex: 1;
    }

    .example-menu-item:hover {
      background-color: rgb(208, 208, 208);
    }

    .example-menu-item:active {
      background-color: rgb(170, 170, 170);
    }
  `,
  template: `
    <div [cdkContextMenuTriggerFor]="context_menu">
      Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not.
      It's not a story the Jedi would tell you. It's a Sith legend. Darth
      Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use
      the Force to influence the midichlorians to create life… He had such a
      knowledge of the dark side that he could even keep the ones he cared about
      from dying. The dark side of the Force is a pathway to many abilities some
      consider to be unnatural. He became so powerful… the only thing he was
      afraid of was losing his power, which eventually, of course, he did.
      Unfortunately, he taught his apprentice everything he knew, then his
      apprentice killed him in his sleep. Ironic. He could save others from
      death, but not himself.
    </div>

    <ng-template #context_menu>
      <div class="example-menu" cdkMenu>
        <button class="example-menu-item" cdkMenuItem>Cut</button>
        <button class="example-menu-item" cdkMenuItem>Copy</button>
        <button class="example-menu-item" cdkMenuItem>Link</button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
})
export class CdkMenuContextExample {}

/** @title Stateful Menu with Standalone Trigger. */
@Component({
  selector: 'cdk-menu-standalone-stateful-menu-example',
  styles: `
    .example-menu {
      display: inline-flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 280px;
      background-color: rgb(255, 255, 255);
      padding: 6px 0;
    }

    .example-menu .example-menu-item {
      width: 100%;
    }

    hr {
      width: 100%;
      color: rgba(0, 0, 0, 0.12);
    }

    .example-menu-item,
    .example-standalone-item {
      background-color: transparent;
      cursor: pointer;
      border: none;

      user-select: none;
      min-width: 64px;
      line-height: 36px;
      padding: 0 16px;

      display: flex;
      align-items: center;
      flex-direction: row;
      flex: 1;
    }

    .example-menu-item:hover {
      background-color: rgb(208, 208, 208);
    }

    .example-menu-item:active {
      background-color: rgb(170, 170, 170);
    }

    .example-standalone-item {
      background-color: rgb(239, 239, 239);
    }
    .example-standalone-item:hover {
      background-color: rgb(208, 208, 208);
    }
    .example-standalone-item[aria-expanded='true'] {
      background-color: rgb(208, 208, 208);
    }

    .example-menu-item[role='menuitemradio'][aria-checked='true'] {
      background-color: rgb(225, 225, 225);
    }
    .example-menu-item[role='menuitemcheckbox'][aria-checked='true'] {
      background-color: rgb(225, 225, 225);
    }
  `,
  template: `
    <button [cdkMenuTriggerFor]="menu" class="example-standalone-item">
      Click me!
    </button>

    <ng-template #menu>
      <div class="example-menu" cdkMenu>
        <button
          cdkMenuItemCheckbox
          class="example-menu-item"
          [cdkMenuItemChecked]="bold"
          (cdkMenuItemTriggered)="bold = !bold"
        >
          Bold
        </button>
        <button
          cdkMenuItemCheckbox
          class="example-menu-item"
          [cdkMenuItemChecked]="italic"
          (cdkMenuItemTriggered)="italic = !italic"
        >
          Italic
        </button>
        <hr />
        <div cdkMenuGroup>
          @for (size of sizes; track size) {
            <button
              cdkMenuItemRadio
              class="example-menu-item"
              [cdkMenuItemChecked]="size === selectedSize"
              (cdkMenuItemTriggered)="selectedSize = size"
            >
              {{ size }}
            </button>
          }
        </div>
        <hr />
        <button
          cdkMenuItem
          class="example-menu-item"
          (cdkMenuItemTriggered)="reset()"
        >
          Reset
        </button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,
    CdkMenuGroup,
    CdkMenuItemRadio,
    CdkMenuItem,
  ],
})
export class CdkMenuStandaloneStatefulMenuExample {
  bold = false;
  italic = false;

  sizes = ['Small', 'Normal', 'Large'];
  selectedSize: string | undefined = 'Normal';

  reset() {
    this.bold = false;
    this.italic = false;
    this.selectedSize = 'Normal';
  }
}

/** @title Menu with Standalone Trigger. */
@Component({
  selector: 'cdk-menu-standalone-menu-example',
  styles: `
    .example-menu {
      display: inline-flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 280px;
      background-color: rgba(255, 255, 255);
      padding: 6px 0;
    }

    .example-menu-item,
    .example-standalone-trigger {
      background-color: transparent;
      cursor: pointer;
      border: none;

      user-select: none;
      min-width: 64px;
      line-height: 36px;
      padding: 0 16px;

      display: flex;
      align-items: center;
      flex-direction: row;
      flex: 1;
    }

    .example-menu-item:hover {
      background-color: rgb(208, 208, 208);
    }

    .example-menu-item:active {
      background-color: rgb(170, 170, 170);
    }

    .example-standalone-item {
      background-color: rgb(239, 239, 239);
    }
    .example-standalone-item:hover {
      background-color: rgb(208, 208, 208);
    }
    .example-standalone-item[aria-expanded='true'] {
      background-color: rgb(208, 208, 208);
    }
  `,
  template: `
    <button [cdkMenuTriggerFor]="menu" class="example-standalone-trigger">
      Click me!
    </button>

    <ng-template #menu>
      <div class="example-menu" cdkMenu>
        <button class="example-menu-item" cdkMenuItem>Refresh</button>
        <button class="example-menu-item" cdkMenuItem>Settings</button>
        <button class="example-menu-item" cdkMenuItem>Help</button>
        <button class="example-menu-item" cdkMenuItem>Sign out</button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItem],
})
export class CdkMenuStandaloneMenuExample {}

/** @title Nested context menus. */
@Component({
  selector: 'cdk-menu-nested-context-example',
  exportAs: 'cdkMenuNestedContextExample',
  encapsulation: ViewEncapsulation.Emulated,
  styles: `
    .example-context-area {
      display: inline-grid;
      border: 2px dashed black;
    }

    .example-context-area .example-context-area {
      margin: 100px;
      width: 200px;
      height: 100px;
    }

    .example-menu {
      display: inline-flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 280px;
      background-color: rgb(255, 255, 255);
      padding: 6px 0;
    }

    .example-menu-item {
      background-color: transparent;
      cursor: pointer;
      border: none;

      user-select: none;
      min-width: 64px;
      line-height: 36px;
      padding: 0 16px;

      display: flex;
      align-items: center;
      flex-direction: row;
      flex: 1;
    }

    .example-menu-item:hover {
      background-color: rgb(208, 208, 208);
    }

    .example-menu-item:active {
      background-color: rgb(170, 170, 170);
    }
  `,
  template: `
    <div class="example-context-area" [cdkContextMenuTriggerFor]="outer">
      Outer context menu
      <div class="example-context-area" [cdkContextMenuTriggerFor]="inner">
        Inner context menu
      </div>
    </div>

    <ng-template #outer>
      <div class="example-menu" cdkMenu>
        <button class="example-menu-item" cdkMenuItem>Save</button>
        <button class="example-menu-item" cdkMenuItem>Exit</button>
      </div>
    </ng-template>

    <ng-template #inner>
      <div class="example-menu" cdkMenu>
        <button class="example-menu-item" cdkMenuItem>Cut</button>
        <button class="example-menu-item" cdkMenuItem>Copy</button>
        <button class="example-menu-item" cdkMenuItem>Paste</button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [CdkContextMenuTrigger, CdkMenu, CdkMenuItem],
})
export class CdkMenuNestedContextExample {}
