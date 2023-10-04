import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, delay, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  verifyEmail(email: string): Observable<boolean> {
    return this._httpClient.get('assets/data/emails.json').pipe(
      delay(2000),
      map((data: { emails?: any[] }) => data.emails ?? []),
      tap(console.log),
      map((data: { email: string }[]) => data.filter(value => value.email === email)),
      // tap(console.log),
      map((data: any[]) => data.length > 0)
      // tap(console.log)
    );
  }
}
