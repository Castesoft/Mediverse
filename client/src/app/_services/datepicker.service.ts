import { Injectable } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { dateRanges } from "src/app/_utils/util";

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  config: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    adaptivePosition: true,
    ranges: dateRanges,
    maxDate: new Date(),
    dateInputFormat: 'MMMM Do YYYY',
    containerClass: 'theme-dark-blue',
  };
}
