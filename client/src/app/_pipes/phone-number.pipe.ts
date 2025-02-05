import { Pipe } from "@angular/core";

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe {
  transform(inputVal: string) {
    const areaCodeStr: string = inputVal.slice(0, 2);
    const midSectionStr: string = inputVal.slice(2, 6);
    const lastSectionStr: string = inputVal.slice(6, 10);

    return `${areaCodeStr} ${midSectionStr} ${lastSectionStr}`;
  }
}
