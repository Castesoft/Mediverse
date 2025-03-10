import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  private readonly rtf: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  transform(value: Date | string | number): string {
    const date = new Date(value);
    const now = new Date();
    // Calculate difference in seconds: negative if in the past.
    const diffInSeconds: number = Math.round((date.getTime() - now.getTime()) / 1000);

    // Absolute difference for threshold checks.
    const absDiff: number = Math.abs(diffInSeconds);

    // Determine the unit and value
    let unit: Intl.RelativeTimeFormatUnit;
    let valueToFormat: number;

    if (absDiff < 60) {
      unit = 'second';
      valueToFormat = diffInSeconds;
    } else if (absDiff < 3600) {
      unit = 'minute';
      valueToFormat = Math.round(diffInSeconds / 60);
    } else if (absDiff < 86400) {
      unit = 'hour';
      valueToFormat = Math.round(diffInSeconds / 3600);
    } else if (absDiff < 604800) {
      unit = 'day';
      valueToFormat = Math.round(diffInSeconds / 86400);
    } else if (absDiff < 2629800) { // Approx. 1 month (30.44 days)
      unit = 'week';
      valueToFormat = Math.round(diffInSeconds / 604800);
    } else if (absDiff < 31557600) { // Approx. 1 year (365.25 days)
      unit = 'month';
      valueToFormat = Math.round(diffInSeconds / 2629800);
    } else {
      unit = 'year';
      valueToFormat = Math.round(diffInSeconds / 31557600);
    }

    return this.rtf.format(valueToFormat, unit);
  }
}
