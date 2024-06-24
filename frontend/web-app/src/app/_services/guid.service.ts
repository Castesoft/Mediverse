import { Injectable } from '@angular/core';
import cuid from 'cuid';

@Injectable({
  providedIn: 'root'
})
export class GuidService {

  constructor() { }

  gen = (): string => cuid();

}
