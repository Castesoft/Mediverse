import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number, decimals: number = 2): string {
    if (value === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    const fileSize = parseFloat((value / Math.pow(k, i)).toFixed(decimals));
    return `${fileSize} ${sizes[i]}`;
  }
}
