import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getAddressByZipCode(zipCode: string): Observable<any> {
    const zipCodeWithoutMask = zipCode.replace(/\D/g, '');

    const validate = /^[0-9]{8}$/;

    if (validate.test(zipCodeWithoutMask)) {
      return this._httpClient.get<any>(`https://viacep.com.br/ws/${zipCodeWithoutMask}/json`);
    }

    return EMPTY;
  }

}
