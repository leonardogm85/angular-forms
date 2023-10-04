import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { State } from 'src/app/shared/models/state.model';
import { Position } from '../models/position.model';
import { Tecnology } from '../models/tecnology.model';
import { Newsletter } from '../models/newsletter.model';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getStates(): Observable<State[]> {
    return this._httpClient.get<State[]>('assets/data/states.json');
  }

  getCities(state: number): Observable<City[]> {
    return this._httpClient.get<City[]>('assets/data/cities.json').pipe(
      map(cities => cities.filter(city => city.state == state))
    );
  }

  getPositions(): Position[] {
    return [
      { name: 'Developer', level: 'Junior', description: 'Junior developer' },
      { name: 'Developer', level: 'Middle', description: 'Middle developer' },
      { name: 'Developer', level: 'Senior', description: 'Senior developer' }
    ]
  }

  getTechnologies(): Tecnology[] {
    return [
      { id: 1, name: 'Python' },
      { id: 2, name: 'C' },
      { id: 3, name: 'C++' },
      { id: 4, name: 'Java' },
      { id: 5, name: 'C#' }
    ]
  }

  getNewsletters(): Newsletter[] {
    return [
      { value: 'y', description: 'Yes' },
      { value: 'n', description: 'No' }
    ]
  }

  getFrameworks(): string[] {
    return [
      'Angular',
      'React',
      'Vue',
      'Flutter'
    ];
  }

}
