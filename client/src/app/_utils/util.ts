import { HttpParams, HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { debounceTime, finalize, map, of, switchMap, take } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Range } from 'src/app/_models/date-range';
import { PaginatedResult } from 'src/app/_models/pagination';
import { AccountService } from 'src/app/_services/account.service';

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);

  return params;
}

const today = new Date();
const startOfToday = new Date(today.setHours(0, 0, 0, 0));
const endOfToday = new Date(today.setHours(23, 59, 59, 999));

const startOfThisWeek = new Date(
  new Date().setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  )
);
startOfThisWeek.setHours(0, 0, 0, 0);

const startOfMonth = new Date(
  new Date().setFullYear(today.getFullYear(), today.getMonth(), 1)
);
startOfMonth.setHours(0, 0, 0, 0);

const startOfYear = new Date(new Date().setFullYear(today.getFullYear(), 0, 1));
startOfYear.setHours(0, 0, 0, 0);

const endOfYear = new Date(new Date().setFullYear(today.getFullYear(), 11, 31));
endOfYear.setHours(23, 59, 59, 999);

const startOfLastYear = new Date(
  new Date().setFullYear(today.getFullYear() - 1, 0, 1)
);
startOfLastYear.setHours(0, 0, 0, 0);

const endOfLastYear = new Date(
  new Date().setFullYear(today.getFullYear() - 1, 11, 31)
);
endOfLastYear.setHours(23, 59, 59, 999);

export const dateRanges: Range[] = [
  {
    value: [startOfToday, endOfToday],
    label: 'Hoy',
  },
  {
    value: [startOfThisWeek, new Date()],
    label: 'Esta semana',
  },
  // {
  //   value: [new Date(new Date().setDate(today.getDate() - 7)), new Date()],
  //   label: 'Pasados 7 días'
  // },
  {
    value: [startOfMonth, new Date()],
    label: 'Este mes',
  },
  // {
  //   value: [new Date(new Date().setDate(today.getDate() - 30)), new Date()],
  //   label: 'Pasados 30 días'
  // },
  {
    value: [startOfYear, endOfYear],
    label: today.getFullYear().toString(),
  },
  {
    value: [startOfLastYear, endOfLastYear],
    label: (today.getFullYear() - 1).toString(),
  },
];

export const isControlOptional = (control: AbstractControl): boolean => {
  if (!control.validator) {
    return true;
  }

  const validator = control.validator({} as AbstractControl);
  return !(validator && validator['required']);
};

export function differentFromCurrentPasswordValidator(
  currentPasswordControl: AbstractControl
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const newPassword = control.value;
    const currentPassword = currentPasswordControl.value;
    return newPassword === currentPassword
      ? { sameAsCurrent: { value: control.value } }
      : null;
  };
}

export function matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === control.parent?.get(matchTo)?.value
      ? null
      : { notMatching: true };
  };
}

export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map((response) => {
      if (response.body) {
        paginatedResult.result = response.body;
      }
      const pagination = response.headers.get('Pagination');
      if (pagination) {
        paginatedResult.pagination = JSON.parse(pagination);
      }
      return paginatedResult;
    })
  );
}

export function formatDate(date: Date): string {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function validateEmailNotTaken(
  accountService: AccountService,
  currentEmail?: string
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (currentEmail && control.value === currentEmail) {
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(1000),
      take(1),
      switchMap(() => {
        return accountService.checkEmailExists(control.value).pipe(
          map((result) => (result ? { emailExists: true } : null)),
          finalize(() => control.markAsTouched())
        );
      })
    );
  };
}

export function validateUsernameNotTaken(
  accountService: AccountService,
  currentUsername?: string
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (currentUsername && control.value === currentUsername) {
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(1000),
      take(1),
      switchMap(() => {
        return accountService.checkUsernameExists(control.value).pipe(
          map((result) => (result ? { emailExists: true } : null)),
          finalize(() => control.markAsTouched())
        );
      })
    );
  };
}

export function validatePhoneNumberNotTaken(
  accountService: AccountService,
  currentPhoneNumber?: string
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (currentPhoneNumber && control.value === currentPhoneNumber) {
      return of(null); // No validation error if the phone number is unchanged
    }
    return control.valueChanges.pipe(
      debounceTime(1000),
      take(1),
      switchMap(() => {
        return accountService.checkPhoneNumberExists(control.value).pipe(
          map((result) => (result ? { phoneNumberExists: true } : null)),
          finalize(() => control.markAsTouched())
        );
      })
    );
  };
}

export const datepickerConfig: Partial<BsDatepickerConfig> = {
  isAnimated: true,
  adaptivePosition: true,
  ranges: dateRanges,
  maxDate: new Date(),
  dateInputFormat: 'MMMM Do YYYY',
  containerClass: 'theme-dark-blue',
};

/**
 * if I give 'Empadre de Toro Único'
 * I want to get empadre-de-toro-unico
 * for that reason, áéíóúñ will be replaced by aeioun
 * and spaces will be replaced by -
 * and all will be lowercased
*/
export const cleanStringAndCreateRoute = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '-')
    .toLowerCase();
}

