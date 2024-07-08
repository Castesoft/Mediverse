import { Injectable } from '@angular/core';
import { createId } from '@paralleldrive/cuid2';

@Injectable({
  providedIn: 'root'
})
export class GuidService {

  constructor() { }

  gen = (): string => createId();

}
