import { Injectable } from "@angular/core";
import { Address } from "src/app/_models/addresses/address";
import { addressDictionary, addressColumns } from "src/app/_models/addresses/addressConstants";
import { AddressFiltersForm } from "src/app/_models/addresses/addressForm";
import { AddressParams } from "src/app/_models/addresses/addressParams";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";

@Injectable({
  providedIn: 'root',
})
export class AddressesService extends ServiceHelper<Address, AddressParams, AddressFiltersForm> {
  constructor() {
    super(AddressParams, 'addresses', addressDictionary, addressColumns);
  }
}
