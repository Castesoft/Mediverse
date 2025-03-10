import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  private readonly rtf: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat('es-MX', { numeric: 'auto' });
  private readonly datePipe: DatePipe = new DatePipe('es-MX');

  /**
   * Transforms a date value into a relative time string (e.g., "Hace 1 hora")
   * or, if the difference exceeds a cutoff, a formatted date (e.g., "Jun 28").
   *
   * @param value Date | string | number | null – The input date value.
   * @param cutoffDays (optional) Number of days after which to show formatted date instead of relative time. Default is 7.
   * @param dateFormat (optional) Date format string for fallback formatting. Default is 'MMM d'.
   * @returns A string with the relative time or formatted date (with the first letter capitalized).
   */
  transform(value: Date | string | number | null, cutoffDays: number = 7, dateFormat: string = 'MMM d'): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    // Calculate difference in seconds (negative if date is in the past)
    const diffInSeconds: number = Math.round((date.getTime() - now.getTime()) / 1000);
    const absDiff: number = Math.abs(diffInSeconds);

    // If difference is larger than the cutoff, return a formatted date.
    const cutoffSeconds = cutoffDays * 86400;
    if (absDiff > cutoffSeconds) {
      const formattedDate = this.datePipe.transform(date, dateFormat);
      return formattedDate
        ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
        : '';
    }

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
    } else if (absDiff < 2629800) { // ~1 month (30.44 days)
      unit = 'week';
      valueToFormat = Math.round(diffInSeconds / 604800);
    } else if (absDiff < 31557600) { // ~1 year (365.25 days)
      unit = 'month';
      valueToFormat = Math.round(diffInSeconds / 2629800);
    } else {
      unit = 'year';
      valueToFormat = Math.round(diffInSeconds / 31557600);
    }

    const relative = this.rtf.format(valueToFormat, unit);
    return relative.charAt(0).toUpperCase() + relative.slice(1);
  }
}
