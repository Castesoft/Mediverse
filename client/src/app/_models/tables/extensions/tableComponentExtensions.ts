import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DevService } from 'src/app/_services/dev.service';
import { IconsService } from "src/app/_services/icons.service";


export class TableMenu<T> {
  protected matSnackBar = inject(MatSnackBar);
  dev = inject(DevService);
  icons = inject(IconsService);

  service: T;

  constructor(serviceToken: new (...args: any[]) => T) {
    this.service = inject(serviceToken);
  }
}
