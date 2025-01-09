import { Pipe } from "@angular/core";

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe {
  transform(inputVal: string) {
    const areaCodeStr = inputVal.slice(0, 2);
    const midSectionStr = inputVal.slice(2, 6);
    const lastSectionStr = inputVal.slice(6, 10);

    return `${areaCodeStr} ${midSectionStr} ${lastSectionStr}`;
  }
}
